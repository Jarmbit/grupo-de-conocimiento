// Aviso por email de cada donación aprobada, usando la API de Resend (https://resend.com).
// Es opcional: si no hay RESEND_API_KEY, no se envía nada y solo queda el registro en logs.

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

export async function sendDonationEmail({ order, amountCents, authCode, mode }, env = process.env) {
  const apiKey = env.RESEND_API_KEY;
  const to = env.DONATION_NOTIFY_TO;
  if (!apiKey || !to) return { sent: false, reason: "email no configurado" };

  const from = env.DONATION_FROM || "Encuentros Siloé <onboarding@resend.dev>";
  const euros = (Number(amountCents) / 100).toLocaleString("es-ES", { style: "currency", currency: "EUR" });
  const prefix = mode === "live" ? "" : "[PRUEBA] ";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()).filter(Boolean),
      subject: `${prefix}Nueva donación: ${euros}`,
      html: `<p>Se ha recibido una donación con tarjeta en la web.</p>
<ul>
<li><strong>Importe:</strong> ${esc(euros)}</li>
<li><strong>Pedido:</strong> ${esc(order)}</li>
<li><strong>Código de autorización:</strong> ${esc(authCode ?? "-")}</li>
<li><strong>Entorno:</strong> ${mode === "live" ? "real" : "pruebas"}</li>
</ul>
<p>Los datos de la tarjeta no se almacenan. Consulta el detalle en el módulo de administración de Redsys.</p>`,
    }),
  });

  if (!res.ok) {
    console.error("Email donación: error", res.status, await res.text().catch(() => ""));
    return { sent: false, reason: `HTTP ${res.status}` };
  }
  return { sent: true };
}
