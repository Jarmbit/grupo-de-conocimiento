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

  enviar_(email, asunto_(estado, ev), cuerpoReserva_(estado, ev, nombre, plazas, id, token));
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
    enviar_(r[C.EMAIL], `¡Se ha liberado plaza! — ${ev.titulo}`, cuerpoReserva_('Promocionada', ev, r[C.NOMBRE], n, r[C.ID], r[C.TOKEN]));
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
    enviar_(r[C.EMAIL], `Mañana: ${ev.titulo}`, cuerpoRecordatorio_(ev, r[C.NOMBRE], Number(r[C.PLAZAS]), r[C.ID], r[C.TOKEN]));
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

function enviar_(para, asunto, texto) {
  const html = '<div>' + esc_(texto).replace(/\n/g, '<br>').replace(/(https?:\/\/[^\s<)]+)/g, '<a href="$1">$1</a>') + '</div>';
  GmailApp.sendEmail(para, asunto, texto, { htmlBody: html, name: REMITENTE, replyTo: EQUIPO });
}

const FIRMA =
  '\n\nUn abrazo,\nEquipo de Encuentros Siloé\ninfo@encuentrossiloe.org\nhttps://encuentrossiloe.org\n' +
  'Instagram: @encuentrossiloe (https://www.instagram.com/encuentrossiloe)';

function enlaceCancelar_(id, token) {
  return `${SITE}/api/reserva?cancelar=${id}.${token}`;
}

function asunto_(estado, ev) {
  return estado === ESTADO.OK ? `Reserva confirmada — ${ev.titulo}` : `Lista de espera — ${ev.titulo}`;
}

function plazasTxt_(n) {
  return n === 1 ? '1 plaza' : `${n} plazas`;
}

function cuerpoReserva_(estado, ev, nombre, plazas, id, token) {
  const datos = `- Fecha y hora: ${ev.cuando}\n- Lugar: ${ev.lugar}\n`;
  const cancelar = `Si no puedes venir, avísanos para liberar tu plaza para otra persona:\n${enlaceCancelar_(id, token)}`;
  if (estado === ESTADO.ESPERA) {
    return `Hola, ${nombre}:\n\nEl aforo del ${ev.titulo} está completo ahora mismo, así que te hemos apuntado en la lista de espera (${plazasTxt_(plazas)}). Si se libera plaza, te escribiremos de inmediato.\n\n${datos}\nSi ya no te interesa, puedes darte de baja aquí:\n${enlaceCancelar_(id, token)}${FIRMA}`;
  }
  const intro =
    estado === 'Promocionada'
      ? `Se ha liberado plaza y ya estás dentro. Hemos anotado ${plazasTxt_(plazas)} a tu nombre para el ${ev.titulo}:`
      : `Gracias por tu reserva. Hemos anotado ${plazasTxt_(plazas)} a tu nombre para el ${ev.titulo}:`;
  return `Hola, ${nombre}:\n\n${intro}\n${datos}\n¡Te esperamos!\n\n${cancelar}${FIRMA}`;
}

function cuerpoRecordatorio_(ev, nombre, plazas, id, token) {
  return `Hola, ${nombre}:\n\nTe recordamos que mañana es el ${ev.titulo}, con ${plazasTxt_(plazas)} a tu nombre:\n- Fecha y hora: ${ev.cuando}\n- Lugar: ${ev.lugar}\n\nSi al final no puedes venir, avísanos para dar tu plaza a otra persona:\n${enlaceCancelar_(id, token)}\n\n¡Te esperamos!${FIRMA}`;
}
