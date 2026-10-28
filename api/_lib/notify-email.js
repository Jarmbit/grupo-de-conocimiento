// Aviso por email de cada donación aprobada, usando la API de Resend (https://resend.com).
// Es opcional: si no hay RESEND_API_KEY, no se envía nada y solo queda el registro en logs.

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

export async function sendDonationEmail({ order, amountCents, authCode, mode, donor }, env = process.env) {
  const apiKey = env.RESEND_API_KEY;
  const to = env.DONATION_NOTIFY_TO;
  if (!apiKey || !to) return { sent: false, reason: "email no configurado" };

  const from = env.DONATION_FROM || "Encuentros Siloé <onboarding@resend.dev>";
  const euros = (Number(amountCents) / 100).toLocaleString("es-ES", { style: "currency", currency: "EUR" });
  const prefix = mode === "live" ? "" : "[PRUEBA] ";

  const who = donor?.n ? `${donor.n}` : "una persona";
  const KIND = { puntual: "Donación puntual", patrocinio: "Patrocinio de un encuentro", socio: "Cuota de socio" };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()).filter(Boolean),
      // Si hay email del donante, "Responder" le escribe directamente a él para darle las gracias.
      ...(donor?.e ? { reply_to: donor.e } : {}),
      subject: `${prefix}Nueva donación: ${euros} — ${who}`,
      html: `<p>Se ha recibido una donación con tarjeta en la web.</p>
<ul>
<li><strong>Donante:</strong> ${esc(donor?.n ?? "(sin datos)")}</li>
<li><strong>Correo:</strong> ${esc(donor?.e ?? "-")}</li>
<li><strong>Teléfono:</strong> ${esc(donor?.t || "-")}</li>
<li><strong>Tipo:</strong> ${esc(KIND[donor?.k] ?? "Donación")}</li>
<li><strong>Importe:</strong> ${esc(euros)}</li>
<li><strong>Pedido:</strong> ${esc(order)}</li>
<li><strong>Código de autorización:</strong> ${esc(authCode ?? "-")}</li>
<li><strong>Entorno:</strong> ${mode === "live" ? "real" : "pruebas"}</li>
</ul>
<p>Puedes responder a este correo para dar las gracias al donante. Los datos de la tarjeta no se almacenan. Consulta el detalle en el módulo de administración de Redsys.</p>`,
    }),
  });

  if (!res.ok) {
    console.error("Email donación: error", res.status, await res.text().catch(() => ""));
    return { sent: false, reason: `HTTP ${res.status}` };
  }
  return { sent: true };
}
