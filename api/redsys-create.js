import {
  REDSYS_URLS,
  SIGNATURE_VERSION,
  encodeParameters,
  generateOrder,
  getConfig,
  sign,
} from "./_lib/redsys.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u001f<>]/g, " ").trim().slice(0, max);

const MIN_EUR = 1;
const MAX_EUR = 5000;

const CONCEPTS = {
  socio: "Cuota de socio - Encuentros Siloe",
  puntual: "Donacion - Encuentros Siloe",
  patrocinio: "Patrocinio de encuentro - Encuentros Siloe",
};

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido" });
  }

  const config = getConfig();
  if (!config) {
    console.error("Redsys: faltan variables de entorno (REDSYS_MERCHANT_CODE, REDSYS_SECRET_KEY, SITE_URL)");
    return res.status(500).json({ error: "El pago no está disponible en este momento." });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body ?? {};
  const kind = typeof body.kind === "string" && CONCEPTS[body.kind] ? body.kind : "puntual";
  const euros = Number(String(body.amount ?? "").replace(",", "."));

  if (!Number.isFinite(euros) || euros < MIN_EUR || euros > MAX_EUR) {
    return res.status(400).json({ error: `El importe debe estar entre ${MIN_EUR} y ${MAX_EUR} euros.` });
  }

  // Datos del donante, para poder darle las gracias. Viajan firmados dentro de Ds_Merchant_MerchantData
  // y Redsys los devuelve en la notificación del pago.
  const donor = {
    n: clean(body.name, 80),
    e: clean(body.email, 120),
    t: clean(body.phone, 30),
    k: kind,
  };
  if (donor.n.length < 2) return res.status(400).json({ error: "Escribe tu nombre." });
  if (!EMAIL_RE.test(donor.e)) return res.status(400).json({ error: "Escribe un correo electrónico válido." });
  if (body.consent !== true) return res.status(400).json({ error: "Debes aceptar la política de privacidad." });

  const cents = Math.round(euros * 100);
  const order = generateOrder();

  const params = {
    DS_MERCHANT_AMOUNT: String(cents),
    DS_MERCHANT_ORDER: order,
    DS_MERCHANT_MERCHANTCODE: config.merchantCode,
    DS_MERCHANT_CURRENCY: "978",
    DS_MERCHANT_TRANSACTIONTYPE: "0",
    DS_MERCHANT_TERMINAL: config.terminal,
    DS_MERCHANT_MERCHANTURL: `${config.siteUrl}/api/redsys-notify`,
    DS_MERCHANT_URLOK: `${config.siteUrl}/pago/ok`,
    DS_MERCHANT_URLKO: `${config.siteUrl}/pago/ko`,
    DS_MERCHANT_PRODUCTDESCRIPTION: CONCEPTS[kind],
    DS_MERCHANT_MERCHANTNAME: "Encuentros Siloe",
    DS_MERCHANT_CONSUMERLANGUAGE: "001",
    DS_MERCHANT_MERCHANTDATA: encodeURIComponent(JSON.stringify(donor)),
  };

  try {
    const merchantParameters = encodeParameters(params);
    const signature = sign(merchantParameters, order, config.secretKey);
    return res.status(200).json({
      url: REDSYS_URLS[config.mode],
      mode: config.mode,
      fields: {
        Ds_SignatureVersion: SIGNATURE_VERSION,
        Ds_MerchantParameters: merchantParameters,
        Ds_Signature: signature,
      },
    });
  } catch (err) {
    // No se registra la clave; solo el motivo (p. ej. longitud de clave inválida).
    console.error("Redsys: error al firmar:", err instanceof Error ? err.message : err);
    return res.status(500).json({ error: "El pago no está disponible en este momento." });
  }
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
