// Llamada al Apps Script "Reservas Siloé" (reservas, boletín y agradecimiento de donativos).
// La URL y el secreto compartido viven solo en variables de entorno de Vercel.

export async function callScript(payload, env = process.env) {
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
