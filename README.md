# Encuentros Siloé — sitio web

Sitio web de una sola página para **Encuentros Siloé**, una asociación católica sin ánimo de
lucro cuya misión es crear espacios donde las personas puedan encontrarse con Jesucristo,
mediante encuentros testimoniales y vídeos sobre la evidencia de la existencia de Dios y la vida
de Jesucristo.

Construido con [Astro](https://astro.build).

## Estado del contenido

El **logo y la paleta de color son finales** (degradado azul-violeta-magenta del logo, aplicado
como acento en toda la web). El resto del **contenido sigue siendo placeholder** y debe
sustituirse antes de publicar:

- `src/data/content.ts` — textos de eventos, vídeos, noticias y modelos de donación.
- Fotografías: la del Hero (`public/images/evento-4.jpg`) es una foto real de un encuentro; la
  sección de vídeos (`VideosSection.astro`) sigue usando un marcador con patrón diagonal —
  sustituir por miniaturas reales de cada vídeo.
- Iconos de redes sociales: representados como iniciales en círculos — sustituir por iconos SVG
  reales o una librería de iconos (p. ej. [lucide](https://lucide.dev)).
- Enlaces de WhatsApp/Instagram/redes sociales (`#` por ahora) — apuntar a los canales reales.
- Botones "Reservar plaza" — conectar a un sistema de reservas real (Calendly, formulario propio,
  Eventbrite...).
- Formulario de suscripción por email (`JoinSection.astro`) — valida el email y muestra un
  mensaje de confirmación en el cliente, pero no está conectado a ningún servicio real. Hay que
  integrarlo con un proveedor de email marketing (Mailchimp, Brevo...).
- Email de contacto (`contact.email` en `content.ts`) — usa un dominio provisional
  (`encuentrossiloe.org`); actualizar si la asociación registra un dominio propio.

## Estructura del proyecto

```text
/
├── src/
│   ├── components/       # Header, Hero, secciones y Footer
│   ├── data/content.ts   # Contenido placeholder centralizado
│   ├── layouts/Layout.astro
│   ├── pages/index.astro
│   └── styles/global.css # Design tokens (colores, reset)
└── public/
    ├── logo-mark.png     # Logo oficial de Encuentros Siloé
    └── images/            # Fotos reales de eventos
```

## Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando             | Acción                                          |
| :------------------- | :----------------------------------------------- |
| `npm install`         | Instala las dependencias                          |
| `npm run dev`          | Arranca el servidor de desarrollo en `localhost:4321` |
| `npm run build`        | Genera el sitio de producción en `./dist/`         |
| `npm run preview`      | Previsualiza el build de producción localmente     |

## Pagos con tarjeta (Redsys / Cyberpac)

Integración por redirección (TPV Virtual). Funciones serverless en `api/`:

- `api/redsys-create.js`: valida el importe y devuelve los campos firmados del formulario de pago.
- `api/redsys-notify.js`: recibe la notificación de Redsys y verifica la firma.
- Páginas de retorno: `/pago/ok` y `/pago/ko`.

Variables de entorno (Vercel → Settings → Environment Variables; **nunca en git**):

| Variable | Valor |
| --- | --- |
| `REDSYS_MERCHANT_CODE` | Código de comercio (FUC) |
| `REDSYS_TERMINAL` | Terminal, normalmente `1` |
| `REDSYS_SECRET_KEY` | Clave secreta SHA-256 (base64) |
| `REDSYS_ENV` | `test` (por defecto) o `live` |
| `SITE_URL` | URL pública, p. ej. `https://encuentrossiloe.org` (opcional en previews: usa `VERCEL_URL`) |

Pasar a real: pedir a Redsys el pase a entorno real, sustituir código/clave y poner `REDSYS_ENV=live`.

Aviso por email de cada donación aprobada (opcional, vía [Resend](https://resend.com)):

| Variable | Valor |
| --- | --- |
| `RESEND_API_KEY` | API key de Resend |
| `DONATION_NOTIFY_TO` | Email(s) destinatarios, separados por comas |
| `DONATION_FROM` | Remitente (opcional). Por defecto `onboarding@resend.dev`, que solo envía al email dueño de la cuenta de Resend; para otros destinatarios hay que verificar el dominio |

### Paso a entorno real (Redsys)

Comercio `372969444`, terminal `1`, moneda `978` (los mismos datos que en pruebas). Cambia solo la clave y el entorno.
La clave SHA-256 **real** no llega por email: se obtiene en https://canales.redsys.es/lacaixa (Administración → Comercio → Buscar → Detalles → Ver clave; se muestra 10 s).

1. Vercel → Environment Variables, para el entorno que vayas a usar: `REDSYS_ENV=live`, `REDSYS_SECRET_KEY=<clave real>`, `SITE_URL=https://encuentrossiloe.org`.
2. Redeploy.
3. Pruebas recomendadas por Redsys: un pago con la tarjeta de denegadas (`4548 8120 4940 0004`, 12/20, CVV 123) y otro autorizado con una tarjeta real (no hay tarjeta de prueba autorizada en real; basta 1 €).
