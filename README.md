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
