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
  costarica: {
    titulo: 'Encuentro en Costa Rica: El origen de la vida',
    fecha: '2026-12-05', // AAAA-MM-DD (para el recordatorio del día anterior)
    cuando: 's\u00e1bado 5 de diciembre, 19:00 h (hora de Costa Rica)',
    lugar: 'Condominio Las Palmas 32 y 33',
    capacidad: 15, // aforo de Costa Rica (15 personas)
    banner: 'https://encuentrossiloe.org/images/email/costarica-banner.jpg', // cabecera de los correos
    mapa: 'https://www.google.com/maps/search/?api=1&query=Condominio+Las+Palmas%2C+Costa+Rica',
    resumen: 'ciencia, universo y un origen con sentido, con v\u00eddeo y m\u00fasica en directo',
  },
  jovenes: {
    titulo: 'Encuentro jóvenes',
    fecha: '2026-11-20',
    cuando: 'viernes 20 de noviembre, 20:00 h',
    lugar: 'Calle Eucalipto 22, Las Rozas (Madrid)',
    capacidad: 100, // provisional: ajústalo en Propiedades del script → CAPACIDAD_JOVENES
    banner: 'https://encuentrossiloe.org/images/email/jovenes-banner.jpg',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Calle+Eucalipto+22%2C+Las+Rozas%2C+Madrid',
    casa: true, // encuentro en una casa: se pide traer algo para picar
    resumen: 'la película Jesús de Nazaret, música en directo, testimonio y diálogo',
  },
  razonable: {
    titulo: 'Encuentro «Dios: una creencia razonable»',
    fecha: '2026-11-20',
    cuando: 'viernes 20 de noviembre, 20:00 h',
    lugar: 'Avenida de los Rubios 18, Las Rozas',
    capacidad: 100, // provisional: ajústalo en Propiedades del script → CAPACIDAD_RAZONABLE
    banner: 'https://encuentrossiloe.org/images/email/razonable-banner.jpg',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Avenida+de+los+Rubios+18%2C+Las+Rozas',
    resumen: 'vídeo y música en directo',
  },
  adultos: {
    titulo: 'Encuentro adultos',
    fecha: '2026-11-21',
    cuando: 'sábado 21 de noviembre, 20:00 h',
    lugar: 'Calle Eucalipto 22, Las Rozas (Madrid)',
    capacidad: 100, // provisional: ajústalo en Propiedades del script → CAPACIDAD_ADULTOS
    banner: 'https://encuentrossiloe.org/images/email/adultos-banner.jpg',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Calle+Eucalipto+22%2C+Las+Rozas%2C+Madrid',
    casa: true, // encuentro en una casa: se pide traer algo para picar
    resumen: 'música, la película Jesús de Nazaret, testimonio y diálogo',
  },
  burgos: {
    titulo: 'Encuentro en Burgos',
    fecha: '2026-11-28',
    cuando: 'sábado 28 de noviembre, 18:00 h',
    lugar: 'Auditorio Círculo Católico, C/ Concepción s/n, Burgos',
    capacidad: 100, // provisional: ajústalo en Propiedades del script → CAPACIDAD_BURGOS
    banner: 'https://encuentrossiloe.org/images/email/burgos-banner.jpg',
    mapa: 'https://www.google.com/maps/search/?api=1&query=C%C3%ADrculo+Cat%C3%B3lico+Calle+Concepci%C3%B3n%2C+Burgos',
    resumen: 'la película Jesús de Nazaret y música en directo',
  },
  espinosa: {
    titulo: 'Encuentro en Espinosa de los Monteros',
    fecha: '2026-12-11',
    cuando: 'viernes 11 de diciembre, 19:30 h',
    lugar: 'Parroquia, Sancho García 9, Espinosa de los Monteros (Burgos)',
    capacidad: 100, // provisional: ajústalo en Propiedades del script → CAPACIDAD_ESPINOSA
    banner: 'https://encuentrossiloe.org/images/email/espinosa-banner.jpg',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Calle+Sancho+Garc%C3%ADa+9%2C+Espinosa+de+los+Monteros',
    resumen: 'vídeo Jesús de Nazaret, música en directo y picoteo para compartir al final',
  },
};

const SITE = 'https://encuentrossiloe.org';
const EQUIPO = 'info@encuentrossiloe.org';
const REMITENTE = 'Encuentros Siloé';
const MAX_PLAZAS_POR_RESERVA = 6;

const COLUMNAS = [
  'Registro', 'ID', 'Evento', 'Nombre', 'Email', 'Teléfono', 'Plazas',
  'Comentario', 'Estado', 'Token', 'Consentimiento', 'Recordatorio', 'Agradecimiento',
];
const C = { REG: 0, ID: 1, EVENTO: 2, NOMBRE: 3, EMAIL: 4, TEL: 5, PLAZAS: 6, COM: 7, ESTADO: 8, TOKEN: 9, CONS: 10, REC: 11, GRACIAS: 12 };
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
    if (data.action === 'boletin') return json_(boletin_(data));
    if (data.action === 'donativo') return json_(donativo_(data));
    if (data.action === 'contacto') return json_(contacto_(data));
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

  sh.appendRow([new Date(), id, d.evento, texto_(nombre), email, texto_(telefono), plazas, comentario, estado, token, 'Sí', '', '']);

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
  enviarAgradecimientos();
}

// ── Agradecimiento (cada día; el día siguiente al encuentro, a quien tenía plaza confirmada) ──
function enviarAgradecimientos() {
  const ayer = Utilities.formatDate(new Date(Date.now() - 24 * 3600 * 1000), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const sh = hoja_();
  if (!sh.getRange(1, C.GRACIAS + 1).getValue()) sh.getRange(1, C.GRACIAS + 1).setValue(COLUMNAS[C.GRACIAS]);
  const filas = filas_(sh);
  const enviados = {};
  filas.forEach((r, i) => {
    const ev = EVENTOS[r[C.EVENTO]];
    if (!ev || ev.fecha !== ayer || r[C.ESTADO] !== ESTADO.OK || r[C.GRACIAS]) return;
    const c = graciasCorreo_(ev, r[C.NOMBRE]);
    enviar_(r[C.EMAIL], c.asunto, c.texto, c.html);
    sh.getRange(i + 2, C.GRACIAS + 1).setValue(new Date());
    enviados[ev.titulo] = (enviados[ev.titulo] || 0) + 1;
  });
  Object.keys(enviados).forEach((t) =>
    enviar_(EQUIPO, `Agradecimiento enviado · ${t}`, `Se ha enviado el correo de agradecimiento a ${enviados[t]} persona(s) con plaza confirmada.`)
  );
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

// Valores que la hoja podría leer como fórmula (p. ej. un teléfono «+34 …» o un texto que empieza
// por «=»): el apóstrofo inicial los guarda como texto y no se ve en la celda.
function texto_(v) {
  const t = String(v == null ? '' : v);
  return /^[=+\-@]/.test(t) ? "'" + t : t;
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

// Invitación a apoyar (correos de reserva confirmada, plaza liberada y recordatorio).
const APOYA = SITE + '/apoya';
const APOYO_TXT = '¿Quieres ayudarnos a llevar los encuentros a más lugares? Puedes hacer un donativo de la cantidad que quieras';
const APOYO_TXT_PLANO = `\n\n${APOYO_TXT}:\n${APOYA}`;

// Encuentros en una casa (ev.casa): cada uno trae algo para compartir.
const PICOTEO_TXT = 'El encuentro es en una casa: si puedes, trae algo para picar y compartir entre todos.';

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
  const datosTxt = `- Fecha y hora: ${ev.cuando}\n- Lugar: ${ev.lugar}\n` +
    (ev.casa && tipo !== 'espera' ? `\n${PICOTEO_TXT}\n` : '');
  const c = { baja, mapa: ev.mapa, plazas: plazasTxt_(plazas), etiquetaPlazas: 'PLAZAS', apoyo: tipo !== 'espera' };

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
    c.texto = `Hola, ${nombre}:\n\nTe recordamos que mañana es el ${ev.titulo}, con ${plazasTxt_(plazas)} a tu nombre:\n${datosTxt}\nSi al final no puedes venir, avísanos para dar tu plaza a otra persona:\n${baja}\n\n¡Te esperamos!${APOYO_TXT_PLANO}${FIRMA}`;
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
    c.texto = `Hola, ${nombre}:\n\n${c.intro}\n${datosTxt}\nSi no puedes venir, avísanos para liberar tu plaza para otra persona:\n${baja}${APOYO_TXT_PLANO}${FIRMA}`;
  }
  return c;
}

// Correo de agradecimiento tras un encuentro (versión general del de Málaga).
function graciasCorreo_(ev, nombre) {
  const yo = primerNombre_(nombre);
  const habla = SITE + '/habla-con-nosotros';
  const continuidad = SITE + '/continuidad';
  const ig = 'https://www.instagram.com/encuentrossiloe';
  const asunto = `Gracias por acompañarnos — ${ev.titulo}`;
  const intro = `Gracias de corazón por venir al ${ev.titulo}. Ha sido un regalo compartir este encuentro contigo, y esperamos que sea el comienzo de un camino.`;
  const bloques =
    `<tr><td style="padding:20px 40px 8px 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ${fondo_('#edf0f3')}"><tr><td ${fondo_('#edf0f3')}padding:22px 24px;">` +
    `<div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#5b6570;">NOS AYUDARÍA MUCHO</div>` +
    `<div style="margin:6px 0 16px 0;font-size:16px;line-height:1.6;color:#1c2530;">Conocer tus impresiones: qué te pareció el encuentro, qué sentiste y qué mejorarías. Puedes contárnoslo en el apartado «Habla con nosotros» de la web.</div>` +
    botonHtml_(habla, 'Cuéntanos tu experiencia') +
    `</td></tr></table></td></tr>` +
    `<tr><td style="padding:20px 40px 4px 40px;font-size:16px;line-height:1.6;color:#1c2530;"><strong style="color:#0f2138;">¿Y después qué?</strong> El encuentro no termina: puedes seguir caminando con nosotros en el itinerario <a href="${continuidad}" style="color:#1f3a5f;font-weight:700;">«Hijos en el Hijo»</a>.</td></tr>` +
    `<tr><td style="padding:16px 40px 8px 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ${fondo_('#fbefd6')}"><tr><td ${fondo_('#fbefd6')}padding:22px 24px;">` +
    `<div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#8e6020;">APOYA ESTA MISIÓN</div>` +
    `<div style="margin:6px 0 16px 0;font-size:16px;line-height:1.6;color:#1c2530;">Si quieres ayudarnos a llevar los encuentros a más lugares, puedes hacer un donativo de la cantidad que quieras.</div>` +
    botonHtml_(APOYA, 'Hacer un donativo', '#d9a356', '#0f2138') +
    `<div style="margin-top:12px;font-size:13px;line-height:1.5;color:#5b6570;">Aviso: por ahora los donativos no desgravan fiscalmente.</div>` +
    `</td></tr></table></td></tr>` +
    `<tr><td style="padding:20px 40px 4px 40px;font-size:16px;line-height:1.6;color:#1c2530;"><strong style="color:#0f2138;">Síguenos en Instagram</strong> para estar al día de los próximos encuentros: <a href="${ig}" style="color:#1f3a5f;font-weight:700;">@encuentrossiloe</a>.</td></tr>`;
  const html = marco_({
    preheader: intro,
    banner: ev.banner,
    bannerAlt: `Cartel del ${ev.titulo}`,
    kicker: 'GRACIAS',
    titulo: `Gracias por acompañarnos, ${yo}`,
    intro,
    bloques,
    cierre: 'Un abrazo y que Dios te bendiga,<br>Equipo de Encuentros Siloé',
    nota: 'Recibes este correo porque reservaste plaza en este encuentro.',
  });
  const texto =
    `Hola, ${nombre}:\n\n${intro}\n\nNos ayudaría mucho conocer tus impresiones: qué te pareció, qué sentiste y qué mejorarías. Puedes contárnoslo aquí:\n${habla}\n\n` +
    `El encuentro no termina: puedes seguir caminando con nosotros en el itinerario «Hijos en el Hijo»:\n${continuidad}\n\n` +
    `Si quieres ayudarnos a llevar los encuentros a más lugares, puedes hacer un donativo de la cantidad que quieras:\n${APOYA}\n(Aviso: por ahora los donativos no desgravan fiscalmente.)` +
    FIRMA;
  return { asunto, html, texto };
}

// Correo sencillo con la maquetación corporativa y sin cartel (boletín, donativos).
function correoSimple_(o) {
  const bloques = (o.parrafos || [])
    .map((p) => `<tr><td style="padding:16px 40px 0 40px;font-size:16px;line-height:1.6;color:#1c2530;">${p}</td></tr>`)
    .join('') + (o.boton ? `<tr><td style="padding:24px 40px 0 40px;">${botonHtml_(o.boton.url, o.boton.texto)}</td></tr>` : '');
  return marco_({
    preheader: o.intro,
    kicker: o.kicker,
    titulo: o.titulo,
    intro: o.intro,
    bloques,
    cierre: 'Un abrazo,<br>Equipo de Encuentros Siloé',
    nota: o.nota,
  });
}

// ── Boletín: alta desde la web ─────────────────────────────────────────────────────────────
function boletin_(d) {
  const nombre = limpiar_(d.nombre, 80);
  const email = limpiar_(d.email, 120).toLowerCase();
  if (nombre.length < 2) return { ok: false, error: 'nombre_invalido' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, error: 'email_invalido' };
  if (d.consentimiento !== true) return { ok: false, error: 'falta_consentimiento' };

  const sh = pestana_('Boletín', ['Alta', 'Nombre', 'Email', 'Consentimiento', 'Estado']);
  const ya = filas_(sh).some((r) => String(r[2]).toLowerCase() === email && r[4] !== 'Baja');
  if (ya) return { ok: true, yaSuscrito: true };
  sh.appendRow([new Date(), texto_(nombre), email, 'Sí', 'Activa']);

  const yo = primerNombre_(nombre);
  const intro = 'Gracias por suscribirte al boletín de Encuentros Siloé. Una vez al mes te contaremos las novedades, los vídeos y los próximos encuentros.';
  enviar_(
    email,
    'Te damos la bienvenida al boletín de Encuentros Siloé',
    `Hola, ${nombre}:\n\n${intro}\n\nMientras tanto, puedes ver los próximos encuentros en ${SITE}\n\nSi en algún momento no quieres recibirlo, responde a este correo y te daremos de baja.${FIRMA}`,
    correoSimple_({
      kicker: 'BOLETÍN',
      titulo: `¡Te damos la bienvenida, ${yo}!`,
      intro,
      parrafos: [
        `Mientras tanto, puedes ver los próximos encuentros en la web y seguirnos en Instagram: <a href="https://www.instagram.com/encuentrossiloe" style="color:#1f3a5f;font-weight:700;">@encuentrossiloe</a>.`,
        'Si en algún momento no quieres recibirlo, responde a este correo y te daremos de baja.',
      ],
      boton: { url: SITE + '/#encuentros', texto: 'Ver próximos encuentros' },
      nota: 'Recibes este correo porque te has suscrito al boletín en encuentrossiloe.org.',
    })
  );
  enviar_(EQUIPO, `Nueva suscripción al boletín: ${nombre}`, `${nombre} <${email}> se ha suscrito al boletín.\nHoja: ${sh.getParent().getUrl()}`);
  return { ok: true };
}

// ── Donativo: agradecimiento al donante (lo llama /api/redsys-notify tras un pago aprobado) ──
function donativo_(d) {
  const pedido = limpiar_(d.pedido, 30);
  const nombre = limpiar_(d.nombre, 80);
  const email = limpiar_(d.email, 120).toLowerCase();
  const importe = limpiar_(d.importe, 20);
  const tipo = limpiar_(d.tipo, 40);
  if (!pedido) return { ok: false, error: 'pedido_invalido' };

  const sh = pestana_('Donativos', ['Fecha', 'Pedido', 'Nombre', 'Email', 'Importe', 'Tipo', 'Agradecimiento']);
  if (filas_(sh).some((r) => String(r[1]) === pedido)) return { ok: true, repetido: true }; // Redsys puede notificar dos veces
  const valido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  sh.appendRow([new Date(), pedido, texto_(nombre), email, importe, tipo, valido ? new Date() : 'Sin correo']);
  if (!valido) return { ok: true, enviado: false };

  const yo = nombre ? primerNombre_(nombre) : '';
  const intro = `Hemos recibido tu donativo de ${importe}. Muchas gracias por tu generosidad: nos ayuda a llevar los encuentros a más lugares y a más personas.`;
  enviar_(
    email,
    'Gracias por tu donativo',
    `Hola${nombre ? ', ' + nombre : ''}:\n\n${intro}\n\nReferencia del pago: ${pedido}\nAviso: por ahora los donativos no desgravan fiscalmente.\n\nRezamos por ti y por tus intenciones.${FIRMA}`,
    correoSimple_({
      kicker: 'DONATIVO RECIBIDO',
      titulo: yo ? `¡Gracias, ${yo}!` : '¡Gracias!',
      intro,
      parrafos: [
        `Referencia del pago: <strong>${esc_(pedido)}</strong>${tipo ? ' · ' + esc_(tipo) : ''}.`,
        'Rezamos por ti y por tus intenciones.',
        '<span style="font-size:13px;color:#5b6570;">Aviso: por ahora los donativos no desgravan fiscalmente.</span>',
      ],
      nota: 'Recibes este correo porque has hecho un donativo en encuentrossiloe.org.',
    })
  );
  return { ok: true, enviado: true };
}

// ── Formularios de contacto (pide un encuentro, voluntariado, continuidad, habla con nosotros) ──
const TIPOS_CONTACTO = {
  'pide-un-encuentro': {
    nombre: 'Pide un encuentro',
    asunto: 'Hemos recibido tu solicitud de encuentro',
    kicker: 'SOLICITUD RECIBIDA',
    intro: 'Gracias por querer organizar un encuentro. Hemos recibido tu solicitud y nos pondremos en contacto contigo en los próximos días para concretarlo.',
  },
  voluntariado: {
    nombre: 'Voluntariado',
    asunto: 'Gracias por querer ayudar',
    kicker: 'VOLUNTARIADO',
    intro: 'Gracias por ofrecer tu tiempo y tu talento. Hemos recibido tus datos y te escribiremos pronto para contarte cómo puedes colaborar.',
  },
  continuidad: {
    nombre: 'Continuidad (Hijos en el Hijo)',
    asunto: 'Te has apuntado al itinerario «Hijos en el Hijo»',
    kicker: 'HIJOS EN EL HIJO',
    intro: 'Gracias por querer seguir caminando con nosotros. Comunicaremos las fechas del acompañamiento próximamente y te escribiremos en cuanto las tengamos.',
  },
  'habla-con-nosotros': {
    nombre: 'Habla con nosotros',
    asunto: 'Hemos recibido tu mensaje',
    kicker: 'MENSAJE RECIBIDO',
    intro: 'Gracias por escribirnos. Hemos recibido tu mensaje y lo leeremos con cariño; si nos has hecho una pregunta, te responderemos pronto.',
  },
};

function contacto_(d) {
  const t = TIPOS_CONTACTO[d.tipo];
  if (!t) return { ok: false, error: 'tipo_desconocido' };
  const nombre = limpiar_(d.nombre, 80);
  const email = limpiar_(d.email, 120).toLowerCase();
  const telefono = limpiar_(d.telefono, 30);
  const mensaje = String(d.mensaje == null ? '' : d.mensaje).replace(/[\u0000-\u0009\u000b-\u001f<>]/g, ' ').trim().slice(0, 2000);
  if (nombre.length < 2) return { ok: false, error: 'nombre_invalido' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, error: 'email_invalido' };
  if (d.consentimiento !== true) return { ok: false, error: 'falta_consentimiento' };

  const sh = pestana_('Solicitudes', ['Fecha', 'Tipo', 'Nombre', 'Email', 'Teléfono', 'Mensaje', 'Estado']);
  sh.appendRow([new Date(), t.nombre, texto_(nombre), email, texto_(telefono), texto_(mensaje), 'Pendiente']);

  const cita = mensaje
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ${fondo_('#edf0f3')}"><tr><td ${fondo_('#edf0f3')}padding:18px 22px;">` +
      `<div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#5b6570;">LO QUE NOS HAS ESCRITO</div>` +
      `<div style="margin-top:6px;font-size:15px;line-height:1.6;color:#1c2530;">${esc_(mensaje).replace(/\n/g, '<br>')}</div></td></tr></table>`
    : '';
  enviar_(
    email,
    t.asunto,
    `Hola, ${nombre}:\n\n${t.intro}${mensaje ? '\n\nLo que nos has escrito:\n' + mensaje : ''}${FIRMA}`,
    correoSimple_({
      kicker: t.kicker,
      titulo: `Gracias, ${primerNombre_(nombre)}`,
      intro: t.intro,
      parrafos: [cita, `Mientras tanto, puedes seguirnos en Instagram: <a href="https://www.instagram.com/encuentrossiloe" style="color:#1f3a5f;font-weight:700;">@encuentrossiloe</a>.`].filter(Boolean),
      nota: 'Recibes este correo porque nos has escrito desde encuentrossiloe.org.',
    })
  );
  GmailApp.sendEmail(
    EQUIPO,
    `${t.nombre}: ${nombre}`,
    `${nombre} <${email}>${telefono ? ' · ' + telefono : ''}\n\n${mensaje || '(sin mensaje)'}\n\nResponde a este correo para escribirle directamente.\nHoja: ${sh.getParent().getUrl()}`,
    { name: REMITENTE, replyTo: email }
  );
  return { ok: true };
}

// Pestaña auxiliar del mismo libro (la crea con cabecera si no existe).
function pestana_(nombre, cabecera) {
  const ss = hoja_().getParent();
  let sh = ss.getSheetByName(nombre);
  if (!sh) {
    sh = ss.insertSheet(nombre);
    sh.appendRow(cabecera);
    sh.setFrozenRows(1);
  }
  return sh;
}

// Pruebas: envían cada correo nuevo solo a esta dirección, sin tocar la hoja.
const CORREO_PRUEBAS = 'jarmadae@gmail.com';
function pruebaConfirmaciones() {
  ['confirmada', 'espera', 'recordatorio'].forEach((tipo) => {
    const c = contenidoCorreo_(tipo, EVENTOS.razonable, 'Juan Armada', 2, 'PRU-000000', 'prueba');
    GmailApp.sendEmail(CORREO_PRUEBAS, '[PRUEBA] ' + c.asunto, c.texto, { htmlBody: htmlCorreo_(EVENTOS.razonable, c), name: REMITENTE, replyTo: EQUIPO });
  });
  const c = contenidoCorreo_('confirmada', EVENTOS.jovenes, 'Juan Armada', 1, 'PRU-000000', 'prueba');
  GmailApp.sendEmail(CORREO_PRUEBAS, '[PRUEBA] ' + c.asunto + ' (encuentro en casa)', c.texto, { htmlBody: htmlCorreo_(EVENTOS.jovenes, c), name: REMITENTE, replyTo: EQUIPO });
}

function pruebaCorreosNuevos() {
  const g = graciasCorreo_(EVENTOS.horche, 'Juan Armada');
  GmailApp.sendEmail(CORREO_PRUEBAS, '[PRUEBA] ' + g.asunto, g.texto, { htmlBody: g.html, name: REMITENTE, replyTo: EQUIPO });
  GmailApp.sendEmail(CORREO_PRUEBAS, '[PRUEBA] Te damos la bienvenida al boletín de Encuentros Siloé', 'Prueba', {
    htmlBody: correoSimple_({
      kicker: 'BOLETÍN', titulo: '¡Te damos la bienvenida, Juan!',
      intro: 'Gracias por suscribirte al boletín de Encuentros Siloé. Una vez al mes te contaremos las novedades, los vídeos y los próximos encuentros.',
      parrafos: ['Mientras tanto, puedes ver los próximos encuentros en la web y seguirnos en Instagram: <a href="https://www.instagram.com/encuentrossiloe" style="color:#1f3a5f;font-weight:700;">@encuentrossiloe</a>.', 'Si en algún momento no quieres recibirlo, responde a este correo y te daremos de baja.'],
      boton: { url: SITE + '/#encuentros', texto: 'Ver próximos encuentros' },
      nota: 'Recibes este correo porque te has suscrito al boletín en encuentrossiloe.org.',
    }), name: REMITENTE, replyTo: EQUIPO });
  GmailApp.sendEmail(CORREO_PRUEBAS, '[PRUEBA] Gracias por tu donativo', 'Prueba', {
    htmlBody: correoSimple_({
      kicker: 'DONATIVO RECIBIDO', titulo: '¡Gracias, Juan!',
      intro: 'Hemos recibido tu donativo de 20,00 €. Muchas gracias por tu generosidad: nos ayuda a llevar los encuentros a más lugares y a más personas.',
      parrafos: ['Referencia del pago: <strong>PRUEBA123</strong> · Donación puntual.', 'Rezamos por ti y por tus intenciones.', '<span style="font-size:13px;color:#5b6570;">Aviso: por ahora los donativos no desgravan fiscalmente.</span>'],
      nota: 'Recibes este correo porque has hecho un donativo en encuentrossiloe.org.',
    }), name: REMITENTE, replyTo: EQUIPO });
}

function enviarReserva_(tipo, ev, email, nombre, plazas, id, token) {
  const c = contenidoCorreo_(tipo, ev, nombre, plazas, id, token);
  enviar_(email, c.asunto, c.texto, htmlCorreo_(ev, c));
}

// ── Maquetación de correos ─────────────────────────────────────────────────────────────────
// Tablas con estilos en línea. Los fondos llevan `bgcolor` Y `background-color` (Outlook ignora
// `background`), y el botón es una celda con fondo (no depende de border-radius ni de padding del enlace).
const F_SANS = "'Source Sans 3',Arial,Helvetica,sans-serif";
const F_SERIF = "Lora,Georgia,'Times New Roman',serif";

function fondo_(color) {
  return `bgcolor="${color}" style="background-color:${color};`;
}

function botonHtml_(url, texto, fondo, color) {
  fondo = fondo || '#1f3a5f';
  color = color || '#ffffff';
  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>` +
    `<td bgcolor="${fondo}" style="background-color:${fondo};border-radius:999px;">` +
    `<a href="${esc_(url)}" style="display:inline-block;color:${color};font-size:16px;font-weight:700;padding:14px 30px;border-radius:999px;text-decoration:none;font-family:${F_SANS};">${esc_(texto)}</a>` +
    `</td></tr></table>`
  );
}

function filaDato_(etiqueta, valor, ultima) {
  return (
    `<tr><td style="padding:14px 0;${ultima ? '' : 'border-bottom:1px solid #d5dbe2;'}">` +
    `<div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#5b6570;">${etiqueta}</div>` +
    `<div style="margin-top:3px;font-size:17px;font-weight:700;color:#0f2138;">${esc_(valor)}</div></td></tr>`
  );
}

// Marco común. o = { preheader, banner, bannerAlt, kicker, titulo, intro, bloques (filas <tr> ya
// maquetadas), cierre, nota }
function marco_(o) {
  return (
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>` +
    `<body bgcolor="#e9edf1" style="margin:0;padding:0;background-color:#e9edf1;">` +
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc_(o.preheader)}</div>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ${fondo_('#e9edf1')}"><tr><td align="center" ${fondo_('#e9edf1')}padding:24px 12px;">` +
    `<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" ${fondo_('#ffffff')}width:100%;max-width:600px;font-family:${F_SANS};color:#1c2530;">` +
    // cabecera
    `<tr><td ${fondo_('#0f2138')}padding:20px 32px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>` +
    `<td style="padding-right:14px;"><img src="${SITE}/logo-mark-white.png" width="46" height="46" alt="" style="display:block;border:0;"></td>` +
    `<td style="color:#ffffff;font-size:13px;font-weight:700;letter-spacing:3px;font-family:${F_SANS};">ENCUENTROS SILOÉ</td></tr></table></td></tr>` +
    `<tr><td height="3" ${fondo_('#d9a356')}height:3px;line-height:3px;font-size:3px;">&nbsp;</td></tr>` +
    // banner
    (o.banner
      ? `<tr><td ${fondo_('#0f2138')}"><img src="${esc_(o.banner)}" width="600" alt="${esc_(o.bannerAlt)}" style="display:block;width:100%;max-width:600px;height:auto;border:0;color:#ffffff;font-size:16px;"></td></tr>`
      : '') +
    // titular
    `<tr><td style="padding:36px 40px 8px 40px;">` +
    `<div style="font-size:12px;font-weight:700;letter-spacing:2px;color:#8e6020;">${esc_(o.kicker)}</div>` +
    `<h1 style="margin:10px 0 0 0;font-family:${F_SERIF};font-size:29px;line-height:1.2;font-weight:600;color:#0f2138;">${esc_(o.titulo)}</h1>` +
    `<p style="margin:16px 0 0 0;font-size:16px;line-height:1.6;color:#1c2530;">${esc_(o.intro)}</p></td></tr>` +
    o.bloques +
    `<tr><td style="padding:24px 40px 36px 40px;font-family:${F_SERIF};font-size:16px;line-height:1.5;color:#0f2138;font-style:italic;">${o.cierre}</td></tr>` +
    // pie
    `<tr><td ${fondo_('#0f2138')}padding:24px 40px;font-size:13px;line-height:1.7;color:#c9d6e6;">` +
    `<a href="mailto:${EQUIPO}" style="color:#ffffff;text-decoration:underline;">${EQUIPO}</a> · ` +
    `<a href="${SITE}" style="color:#ffffff;text-decoration:underline;">encuentrossiloe.org</a> · ` +
    `<a href="https://www.instagram.com/encuentrossiloe" style="color:#ffffff;text-decoration:underline;">@encuentrossiloe</a>` +
    `<div style="margin-top:10px;font-size:12px;line-height:1.5;color:#a9bbd1;">${o.nota} Tratamos tus datos según nuestra <a href="${SITE}/privacidad" style="color:#ffffff;">política de privacidad</a>.</div>` +
    `</td></tr></table></td></tr></table></body></html>`
  );
}

// Correos de reserva (confirmada, plaza liberada, recordatorio, lista de espera), con el mismo
// formato que el agradecimiento: bloque gris con los datos, bloque dorado de apoyo e Instagram.
function htmlCorreo_(ev, c) {
  const comoLlegar = c.boton && ev.mapa ? `<div style="margin-top:18px;">${botonHtml_(ev.mapa, 'Cómo llegar')}</div>` : '';
  const panel =
    `<tr><td style="padding:20px 40px 8px 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ${fondo_('#edf0f3')}"><tr><td ${fondo_('#edf0f3')}padding:20px 24px 22px 24px;">` +
    `<div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#5b6570;">${c.apoyo ? 'TU RESERVA' : 'TU SOLICITUD'}</div>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">` +
    filaDato_('FECHA Y HORA', mayus_(ev.cuando).replace(', ', ' · '), false) +
    filaDato_('LUGAR', ev.lugar, false) +
    filaDato_(c.etiquetaPlazas, c.plazas, true) +
    `</table>${comoLlegar}</td></tr></table></td></tr>`;
  const picoteo = ev.casa && c.apoyo
    ? `<tr><td style="padding:20px 40px 4px 40px;font-size:16px;line-height:1.6;color:#1c2530;"><strong style="color:#0f2138;">Trae algo para picar:</strong> el encuentro es en una casa, así que si puedes trae algo para compartir entre todos.</td></tr>`
    : '';
  const vivir = ev.resumen
    ? `<tr><td style="padding:20px 40px 4px 40px;font-size:16px;line-height:1.6;color:#1c2530;"><strong style="color:#0f2138;">Qué vas a vivir:</strong> ${esc_(ev.resumen)}.</td></tr>`
    : '';
  const apoyo = c.apoyo
    ? `<tr><td style="padding:16px 40px 8px 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ${fondo_('#fbefd6')}"><tr><td ${fondo_('#fbefd6')}padding:22px 24px;">` +
      `<div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#8e6020;">APOYA ESTA MISIÓN</div>` +
      `<div style="margin:6px 0 16px 0;font-size:16px;line-height:1.6;color:#1c2530;">${esc_(APOYO_TXT)}.</div>` +
      botonHtml_(APOYA, 'Hacer un donativo', '#d9a356', '#0f2138') +
      `<div style="margin-top:12px;font-size:13px;line-height:1.5;color:#5b6570;">Aviso: por ahora los donativos no desgravan fiscalmente.</div>` +
      `</td></tr></table></td></tr>`
    : '';
  const ig = `<tr><td style="padding:20px 40px 4px 40px;font-size:16px;line-height:1.6;color:#1c2530;"><strong style="color:#0f2138;">Síguenos en Instagram</strong> para estar al día de los próximos encuentros: <a href="https://www.instagram.com/encuentrossiloe" style="color:#1f3a5f;font-weight:700;">@encuentrossiloe</a>.</td></tr>`;
  const enlace = `<tr><td style="padding:20px 40px 0 40px;font-size:14px;line-height:1.6;color:#5b6570;">${esc_(c.enlaceTxt)} <a href="${esc_(c.baja)}" style="color:#1f3a5f;font-weight:700;">${esc_(c.enlaceLabel)}</a>.</td></tr>`;
  return marco_({
    preheader: c.intro,
    banner: ev.banner,
    bannerAlt: `Cartel del ${ev.titulo}`,
    kicker: c.kicker,
    titulo: c.titulo,
    intro: c.intro,
    bloques: panel + picoteo + vivir + apoyo + ig + enlace,
    cierre: esc_(c.cierre) + '<br>Equipo de Encuentros Siloé',
    nota: 'Recibes este correo porque has reservado plaza en encuentrossiloe.org.',
  });
}

// ── Correo de agradecimiento del Encuentro de Málaga (envío único) ────────────────────────
// Los destinatarios (copia oculta) se leen del borrador "Gracias por acompañarnos en el Encuentro
// de Málaga" de info@, para no guardar direcciones en el código.
const GRACIAS_MALAGA = {
  asunto: 'Gracias por acompañarnos en el Encuentro de Málaga',
  banner: SITE + '/images/email/malaga-banner.jpg',
};

function graciasMalagaCorreo_() {
  const habla = SITE + '/habla-con-nosotros';
  const apoya = SITE + '/apoya';
  const ig = 'https://www.instagram.com/encuentrossiloe';
  const intro =
    'Gracias de corazón por haber reservado plaza en el Encuentro de Málaga del pasado sábado 14 de noviembre. A los que pudisteis venir, gracias por vuestra presencia y por compartir esa tarde con nosotros; a los que no pudisteis, os tuvimos muy presentes y esperamos veros en el próximo.';
  const bloques =
    // 1) Opinión
    `<tr><td style="padding:20px 40px 8px 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ${fondo_('#edf0f3')}"><tr><td ${fondo_('#edf0f3')}padding:22px 24px;">` +
    `<div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#5b6570;">NOS AYUDARÍA MUCHO</div>` +
    `<div style="margin:6px 0 16px 0;font-size:16px;line-height:1.6;color:#1c2530;">Conocer vuestras impresiones: qué os pareció el encuentro, qué sentisteis y qué mejoraríais. Podéis escribírnoslas en el apartado «Habla con nosotros» de la web.</div>` +
    botonHtml_(habla, 'Cuéntanos tu experiencia') +
    `</td></tr></table></td></tr>` +
    // 2) Apoyo (destacado)
    `<tr><td style="padding:12px 40px 8px 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ${fondo_('#fbefd6')}"><tr><td ${fondo_('#fbefd6')}padding:22px 24px;">` +
    `<div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#8e6020;">APOYA ESTA MISIÓN</div>` +
    `<div style="margin:6px 0 16px 0;font-size:16px;line-height:1.6;color:#1c2530;">Si queréis apoyarnos, podéis hacer un donativo de la cantidad que queráis. Cada aportación nos ayuda a llevar los encuentros a más lugares.</div>` +
    botonHtml_(apoya, 'Hacer un donativo', '#d9a356', '#0f2138') +
    `<div style="margin-top:12px;font-size:13px;line-height:1.5;color:#5b6570;">Aviso: por ahora los donativos no desgravan fiscalmente.</div>` +
    `</td></tr></table></td></tr>` +
    // 3) Instagram
    `<tr><td style="padding:20px 40px 4px 40px;font-size:16px;line-height:1.6;color:#1c2530;"><strong style="color:#0f2138;">Síguenos en Instagram</strong> para estar al día de los próximos encuentros: <a href="${ig}" style="color:#1f3a5f;font-weight:700;">@encuentrossiloe</a>.</td></tr>`;
  const html = marco_({
    preheader: intro.slice(0, 110),
    banner: GRACIAS_MALAGA.banner,
    bannerAlt: 'Encuentros Siloé · Málaga · 14 de noviembre',
    kicker: 'ENCUENTRO DE MÁLAGA · 14 DE NOVIEMBRE',
    titulo: 'Gracias por acompañarnos',
    intro,
    bloques,
    cierre: 'Un abrazo y que Dios os bendiga,<br>Equipo de Encuentros Siloé',
    nota: 'Recibes este correo porque reservaste plaza en el Encuentro de Málaga.',
  });
  const texto =
    `Hola:\n\n${intro}\n\nNos ayudaría mucho conocer vuestras impresiones: qué os pareció el encuentro, qué sentisteis y qué mejoraríais. Podéis escribírnoslas en nuestra web, en el apartado "Habla con nosotros":\n${habla}\n\n` +
    `Y si queréis apoyarnos, podéis hacer un donativo, de la cantidad que queráis, aquí:\n${apoya}\n(Aviso: por ahora los donativos no desgravan fiscalmente.)\n\n` +
    `También podéis seguirnos en Instagram para estar al día de los próximos encuentros:\n${ig}\n\n` +
    `Un abrazo y que Dios os bendiga,\n\nEquipo de Encuentros Siloé\n${EQUIPO}\n${SITE}`;
  return { html, texto };
}

// 1) Prueba: se envía solo a estas direcciones (edítalas si hace falta).
function pruebaGraciasMalaga() {
  const c = graciasMalagaCorreo_();
  GmailApp.sendEmail('jarmadae@gmail.com,jhuertan@encuentrossiloe.org', '[PRUEBA] ' + GRACIAS_MALAGA.asunto, c.texto, { htmlBody: c.html, name: REMITENTE, replyTo: EQUIPO });
}

// 2) Envío real: a info@ con los asistentes en copia oculta (los del borrador). Borra el borrador al terminar.
// Busca el borrador sin depender de acentos ni mayúsculas; si no lo encuentra, el error lista los asuntos que ve.
function enviarGraciasMalaga() {
  const norm = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const borradores = GmailApp.getDrafts();
  const borrador = borradores.find((d) => norm(d.getMessage().getSubject()).indexOf('gracias por acompanarnos') >= 0);
  if (!borrador) {
    throw new Error('No encuentro el borrador. Borradores vistos: ' + borradores.map((d) => '[' + d.getMessage().getSubject() + ']').join(' '));
  }
  const bcc = borrador.getMessage().getBcc();
  if (!bcc) throw new Error('El borrador no tiene destinatarios en copia oculta.');
  const c = graciasMalagaCorreo_();
  GmailApp.sendEmail(EQUIPO, GRACIAS_MALAGA.asunto, c.texto, { htmlBody: c.html, bcc, name: REMITENTE, replyTo: EQUIPO });
  borrador.deleteDraft();
}

// ── Resumen diario para el comité ──────────────────────────────────────────────────────────
// Cada mañana manda a COMITE lo pendiente: próximos encuentros con su ocupación, acciones
// pendientes de la pestaña «Contactos» (columna «Acción pendiente»), solicitudes sin atender y
// reservas de las últimas 24 h. Para instalarlo, ejecutar UNA vez instalarResumenComite().
const COMITE = 'comite@encuentrossiloe.org';
const DIAS_PROXIMOS = 14;

function resumenComite() {
  const r = datosResumen_();
  const c = correoResumen_(r);
  GmailApp.sendEmail(COMITE, c.asunto, c.texto, { htmlBody: c.html, name: REMITENTE, replyTo: EQUIPO });
}

// Prueba: el mismo resumen, solo a CORREO_PRUEBAS.
function pruebaResumenComite() {
  const c = correoResumen_(datosResumen_());
  GmailApp.sendEmail(CORREO_PRUEBAS, '[PRUEBA] ' + c.asunto, c.texto, { htmlBody: c.html, name: REMITENTE, replyTo: EQUIPO });
}

function instalarResumenComite() {
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'resumenComite')
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('resumenComite').timeBased().everyDays(1).atHour(8).create(); // entre 8:00 y 9:00
}

function datosResumen_() {
  const tz = Session.getScriptTimeZone();
  const hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  const limite = Utilities.formatDate(new Date(Date.now() + DIAS_PROXIMOS * 24 * 3600 * 1000), tz, 'yyyy-MM-dd');
  const sh = hoja_();
  const ss = sh.getParent();
  const filas = filas_(sh);

  const proximos = Object.keys(EVENTOS)
    .filter((k) => EVENTOS[k].fecha >= hoy && EVENTOS[k].fecha <= limite)
    .sort((a, b) => (EVENTOS[a].fecha < EVENTOS[b].fecha ? -1 : 1))
    .map((k) => ({
      titulo: EVENTOS[k].titulo,
      cuando: EVENTOS[k].cuando,
      ocupadas: ocupadas_(filas, k),
      capacidad: capacidad_(k),
      espera: filas.filter((f) => f[C.EVENTO] === k && f[C.ESTADO] === ESTADO.ESPERA).length,
    }));

  const desde = Date.now() - 24 * 3600 * 1000;
  const nuevas = filas
    .filter((f) => f[C.REG] instanceof Date && f[C.REG].getTime() >= desde && EVENTOS[f[C.EVENTO]])
    .map((f) => ({ nombre: f[C.NOMBRE], evento: EVENTOS[f[C.EVENTO]].titulo, plazas: Number(f[C.PLAZAS]), estado: f[C.ESTADO] }));

  return { hoy, proximos, nuevas, pendientes: tablaPendiente_(ss, 'Contactos'), solicitudes: solicitudesPendientes_(ss), url: ss.getUrl() };
}

// Filas de «Contactos» con algo en «Acción pendiente», las que llevan más tiempo esperando primero.
function tablaPendiente_(ss, nombre) {
  const sh = ss.getSheetByName(nombre);
  if (!sh) return [];
  const datos = sh.getDataRange().getValues();
  const cab = datos[0].map(String);
  const col = (t) => cab.indexOf(t);
  const iNom = col('Nombre'), iAcc = col('Acción pendiente'), iEst = col('Estado'), iFecha = col('Primer contacto'), iTel = col('Teléfono');
  if (iNom < 0 || iAcc < 0) return [];
  return datos
    .slice(1)
    .filter((f) => String(f[iAcc]).trim())
    .map((f) => ({
      nombre: String(f[iNom]),
      accion: String(f[iAcc]).trim(),
      estado: iEst >= 0 ? String(f[iEst]) : '',
      telefono: iTel >= 0 ? String(f[iTel]) : '',
      fecha: iFecha >= 0 && f[iFecha] instanceof Date ? f[iFecha].getTime() : 0,
    }))
    .sort((a, b) => a.fecha - b.fecha);
}

function solicitudesPendientes_(ss) {
  const sh = ss.getSheetByName('Solicitudes');
  if (!sh) return [];
  return sh
    .getDataRange()
    .getValues()
    .slice(1)
    .filter((f) => String(f[6]).trim() === 'Pendiente')
    .map((f) => ({ tipo: String(f[1]), nombre: String(f[2]), email: String(f[3]), mensaje: String(f[5]).slice(0, 160) }));
}

function correoResumen_(r) {
  const fecha = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy');
  const total = r.pendientes.length + r.solicitudes.length;
  const asunto = `Pendientes de hoy (${fecha}) · ${total} ${total === 1 ? 'tarea' : 'tareas'}`;
  const intro = total
    ? `Hoy tenemos ${total} ${total === 1 ? 'cosa pendiente' : 'cosas pendientes'}. Cuando hagáis una, vaciad su «Acción pendiente» en la hoja y desaparecerá del resumen de mañana.`
    : 'Hoy no hay nada pendiente en la hoja. ¡Buen trabajo!';

  const seccion = (titulo, filas) =>
    `<tr><td style="padding:24px 40px 0 40px;"><div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#8e6020;">${esc_(titulo)}</div>${filas}</td></tr>`;
  const item = (principal, secundario) =>
    `<div style="padding:10px 0;border-bottom:1px solid #e3e7ec;font-size:15px;line-height:1.5;color:#1c2530;"><strong style="color:#0f2138;">${esc_(principal)}</strong>` +
    (secundario ? `<br><span style="color:#5b6570;">${esc_(secundario)}</span>` : '') + `</div>`;
  const vacio = (t) => `<div style="padding:10px 0;font-size:15px;color:#5b6570;">${esc_(t)}</div>`;

  const lineaEv = (e) => `${mayus_(e.cuando)} · ${e.ocupadas} de ${e.capacidad} plazas${e.espera ? ` · ${e.espera} en lista de espera` : ''}`;
  const lineaPend = (p) => [p.estado, p.telefono].filter(Boolean).join(' · ');

  const bloques =
    seccion(`PRÓXIMOS ENCUENTROS (${DIAS_PROXIMOS} DÍAS)`, r.proximos.length ? r.proximos.map((e) => item(e.titulo, lineaEv(e))).join('') : vacio('No hay encuentros en los próximos días.')) +
    seccion(`ACCIONES PENDIENTES (${r.pendientes.length})`, r.pendientes.length ? r.pendientes.map((p) => item(`${p.nombre}: ${p.accion}`, lineaPend(p))).join('') : vacio('Nada pendiente en «Contactos».')) +
    (r.solicitudes.length ? seccion(`SOLICITUDES DE LA WEB SIN ATENDER (${r.solicitudes.length})`, r.solicitudes.map((s) => item(`${s.tipo}: ${s.nombre}`, [s.email, s.mensaje].filter(Boolean).join(' · '))).join('')) : '') +
    seccion('RESERVAS DE LAS ÚLTIMAS 24 H', r.nuevas.length ? r.nuevas.map((n) => item(`${n.nombre} · ${plazasTxt_(n.plazas)}`, `${n.evento} · ${n.estado}`)).join('') : vacio('Ninguna reserva nueva.')) +
    `<tr><td style="padding:28px 40px 0 40px;">${botonHtml_(r.url, 'Abrir la hoja')}</td></tr>`;

  const html = marco_({
    preheader: intro,
    kicker: 'RESUMEN DEL DÍA',
    titulo: `Pendientes del ${fecha}`,
    intro,
    bloques,
    cierre: 'Equipo de Encuentros Siloé',
    nota: 'Correo interno para el comité, generado cada mañana a partir de la hoja de reservas.',
  });

  const t = [];
  t.push(intro, '', `PRÓXIMOS ENCUENTROS (${DIAS_PROXIMOS} días)`);
  r.proximos.forEach((e) => t.push(`- ${e.titulo}: ${lineaEv(e)}`));
  if (!r.proximos.length) t.push('- Ninguno');
  t.push('', `ACCIONES PENDIENTES (${r.pendientes.length})`);
  r.pendientes.forEach((p) => t.push(`- ${p.nombre}: ${p.accion}${lineaPend(p) ? ' (' + lineaPend(p) + ')' : ''}`));
  if (r.solicitudes.length) {
    t.push('', `SOLICITUDES DE LA WEB SIN ATENDER (${r.solicitudes.length})`);
    r.solicitudes.forEach((s) => t.push(`- ${s.tipo}: ${s.nombre} <${s.email}>`));
  }
  t.push('', 'RESERVAS DE LAS ÚLTIMAS 24 H');
  r.nuevas.forEach((n) => t.push(`- ${n.nombre} · ${plazasTxt_(n.plazas)} · ${n.evento} · ${n.estado}`));
  if (!r.nuevas.length) t.push('- Ninguna');
  t.push('', 'Hoja: ' + r.url);
  return { asunto, html, texto: t.join('\n') };
}
