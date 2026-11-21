// Envía un evento a Google Analytics si la persona aceptó las cookies (CookieConsent.astro solo
// define window.gtag tras aceptar). Sin consentimiento no se envía nada. Nunca se mandan datos
// personales (nombre, correo, teléfono): solo el tipo de acción y datos generales.
type Gtag = (...args: unknown[]) => void;

export function medir(evento: string, params: Record<string, string | number> = {}) {
  try {
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    if (typeof gtag === "function") gtag("event", evento, params);
  } catch {
    /* la medición nunca debe romper el formulario */
  }
}
