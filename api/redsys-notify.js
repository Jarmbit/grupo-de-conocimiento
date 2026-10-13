import { decodeParameters, getConfig, isAuthorised, sign, signaturesMatch } from "./_lib/redsys.js";

// Notificación servidor a servidor (Ds_Merchant_MerchantURL). Redsys envía un POST
// application/x-www-form-urlencoded. Aquí solo verificamos la firma y registramos el resultado.
export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  const config = getConfig();
  if (!config) return res.status(500).end();

  const body = typeof req.body === "string" ? Object.fromEntries(new URLSearchParams(req.body)) : req.body ?? {};
  const { Ds_MerchantParameters: merchantParameters, Ds_Signature: signature } = body;

  if (!merchantParameters || !signature) return res.status(400).end();

  let data;
  try {
    data = decodeParameters(merchantParameters);
  } catch {
    return res.status(400).end();
  }

  const order = data.Ds_Order ?? data.DS_ORDER;
  if (!order) return res.status(400).end();

  const expected = sign(merchantParameters, order, config.secretKey);
  if (!signaturesMatch(signature, expected)) {
    console.warn("Redsys notify: firma inválida", { order });
    return res.status(403).end();
  }

  const responseCode = data.Ds_Response ?? data.DS_RESPONSE;
  console.log("Redsys notify:", {
    order,
    authorised: isAuthorised(responseCode),
    responseCode,
    amountCents: data.Ds_Amount ?? data.DS_AMOUNT,
    authCode: data.Ds_AuthorisationCode ?? data.DS_AUTHORISATIONCODE,
  });

  return res.status(200).send("OK");
}
