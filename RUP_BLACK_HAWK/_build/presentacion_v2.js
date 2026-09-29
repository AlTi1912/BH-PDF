// Genera BLACK_HAWK_RUP_PRESENTACION_V2.pptx y slides_v2.json (base de la guía V2).
const fs = require('fs');
const pptxgen = require('pptxgenjs');
const React = require('react');
const RDS = require('react-dom/server');
const sharp = require('sharp');
const lu = require('react-icons/lu');
const V = require('./v2data');
const { pngSize } = require('./docxlib');

const C = { ink: '0B0B0D', ink2: '1A1B1F', white: 'FFFFFF', paper: 'F5F5F7', line: 'E3E4E8', mute: '6B7280', mute2: '9CA3AF', pur: '6D28D9', purL: 'EDE4FB', purM: 'A78BFA', wa: '25D366' };
const F = 'Arial';
const W = 13.333, H = 7.5, MX = 0.6;

const ICONS = {};
async function icon(name, color) {
  const key = name + color;
  if (!ICONS[key]) {
    const svg = RDS.renderToStaticMarkup(React.createElement(lu[name], { color: '#' + color, size: 256 }));
    ICONS[key] = 'image/png;base64,' + (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64');
  }
  return ICONS[key];
}

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'Aplicación de RUP — SGCD-BH Black Hawk (V2)';
pres.author = 'Equipo del proyecto SGCD-BH';
const META = [];

function text(s, t, o) { s.addText(t, { fontFace: F, fontSize: 15, color: C.ink, margin: 0, valign: 'top', isTextBox: true, ...o }); }
function base(s, { kicker, title, dark = false }) {
  s.background = { color: dark ? C.ink : C.white };
  if (kicker) text(s, kicker.toUpperCase(), { x: MX, y: 0.4, w: 9, h: 0.3, fontSize: 11, bold: true, color: dark ? C.purM : C.pur, charSpacing: 3 });
  if (title) { text(s, title, { x: MX, y: 0.72, w: W - 2 * MX, h: 0.8, fontSize: 32, bold: true, color: dark ? C.white : C.ink }); META[META.length - 1].visible = title; }
  text(s, `SGCD-BH · RUP   ${META.length}`, { x: W - 3.2, y: H - 0.42, w: 2.6, h: 0.25, fontSize: 9, color: dark ? C.mute : C.mute2, align: 'right' });
}
function card(s, x, y, w, h, fill = C.paper, line) { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: line ? { color: line, width: 1 } : { type: 'none' }, rectRadius: 0.08 }); }
function badge(s, x, y, label) {
  const prop = label === 'Propuesto';
  const w = 0.25 + label.length * 0.085;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.28, rectRadius: 0.14, fill: { color: prop ? C.pur : C.white }, line: { color: prop ? C.pur : C.ink, width: 0.75 } });
  text(s, label, { x, y, w, h: 0.28, fontSize: 9.5, bold: true, color: prop ? C.white : C.ink, align: 'center', valign: 'middle' });
  return w;
}
function img(s, file, x, y, w, h) {
  const { w: pw, h: ph } = pngSize(file);
  let iw = w, ih = w * ph / pw;
  if (ih > h) { ih = h; iw = h * pw / ph; }
  s.addImage({ path: file, x: x + (w - iw) / 2, y: y + (h - ih) / 2, w: iw, h: ih });
}
async function iconCircle(s, name, x, y, d = 0.62, fill = C.purL, color = C.pur) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: 'none' } });
  s.addImage({ data: await icon(name, color), x: x + d * 0.24, y: y + d * 0.24, w: d * 0.52, h: d * 0.52 });
}
function arrow(s, x1, y1, x2, y2, color = C.ink, dash) {
  s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipH: x2 < x1, flipV: y2 < y1, line: { color, width: 1.25, endArrowType: 'triangle', dashType: dash || 'solid' } });
}
function line(s, x1, y1, x2, y2, color = C.ink, dash) {
  s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipH: x2 < x1, flipV: y2 < y1, line: { color, width: 1, dashType: dash || 'solid' } });
}
function stick(s, cx, y, label, lw = 1.5) { // actor UML
  s.addShape(pres.shapes.OVAL, { x: cx - 0.11, y, w: 0.22, h: 0.22, fill: { color: C.white }, line: { color: C.ink, width: 1 } });
  line(s, cx, y + 0.22, cx, y + 0.55); line(s, cx - 0.2, y + 0.33, cx + 0.2, y + 0.33);
  line(s, cx, y + 0.55, cx - 0.16, y + 0.8); line(s, cx, y + 0.55, cx + 0.16, y + 0.8);
  text(s, label, { x: cx - lw / 2, y: y + 0.84, w: lw, h: 0.45, fontSize: 11, bold: true, align: 'center' });
}
function add(meta) { const s = pres.addSlide(); META.push(meta); s.addNotes(`${meta.idea}\n\n${meta.explicar.map((e) => '• ' + e).join('\n')}\n\nEjemplo: ${meta.ejemplo}\n\nTransición: ${meta.trans}`); return s; }
function source(s, t, dark) { text(s, t, { x: MX, y: H - 0.45, w: 9.5, h: 0.3, fontSize: 9, color: dark ? C.mute : C.mute2 }); }

(async () => {
  // 1 ─ Portada
  {
    const s = add({ title: 'Portada', t: 30, idea: 'Presentamos una propuesta de sistema para Black Hawk, diseñada con RUP.',
      explicar: ['Quiénes somos y el curso.', 'Tema: aplicar RUP para diseñar un sistema de información para una empresa real.', 'Hoy presentamos la estructura y la propuesta del proyecto, no un sistema terminado.'],
      ejemplo: 'Black Hawk es una marca peruana de car audio: amplificadores, subwoofers, procesadores.', claves: ['RUP', 'Propuesta', 'Black Hawk'], trans: 'Empecemos por conocer a la empresa.' });
    s.background = { color: C.ink };
    s.addImage({ path: '../../assets/images/brand/subwoofer-960.jpg', x: 6.35, y: 0, w: 6.983, h: 7.5, sizing: { type: 'cover', w: 6.983, h: 7.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 6.35, y: 0, w: 6.983, h: 7.5, fill: { color: C.ink, transparency: 40 }, line: { type: 'none' } });
    s.addImage({ path: 'research/logo-w-t.png', x: MX, y: 0.6, w: 1.5, h: 0.8 });
    text(s, 'DISEÑO DE SISTEMAS DE INFORMACIÓN', { x: MX, y: 1.85, w: 5.6, h: 0.3, fontSize: 11, bold: true, color: C.purM, charSpacing: 3 });
    text(s, 'Aplicación de la metodología RUP en el diseño de un sistema de información para Black Hawk', { x: MX, y: 2.25, w: 5.6, h: 2.3, fontSize: 29, bold: true, color: C.white });
    text(s, 'Propuesta: SGCD-BH · Sistema de Gestión de Catálogo y Distribuidores Black Hawk', { x: MX, y: 4.6, w: 5.4, h: 0.7, fontSize: 14, color: C.mute2 });
    text(s, [{ text: 'Integrantes: [nombres del equipo]', options: { breakLine: true } }, { text: 'Docente: [nombre del docente]', options: { breakLine: true } }, { text: '[Institución] · 2026' }], { x: MX, y: 5.75, w: 5.5, h: 1.0, fontSize: 12, color: C.mute2, paraSpaceAfter: 4 });
  }

  // 2 ─ ¿Qué es Black Hawk?
  {
    const s = add({ title: '¿Qué es Black Hawk?', t: 50, idea: 'Black Hawk es una marca de car audio que usa su web como catálogo, no como tienda.',
      explicar: ['Sector: audio automotriz en el Perú.', 'Productos: amplificadores, subwoofers, procesadores, parlantes, cargadores.', 'Público: quien equipa su vehículo y los negocios que venden la marca.', 'Modelo comercial: la web muestra y orienta; la compra ocurre con el área comercial o un distribuidor.'],
      ejemplo: 'La web renovada tiene 118 productos en 12 categorías, por ejemplo el amplificador BH-FR1500.1 o el subwoofer BH-SW12XZP.', claves: ['Car audio', 'Catálogo', 'Distribuidores'], trans: '¿Cómo compra hoy un cliente?' });
    base(s, { kicker: '01 · La empresa', title: '¿Qué es Black Hawk?' });
    const rows = [['LuCar', 'Sector', 'Audio automotriz (car audio), mercado peruano.'], ['LuSpeaker', 'Productos', 'Amplificadores, subwoofers, procesadores, parlantes y cargadores.'], ['LuUsers', 'Público', 'Quien equipa su vehículo y las tiendas o distribuidores que venden la marca.'], ['LuStore', 'Modelo comercial', 'La web es un catálogo: no vende ni cobra. La compra se cierra con el área comercial o un distribuidor.']];
    for (let i = 0; i < rows.length; i++) {
      const y = 1.75 + i * 1.12;
      await iconCircle(s, rows[i][0], MX, y, 0.66);
      text(s, rows[i][1], { x: MX + 0.9, y: y - 0.02, w: 5.4, h: 0.35, fontSize: 16, bold: true });
      text(s, rows[i][2], { x: MX + 0.9, y: y + 0.34, w: 5.4, h: 0.7, fontSize: 13.5, color: C.mute });
    }
    s.addImage({ path: '../../assets/images/brand/amplificadores-960.jpg', x: 7.1, y: 1.7, w: 5.63, h: 3.14 });
    text(s, [{ text: '118', options: { fontSize: 40, bold: true, color: C.ink } }, { text: '  productos', options: { fontSize: 15, color: C.mute } }], { x: 7.1, y: 5.1, w: 2.8, h: 0.8, valign: 'middle' });
    text(s, [{ text: '12', options: { fontSize: 40, bold: true, color: C.pur } }, { text: '  categorías', options: { fontSize: 15, color: C.mute } }], { x: 9.95, y: 5.1, w: 2.8, h: 0.8, valign: 'middle' });
    source(s, `Fuente: sitemap de la ${V.WEB}. Imagen: sitio oficial de Black Hawk.`);
  }

  // 3 ─ ¿Cómo funciona hoy?
  {
    const s = add({ title: '¿Cómo funciona actualmente?', t: 55, idea: 'Hoy el cliente encuentra el producto en la web y la consulta termina en WhatsApp.',
      explicar: ['Recorrer el flujo: cliente → catálogo → ficha → «Cotizar» → WhatsApp → compra fuera de la web.', 'Lo que ya existe: catálogo con filtros, ficha, comparador y el botón que escribe el modelo en el mensaje.', 'Aclarar que la compra no ocurre en la web.'],
      ejemplo: 'En la ficha del BH-FR1500.1, «Cotizar» abre WhatsApp con «quiero cotizar el modelo BH-FR1500.1».', claves: ['Flujo actual', 'Cotizar', 'WhatsApp'], trans: 'El flujo funciona, pero tiene vacíos. Veamos cuáles.' });
    base(s, { kicker: '01 · La empresa', title: '¿Cómo funciona actualmente?' });
    const flow = [['LuUser', 'Cliente'], ['LuLayoutGrid', 'Catálogo'], ['LuFileText', 'Ficha del producto'], ['LuMousePointerClick', '«Cotizar»'], ['LuMessageCircle', 'WhatsApp'], ['LuStore', 'Compra fuera de la web']];
    const fw = 1.72, gap = (W - 2 * MX - 6 * fw) / 5;
    for (let i = 0; i < 6; i++) {
      const x = MX + i * (fw + gap);
      card(s, x, 1.75, fw, 1.35, i === 5 ? C.ink : C.paper);
      s.addImage({ data: await icon(flow[i][0], i === 5 ? C.purM : C.pur), x: x + fw / 2 - 0.22, y: 1.9, w: 0.44, h: 0.44 });
      text(s, flow[i][1], { x: x + 0.08, y: 2.45, w: fw - 0.16, h: 0.55, fontSize: 13.5, bold: true, align: 'center', color: i === 5 ? C.white : C.ink });
      if (i < 5) arrow(s, x + fw + 0.04, 2.42, x + fw + gap - 0.04, 2.42, C.pur);
    }
    img(s, 'img/v2-ficha-crop.png', MX, 3.45, 6.3, 3.35);
    text(s, 'Ficha real de la web renovada', { x: MX, y: 6.85, w: 6, h: 0.25, fontSize: 9.5, color: C.mute2 });
    card(s, 7.3, 3.45, W - MX - 7.3, 3.35, C.paper);
    text(s, 'YA EXISTE HOY', { x: 7.6, y: 3.65, w: 4, h: 0.3, fontSize: 10.5, bold: true, color: C.pur, charSpacing: 2 });
    text(s, V.EXISTE_HOY.map((e, i) => ({ text: e, options: { breakLine: i < V.EXISTE_HOY.length - 1, bullet: { code: '2713' }, paraSpaceAfter: 9 } })), { x: 7.6, y: 4.05, w: W - MX - 7.9, h: 2.6, fontSize: 13.5 });
    source(s, `Fuente: ${V.WEB}.`);
  }

  // 4 ─ Problema
  {
    const s = add({ title: 'Problema o necesidad identificada', t: 60, idea: 'El problema no es tener web: es mantener la información ordenada y medir la ruta hasta el distribuidor.',
      explicar: ['Decir la frase del problema.', 'Tres necesidades: información técnica ordenada, llegar al punto de venta y saber qué se consulta.', 'Separar lo observado del supuesto académico.'],
      ejemplo: '«Dónde comprar» no tiene un directorio: todas las consultas van al mismo WhatsApp.', claves: ['Información', 'Derivación', 'Trazabilidad'], trans: 'Para resolverlo, proponemos un sistema.' });
    base(s, { kicker: '02 · La necesidad', title: 'El problema, en una frase' });
    card(s, MX, 1.7, W - 2 * MX, 1.15, C.pur);
    text(s, V.PROBLEMA, { x: MX + 0.35, y: 1.7, w: W - 2 * MX - 0.7, h: 1.15, fontSize: 18, bold: true, color: C.white, valign: 'middle' });
    V.NECESIDADES_V2.forEach((n, i) => {
      const x = MX + i * 4.1;
      text(s, `0${i + 1}`, { x, y: 3.15, w: 1, h: 0.5, fontSize: 24, bold: true, color: C.pur });
      text(s, n.t, { x: x + 0.7, y: 3.2, w: 3.2, h: 0.45, fontSize: 15.5, bold: true });
      card(s, x, 3.8, 3.9, 1.35, C.paper);
      text(s, [{ text: 'Causa  ', options: { bold: true, color: C.pur } }, { text: n.causa }], { x: x + 0.2, y: 3.9, w: 3.5, h: 1.2, fontSize: 12 });
      arrow(s, x + 1.95, 5.2, x + 1.95, 5.45, C.pur);
      card(s, x, 5.5, 3.9, 0.95, C.white, C.line);
      text(s, [{ text: 'Consecuencia  ', options: { bold: true } }, { text: n.efecto }], { x: x + 0.2, y: 5.56, w: 3.5, h: 0.85, fontSize: 12 });
      text(s, n.base, { x, y: 6.52, w: 3.9, h: 0.3, fontSize: 10, italic: true, color: C.mute });
    });
  }

  // 5 ─ ¿Qué proponemos?
  {
    const s = add({ title: '¿Qué proponemos?', t: 55, idea: 'El SGCD-BH: un sistema web que ordena el catálogo, conecta con el distribuidor y registra cada consulta.',
      explicar: ['Qué es, en una frase.', 'Para qué sirve: datos confiables, derivación al punto de venta, seguimiento.', 'Quién lo usa: cliente, gestor del catálogo, administrador y distribuidor.', 'Se construye sobre la web actual; no la reemplaza.'],
      ejemplo: 'Cuando un cliente pulsa «Cotizar» en el BH-SW12XZP, el sistema guarda la consulta y el gestor luego la deriva a un distribuidor de su ciudad.', claves: ['SGCD-BH', 'Usuarios', 'Sobre la web actual'], trans: '¿Qué objetivos tiene y hasta dónde llega?' });
    base(s, { kicker: '03 · La propuesta', title: '¿Qué proponemos?' });
    card(s, MX, 1.7, 6.0, 4.95, C.ink);
    text(s, 'SGCD-BH', { x: MX + 0.35, y: 1.95, w: 5.3, h: 0.7, fontSize: 38, bold: true, color: C.white });
    text(s, 'Sistema de Gestión de Catálogo y Distribuidores Black Hawk', { x: MX + 0.35, y: 2.7, w: 5.3, h: 0.7, fontSize: 15, color: C.purM });
    text(s, 'Un sistema web que ordena la información de los productos, lleva al comprador hasta un distribuidor y registra cada consulta para darle seguimiento.', { x: MX + 0.35, y: 3.55, w: 5.3, h: 1.5, fontSize: 16, color: C.white });
    text(s, 'Se construye sobre la web actual (WordPress + WooCommerce): la extiende, no la reemplaza.', { x: MX + 0.35, y: 5.45, w: 5.3, h: 0.9, fontSize: 12.5, italic: true, color: C.mute2 });
    text(s, 'QUIÉN LO USARÁ', { x: 7.0, y: 1.7, w: 5, h: 0.3, fontSize: 10.5, bold: true, color: C.pur, charSpacing: 2 });
    const ic = ['LuUser', 'LuPackage', 'LuShieldCheck', 'LuStore'];
    for (let i = 0; i < 4; i++) {
      const y = 2.1 + i * 1.14;
      card(s, 7.0, y, W - MX - 7.0, 1.0, C.paper);
      await iconCircle(s, ic[i], 7.2, y + 0.19, 0.62, C.white);
      text(s, V.USUARIOS[i][0], { x: 8.0, y: y + 0.13, w: 4.5, h: 0.35, fontSize: 15, bold: true });
      text(s, V.USUARIOS[i][1], { x: 8.0, y: y + 0.5, w: 4.6, h: 0.4, fontSize: 12.5, color: C.mute });
    }
  }

  // 6 ─ Objetivos y alcance
  {
    const s = add({ title: 'Objetivos y alcance', t: 55, idea: 'Un objetivo general, cuatro específicos y un alcance agrupado en cuatro áreas.',
      explicar: ['Leer el objetivo general con tus palabras.', 'Los cuatro específicos siguen el orden del trabajo: analizar, especificar, modelar, planificar.', 'Alcance: catálogo, consultas, distribuidores y administración.', 'Exclusiones: no es tienda en línea ni ERP.'],
      ejemplo: 'No incluimos carrito ni pagos porque Black Hawk vende a través de su área comercial y de distribuidores.', claves: ['Objetivo general', 'Alcance', 'Exclusiones'], trans: 'Veamos cómo funcionará la solución.' });
    base(s, { kicker: '03 · La propuesta', title: 'Objetivos y alcance' });
    card(s, MX, 1.7, 5.8, 4.95, C.paper);
    text(s, 'OBJETIVO GENERAL', { x: MX + 0.3, y: 1.9, w: 5, h: 0.3, fontSize: 10.5, bold: true, color: C.pur, charSpacing: 2 });
    text(s, V.OBJ_GENERAL, { x: MX + 0.3, y: 2.25, w: 5.2, h: 1.7, fontSize: 13.5, bold: true });
    text(s, 'OBJETIVOS ESPECÍFICOS', { x: MX + 0.3, y: 4.05, w: 5, h: 0.3, fontSize: 10.5, bold: true, color: C.pur, charSpacing: 2 });
    text(s, V.OBJ_ESP.map((o, i) => ({ text: o, options: { breakLine: i < 3, bullet: { type: 'number' }, paraSpaceAfter: 5 } })), { x: MX + 0.3, y: 4.4, w: 5.2, h: 2.2, fontSize: 12.5 });
    text(s, 'EL SISTEMA INCLUYE', { x: 6.75, y: 1.7, w: 5, h: 0.3, fontSize: 10.5, bold: true, color: C.pur, charSpacing: 2 });
    const gi = ['LuLayoutGrid', 'LuMessageCircle', 'LuMapPin', 'LuSettings'];
    for (let i = 0; i < 4; i++) {
      const x = 6.75 + (i % 2) * 3.05, y = 2.1 + Math.floor(i / 2) * 1.62;
      card(s, x, y, 2.9, 1.48, i === 1 ? C.purL : C.paper);
      await iconCircle(s, gi[i], x + 0.2, y + 0.2, 0.5, C.white);
      text(s, V.GRUPOS[i][0], { x: x + 0.82, y: y + 0.26, w: 2, h: 0.4, fontSize: 15, bold: true });
      text(s, V.GRUPOS[i][1], { x: x + 0.2, y: y + 0.8, w: 2.55, h: 0.65, fontSize: 11.5, color: C.mute });
    }
    card(s, 6.75, 5.45, W - MX - 6.75, 1.2, C.ink);
    text(s, [{ text: 'No incluye: ', options: { bold: true, color: C.purM } }, { text: V.EXCLUSIONES.join(' · '), options: { color: C.white } }], { x: 7.0, y: 5.45, w: W - MX - 7.25, h: 1.2, fontSize: 13, valign: 'middle' });
  }

  // 7 ─ ¿Cómo funcionará? (diagrama de actividades simplificado, editable)
  {
    const s = add({ title: '¿Cómo funcionará la solución?', t: 65, idea: 'El recorrido del cliente, con lo que el sistema hace en cada paso.',
      explicar: ['Es un diagrama de actividades simplificado: una fila por participante.', 'Cliente: busca, revisa la ficha, compara y pulsa «Cotizar».', 'Sistema: registra la consulta y abre WhatsApp con el modelo y el enlace.', 'Área comercial o distribuidor: atiende y deriva. El gestor actualiza el estado y ve reportes.'],
      ejemplo: 'Un cliente compara BH-FR1500.1 y BH-FR3000.1, cotiza el segundo y el gestor ve después que ese modelo es el más consultado.', claves: ['Recorrido', 'Registro', 'Seguimiento'], trans: '¿Con qué metodología vamos a desarrollar esto? Con RUP.' });
    base(s, { kicker: '03 · La propuesta', title: '¿Cómo funcionará la solución?' });
    const lanes = ['Cliente', 'SGCD-BH', 'Comercial / distribuidor', 'Gestor'];
    const lx = MX + 1.9, lw = W - MX - lx, ly = 1.7, lh = 1.18;
    lanes.forEach((l, i) => {
      s.addShape(pres.shapes.RECTANGLE, { x: MX, y: ly + i * lh, w: W - 2 * MX, h: lh - 0.06, fill: { color: i % 2 ? C.white : C.paper }, line: { color: C.line, width: 0.75 } });
      text(s, l, { x: MX + 0.15, y: ly + i * lh, w: 1.65, h: lh - 0.06, fontSize: 12.5, bold: true, valign: 'middle', color: i === 1 ? C.pur : C.ink });
    });
    const box = (col, lane, t, prop) => {
      const sp = (lw - 0.3) / 5, bw = sp - 0.14, x = lx + 0.2 + col * sp, y = ly + lane * lh + 0.2;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: bw, h: 0.72, rectRadius: 0.1, fill: { color: prop ? C.purL : C.white }, line: { color: prop ? C.pur : C.ink, width: 1 } });
      text(s, t, { x: x + 0.08, y, w: bw - 0.16, h: 0.72, fontSize: 11.5, align: 'center', valign: 'middle', bold: true });
      return { x, y, w: bw, h: 0.72 };
    };
    const b1 = box(0, 0, 'Busca en el catálogo');
    const b2 = box(1, 0, 'Revisa la ficha y compara');
    const b3 = box(2, 0, 'Pulsa «Cotizar»');
    const b4 = box(3, 1, 'Registra la consulta', true);
    const b5 = box(4, 1, 'Abre WhatsApp con modelo y enlace', true);
    const b6 = box(4, 2, 'Atiende y deriva al punto de venta');
    const b7 = box(3, 3, 'Actualiza el estado y ve reportes', true);
    const r = (b) => [b.x + b.w, b.y + b.h / 2], l = (b) => [b.x, b.y + b.h / 2], bot = (b) => [b.x + b.w / 2, b.y + b.h], top = (b) => [b.x + b.w / 2, b.y];
    arrow(s, ...r(b1), ...l(b2)); arrow(s, ...r(b2), ...l(b3));
    arrow(s, ...bot(b3), b4.x, b4.y + 0.2); arrow(s, ...r(b4), ...l(b5));
    arrow(s, ...bot(b5), ...top(b6)); arrow(s, b6.x, b6.y + b6.h, b7.x + b7.w, b7.y + 0.2);
    s.addShape(pres.shapes.OVAL, { x: lx - 0.12, y: ly + 0.47, w: 0.2, h: 0.2, fill: { color: C.ink }, line: { type: 'none' } });
    arrow(s, lx + 0.08, ly + 0.57, b1.x, ly + 0.57);
    s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 6.5, w: 0.22, h: 0.22, fill: { color: C.purL }, line: { color: C.pur, width: 1 } });
    text(s, 'Propuesto. Lo demás ya existe en la web renovada. Vista simplificada del diagrama de actividades (D-16).', { x: MX + 0.35, y: 6.47, w: 11, h: 0.3, fontSize: 11, color: C.mute });
  }

  // 8 ─ ¿Por qué RUP?
  {
    const s = add({ title: '¿Por qué utilizamos RUP?', t: 55, idea: 'RUP organiza el desarrollo en iteraciones guiadas por casos de uso y por la arquitectura.',
      explicar: ['RUP es una metodología (un proceso) de desarrollo de software.', 'Iterativo e incremental: el sistema crece por partes.', 'Dirigido por casos de uso: el caso «Enviar consulta» guía el diseño y las pruebas.', 'Centrado en la arquitectura: se valida la estructura antes de construir.'],
      ejemplo: 'Primero se construye el catálogo, luego las consultas y al final la administración; cada parte se prueba antes de seguir.', claves: ['Iterativo', 'Casos de uso', 'Arquitectura'], trans: 'RUP organiza el trabajo en cuatro fases.' });
    base(s, { kicker: '04 · La metodología', title: '¿Por qué utilizamos RUP?' });
    text(s, 'Rational Unified Process es una metodología de desarrollo de software que organiza el trabajo en fases e iteraciones, con entregables y puntos de control definidos.', { x: MX, y: 1.65, w: 9.5, h: 0.9, fontSize: 16, color: C.mute });
    const ic = ['LuRepeat', 'LuUsers', 'LuLayers'];
    for (let i = 0; i < 3; i++) {
      const x = MX + i * 4.1;
      card(s, x, 2.8, 3.9, 3.8, i === 0 ? C.ink : C.paper);
      await iconCircle(s, ic[i], x + 0.3, 3.05, 0.72, i === 0 ? C.pur : C.white, i === 0 ? C.white : C.pur);
      text(s, V.RUP_CARAC[i][0], { x: x + 0.3, y: 3.95, w: 3.4, h: 0.5, fontSize: 17, bold: true, color: i === 0 ? C.white : C.ink });
      text(s, 'En Black Hawk', { x: x + 0.3, y: 4.55, w: 3.3, h: 0.3, fontSize: 10.5, bold: true, color: i === 0 ? C.purM : C.pur, charSpacing: 1 });
      text(s, V.RUP_CARAC[i][1], { x: x + 0.3, y: 4.9, w: 3.3, h: 1.6, fontSize: 13.5, color: i === 0 ? C.white : C.ink });
    }
  }

  // 9 ─ Las cuatro fases (con plan)
  {
    const s = add({ title: 'Las cuatro fases de RUP', t: 90, idea: 'Cuatro fases, cada una con un propósito, sus entregables y un hito que la cierra.',
      explicar: ['Recorrer Inicio → Elaboración → Construcción → Transición: qué haremos, qué entregaremos y qué significa en Black Hawk.', 'Cada fase termina en un hito: LCO, LCA, IOC y PR.', 'No es una cascada: dentro de cada fase se repiten ciclos de análisis, diseño, desarrollo y prueba.', 'Esta entrega cubre Inicio y Elaboración; Construcción y Transición quedan planificadas. Las semanas son una estimación académica.'],
      ejemplo: 'En Elaboración se prueba con un prototipo que registrar la consulta no retrasa la apertura de WhatsApp.', claves: ['Fases', 'Hitos', 'No es cascada'], trans: '¿Qué requisitos salieron del análisis?' });
    base(s, { kicker: '04 · La metodología', title: 'Las cuatro fases de RUP y el plan de desarrollo' });
    const cw = (W - 2 * MX - 3 * 0.15) / 4, y0 = 1.75;
    const colH = [C.mute2, C.purM, C.pur, C.ink];
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: MX - 0.05, y: y0 - 0.1, w: 2 * cw + 0.25, h: 4.85, fill: { color: C.purL, transparency: 60 }, line: { color: C.pur, width: 1, dashType: 'dash' }, rectRadius: 0.1 });
    V.FASES_V2.forEach((f, i) => {
      const x = MX + i * (cw + 0.15);
      s.addShape(pres.shapes.RECTANGLE, { x, y: y0, w: cw, h: 0.85, fill: { color: colH[i] }, line: { type: 'none' } });
      text(s, f.n, { x: x + 0.2, y: y0 + 0.08, w: cw - 0.3, h: 0.45, fontSize: 18, bold: true, color: C.white });
      text(s, `${f.sem} (estimado)`, { x: x + 0.2, y: y0 + 0.5, w: cw - 0.3, h: 0.3, fontSize: 11, color: C.white });
      const rows = [['Qué haremos', f.haremos], ['Qué entregaremos', f.entregas], ['En Black Hawk', f.bh]];
      rows.forEach(([k, v], j) => {
        const yy = y0 + 1.0 + j * 1.05;
        text(s, k.toUpperCase(), { x: x + 0.12, y: yy, w: cw - 0.2, h: 0.25, fontSize: 9, bold: true, color: C.pur, charSpacing: 1 });
        text(s, v, { x: x + 0.12, y: yy + 0.27, w: cw - 0.2, h: 0.75, fontSize: 12, color: C.ink });
      });
      card(s, x + 0.12, y0 + 4.2, cw - 0.24, 0.45, C.white, C.ink);
      text(s, [{ text: f.hito + '  ', options: { bold: true, color: C.pur } }, { text: f.hitoN }], { x: x + 0.12, y: y0 + 4.2, w: cw - 0.24, h: 0.45, fontSize: 11.5, align: 'center', valign: 'middle' });
    });
    text(s, 'ESTA ENTREGA: ANÁLISIS Y DISEÑO', { x: MX + 0.1, y: 6.62, w: 5.8, h: 0.3, fontSize: 10.5, bold: true, color: C.pur, charSpacing: 1.5 });
    text(s, 'No es una cascada: cada fase itera análisis, diseño, desarrollo y prueba.', { x: 6.9, y: 6.6, w: W - MX - 6.9, h: 0.4, fontSize: 11.5, italic: true, color: C.mute, align: 'right' });
  }

  // 10 ─ Requisitos principales
  {
    const s = add({ title: 'Requisitos principales', t: 60, idea: 'Los requisitos dicen qué debe hacer el sistema (funcionales) y cómo debe hacerlo (no funcionales).',
      explicar: ['Funcionales: buscar y ver fichas, comparar, consultar por WhatsApp con registro, administrar.', 'Marcar cuáles ya existen y cuáles se proponen.', 'No funcionales: usabilidad, adaptabilidad, rendimiento y seguridad.', 'El catálogo completo, con criterios de aceptación, está en los anexos.'],
      ejemplo: 'Requisito propuesto: antes de abrir WhatsApp, el sistema registra la fecha, el producto y la página de origen, sin datos personales.', claves: ['Funcional', 'No funcional', 'Criterio de aceptación'], trans: 'Los requisitos se modelan con UML.' });
    base(s, { kicker: '05 · El diseño', title: 'Requisitos principales' });
    card(s, MX, 1.7, 6.95, 4.95, C.paper);
    text(s, 'FUNCIONALES · qué hará el sistema', { x: MX + 0.3, y: 1.9, w: 6, h: 0.3, fontSize: 10.5, bold: true, color: C.pur, charSpacing: 1.5 });
    V.REQ_F.forEach(([t, e], i) => {
      const y = 2.35 + i * 1.03;
      badge(s, MX + 0.3, y + 0.05, e);
      text(s, t, { x: MX + 1.65, y, w: 5.1, h: 0.85, fontSize: 14.5, bold: true });
    });
    card(s, 7.8, 1.7, W - MX - 7.8, 4.95, C.ink);
    text(s, 'NO FUNCIONALES · cómo debe hacerlo', { x: 8.1, y: 1.9, w: 4.5, h: 0.3, fontSize: 10.5, bold: true, color: C.purM, charSpacing: 1.5 });
    V.REQ_NF.forEach(([c, t], i) => {
      const y = 2.35 + i * 1.03;
      text(s, c, { x: 8.1, y, w: 4.4, h: 0.35, fontSize: 14.5, bold: true, color: C.white });
      text(s, t, { x: 8.1, y: y + 0.36, w: 4.4, h: 0.6, fontSize: 12, color: C.mute2 });
    });
    source(s, 'Catálogo completo con criterios de aceptación: anexos (27 requisitos funcionales y 13 no funcionales).');
  }

  // 11 ─ UML y Rational Rose (diagramas editables)
  {
    const s = add({ title: 'Modelado UML y Rational Rose', t: 75, idea: 'Con UML mostramos quién usa el sistema, qué puede hacer y cómo se relacionan sus datos.',
      explicar: ['RUP es la metodología, UML el lenguaje de los diagramas y Rational Rose la herramienta para dibujarlos.', 'Casos de uso: actores (cliente, gestor, distribuidor y WhatsApp como sistema externo) y lo que pueden hacer.', '«include»: enviar la consulta siempre la registra.', 'Clases: el producto pertenece a categorías y tiene especificaciones; una consulta puede referirse a un producto y derivarse a un distribuidor.'],
      ejemplo: 'Un producto tiene de 0 a muchas especificaciones, y si se borra el producto, sus especificaciones desaparecen (composición).', claves: ['UML', 'Actor', 'Clase'], trans: '¿Cómo se estructura técnicamente la solución?' });
    base(s, { kicker: '05 · El diseño', title: 'Modelado UML y Rational Rose' });
    const chips = [['RUP', 'metodología'], ['UML', 'lenguaje de modelado'], ['Rational Rose', 'herramienta de modelado']];
    chips.forEach(([a, b], i) => { const x = MX + i * 2.95; card(s, x, 1.62, 2.8, 0.5, i === 1 ? C.pur : C.paper); text(s, [{ text: a + '  ', options: { bold: true, color: i === 1 ? C.white : C.ink } }, { text: b, options: { color: i === 1 ? C.purL : C.mute } }], { x: x + 0.15, y: 1.62, w: 2.6, h: 0.5, fontSize: 12, valign: 'middle' }); });
    text(s, 'El flujo de la diapositiva 7 es el diagrama de actividades.', { x: 9.6, y: 1.62, w: W - MX - 9.6, h: 0.5, fontSize: 10.5, italic: true, color: C.mute, valign: 'middle' });
    // Casos de uso
    const ux = MX, uy = 2.3, uw = 6.15, uh = 4.55;
    text(s, 'Casos de uso: quién usa el sistema y qué puede hacer', { x: ux, y: uy, w: uw, h: 0.3, fontSize: 11.5, bold: true, color: C.pur });
    const sx = ux + 1.35, sy = uy + 0.4, sw = 3.3, sh = uh - 0.45;
    s.addShape(pres.shapes.RECTANGLE, { x: sx, y: sy, w: sw, h: sh, fill: { color: C.white }, line: { color: C.mute2, width: 1 } });
    text(s, 'SGCD-BH', { x: sx, y: sy + 0.04, w: sw, h: 0.25, fontSize: 10, bold: true, align: 'center' });
    const ucs = [['Consultar catálogo y ficha', 0], ['Comparar productos', 0], ['Enviar consulta por WhatsApp', 0], ['Registrar consulta', 1], ['Solicitar ser distribuidor', 0], ['Administrar catálogo', 0], ['Gestionar distribuidores', 1], ['Seguimiento y reportes', 1]];
    const ovH = 0.4, step = (sh - 0.4) / ucs.length;
    const ov = ucs.map(([t, p], i) => { const oy = sy + 0.35 + i * step, ox = sx + (i === 3 ? 1.0 : 0.25), ow = 2.25; s.addShape(pres.shapes.OVAL, { x: ox, y: oy, w: ow, h: ovH, fill: { color: p ? C.purL : C.white }, line: { color: p ? C.pur : C.ink, width: 1 } }); text(s, t, { x: ox, y: oy, w: ow, h: ovH, fontSize: 9.5, align: 'center', valign: 'middle' }); return { x: ox, y: oy, w: ow, h: ovH }; });
    stick(s, ux + 0.55, sy + 0.55, 'Cliente', 1.2);
    stick(s, ux + 0.55, sy + 2.55, 'Distribuidor', 1.3);
    stick(s, sx + sw + 0.7, sy + 0.95, 'WhatsApp «sistema»', 1.3);
    stick(s, sx + sw + 0.7, sy + 2.75, 'Gestor / Admin', 1.3);
    const cl = [ux + 0.8, sy + 0.9], di = [ux + 0.8, sy + 2.9], wa = [sx + sw + 0.45, sy + 1.3], ga = [sx + sw + 0.45, sy + 3.1];
    [0, 1, 2].forEach((i) => line(s, ...cl, ov[i].x, ov[i].y + ovH / 2));
    line(s, ...di, ov[4].x, ov[4].y + ovH / 2);
    line(s, ov[2].x + ov[2].w, ov[2].y + ovH / 2, ...wa);
    [5, 6, 7].forEach((i) => line(s, ov[i].x + ov[i].w, ov[i].y + ovH / 2, ...ga));
    arrow(s, ov[2].x + 1.1, ov[2].y + ovH, ov[3].x + 0.6, ov[3].y, C.ink, 'dash');
    text(s, '«include»', { x: ov[2].x + 0.05, y: ov[2].y + ovH + 0.02, w: 0.9, h: 0.2, fontSize: 8, color: C.mute });
    // Clases
    const cx0 = 7.1;
    text(s, 'Clases: cómo se relacionan los datos', { x: cx0, y: uy, w: 5.6, h: 0.3, fontSize: 11.5, bold: true, color: C.pur });
    const cls = (x, y, t, p) => { s.addShape(pres.shapes.RECTANGLE, { x, y, w: 1.6, h: 0.55, fill: { color: p ? C.purL : C.paper }, line: { color: p ? C.pur : C.ink, width: 1 } }); text(s, t, { x, y, w: 1.6, h: 0.55, fontSize: 10.5, bold: true, align: 'center', valign: 'middle' }); return { x, y, w: 1.6, h: 0.55 }; };
    const cat = cls(7.1, 2.85, 'Categoría'), pro = cls(9.35, 2.85, 'Producto'), usu = cls(11.13, 2.85, 'Usuario');
    const esp = cls(9.35, 5.75, 'Especificación técnica'), con = cls(11.13, 4.3, 'Consulta comercial', true), dis = cls(11.13, 5.75, 'Distribuidor', true);
    const mult = (t, x, y) => text(s, t, { x, y, w: 0.45, h: 0.2, fontSize: 9.5, color: C.pur, bold: true });
    const lbl = (t, x, y, w = 1.2) => text(s, t, { x, y, w, h: 0.2, fontSize: 8.5, italic: true, color: C.mute });
    line(s, cat.x + cat.w, 3.12, pro.x, 3.12); mult('1..*', cat.x + cat.w + 0.04, 2.9); mult('0..*', pro.x - 0.36, 3.16); lbl('pertenece a', cat.x + cat.w - 0.2, 3.45, 1.0);
    s.addShape(pres.shapes.DIAMOND, { x: pro.x + 0.36, y: pro.y + pro.h, w: 0.18, h: 0.18, fill: { color: C.ink }, line: { color: C.ink, width: 1 } });
    line(s, pro.x + 0.45, pro.y + pro.h + 0.18, pro.x + 0.45, esp.y); mult('1', pro.x + 0.55, pro.y + pro.h + 0.12); mult('0..*', pro.x + 0.55, esp.y - 0.25); lbl('describe', pro.x - 0.75, 4.6, 0.8);
    line(s, pro.x + pro.w - 0.25, pro.y + pro.h, con.x + 0.25, con.y); mult('0..1', pro.x + pro.w - 0.2, pro.y + pro.h + 0.05); mult('0..*', con.x - 0.2, con.y - 0.25); lbl('sobre', pro.x + pro.w - 0.35, 3.85, 0.6);
    line(s, usu.x + usu.w / 2, usu.y + usu.h, con.x + con.w / 2, con.y); mult('0..1', usu.x + usu.w / 2 + 0.06, usu.y + usu.h + 0.03); mult('0..*', con.x + con.w / 2 + 0.06, con.y - 0.25); lbl('atiende', usu.x + usu.w / 2 - 0.75, 3.75, 0.7);
    line(s, con.x + con.w / 2, con.y + con.h, dis.x + dis.w / 2, dis.y); mult('0..*', con.x + con.w / 2 + 0.06, con.y + con.h + 0.03); mult('0..1', dis.x + dis.w / 2 + 0.06, dis.y - 0.25); lbl('derivada a', dis.x + dis.w / 2 - 0.95, 5.25, 0.9);
    text(s, 'Morado: propuesto. Diagramas completos (22) en los anexos.', { x: cx0, y: 6.62, w: 5.6, h: 0.25, fontSize: 9.5, color: C.mute2 });
  }

  // 12 ─ Arquitectura general
  {
    const s = add({ title: 'Arquitectura general', t: 55, idea: 'La solución tiene cuatro capas y se apoya en la plataforma que ya existe.',
      explicar: ['Interfaz web: el sitio público y el panel de administración.', 'Lógica: WooCommerce maneja el catálogo; YITH Catalog Mode oculta precio, carrito y pago; un módulo propio agrega lo nuevo.', 'Datos: una base MySQL.', 'WhatsApp es un canal externo: el sistema solo genera el enlace.'],
      ejemplo: 'El módulo propio guarda la consulta y arma el enlace wa.me; WooCommerce no se modifica, así sus actualizaciones no borran nada.', claves: ['Capas', 'WooCommerce', 'Módulo propio'], trans: '¿Qué resultados esperamos?' });
    base(s, { kicker: '05 · El diseño', title: 'Arquitectura general' });
    const L = [['Interfaz web', [['Sitio público', 'Tema hijo Black Hawk', 0], ['Panel de administración', 'WordPress', 0]]], ['Lógica del sistema', [['WooCommerce', 'Catálogo de productos', 0], ['YITH Catalog Mode', 'Sin carrito ni pago', 0], ['Módulo propio', 'Consultas, distribuidores, reportes', 1]]], ['Datos', [['Base de datos', 'MySQL / MariaDB', 0]]]];
    const x0 = MX, wL = 9.0, y0 = 1.75, hL = 1.45;
    L.forEach(([n, comps], i) => {
      const y = y0 + i * (hL + 0.28);
      card(s, x0, y, wL, hL, C.paper);
      text(s, n, { x: x0 + 0.25, y, w: 1.9, h: hL, fontSize: 15, bold: true, valign: 'middle' });
      const cw = (wL - 2.4 - (comps.length - 1) * 0.15) / comps.length;
      comps.forEach(([t, d, p], j) => { const cx = x0 + 2.2 + j * (cw + 0.15); card(s, cx, y + 0.2, cw, hL - 0.4, p ? C.pur : C.white, p ? null : C.line); text(s, t, { x: cx + 0.15, y: y + 0.3, w: cw - 0.3, h: 0.4, fontSize: 14, bold: true, color: p ? C.white : C.ink }); text(s, d, { x: cx + 0.15, y: y + 0.7, w: cw - 0.3, h: 0.5, fontSize: 11.5, color: p ? C.purL : C.mute }); });
      if (i < 2) arrow(s, x0 + wL / 2, y + hL + 0.02, x0 + wL / 2, y + hL + 0.26, C.pur);
    });
    card(s, 10.0, 3.48, W - MX - 10.0, 1.45, C.ink);
    s.addImage({ data: await icon('LuMessageCircle', C.wa), x: 10.2, y: 3.68, w: 0.45, h: 0.45 });
    text(s, 'WhatsApp', { x: 10.75, y: 3.68, w: 1.9, h: 0.45, fontSize: 15, bold: true, color: C.white, valign: 'middle' });
    text(s, 'Canal externo: el sistema solo genera el enlace wa.me.', { x: 10.2, y: 4.18, w: 2.45, h: 0.7, fontSize: 11, color: C.mute2 });
    arrow(s, x0 + wL + 0.02, 4.2, 10.0, 4.2, C.pur, 'dash');
    text(s, 'Base tecnológica: WordPress + WooCommerce. Se extiende la plataforma, no se reemplaza.', { x: 10.0, y: 5.2, w: W - MX - 10.0, h: 1.3, fontSize: 12, italic: true, color: C.mute });
  }

  // 13 ─ Resultados esperados
  {
    const s = add({ title: 'Resultados esperados', t: 55, idea: 'Tres cosas distintas: lo que ya diseñamos, lo que proponemos implementar y lo que esperamos lograr.',
      explicar: ['Realizado: análisis y diseño (problema, requisitos, casos de uso, modelos, arquitectura, plan).', 'Propuesto: las funciones nuevas que se implementarían.', 'Esperado: beneficios de una futura implementación, que se medirían con indicadores.', 'No afirmamos ventas ni tráfico: no tenemos esos datos.'],
      ejemplo: 'Un indicador esperado: el porcentaje de consultas que llegan con el producto identificado.', claves: ['Realizado', 'Propuesto', 'Esperado'], trans: 'Para cerrar, nuestras conclusiones.' });
    base(s, { kicker: '06 · Resultados', title: 'Resultados esperados' });
    const cols = [['YA REALIZADO', 'Análisis y diseño', V.RESULTADOS.realizado, C.paper, C.ink], ['SE PROPONE IMPLEMENTAR', 'Funciones nuevas', V.RESULTADOS.propuesto, C.ink, C.white], ['SE ESPERA CONSEGUIR', 'Beneficios futuros', V.RESULTADOS.esperado, C.purL, C.ink]];
    cols.forEach(([k, d, items, fill, col], i) => {
      const x = MX + i * 4.1;
      card(s, x, 1.7, 3.9, 4.95, fill);
      text(s, k, { x: x + 0.3, y: 1.92, w: 3.3, h: 0.3, fontSize: 10.5, bold: true, color: i === 1 ? C.purM : C.pur, charSpacing: 1.5 });
      text(s, d, { x: x + 0.3, y: 2.25, w: 3.3, h: 0.45, fontSize: 18, bold: true, color: col });
      text(s, items.map((a, k2) => ({ text: a, options: { breakLine: k2 < items.length - 1, bullet: { code: '25A0' }, paraSpaceAfter: 12 } })), { x: x + 0.3, y: 2.95, w: 3.3, h: 3.5, fontSize: 14.5, color: col });
    });
    source(s, 'Los beneficios esperados son hipótesis: se medirían después de implementar el sistema.');
  }

  // 14 ─ Conclusiones
  {
    const s = add({ title: 'Conclusiones', t: 50, idea: 'Necesidad, solución y metodología, en tres ideas.',
      explicar: ['La necesidad: información confiable y una ruta clara al distribuidor, no una tienda.', 'La solución: el SGCD-BH extiende la plataforma existente.', 'La metodología: RUP permitió definir, modelar y planificar antes de construir.'],
      ejemplo: 'Cierre: «Diseñar bien antes de construir: ese es el valor de aplicar RUP a Black Hawk».', claves: ['Necesidad', 'Solución', 'RUP'], trans: 'Muchas gracias. ¿Preguntas?' });
    base(s, { kicker: 'Conclusiones', title: 'Conclusiones', dark: true });
    V.CONCLUSIONES.forEach(([k, t], i) => {
      const x = MX + i * 4.1;
      text(s, `0${i + 1}`, { x, y: 1.8, w: 1, h: 0.7, fontSize: 32, bold: true, color: C.purM });
      text(s, k, { x, y: 2.55, w: 3.8, h: 0.45, fontSize: 18, bold: true, color: C.white });
      text(s, t, { x, y: 3.05, w: 3.8, h: 2.0, fontSize: 15, color: C.mute2 });
    });
    card(s, MX, 5.45, W - 2 * MX, 1.1, C.pur);
    text(s, V.CIERRE, { x: MX + 0.35, y: 5.45, w: W - 2 * MX - 0.7, h: 1.1, fontSize: 20, bold: true, color: C.white, valign: 'middle', align: 'center' });
  }

  // 15 ─ Preguntas
  {
    const s = add({ title: 'Preguntas', t: 10, idea: 'Abrimos la ronda de preguntas.', explicar: ['Agradecer y escuchar la pregunta completa antes de responder.'], ejemplo: '—', claves: ['Preguntas'], trans: '—' });
    s.background = { color: C.ink };
    s.addImage({ path: 'research/logo-w-t.png', x: W / 2 - 1.1, y: 1.7, w: 2.2, h: 1.17 });
    text(s, '¿Preguntas?', { x: 0, y: 3.3, w: W, h: 1.2, fontSize: 54, bold: true, color: C.white, align: 'center' });
    text(s, 'SGCD-BH · Aplicación de RUP a Black Hawk', { x: 0, y: 4.6, w: W, h: 0.5, fontSize: 16, color: C.mute2, align: 'center' });
  }

  await pres.writeFile({ fileName: '../BLACK_HAWK_RUP_PRESENTACION_V2.pptx' });
  META.forEach((m, i) => { m.n = i + 1; });
  fs.writeFileSync('slides_v2.json', JSON.stringify(META, null, 1));
  console.log('ok', META.length, 'diapositivas', Math.round(META.reduce((a, b) => a + b.t, 0) / 60), 'min');
})();
