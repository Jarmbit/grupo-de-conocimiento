// Alta en el boletín: guarda la suscripción en la hoja de la asociación y envía la bienvenida.
//   POST /api/boletin { nombre, email, consentimiento, website }
import { callScript } from "./_lib/script.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u001f<>]/g, " ").trim().slice(0, max);

export default async function handler(req, res, env = process.env) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "metodo_no_permitido" });
  }
  let body = req.body ?? {};
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  // Cebo anti-bots: las personas no ven ni rellenan este campo.
  if (clean(body.website, 50)) return res.status(200).json({ ok: true });

  const nombre = clean(body.nombre, 80);
  const email = clean(body.email, 120);
  if (nombre.length < 2) return res.status(400).json({ ok: false, error: "nombre_invalido" });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ ok: false, error: "email_invalido" });
  if (body.consentimiento !== true) return res.status(400).json({ ok: false, error: "falta_consentimiento" });

  const r = await callScript({ action: "boletin", nombre, email, consentimiento: true }, env);
  return res.status(r.status === 200 && !r.body.ok ? 400 : r.status).json(r.body);
}
