# Encuentros Siloé — sitio web

Sitio web para **Encuentros Siloé**, una asociación católica sin ánimo de lucro cuya misión es
crear espacios donde las personas puedan encontrarse con Jesucristo, mediante encuentros
testimoniales y vídeos sobre la evidencia de la existencia de Dios y la vida de Jesucristo.

Construido con [Astro](https://astro.build) (SSG, sin framework de UI adicional), TypeScript
estricto y CSS con variables — sin backend ni CMS: el contenido vive centralizado y tipado en
`src/data/content.ts`, y las conversiones (reservar plaza, pedir un encuentro, solicitar
información) se resuelven con enlaces `mailto:` construidos dinámicamente.

## Concepto visual

Rediseño 2026 bajo el concepto **"Volver a mirar con otros ojos"** (Juan 9, el ciego de
nacimiento y la piscina de Siloé): paleta cálida y editorial (marfil, azul profundo, arena,
acento terracota — variables `--color-*` en `src/styles/global.css`), tipografía serif para
titulares (Cormorant Garamond) + sans-serif para texto (Manrope), animaciones sutiles de
aparición al hacer scroll (`[data-reveal]`, respeta `prefers-reduced-motion`).

## Estado del contenido

El **logo, la paleta y la tipografía son finales**. El contenido real está mayoritariamente
completo (misión, identidad, cómo es un encuentro, historia de Siloé/Juan 9, un evento con cartel
y venta real, fotos y vídeos de encuentros pasados). Lo que **sigue pendiente de contenido real**:

- **Testimonios** (`testimonials` en `content.ts`, sección "¿Qué pasa cuando te atreves a
  preguntar?"): los 3 actuales tienen `placeholder: true` — son ejemplos de formato, NO
  testimonios reales. Sustituir por citas reales (con consentimiento) antes de publicar. El
  componente `TestimonialsSection.astro` marca visualmente cualquier entrada `placeholder: true`
  con un badge, visible solo en `npm run dev` (no en producción).
- **Historias** (`stories` en `content.ts`, sección "Historias Siloé"): solo la primera ("Así fue
  nuestro encuentro en Burgos") tiene contenido real; las otras dos son `placeholder: true` a la
  espera de artículos reales. Mismo sistema de aviso visual en dev.
- Próximos eventos sin foto/enlace de venta propio (Málaga, Las Rozas, Burgos): usan un fallback
  visual (mes/día en grande sobre fondo de marca) y el `mailto` genérico de reserva — añadir
  cartel real y enlace de venta cuando existan.
- Iconos de redes sociales (`socials` en `content.ts`): vacío — sin enlaces reales todavía.
- Formulario de suscripción por email (`JoinSection.astro`) — usa `mailto:`, no está conectado a
  ningún proveedor de email marketing (Mailchimp, Brevo...).
- Botones "Reservar plaza"/donaciones — usan `mailto:`; conectar a un sistema de reservas y una
  pasarela de pago reales cuando existan.

## Estructura del proyecto

```text
/
├── src/
│   ├── components/       # Header, Hero, secciones reutilizables y Footer
│   ├── data/content.ts   # Contenido centralizado y tipado (el "CMS" del proyecto)
│   ├── layouts/Layout.astro   # <head>, SEO, fuentes, script de reveal-on-scroll
│   ├── pages/
│   │   ├── index.astro        # Home
│   │   ├── encuentros.astro   # Agenda + encuentros pasados + "pide un encuentro"
│   │   ├── historias.astro    # Historias Siloé
│   │   ├── que-es-siloe.astro # Misión + cómo es un encuentro + origen del nombre
│   │   ├── organiza.astro     # Organiza un encuentro en tu casa/parroquia/comunidad
│   │   ├── participa.astro    # Formas de colaborar con tiempo/talento
│   │   ├── apoya.astro        # Formas de colaborar económicamente
│   │   ├── noticias.astro, habla-con-nosotros.astro, aviso-legal.astro, privacidad.astro, cookies.astro
│   └── styles/global.css # Design tokens (paleta, tipografía, sistema de botones, reveal)
└── public/
    ├── logo-mark-navy.png / logo-mark-white.png  # Logo oficial de Encuentros Siloé
    └── images/, videos/   # Fotos y vídeos reales de encuentros
```

## Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando             | Acción                                          |
| :------------------- | :----------------------------------------------- |
| `npm install`         | Instala las dependencias                          |
| `npm run dev`          | Arranca el servidor de desarrollo en `localhost:4321` |
| `npm run build`        | Genera el sitio de producción en `./dist/`         |
| `npm run preview`      | Previsualiza el build de producción localmente     |
