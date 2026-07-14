# Grupo de Conocimiento — sitio web

Sitio web de una sola página para **Grupo de Conocimiento**, una asociación católica sin ánimo
de lucro cuya misión es dar a conocer a Dios mediante eventos testimoniales y vídeos sobre la
evidencia de la existencia de Dios y la vida de Jesucristo.

Construido con [Astro](https://astro.build), recreando el diseño de referencia (hifi) recibido
en el handoff de diseño original.

## Estado del contenido

El **layout y el estilo son finales** (colores, tipografía, espaciado y estructura respetan el
design handoff). El **contenido es placeholder** y debe sustituirse antes de publicar:

- `src/data/content.ts` — textos de eventos, vídeos, noticias y modelos de donación.
- Fotografías: actualmente son marcadores con patrón diagonal (`Hero.astro`,
  `VideosSection.astro`) — sustituir por fotografía real de eventos, comunidad y testimonios.
- Logo: símbolo simple (cruz estilizada) en `src/components/Logo.astro` — sustituir por el logo
  real de la asociación si existe.
- Iconos de redes sociales: representados como iniciales en círculos — sustituir por iconos SVG
  reales o una librería de iconos (p. ej. [lucide](https://lucide.dev)).
- Enlaces de WhatsApp/Instagram/redes sociales (`#` por ahora) — apuntar a los canales reales.
- Botones "Reservar plaza" — conectar a un sistema de reservas real (Calendly, formulario propio,
  Eventbrite...).
- Formulario de suscripción por email (`JoinSection.astro`) — valida el email y muestra un
  mensaje de confirmación en el cliente, pero no está conectado a ningún servicio real. Hay que
  integrarlo con un proveedor de email marketing (Mailchimp, Brevo...).

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
```

## Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando             | Acción                                          |
| :------------------- | :----------------------------------------------- |
| `npm install`         | Instala las dependencias                          |
| `npm run dev`          | Arranca el servidor de desarrollo en `localhost:4321` |
| `npm run build`        | Genera el sitio de producción en `./dist/`         |
| `npm run preview`      | Previsualiza el build de producción localmente     |
