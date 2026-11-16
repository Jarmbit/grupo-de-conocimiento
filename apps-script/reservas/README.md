# Reservas automáticas (Apps Script) — piloto Horche

Flujo: formulario `/reservar/horche` → `POST /api/reserva` (Vercel) → este Apps Script (corre como
`info@encuentrossiloe.org`) → hoja "Reservas de encuentros" + correo de confirmación + aviso al equipo.
Cancelación con enlace del correo, lista de espera con promoción automática y recordatorio el día antes.

## Puesta en marcha (≈10 min, con la cuenta info@encuentrossiloe.org)

1. Entra en <https://script.google.com> con **info@encuentrossiloe.org** → *Nuevo proyecto* → nómbralo
   "Reservas Siloé".
2. Pega el contenido de `Code.gs` (sustituye todo). En *Configuración del proyecto* marca
   "Mostrar el archivo de manifiesto appsscript.json" y pega también el de esta carpeta.
3. El aforo de Horche está fijado en 60 (`EVENTOS.horche.capacidad`). Para cambiarlo sin tocar código,
   crea la propiedad de script `CAPACIDAD_HORCHE`.
4. Selecciona la función `setup` → *Ejecutar* → autoriza los permisos. Crea la hoja, genera el
   secreto y programa el recordatorio diario (10:00). En *Registro de ejecución* verás:
   - `RESERVAS_SECRET …` → cópialo.
   - `Hoja de reservas: …` → enlace a la hoja (compártela solo con quien deba verla).
5. *Implementar* → *Nueva implementación* → tipo **Aplicación web** → Ejecutar como: **yo** →
   Quién tiene acceso: **Cualquier persona** → copia la URL que termina en `/exec`.
6. En Vercel → Settings → Environment Variables (Production y Preview):
   - `RESERVAS_SCRIPT_URL` = la URL `/exec`
   - `RESERVAS_SECRET` = el secreto del paso 4
   y vuelve a desplegar.
7. Prueba con una reserva real a tu correo y comprueba: fila en la hoja, correo de confirmación, aviso
   en info@, enlace de cancelación (debe liberar la plaza) y el contador de plazas de la página.

Al cambiar `Code.gs` hay que crear una *nueva versión* de la implementación (Implementar → Gestionar).

## Datos personales
Las reservas se guardan en Google Workspace. Hay que añadir a Google como encargado del tratamiento en
`/privacidad` y limitar el acceso a la hoja.
