// Reservas de encuentros: puente entre la web y el Apps Script de la asociación.
// El secreto compartido y la URL del script viven solo en variables de entorno de Vercel.
//   POST /api/reserva                 → crea una reserva
//   GET  /api/reserva?libres=<evento> → plazas libres
//   GET  /api/reserva?cancelar=ID.TOKEN → cancela (enlace del correo; devuelve una página HTML)

const EVENTOS = new Set(["horche"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u001f<>]/g, " ").trim().slice(0, max);

async function callScript(payload, env = process.env) {
  const url = env.RESERVAS_SCRIPT_URL;
  const secret = env.RESERVAS_SECRET;
  if (!url || !secret) return { status: 503, body: { ok: false, error: "no_configurado" } };
  try {
    const res = await fetch(url, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...payload, secret }),
      signal: AbortSignal.timeout(20000),
    });
    const body = await res.json();
    return { status: 200, body };
  } catch (err) {
    console.error("Reservas: fallo llamando al Apps Script", err?.message ?? err);
    return { status: 502, body: { ok: false, error: "servicio_no_disponible" } };
  }
}

const page = (title, text) => `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — Encuentros Siloé</title>
<body style="font-family:system-ui,sans-serif;max-width:520px;margin:12vh auto;padding:0 20px;color:#1c2530;line-height:1.5">
<h1 style="font-size:22px;color:#1f3a5f">${title}</h1><p>${text}</p><p><a href="https://encuentrossiloe.org" style="color:#1f3a5f">Volver a encuentrossiloe.org</a></p></body></html>`;

export default async function handler(req, res, env = process.env) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    const q = req.query ?? {};
    if (q.libres) {
      const evento = clean(q.libres, 30);
      if (!EVENTOS.has(evento)) return res.status(404).json({ ok: false, error: "evento_desconocido" });
      const r = await callScript({ action: "libres", evento }, env);
      return res.status(r.status).json(r.body);
    }
    if (q.cancelar) {
      const [id, token] = clean(q.cancelar, 60).split(".");
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      const r = id && token ? await callScript({ action: "cancelar", id, token }, env) : { body: { ok: false } };
      if (r.body.ok) {
        return res.status(200).send(page("Reserva cancelada", r.body.yaCancelada ? "Esta reserva ya estaba cancelada." : "Hemos cancelado tu reserva y liberado la plaza. ¡Gracias por avisar!"));
      }
      return res.status(400).send(page("No hemos podido cancelar", "El enlace no es válido. Escríbenos a <a href=\"mailto:info@encuentrossiloe.org\">info@encuentrossiloe.org</a> y lo resolvemos."));
    }
    return res.status(400).json({ ok: false, error: "peticion_invalida" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, error: "metodo_no_permitido" });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body ?? {};

  // Cebo anti-bots: las personas no ven ni rellenan este campo.
  if (clean(body.website, 50)) return res.status(200).json({ ok: true, estado: "Confirmada" });

  const evento = clean(body.evento, 30);
  const email = clean(body.email, 120);
  const plazas = Number(body.plazas);
  if (!EVENTOS.has(evento)) return res.status(400).json({ ok: false, error: "evento_desconocido" });
  if (clean(body.nombre, 80).length < 2) return res.status(400).json({ ok: false, error: "nombre_invalido" });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ ok: false, error: "email_invalido" });
  if (!Number.isInteger(plazas) || plazas < 1 || plazas > 6) return res.status(400).json({ ok: false, error: "plazas_invalidas" });
  if (body.consentimiento !== true) return res.status(400).json({ ok: false, error: "falta_consentimiento" });

  const r = await callScript(
    {
      action: "reservar",
      evento,
      nombre: clean(body.nombre, 80),
      email,
      telefono: clean(body.telefono, 30),
      plazas,
      comentario: clean(body.comentario, 400),
      consentimiento: true,
    },
    env
  );
  return res.status(r.status === 200 && !r.body.ok ? 409 : r.status).json(r.body);
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
