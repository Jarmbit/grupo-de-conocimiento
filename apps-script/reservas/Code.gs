/**
 * Reservas de encuentros — Encuentros Siloé
 *
 * Aplicación web de Google Apps Script. Se despliega con la cuenta info@encuentrossiloe.org
 * ("Ejecutar como: yo"), de modo que los correos salen de esa dirección y la hoja de cálculo
 * queda en el Drive de la asociación. La web NO la llama directamente: lo hace la función
 * serverless /api/reserva (Vercel), que añade el secreto compartido.
 *
 * Instrucciones de despliegue: ver README.md de esta carpeta.
 */

// ── Configuración de encuentros ────────────────────────────────────────────────────────────
// La clave ("horche") es la que usa la web. Para añadir un encuentro, copia el bloque.
// El aforo se puede cambiar sin tocar el código: Propiedades del script → CAPACIDAD_HORCHE.
const EVENTOS = {
  horche: {
    titulo: 'Encuentro en Horche',
    fecha: '2026-11-20', // AAAA-MM-DD (para el recordatorio del día anterior)
    cuando: 'viernes 20 de noviembre, 20:00 h',
    lugar: 'Prolongación San Roque, 1, Horche (Guadalajara)',
    capacidad: 60, // aforo de Horche (60 personas)
    banner: 'https://encuentrossiloe.org/images/email/horche-banner.jpg', // cabecera de los correos
    mapa: 'https://www.google.com/maps/search/?api=1&query=Prolongaci%C3%B3n+San+Roque+1%2C+Horche%2C+Guadalajara',
    resumen: 'v\u00eddeo, m\u00fasica en directo y picoteo para compartir al final',
  },
};

const SITE = 'https://encuentrossiloe.org';
const EQUIPO = 'info@encuentrossiloe.org';
const REMITENTE = 'Encuentros Siloé';
const MAX_PLAZAS_POR_RESERVA = 6;

const COLUMNAS = [
  'Registro', 'ID', 'Evento', 'Nombre', 'Email', 'Teléfono', 'Plazas',
  'Comentario', 'Estado', 'Token', 'Consentimiento', 'Recordatorio',
];
const C = { REG: 0, ID: 1, EVENTO: 2, NOMBRE: 3, EMAIL: 4, TEL: 5, PLAZAS: 6, COM: 7, ESTADO: 8, TOKEN: 9, CONS: 10, REC: 11 };
const ESTADO = { OK: 'Confirmada', ESPERA: 'Lista de espera', CANCELADA: 'Cancelada' };

// ── Puntos de entrada web ──────────────────────────────────────────────────────────────────
function doPost(e) {
  let data;
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false, error: 'peticion_invalida' });
  }
  const secreto = props_().getProperty('SECRET');
  if (!secreto || data.secret !== secreto) return json_({ ok: false, error: 'no_autorizado' });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (data.action === 'libres') return json_(libres_(data));
    if (data.action === 'reservar') return json_(reservar_(data));
    if (data.action === 'cancelar') return json_(cancelar_(data));
    return json_({ ok: false, error: 'accion_desconocida' });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    return json_({ ok: false, error: 'error_interno' });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, servicio: 'reservas-siloe' });
}

// ── Lógica ─────────────────────────────────────────────────────────────────────────────────
function libres_(d) {
  const ev = EVENTOS[d.evento];
  if (!ev) return { ok: false, error: 'evento_desconocido' };
  const filas = filas_(hoja_());
  const capacidad = capacidad_(d.evento);
  return { ok: true, capacidad, libres: Math.max(0, capacidad - ocupadas_(filas, d.evento)) };
}

function reservar_(d) {
  const ev = EVENTOS[d.evento];
  if (!ev) return { ok: false, error: 'evento_desconocido' };

  const nombre = limpiar_(d.nombre, 80);
  const email = limpiar_(d.email, 120).toLowerCase();
  const telefono = limpiar_(d.telefono, 30);
  const comentario = limpiar_(d.comentario, 400);
  const plazas = Number(d.plazas);

  if (nombre.length < 2) return { ok: false, error: 'nombre_invalido' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, error: 'email_invalido' };
  if (!Number.isInteger(plazas) || plazas < 1 || plazas > MAX_PLAZAS_POR_RESERVA) return { ok: false, error: 'plazas_invalidas' };
  if (d.consentimiento !== true) return { ok: false, error: 'falta_consentimiento' };

  const sh = hoja_();
  const filas = filas_(sh);
  const activa = filas.find((r) => r[C.EVENTO] === d.evento && String(r[C.EMAIL]).toLowerCase() === email && r[C.ESTADO] !== ESTADO.CANCELADA);
  if (activa) return { ok: false, error: 'duplicada' };

  const capacidad = capacidad_(d.evento);
  const libres = capacidad - ocupadas_(filas, d.evento);
  const estado = plazas <= libres ? ESTADO.OK : ESTADO.ESPERA;
  const id = d.evento.slice(0, 3).toUpperCase() + '-' + Utilities.getUuid().slice(0, 6).toUpperCase();
  const token = Utilities.getUuid().replace(/-/g, '').slice(0, 16);

  sh.appendRow([new Date(), id, d.evento, nombre, email, telefono, plazas, comentario, estado, token, 'Sí', '']);

  enviarReserva_(estado === ESTADO.OK ? 'confirmada' : 'espera', ev, email, nombre, plazas, id, token);
  enviar_(
    EQUIPO,
    `${estado === ESTADO.OK ? 'Nueva reserva' : 'Lista de espera'} · ${ev.titulo}: ${nombre} (${plazas})`,
    `${nombre} <${email}> ${telefono ? '· ' + telefono : ''}\n${plazas} plaza(s) · ${estado}\n` +
      (comentario ? `Comentario: ${comentario}\n` : '') +
      `Quedan ${Math.max(0, libres - (estado === ESTADO.OK ? plazas : 0))} de ${capacidad}.\nHoja: ${hoja_().getParent().getUrl()}`
  );

  return { ok: true, estado, plazas, libres: Math.max(0, libres - (estado === ESTADO.OK ? plazas : 0)) };
}

function cancelar_(d) {
  const sh = hoja_();
  const filas = filas_(sh);
  const i = filas.findIndex((r) => r[C.ID] === d.id && r[C.TOKEN] === d.token);
  if (i < 0) return { ok: false, error: 'reserva_no_encontrada' };
  const fila = filas[i];
  if (fila[C.ESTADO] === ESTADO.CANCELADA) return { ok: true, yaCancelada: true };

  const habiaPlaza = fila[C.ESTADO] === ESTADO.OK;
  sh.getRange(i + 2, C.ESTADO + 1).setValue(ESTADO.CANCELADA);
  fila[C.ESTADO] = ESTADO.CANCELADA;
  const ev = EVENTOS[fila[C.EVENTO]];

  enviar_(EQUIPO, `Cancelación · ${ev.titulo}: ${fila[C.NOMBRE]} (${fila[C.PLAZAS]})`, `${fila[C.NOMBRE]} <${fila[C.EMAIL]}> ha cancelado su reserva (${fila[C.PLAZAS]} plaza/s, estado previo: ${habiaPlaza ? ESTADO.OK : ESTADO.ESPERA}).`);

  if (habiaPlaza) promocionarEspera_(sh, filas, fila[C.EVENTO]);
  return { ok: true };
}

// Pasa a "Confirmada" a quienes esperaban, por orden de llegada, mientras quepan.
function promocionarEspera_(sh, filas, evento) {
  const ev = EVENTOS[evento];
  let libres = capacidad_(evento) - ocupadas_(filas, evento);
  for (let i = 0; i < filas.length; i++) {
    const r = filas[i];
    if (r[C.EVENTO] !== evento || r[C.ESTADO] !== ESTADO.ESPERA) continue;
    const n = Number(r[C.PLAZAS]);
    if (n > libres) continue;
    sh.getRange(i + 2, C.ESTADO + 1).setValue(ESTADO.OK);
    r[C.ESTADO] = ESTADO.OK;
    libres -= n;
    enviarReserva_('promocionada', ev, r[C.EMAIL], r[C.NOMBRE], n, r[C.ID], r[C.TOKEN]);
  }
}

// ── Recordatorio (se ejecuta cada día; envía el del día anterior al encuentro) ─────────────
function enviarRecordatorios() {
  const manana = Utilities.formatDate(new Date(Date.now() + 24 * 3600 * 1000), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const sh = hoja_();
  const filas = filas_(sh);
  filas.forEach((r, i) => {
    const ev = EVENTOS[r[C.EVENTO]];
    if (!ev || ev.fecha !== manana || r[C.ESTADO] !== ESTADO.OK || r[C.REC]) return;
    enviarReserva_('recordatorio', ev, r[C.EMAIL], r[C.NOMBRE], Number(r[C.PLAZAS]), r[C.ID], r[C.TOKEN]);
    sh.getRange(i + 2, C.REC + 1).setValue(new Date());
  });
}

// ── Configuración inicial (ejecutar UNA vez a mano desde el editor) ────────────────────────
function setup() {
  const p = props_();
  if (!p.getProperty('SECRET')) {
    p.setProperty('SECRET', Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, ''));
  }
  const sh = hoja_();
  instalarTrigger();
  Logger.log('RESERVAS_SECRET (cópialo en Vercel): ' + p.getProperty('SECRET'));
  Logger.log('Hoja de reservas: ' + sh.getParent().getUrl());
}

function instalarTrigger() {
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'enviarRecordatorios')
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('enviarRecordatorios').timeBased().everyDays(1).atHour(10).create();
}

// ── Utilidades ─────────────────────────────────────────────────────────────────────────────
function props_() {
  return PropertiesService.getScriptProperties();
}

function hoja_() {
  const p = props_();
  const id = p.getProperty('SHEET_ID');
  let ss;
  if (id) {
    ss = SpreadsheetApp.openById(id);
  } else {
    ss = SpreadsheetApp.create('Reservas de encuentros — Encuentros Siloé');
    p.setProperty('SHEET_ID', ss.getId());
  }
  let sh = ss.getSheetByName('Reservas');
  if (!sh) {
    sh = ss.getSheets()[0];
    sh.setName('Reservas');
    sh.appendRow(COLUMNAS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function filas_(sh) {
  return sh.getDataRange().getValues().slice(1);
}

function capacidad_(evento) {
  const custom = Number(props_().getProperty('CAPACIDAD_' + evento.toUpperCase()));
  return custom > 0 ? custom : EVENTOS[evento].capacidad;
}

function ocupadas_(filas, evento) {
  return filas
    .filter((r) => r[C.EVENTO] === evento && r[C.ESTADO] === ESTADO.OK)
    .reduce((s, r) => s + Number(r[C.PLAZAS] || 0), 0);
}

function limpiar_(v, max) {
  return String(v == null ? '' : v).replace(/[\u0000-\u001f<>]/g, ' ').trim().slice(0, max);
}

function esc_(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function enviar_(para, asunto, texto, html) {
  const cuerpoHtml =
    html ||
    '<div>' + esc_(texto).replace(/\n/g, '<br>').replace(/(https?:\/\/[^\s<)]+)/g, '<a href="$1">$1</a>') + '</div>';
  GmailApp.sendEmail(para, asunto, texto, { htmlBody: cuerpoHtml, name: REMITENTE, replyTo: EQUIPO });
}

const FIRMA =
  '\n\nUn abrazo,\nEquipo de Encuentros Siloé\ninfo@encuentrossiloe.org\nhttps://encuentrossiloe.org\n' +
  'Instagram: @encuentrossiloe (https://www.instagram.com/encuentrossiloe)';

function enlaceCancelar_(id, token) {
  return `${SITE}/api/reserva?cancelar=${id}.${token}`;
}

function plazasTxt_(n) {
  return n === 1 ? '1 plaza' : `${n} plazas`;
}

function mayus_(t) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function primerNombre_(nombre) {
  return String(nombre).trim().split(/\s+/)[0];
}

// Textos de cada tipo de correo (la maquetación común está en htmlCorreo_).
function contenidoCorreo_(tipo, ev, nombre, plazas, id, token) {
  const yo = primerNombre_(nombre);
  const baja = enlaceCancelar_(id, token);
  const datosTxt = `- Fecha y hora: ${ev.cuando}\n- Lugar: ${ev.lugar}\n`;
  const c = { baja, mapa: ev.mapa, plazas: plazasTxt_(plazas), etiquetaPlazas: 'PLAZAS' };

  if (tipo === 'espera') {
    c.asunto = `Lista de espera — ${ev.titulo}`;
    c.kicker = 'LISTA DE ESPERA';
    c.titulo = `Estás en la lista de espera, ${yo}`;
    c.intro = `El aforo del ${ev.titulo} está completo ahora mismo. Te hemos apuntado en la lista de espera y, si se libera una plaza, te escribiremos de inmediato.`;
    c.etiquetaPlazas = 'PLAZAS EN ESPERA';
    c.boton = false;
    c.enlaceTxt = 'Si ya no te interesa, puedes';
    c.enlaceLabel = 'darte de baja de la lista';
    c.cierre = 'Un abrazo,';
    c.texto = `Hola, ${nombre}:\n\nEl aforo del ${ev.titulo} está completo ahora mismo, así que te hemos apuntado en la lista de espera (${plazasTxt_(plazas)}). Si se libera plaza, te escribiremos de inmediato.\n\n${datosTxt}\nSi ya no te interesa, puedes darte de baja aquí:\n${baja}${FIRMA}`;
  } else if (tipo === 'recordatorio') {
    c.asunto = `Mañana: ${ev.titulo}`;
    c.kicker = 'MAÑANA';
    c.titulo = `Mañana nos vemos, ${yo}`;
    c.intro = `Te recordamos que mañana es el ${ev.titulo}, con ${plazasTxt_(plazas)} a tu nombre. Habrá ${ev.resumen}.`;
    c.boton = true;
    c.enlaceTxt = 'Si al final no puedes venir, avísanos para dar tu plaza a otra persona:';
    c.enlaceLabel = 'liberar mi plaza';
    c.cierre = '¡Te esperamos!';
    c.texto = `Hola, ${nombre}:\n\nTe recordamos que mañana es el ${ev.titulo}, con ${plazasTxt_(plazas)} a tu nombre:\n${datosTxt}\nSi al final no puedes venir, avísanos para dar tu plaza a otra persona:\n${baja}\n\n¡Te esperamos!${FIRMA}`;
  } else {
    const prom = tipo === 'promocionada';
    c.asunto = prom ? `¡Se ha liberado plaza! — ${ev.titulo}` : `Reserva confirmada — ${ev.titulo}`;
    c.kicker = prom ? 'SE HA LIBERADO UNA PLAZA' : 'RESERVA CONFIRMADA';
    c.titulo = prom ? `¡Ya tienes plaza, ${yo}!` : `Tu plaza está reservada, ${yo}`;
    c.intro = prom
      ? `Se ha liberado una plaza y ya estás dentro. Hemos anotado ${plazasTxt_(plazas)} a tu nombre para el ${ev.titulo}.`
      : `Gracias por tu reserva. Hemos anotado ${plazasTxt_(plazas)} a tu nombre para el ${ev.titulo}. ¡Te esperamos!`;
    c.boton = true;
    c.enlaceTxt = '¿No puedes venir? Avísanos para dar tu plaza a otra persona:';
    c.enlaceLabel = 'liberar mi plaza';
    c.cierre = 'Un abrazo,';
    c.texto = `Hola, ${nombre}:\n\n${c.intro}\n${datosTxt}\n¡Te esperamos!\n\nSi no puedes venir, avísanos para liberar tu plaza para otra persona:\n${baja}${FIRMA}`;
  }
  return c;
}

function enviarReserva_(tipo, ev, email, nombre, plazas, id, token) {
  const c = contenidoCorreo_(tipo, ev, nombre, plazas, id, token);
  enviar_(email, c.asunto, c.texto, htmlCorreo_(ev, c));
}

// Maquetación del correo: tablas con estilos en línea (lo que admiten Gmail, Outlook y el móvil).
function htmlCorreo_(ev, c) {
  const F_SANS = "'Source Sans 3',Arial,Helvetica,sans-serif";
  const F_SERIF = "Lora,Georgia,'Times New Roman',serif";
  const fila = (etiqueta, valor, ultima) =>
    `<tr><td style="padding:14px 0;${ultima ? '' : 'border-bottom:1px solid #d5dbe2;'}">` +
    `<div style="font-size:11px;font-weight:700;letter-spacing:0.14em;color:#5b6570;">${etiqueta}</div>` +
    `<div style="margin-top:3px;font-size:17px;font-weight:700;color:#0f2138;">${esc_(valor)}</div></td></tr>`;
  const boton = c.boton
    ? `<tr><td style="padding:20px 40px 0 40px;"><a href="${esc_(c.mapa)}" style="display:inline-block;background:#1f3a5f;color:#ffffff;font-size:16px;font-weight:700;padding:14px 30px;border-radius:999px;text-decoration:none;font-family:${F_SANS};">Cómo llegar</a></td></tr>`
    : '';
  const enlaceBaja = `<a href="${esc_(c.baja)}" style="color:#1f3a5f;font-weight:700;">${esc_(c.enlaceLabel)}</a>`;
  const cierreHtml = esc_(c.cierre) + '<br>Equipo de Encuentros Siloé';

  return (
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>` +
    `<body style="margin:0;padding:0;background:#e9edf1;">` +
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc_(c.intro)}</div>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e9edf1;"><tr><td align="center" style="padding:24px 12px;">` +
    `<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;font-family:${F_SANS};color:#1c2530;">` +
    // cabecera
    `<tr><td style="background:#0f2138;padding:20px 32px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>` +
    `<td style="padding-right:14px;"><img src="${SITE}/logo-mark-white.png" width="46" height="46" alt="Encuentros Siloé" style="display:block;border:0;"></td>` +
    `<td style="color:#ffffff;font-size:13px;font-weight:700;letter-spacing:0.24em;font-family:${F_SANS};">ENCUENTROS SILOÉ</td></tr></table></td></tr>` +
    `<tr><td style="height:3px;line-height:3px;font-size:3px;background:#d9a356;">&nbsp;</td></tr>` +
    // banner
    `<tr><td><img src="${esc_(ev.banner)}" width="600" alt="Cartel del ${esc_(ev.titulo)}" style="display:block;width:100%;max-width:600px;height:auto;border:0;"></td></tr>` +
    // titular
    `<tr><td style="padding:36px 40px 8px 40px;">` +
    `<div style="font-size:12px;font-weight:700;letter-spacing:0.16em;color:#8e6020;">${esc_(c.kicker)}</div>` +
    `<h1 style="margin:10px 0 0 0;font-family:${F_SERIF};font-size:29px;line-height:1.2;font-weight:600;color:#0f2138;">${esc_(c.titulo)}</h1>` +
    `<p style="margin:16px 0 0 0;font-size:16px;line-height:1.6;color:#1c2530;">${esc_(c.intro)}</p></td></tr>` +
    // datos
    `<tr><td style="padding:20px 40px 8px 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#edf0f3;border-radius:12px;"><tr><td style="padding:6px 24px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">` +
    fila('FECHA Y HORA', mayus_(ev.cuando).replace(', ', ' · '), false) +
    fila('LUGAR', ev.lugar, false) +
    fila(c.etiquetaPlazas, c.plazas, true) +
    `</table></td></tr></table></td></tr>` +
    boton +
    `<tr><td style="padding:28px 40px 4px 40px;font-size:15px;line-height:1.6;color:#1c2530;">${esc_(c.enlaceTxt)} ${enlaceBaja}.</td></tr>` +
    `<tr><td style="padding:20px 40px 36px 40px;font-family:${F_SERIF};font-size:16px;line-height:1.5;color:#0f2138;font-style:italic;">${cierreHtml}</td></tr>` +
    // pie
    `<tr><td style="background:#0f2138;padding:24px 40px;font-size:13px;line-height:1.7;color:#c9d6e6;">` +
    `<a href="mailto:${EQUIPO}" style="color:#ffffff;text-decoration:underline;">${EQUIPO}</a> · ` +
    `<a href="${SITE}" style="color:#ffffff;text-decoration:underline;">encuentrossiloe.org</a> · ` +
    `<a href="https://www.instagram.com/encuentrossiloe" style="color:#ffffff;text-decoration:underline;">@encuentrossiloe</a>` +
    `<div style="margin-top:10px;font-size:12px;line-height:1.5;color:#a9bbd1;">Recibes este correo porque has reservado plaza en encuentrossiloe.org. Tratamos tus datos según nuestra <a href="${SITE}/privacidad" style="color:#ffffff;">política de privacidad</a>.</div>` +
    `</td></tr></table></td></tr></table></body></html>`
  );
}
