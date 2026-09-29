// Genera BLACK_HAWK_RUP_PRESENTACION_V3.pptx y slides_v3.json (base de la guía V3).
const fs = require('fs');
const pptxgen = require('pptxgenjs');
const React = require('react');
const RDS = require('react-dom/server');
const sharp = require('sharp');
const lu = require('react-icons/lu');
const V = require('./v3data');
const M = V.M;
const { pngSize } = require('./docxlib');

const C = { ink: '0B0B0D', ink2: '1A1B1F', white: 'FFFFFF', paper: 'F5F5F7', line: 'E3E4E8', mute: '6B7280', mute2: '9CA3AF', pur: '6D28D9', purL: 'EDE4FB', purM: 'A78BFA', wa: '25D366' };
const F = 'Arial';
const W = 13.333, H = 7.5, MX = 0.6;
const DG = '../DIAGRAMAS_UML/png/';
const EV = '../../evidence/';

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
pres.title = 'Aplicación de RUP — Web renovada de Black Hawk (V3)';
pres.author = 'Equipo del proyecto SGCD-BH';
const META = [];

function text(s, t, o) { s.addText(t, { fontFace: F, fontSize: 15, color: C.ink, margin: 0, valign: 'top', isTextBox: true, ...o }); }
function base(s, { kicker, title, dark = false }) {
  s.background = { color: dark ? C.ink : C.white };
  if (kicker) text(s, kicker.toUpperCase(), { x: MX, y: 0.38, w: 9, h: 0.3, fontSize: 11, bold: true, color: dark ? C.purM : C.pur, charSpacing: 3 });
  if (title) { text(s, title, { x: MX, y: 0.68, w: W - 2 * MX, h: 0.75, fontSize: 30, bold: true, color: dark ? C.white : C.ink }); META[META.length - 1].visible = title; }
  text(s, `Black Hawk · RUP   ${META.length}`, { x: W - 3.2, y: H - 0.42, w: 2.6, h: 0.25, fontSize: 9, color: dark ? C.mute : C.mute2, align: 'right' });
}
function card(s, x, y, w, h, fill = C.paper, line) { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: line ? { color: line, width: 1 } : { type: 'none' }, rectRadius: 0.08 }); }
const TAG = {
  Existente: [C.white, C.ink, C.ink], Desarrollado: [C.white, C.ink, C.ink], 'Base WordPress': [C.white, C.mute, C.mute],
  Propuesto: [C.pur, C.white, C.pur], Realizado: [C.ink, C.white, C.ink], 'En curso': [C.purL, C.pur, C.pur], Planificado: [C.white, C.mute, C.mute2],
  Inexistente: [C.ink, C.white, C.ink], 'Existe, poco visible': [C.white, C.ink, C.ink], 'Recorrido mejorable': [C.purL, C.pur, C.pur],
  ANTES: [C.white, C.ink, C.ink], 'DESPUÉS': [C.pur, C.white, C.pur],
};
function tag(s, x, y, label, fs = 9.5) {
  const [fill, col, ln] = TAG[label] || [C.white, C.ink, C.ink];
  const w = 0.28 + label.length * fs * 0.0085;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.28, rectRadius: 0.14, fill: { color: fill }, line: { color: ln, width: 0.75 } });
  text(s, label, { x, y, w, h: 0.28, fontSize: fs, bold: true, color: col, align: 'center', valign: 'middle' });
  return w;
}
function img(s, file, x, y, w, h, frame) {
  const { w: pw, h: ph } = pngSize(file);
  let iw = w, ih = w * ph / pw;
  if (ih > h) { ih = h; iw = h * pw / ph; }
  const ix = x + (w - iw) / 2, iy = y + (h - ih) / 2;
  s.addImage({ path: file, x: ix, y: iy, w: iw, h: ih });
  if (frame) s.addShape(pres.shapes.RECTANGLE, { x: ix, y: iy, w: iw, h: ih, fill: { type: 'none' }, line: { color: C.line, width: 1 } });
  return { x: ix, y: iy, w: iw, h: ih };
}
function marker(s, x, y, n) {
  s.addShape(pres.shapes.OVAL, { x: x - 0.19, y: y - 0.19, w: 0.38, h: 0.38, fill: { color: C.pur }, line: { color: C.white, width: 1.5 } });
  text(s, String(n), { x: x - 0.19, y: y - 0.19, w: 0.38, h: 0.38, fontSize: 12, bold: true, color: C.white, align: 'center', valign: 'middle' });
}
async function iconCircle(s, name, x, y, d = 0.62, fill = C.purL, color = C.pur) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: 'none' } });
  s.addImage({ data: await icon(name, color), x: x + d * 0.24, y: y + d * 0.24, w: d * 0.52, h: d * 0.52 });
}
function arrow(s, x1, y1, x2, y2, color = C.ink, dash) {
  s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipH: x2 < x1, flipV: y2 < y1, line: { color, width: 1.25, endArrowType: 'triangle', dashType: dash || 'solid' } });
}
function bullets(s, items, o) { text(s, items.map((t, i) => ({ text: t, options: { breakLine: i < items.length - 1, bullet: { code: o.code || '25A0' }, paraSpaceAfter: o.gap ?? 6 } })), o); }
function add(meta) {
  const s = pres.addSlide(); META.push(meta);
  s.addNotes(`${meta.msg}\n\n${meta.exp}\n\nEjemplo: ${meta.ej}`);
  return s;
}
function source(s, t, dark) { text(s, t, { x: MX, y: H - 0.45, w: 9.8, h: 0.3, fontSize: 9, color: dark ? C.mute : C.mute2 }); }
function sidePanel(s, x, y, w, h, blocks) {
  card(s, x, y, w, h, C.paper);
  let yy = y + 0.25;
  blocks.forEach(([k, v]) => {
    text(s, k.toUpperCase(), { x: x + 0.25, y: yy, w: w - 0.5, h: 0.25, fontSize: 9.5, bold: true, color: C.pur, charSpacing: 1.5 });
    const lines = Math.ceil(v.length / (w * 11)) + 0.2;
    text(s, v, { x: x + 0.25, y: yy + 0.28, w: w - 0.5, h: lines * 0.22 + 0.1, fontSize: 12 });
    yy += 0.28 + lines * 0.22 + 0.3;
  });
}
function diagSlide(meta, file, blocks, imgW = 8.55, src) {
  const s = add(meta);
  base(s, { kicker: meta.kicker, title: meta.title });
  img(s, file, MX, 1.4, imgW, 5.65);
  sidePanel(s, MX + imgW + 0.3, 1.5, W - MX - (MX + imgW + 0.3), 5.45, blocks);
  if (src) source(s, src);
  return s;
}

(async () => {
  // ═══════════ BLOQUE I — EMPRESA Y SITUACIÓN ORIGINAL
  { // 1 Portada
    const s = add({ title: 'Portada', t: 30, msg: 'Presento cómo apliqué RUP para renovar la plataforma web de Black Hawk.',
      exp: 'Es un proyecto sobre una empresa real: parto de su web original, desarrollo una versión renovada y uso RUP para organizar y justificar el proceso.',
      ej: 'Black Hawk es una marca peruana de car audio: amplificadores, subwoofers, procesadores.', con: ['RUP', 'Web renovada'], preg: ['¿El proyecto es real o solo teórico?', 'Es real: la web renovada ya funciona en un entorno de prueba. Lo teórico son las ampliaciones propuestas y la planificación de la publicación.'] });
    s.background = { color: C.ink };
    s.addImage({ path: '../../assets/images/brand/subwoofer-960.jpg', x: 6.35, y: 0, w: 6.983, h: 7.5, sizing: { type: 'cover', w: 6.983, h: 7.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 6.35, y: 0, w: 6.983, h: 7.5, fill: { color: C.ink, transparency: 40 }, line: { type: 'none' } });
    s.addImage({ path: 'research/logo-w-t.png', x: MX, y: 0.6, w: 1.5, h: 0.8 });
    text(s, 'DISEÑO DE SISTEMAS DE INFORMACIÓN', { x: MX, y: 1.85, w: 5.6, h: 0.3, fontSize: 11, bold: true, color: C.purM, charSpacing: 3 });
    text(s, 'Aplicación de la metodología RUP en el análisis, diseño y desarrollo de la web renovada de Black Hawk', { x: MX, y: 2.25, w: 5.6, h: 2.3, fontSize: 27, bold: true, color: C.white });
    text(s, 'Del sitio original a una plataforma que guía al cliente hasta la consulta comercial', { x: MX, y: 4.6, w: 5.4, h: 0.7, fontSize: 14, color: C.mute2 });
    text(s, [{ text: 'Integrantes: [nombres del equipo]', options: { breakLine: true } }, { text: 'Docente: [nombre del docente]', options: { breakLine: true } }, { text: '[Institución] · 2026' }], { x: MX, y: 5.75, w: 5.5, h: 1.0, fontSize: 12, color: C.mute2, paraSpaceAfter: 4 });
  }

  { // 2 Black Hawk
    const s = add({ title: 'Presentación de Black Hawk', t: 45, kicker: '01 · La empresa', msg: 'Black Hawk es una marca de car audio que usa su web como catálogo, no como tienda.',
      exp: 'Vende a través de su área comercial y de distribuidores. La web muestra los productos y orienta la compra; no cobra ni tiene carrito.',
      ej: 'Su sitio original publica 110 productos en 11 categorías, como el subwoofer BH-SW12XXG o el procesador BH-4.8DSP.', con: ['Modelo comercial', 'Catálogo', 'Distribuidores'], preg: ['¿Por qué la web no vende?', 'Porque su modelo comercial pasa por el área comercial y los distribuidores; la web orienta la compra.'] });
    base(s, { kicker: '01 · La empresa', title: 'Black Hawk Car Audio' });
    const rows = [['LuCar', 'Sector', 'Audio automotriz en el Perú.'], ['LuSpeaker', 'Productos', 'Amplificadores, subwoofers, procesadores, parlantes y más.'], ['LuUsers', 'Público', 'Quien equipa su vehículo y las tiendas que venden la marca.'], ['LuStore', 'Modelo comercial', 'La web es un catálogo: la compra se cierra con el área comercial o un distribuidor.']];
    for (let i = 0; i < 4; i++) { const y = 1.7 + i * 1.12; await iconCircle(s, rows[i][0], MX, y, 0.66); text(s, rows[i][1], { x: MX + 0.9, y, w: 5.4, h: 0.35, fontSize: 16, bold: true }); text(s, rows[i][2], { x: MX + 0.9, y: y + 0.36, w: 5.4, h: 0.65, fontSize: 13.5, color: C.mute }); }
    s.addImage({ path: '../../assets/images/brand/amplificadores-960.jpg', x: 7.1, y: 1.65, w: 5.63, h: 3.14 });
    text(s, [{ text: '110', options: { fontSize: 38, bold: true } }, { text: '  productos', options: { fontSize: 14, color: C.mute } }], { x: 7.1, y: 5.05, w: 2.8, h: 0.8, valign: 'middle' });
    text(s, [{ text: '11', options: { fontSize: 38, bold: true, color: C.pur } }, { text: '  categorías', options: { fontSize: 14, color: C.mute } }], { x: 9.95, y: 5.05, w: 2.8, h: 0.8, valign: 'middle' });
    source(s, `Cifras del sitemap del sitio original (${V.FECHA}). Imagen: sitio oficial de Black Hawk.`);
  }

  { // 3 Plataforma original
    const s = add({ title: 'Plataforma web original', t: 55, kicker: '01 · Situación original', msg: 'Black Hawk ya tiene un sistema web: no partimos de cero.',
      exp: 'El sitio original funciona sobre WordPress y WooCommerce, tiene catálogo por categorías, buscador y fichas. Es la base que se busca mejorar.',
      ej: 'Estas tres capturas son del sitio original, tomadas el 29-09-2026: home, tienda y ficha del BH-SW12XXG.', con: ['Punto de partida', 'WordPress', 'WooCommerce'], preg: ['¿Entonces Black Hawk no tenía sistema?', 'Sí tenía: una plataforma con catálogo. El proyecto mejora su diseño, su experiencia y su recorrido comercial.'] });
    base(s, { kicker: '01 · Situación original', title: 'La plataforma original: una base que ya funciona' });
    const shots = [['img/v3-A-home.png', 'Home'], ['img/v3-A-shop.png', 'Tienda (/shop/)'], ['img/v3-A-ficha.png', 'Ficha BH-SW12XXG']];
    shots.forEach(([f, l], i) => { const x = MX + i * 2.72; img(s, f, x, 1.6, 2.6, 1.63, true); text(s, l, { x, y: 3.3, w: 2.6, h: 0.3, fontSize: 11, bold: true }); });
    tag(s, MX, 3.7, 'ANTES'); text(s, 'Capturas reales del sitio original, 29-09-2026', { x: MX + 0.9, y: 3.72, w: 6, h: 0.25, fontSize: 10.5, color: C.mute });
    card(s, 8.95, 1.6, W - MX - 8.95, 4.95, C.paper);
    text(s, 'LO QUE YA TIENE', { x: 9.2, y: 1.8, w: 3.5, h: 0.3, fontSize: 10.5, bold: true, color: C.pur, charSpacing: 2 });
    bullets(s, V.ORIGINAL_TIENE, { x: 9.2, y: 2.2, w: 3.35, h: 4.2, fontSize: 12.5, code: '2713', gap: 9 });
    card(s, MX, 4.25, 8.05, 2.3, C.ink);
    text(s, 'Punto de partida', { x: MX + 0.3, y: 4.45, w: 7.4, h: 0.4, fontSize: 17, bold: true, color: C.white });
    text(s, 'El sitio original informa sobre los productos. El proyecto no lo reemplaza: rediseña su presentación, su catálogo y el camino que sigue el cliente hasta el contacto comercial.', { x: MX + 0.3, y: 4.95, w: 7.4, h: 1.4, fontSize: 14, color: C.mute2 });
  }

  { // 4 Análisis con anotaciones
    const s = add({ title: 'Análisis de la plataforma original', t: 75, kicker: '01 · Situación original', msg: 'Hallazgos observables, clasificados: qué no existe, qué existe pero está oculto y qué recorrido se puede mejorar.',
      exp: 'Cada número está marcado sobre una captura real. No digo que al sitio le falte algo que sí tiene: por ejemplo, WhatsApp existe, pero solo en la página de ventas al mayor.',
      ej: 'Al pulsar «Productos» se abre una tienda sin productos (1); la ficha del BH-SW12XXG no tiene botón de consulta (2).', con: ['Inexistente', 'Poco visible', 'Recorrido mejorable'], preg: ['¿Cómo sabe que son problemas reales?', 'Están en capturas del sitio original, con fecha; en el caso de WhatsApp, además, revisé los enlaces de la página.'] });
    base(s, { kicker: '01 · Situación original', title: 'Análisis del sitio original: qué se observa' });
    const a = img(s, 'img/v3-A-shop.png', MX, 1.55, 3.9, 2.44, true);
    marker(s, a.x + a.w * 0.62, a.y + a.h * 0.72, 1);
    marker(s, a.x + a.w * 0.1, a.y + a.h * 0.065, 3);
    text(s, 'Tienda (/shop/)', { x: MX, y: a.y + a.h + 0.05, w: 3.9, h: 0.25, fontSize: 10, color: C.mute });
    const b = img(s, 'img/v3-A-ficha.png', MX + 4.05, 1.55, 3.9, 2.44, true);
    marker(s, b.x + b.w * 0.75, b.y + b.h * 0.85, 2);
    text(s, 'Ficha BH-SW12XXG', { x: MX + 4.05, y: b.y + b.h + 0.05, w: 3.9, h: 0.25, fontSize: 10, color: C.mute });
    const c = img(s, 'img/v3-A-mayoristas.png', MX, 4.4, 3.9, 2.2, true);
    marker(s, c.x + c.w * 0.5, c.y + c.h * 0.4, 4);
    text(s, '«Ventas al mayor»', { x: MX, y: c.y + c.h + 0.03, w: 3.9, h: 0.25, fontSize: 10, color: C.mute });
    const d = img(s, EV + 'screens/A-cat-sub-d-view.png', MX + 4.05, 4.4, 3.9, 2.2, true);
    marker(s, d.x + d.w * 0.45, d.y + d.h * 0.37, 5);
    text(s, 'Categoría Subwoofer (23-09-2026)', { x: MX + 4.05, y: d.y + d.h + 0.03, w: 3.9, h: 0.25, fontSize: 10, color: C.mute });
    V.HALLAZGOS.forEach((h, i) => {
      const y = 1.55 + i * 0.86, x = 8.75;
      marker(s, x + 0.19, y + 0.2, h.n);
      text(s, h.t, { x: x + 0.5, y: y - 0.04, w: 3.55, h: 0.45, fontSize: 11.5, bold: true });
      tag(s, x + 0.5, y + 0.5, V.TIPOS[h.tipo], 8.5);
    });
  }

  { // 5 Problema
    const s = add({ title: 'Problema y necesidad empresarial', t: 55, kicker: '01 · Necesidad', msg: 'La plataforma informa, pero no guía hacia una acción comercial.',
      exp: 'De los hallazgos salen tres necesidades: llevar al cliente del interés al contacto, tener un catálogo claro y comparable, y mostrar una marca moderna que funcione en el celular.',
      ej: 'Un cliente que llega a la ficha del BH-SW12XXG no tiene un botón para consultar: debe buscar el contacto por su cuenta.', con: ['Necesidad empresarial', 'Recorrido comercial', 'Acción concreta'], preg: ['¿Cuál es el problema principal?', 'Que la web original no guía al usuario desde el interés en un producto hasta el contacto comercial.'] });
    base(s, { kicker: '01 · Necesidad', title: 'El problema' });
    card(s, MX, 1.6, W - 2 * MX, 1.2, C.pur);
    text(s, V.PROBLEMA, { x: MX + 0.35, y: 1.6, w: W - 2 * MX - 0.7, h: 1.2, fontSize: 20, bold: true, color: C.white, valign: 'middle' });
    text(s, 'Necesidad central: transformar una plataforma informativa en una herramienta que oriente a una acción comercial concreta.', { x: MX, y: 3.0, w: W - 2 * MX, h: 0.4, fontSize: 14, italic: true, color: C.mute });
    V.NECESIDADES.forEach((n, i) => {
      const x = MX + i * 4.1;
      card(s, x, 3.6, 3.9, 2.95, i === 0 ? C.ink : C.paper);
      text(s, `0${i + 1}`, { x: x + 0.3, y: 3.8, w: 1, h: 0.5, fontSize: 24, bold: true, color: i === 0 ? C.purM : C.pur });
      text(s, n.t, { x: x + 0.3, y: 4.35, w: 3.3, h: 0.7, fontSize: 17, bold: true, color: i === 0 ? C.white : C.ink });
      text(s, n.d, { x: x + 0.3, y: 5.1, w: 3.3, h: 0.9, fontSize: 12.5, color: i === 0 ? C.mute2 : C.mute });
      text(s, 'Hallazgos: ' + n.h.join(', '), { x: x + 0.3, y: 6.1, w: 3.3, h: 0.3, fontSize: 10.5, bold: true, color: i === 0 ? C.purM : C.pur });
    });
  }

  { // 6 Objetivos y alcance
    const s = add({ title: 'Objetivos y alcance', t: 60, kicker: '01 · Necesidad', msg: 'El objetivo es desarrollar la web renovada aplicando RUP; el alcance separa lo desarrollado de lo propuesto.',
      exp: 'Los cuatro objetivos específicos siguen el orden del trabajo: analizar, especificar y modelar, desarrollar, y validar. El alcance tiene cinco grupos: los cuatro primeros forman el rediseño; el quinto son las ampliaciones.',
      ej: 'Se excluye la venta en línea porque Black Hawk vende a través de distribuidores.', con: ['Objetivo general', 'Alcance', 'Exclusiones'], preg: ['¿Qué queda fuera del proyecto?', 'Carrito y pagos, ERP e inventario, un CRM o la API de WhatsApp Business y una aplicación móvil.'] });
    base(s, { kicker: '01 · Necesidad', title: 'Objetivos y alcance' });
    card(s, MX, 1.55, 6.3, 5.05, C.paper);
    text(s, 'OBJETIVO GENERAL', { x: MX + 0.3, y: 1.75, w: 5, h: 0.3, fontSize: 10.5, bold: true, color: C.pur, charSpacing: 2 });
    text(s, V.OBJ_GENERAL, { x: MX + 0.3, y: 2.1, w: 5.7, h: 1.7, fontSize: 13, bold: true });
    text(s, 'OBJETIVOS ESPECÍFICOS', { x: MX + 0.3, y: 3.95, w: 5, h: 0.3, fontSize: 10.5, bold: true, color: C.pur, charSpacing: 2 });
    text(s, V.OBJ_ESP.map((o, i) => ({ text: o, options: { breakLine: i < 3, bullet: { type: 'number' }, paraSpaceAfter: 5 } })), { x: MX + 0.3, y: 4.3, w: 5.7, h: 2.2, fontSize: 12.5 });
    text(s, 'ALCANCE', { x: 7.25, y: 1.55, w: 5, h: 0.3, fontSize: 10.5, bold: true, color: C.pur, charSpacing: 2 });
    V.FUNCIONES.forEach((f, i) => {
      const y = 1.9 + i * 0.72;
      card(s, 7.25, y, W - MX - 7.25, 0.62, f.e === 'Propuesto' ? C.purL : C.paper);
      text(s, `${f.k} · ${f.n}`, { x: 7.45, y, w: 3.2, h: 0.62, fontSize: 13.5, bold: true, valign: 'middle' });
      tag(s, 11.0, y + 0.17, f.e);
    });
    card(s, 7.25, 5.6, W - MX - 7.25, 1.0, C.ink);
    text(s, [{ text: 'No incluye: ', options: { bold: true, color: C.purM } }, { text: V.EXCLUSIONES.join(' · '), options: { color: C.white } }], { x: 7.45, y: 5.6, w: W - MX - 7.65, h: 1.0, fontSize: 12, valign: 'middle' });
  }

  // ═══════════ BLOQUE II — RUP
  { // 7 Qué es RUP
    const s = add({ title: '¿Qué es RUP y por qué se utiliza?', t: 60, kicker: '02 · Metodología RUP', msg: 'RUP es una metodología iterativa, dirigida por casos de uso y centrada en la arquitectura; encaja con un proyecto que se construye por partes.',
      exp: 'La web renovada no se hizo de una vez: primero la home y la identidad, luego el catálogo y la ficha, después el recorrido de cotización. Cada parte se diseñó, construyó y verificó.',
      ej: 'El caso de uso «Cotizar por WhatsApp» guió el diseño de la ficha, del mensaje y de las pruebas.', con: ['Iterativo', 'Casos de uso', 'Arquitectura'], preg: ['¿Por qué RUP y no Scrum?', 'Porque el curso exige análisis y diseño formales con UML, y RUP combina iteraciones con hitos y artefactos de modelado.'] });
    base(s, { kicker: '02 · Metodología RUP', title: '¿Qué es RUP y por qué lo utilizo?' });
    text(s, 'Rational Unified Process: metodología de desarrollo de software que organiza el trabajo en fases e iteraciones, con disciplinas, artefactos e hitos definidos (Kruchten, 2004).', { x: MX, y: 1.5, w: 11.5, h: 0.7, fontSize: 15, color: C.mute });
    const c3 = [['LuRepeat', 'Iterativo e incremental', 'El sistema crece por partes que se prueban.', 'Home → catálogo → ficha → recorrido de cotización.'], ['LuUsers', 'Dirigido por casos de uso', 'Los casos de uso guían diseño, código y pruebas.', '«Cotizar por WhatsApp» definió la ficha y el mensaje.'], ['LuLayers', 'Centrado en la arquitectura', 'Se valida la estructura antes de construir.', 'Tema hijo sobre WooCommerce, sin tocar su núcleo.']];
    for (let i = 0; i < 3; i++) {
      const x = MX + i * 4.1;
      card(s, x, 2.4, 3.9, 3.0, i === 0 ? C.ink : C.paper);
      await iconCircle(s, c3[i][0], x + 0.3, 2.6, 0.66, i === 0 ? C.pur : C.white, i === 0 ? C.white : C.pur);
      text(s, c3[i][1], { x: x + 0.3, y: 3.4, w: 3.4, h: 0.45, fontSize: 17, bold: true, color: i === 0 ? C.white : C.ink });
      text(s, c3[i][2], { x: x + 0.3, y: 3.9, w: 3.4, h: 0.55, fontSize: 12.5, color: i === 0 ? C.mute2 : C.mute });
      text(s, c3[i][3], { x: x + 0.3, y: 4.55, w: 3.4, h: 0.7, fontSize: 13, bold: true, color: i === 0 ? C.purM : C.pur });
    }
    card(s, MX, 5.65, W - 2 * MX, 0.9, C.purL);
    text(s, [{ text: 'Por qué RUP: ', options: { bold: true, color: C.pur } }, { text: 'exige analizar y modelar antes de construir, ataca los riesgos temprano y cada fase cierra con un hito verificable.' }], { x: MX + 0.3, y: 5.65, w: W - 2 * MX - 0.6, h: 0.9, fontSize: 14, valign: 'middle' });
  }

  { // 8 Estructura general
    const s = add({ title: 'Estructura general de RUP', t: 65, kicker: '02 · Metodología RUP', msg: 'RUP tiene dos dimensiones: en el tiempo, fases e iteraciones; en el contenido, disciplinas.',
      exp: 'Las columnas son las fases, con sus iteraciones. Las filas son las disciplinas. La barra indica cuánto trabajo tiene cada disciplina en cada fase: requisitos pesa más al inicio, implementación en construcción. Todas conviven: no es una cascada.',
      ej: 'En Elaboración ya se programó un prototipo, y en Construcción se ajustaron requisitos.', con: ['Fase', 'Iteración', 'Disciplina', 'Hito'], preg: ['¿Qué diferencia hay entre fase y disciplina?', 'La fase es un periodo con un objetivo y un hito; la disciplina es un tipo de trabajo (requisitos, pruebas…) que ocurre en varias fases.'] });
    base(s, { kicker: '02 · Metodología RUP', title: 'Estructura de RUP: fases, iteraciones y disciplinas' });
    const lx = MX + 3.0, cw = (W - MX - lx) / 4, y0 = 1.55;
    const phases = [['Inicio', ['I1'], 'LCO'], ['Elaboración', ['E1', 'E2'], 'LCA'], ['Construcción', ['C1', 'C2', 'C3'], 'IOC'], ['Transición', ['T1'], 'PR']];
    phases.forEach(([n, its, h], i) => {
      const x = lx + i * cw;
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.03, y: y0, w: cw - 0.06, h: 0.45, fill: { color: [C.mute2, C.purM, C.pur, C.ink][i] }, line: { type: 'none' } });
      text(s, n, { x: x + 0.03, y: y0, w: cw - 0.06, h: 0.45, fontSize: 13, bold: true, color: C.white, align: 'center', valign: 'middle' });
      its.forEach((it, k) => { const iw = (cw - 0.06) / its.length; card(s, x + 0.03 + k * iw + 0.02, y0 + 0.52, iw - 0.04, 0.32, C.paper); text(s, it, { x: x + 0.03 + k * iw, y: y0 + 0.52, w: iw, h: 0.32, fontSize: 10, bold: true, align: 'center', valign: 'middle' }); });
    });
    const dis = M.DISCIPLINAS;
    const rh = 0.42;
    dis.forEach((d_, r) => {
      const y = y0 + 1.0 + r * rh;
      text(s, d_.n, { x: MX, y, w: 2.9, h: rh, fontSize: 11, valign: 'middle', color: d_.t === 'Soporte' ? C.mute : C.ink, bold: d_.t !== 'Soporte' });
      s.addShape(pres.shapes.LINE, { x: MX, y: y + rh, w: W - 2 * MX, h: 0, line: { color: C.line, width: 0.5 } });
      d_.v.forEach((v, i) => { if (!v) return; const bw = (cw - 0.3) * v / 4; s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: lx + i * cw + (cw - bw) / 2, y: y + 0.1, w: bw, h: rh - 0.2, rectRadius: 0.05, fill: { color: d_.t === 'Soporte' ? C.mute2 : C.pur }, line: { type: 'none' } }); });
    });
    const yh = y0 + 1.0 + dis.length * rh + 0.1;
    phases.forEach(([n, its, h], i) => { text(s, [{ text: h, options: { bold: true, color: C.pur } }], { x: lx + i * cw, y: yh, w: cw, h: 0.3, fontSize: 12, align: 'center' }); });
    text(s, 'Hitos: LCO objetivos acordados · LCA arquitectura validada · IOC versión operativa · PR producto publicado', { x: MX, y: yh + 0.35, w: W - 2 * MX, h: 0.3, fontSize: 11, color: C.mute });
  }

  const phaseSlide = (i, meta) => {
    const f = V.FASES[i];
    const s = add(meta);
    base(s, { kicker: `02 · Fase ${i + 1} de 4`, title: `Fase de ${f.n}` });
    tag(s, W - MX - 1.5, 0.82, f.estado, 11);
    card(s, MX, 1.55, 6.2, 1.0, C.ink);
    text(s, [{ text: 'Objetivo  ', options: { bold: true, color: C.purM } }, { text: f.obj, options: { color: C.white } }], { x: MX + 0.3, y: 1.55, w: 5.7, h: 1.0, fontSize: 15, valign: 'middle' });
    text(s, 'ACTIVIDADES PRINCIPALES', { x: MX, y: 2.75, w: 5, h: 0.3, fontSize: 10.5, bold: true, color: C.pur, charSpacing: 1.5 });
    bullets(s, f.act, { x: MX, y: 3.1, w: 6.1, h: 2.3, fontSize: 13.5, gap: 8 });
    text(s, 'ARTEFACTOS', { x: MX, y: 5.35, w: 5, h: 0.3, fontSize: 10.5, bold: true, color: C.pur, charSpacing: 1.5 });
    let ax = MX, ay = 5.7;
    f.art.forEach((a) => { const w = 0.3 + a.length * 0.085; if (ax + w > MX + 6.3) { ax = MX; ay += 0.42; } card(s, ax, ay, w, 0.34, C.paper, C.line); text(s, a, { x: ax, y: ay, w, h: 0.34, fontSize: 10.5, align: 'center', valign: 'middle' }); ax += w + 0.12; });
    const rx = 7.2, rw = W - MX - rx;
    card(s, rx, 1.55, rw, 1.6, C.purL);
    text(s, 'EN BLACK HAWK', { x: rx + 0.25, y: 1.7, w: 4, h: 0.3, fontSize: 10.5, bold: true, color: C.pur, charSpacing: 1.5 });
    text(s, f.bh, { x: rx + 0.25, y: 2.0, w: rw - 0.5, h: 1.1, fontSize: 13.5, bold: true });
    if (f.extra) {
      card(s, rx, 3.3, rw, 1.35, C.paper);
      text(s, 'STAKEHOLDERS', { x: rx + 0.25, y: 3.42, w: 4, h: 0.3, fontSize: 10, bold: true, color: C.pur, charSpacing: 1.5 });
      text(s, f.extra.stake.join(' · '), { x: rx + 0.25, y: 3.72, w: rw - 0.5, h: 0.85, fontSize: 12 });
      card(s, rx, 4.8, rw, 1.2, C.paper);
      text(s, 'VIABILIDAD', { x: rx + 0.25, y: 4.9, w: 4, h: 0.3, fontSize: 10, bold: true, color: C.pur, charSpacing: 1.5 });
      text(s, f.extra.viab.map(([k, v], j) => ({ text: `${k}: `, options: { bold: true } })).flatMap((a, j) => [a, { text: f.extra.viab[j][1], options: { breakLine: j < 2 } }]), { x: rx + 0.25, y: 5.18, w: rw - 0.5, h: 0.8, fontSize: 11 });
    } else if (f.pruebas) {
      card(s, rx, 3.3, rw, 2.7, C.paper);
      text(s, 'PRUEBAS', { x: rx + 0.25, y: 3.42, w: 4, h: 0.3, fontSize: 10, bold: true, color: C.pur, charSpacing: 1.5 });
      text(s, f.pruebas, { x: rx + 0.25, y: 3.75, w: rw - 0.5, h: 2.2, fontSize: 12.5 });
    } else {
      card(s, rx, 3.3, rw, 2.7, C.paper);
      text(s, i === 1 ? 'DECISIÓN DE ARQUITECTURA' : 'CRITERIOS PARA PUBLICAR', { x: rx + 0.25, y: 3.42, w: 5, h: 0.3, fontSize: 10, bold: true, color: C.pur, charSpacing: 1.5 });
      const items = i === 1 ? ['Conservar WordPress + WooCommerce', 'Rediseño como tema hijo: las actualizaciones no borran los cambios', 'YITH Catalog Mode: sin carrito ni pago', 'WhatsApp por enlace wa.me, sin API de pago'] : ['Aceptación de Black Hawk', 'Sin errores críticos abiertos', 'Funciona en celular y escritorio', 'Respaldo previo y plan de reversión'];
      bullets(s, items, { x: rx + 0.25, y: 3.75, w: rw - 0.5, h: 2.2, fontSize: 12.5, gap: 6, code: '2713' });
    }
    card(s, rx, 6.15, rw, 0.5, C.white, C.ink);
    text(s, [{ text: `Hito ${f.hito}  `, options: { bold: true, color: C.pur } }, { text: f.hitoN }], { x: rx, y: 6.15, w: rw, h: 0.5, fontSize: 13, align: 'center', valign: 'middle' });
  };
  phaseSlide(0, { title: 'Fase de Inicio', t: 60, kicker: '02', msg: 'En Inicio entendí el negocio y acordé qué construir. Está realizada.',
    exp: 'Analicé el sitio original con capturas, identifiqué a los interesados y las necesidades, y fijé el alcance y las exclusiones. El hito LCO significa que los objetivos y el alcance quedan acordados.',
    ej: 'La tienda vacía y la ficha sin consulta se documentaron en esta fase.', con: ['Visión', 'Stakeholders', 'Viabilidad', 'LCO'], preg: ['¿Qué se entrega al terminar Inicio?', 'La visión, el análisis del sitio original, el modelo del negocio y los riesgos iniciales.'] });
  phaseSlide(1, { title: 'Fase de Elaboración', t: 60, kicker: '02', msg: 'En Elaboración definí requisitos, modelé con UML y validé la arquitectura. Está realizada.',
    exp: 'Aquí se decide cómo será el sistema antes de construirlo: requisitos, casos de uso, diagramas, arquitectura y prototipos. La decisión clave fue rediseñar sobre la misma plataforma con un tema hijo. El hito LCA indica que la arquitectura está validada.',
    ej: 'Antes de construir se definió cómo serían la home, el catálogo, la ficha y el comparador, y cómo se conectarían con WooCommerce.', con: ['Requisitos', 'Casos de uso', 'Arquitectura', 'LCA'], preg: ['¿Por qué no reescribir la web desde cero?', 'Porque la plataforma ya tenía el catálogo y el equipo sabe usarla; rediseñar sobre ella es más barato y menos riesgoso.'] });
  phaseSlide(2, { title: 'Fase de Construcción', t: 65, kicker: '02', msg: 'En Construcción desarrollé la web renovada por incrementos. Está en curso: el rediseño funciona; las ampliaciones están planificadas.',
    exp: 'C1: identidad y home. C2: catálogo, fichas, búsqueda y comparador. C3: el recorrido de cotización con WhatsApp, Dónde comprar, Mayoristas y Soporte. Verifiqué cada incremento y lo documenté con capturas; las pruebas formales están planificadas.',
    ej: 'Se verificó que el comparador rechaza un cuarto producto y conserva la selección al cambiar de página.', con: ['Incremento', 'Integración', 'Verificación', 'IOC'], preg: ['¿Qué pruebas hizo?', 'Verificaciones funcionales documentadas con capturas. Las pruebas unitarias y de aceptación formales están planificadas, no ejecutadas.'] });
  phaseSlide(3, { title: 'Fase de Transición', t: 50, kicker: '02', msg: 'Transición es la entrega a Black Hawk: validar, publicar, capacitar y mantener. Está planificada.',
    exp: 'La web renovada funciona en un entorno de prueba; falta validarla con la empresa, publicarla en su dominio con respaldo previo y capacitar al gestor. El hito PR es la publicación del producto.',
    ej: 'Al publicarla en blackhawkcaraudio.com se podrá medir su uso con datos reales.', con: ['Aceptación', 'Despliegue', 'Capacitación', 'PR'], preg: ['¿Cuándo se considera terminado el proyecto?', 'Cuando Black Hawk acepta la web, se publica en su dominio y el gestor queda capacitado: el hito PR.'] });

  { // 13 Matriz
    const s = add({ title: 'Disciplinas, iteraciones y entregables', t: 60, kicker: '02 · Metodología RUP', msg: 'Esta matriz muestra qué se produjo en cada iteración y qué está realizado, en curso o planificado.',
      exp: 'Las columnas son las siete iteraciones; las filas, las disciplinas de ingeniería. Cada celda es el entregable principal. Se ve el carácter iterativo: requisitos y diseño aparecen varias veces, y la implementación empieza con un prototipo en Elaboración.',
      ej: 'C2 produjo el catálogo, la ficha y el comparador; C3 está en curso por las ampliaciones.', con: ['Iteración', 'Entregable', 'Estado'], preg: ['¿Por qué la implementación aparece en Elaboración?', 'Porque en RUP se construye un prototipo para validar la arquitectura antes de la construcción completa.'] });
    base(s, { kicker: '02 · Metodología RUP', title: 'Disciplinas × iteraciones: qué se entregó y qué falta' });
    const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.ink }, align: 'center' } });
    const rows = [[hdr('Disciplina'), ...V.ITER.map((it) => hdr(it.id))]];
    V.MATRIZ.forEach(([d_, cells]) => rows.push([{ text: d_, options: { bold: true } }, ...cells.map((c, j) => ({ text: c, options: { align: 'center', fill: c ? { color: V.ITER[j].e === 'Planificado' ? C.white : V.ITER[j].e === 'En curso' ? C.purL : 'F3F4F6' } : undefined, color: V.ITER[j].e === 'Planificado' ? C.mute : C.ink } }))]));
    rows.push([{ text: 'Estado', options: { bold: true, color: C.pur } }, ...V.ITER.map((it) => ({ text: it.e, options: { bold: true, align: 'center', color: it.e === 'Planificado' ? C.mute : C.pur } }))]);
    s.addTable(rows, { x: MX, y: 1.5, w: W - 2 * MX, colW: [2.2, ...Array(7).fill((W - 2 * MX - 2.2) / 7)], fontFace: F, fontSize: 10, rowH: 0.52, border: { type: 'solid', color: C.line, pt: 0.75 }, valign: 'middle' });
    text(s, 'Semanas: estimación académica (I1 S1–2 · E1–E2 S3–6 · C1–C3 S7–12 · T1 S13–14). C3 incluye el recorrido de cotización (desarrollado) y las ampliaciones (propuestas).', { x: MX, y: 6.55, w: W - 2 * MX, h: 0.4, fontSize: 10, color: C.mute });
  }

  // ═══════════ BLOQUE III — MODELADO
  { // 14 Requisitos
    const s = add({ title: 'Requisitos funcionales y no funcionales', t: 55, kicker: '03 · Modelado y diseño', msg: 'Los requisitos dicen qué hace la web renovada y con qué calidad; cada uno se enlaza con el catálogo completo.',
      exp: 'Funcionales: explorar, buscar, ver la ficha, comparar, cotizar y consultar dónde comprar ya están desarrollados; registrar la consulta, el directorio y los reportes son propuestos. No funcionales: celular, usabilidad, peso de página, idioma y datos personales.',
      ej: 'Requisito no funcional medido: la ficha del BH-SW12XXG pasó de 5,28 MB a 0,38 MB transferidos en escritorio.', con: ['Funcional', 'No funcional', 'Criterio de aceptación'], preg: ['¿Cómo se valida un requisito?', 'Con su criterio de aceptación: por ejemplo, el comparador debe rechazar un cuarto producto.'] });
    base(s, { kicker: '03 · Modelado y diseño', title: 'Requisitos principales' });
    card(s, MX, 1.5, 7.2, 5.1, C.paper);
    text(s, 'FUNCIONALES · qué hace el sistema', { x: MX + 0.3, y: 1.68, w: 6, h: 0.3, fontSize: 10.5, bold: true, color: C.pur, charSpacing: 1.5 });
    V.REQ_F.forEach(([t, e, c], i) => { const y = 2.08 + i * 0.63; tag(s, MX + 0.3, y + 0.05, e, 8.5); text(s, t, { x: MX + 1.75, y, w: 4.0, h: 0.55, fontSize: 12, bold: true, valign: 'middle' }); text(s, c, { x: MX + 5.85, y, w: 1.25, h: 0.55, fontSize: 9, color: C.mute, valign: 'middle', align: 'right' }); });
    card(s, 8.05, 1.5, W - MX - 8.05, 5.1, C.ink);
    text(s, 'NO FUNCIONALES · con qué calidad', { x: 8.3, y: 1.68, w: 4.5, h: 0.3, fontSize: 10.5, bold: true, color: C.purM, charSpacing: 1.5 });
    V.REQ_NF.forEach(([c, t, k], i) => { const y = 2.08 + i * 0.88; text(s, c, { x: 8.3, y, w: 3, h: 0.3, fontSize: 13.5, bold: true, color: C.white }); text(s, k, { x: 11.3, y, w: 1.2, h: 0.3, fontSize: 9, color: C.mute2, align: 'right' }); text(s, t, { x: 8.3, y: y + 0.32, w: 4.3, h: 0.5, fontSize: 11.5, color: C.mute2 }); });
    source(s, 'Catálogo completo en anexos: 27 funcionales y 13 no funcionales. Peso medido con Lighthouse (mediana de 3, 23-09-2026).');
  }
  diagSlide({ title: 'Diagrama de casos de uso', kicker: '03 · Modelado y diseño', t: 60, msg: 'Qué puede hacer cada actor con la web renovada.',
    exp: 'Los actores externos están a la izquierda y el gestor a la derecha; WhatsApp es un sistema externo. El cliente interesado hereda lo que hace el visitante. «Cotizar por WhatsApp» incluiría registrar la consulta, que es una ampliación propuesta.',
    ej: 'CU-05 Comparar productos y CU-08 Cotizar por WhatsApp ya funcionan en la web renovada.', con: ['Actor', 'Caso de uso', '«include»', '«extend»'], preg: ['¿Qué diferencia hay entre actor y usuario?', 'El actor es un rol: una misma persona puede ser visitante y luego cliente interesado. WhatsApp también es un actor, porque es un sistema externo.'] },
  DG + 'V3_01_casos_de_uso.png', [['Qué muestra', 'Quién usa el sistema y qué puede hacer con él.'], ['Cómo leerlo', 'Actores a los lados; óvalos = casos de uso; morado = propuesto.'], ['En Black Hawk', 'Visitante, cliente, distribuidor, gestor y WhatsApp como sistema externo.']], 9.2, 'Adaptado del diagrama D-02 del proyecto. Completo en DIAGRAMAS_UML.');
  diagSlide({ title: 'Diagrama de actividades', kicker: '03 · Modelado y diseño', t: 55, msg: 'Cómo avanza el recorrido comercial, paso a paso, y quién hace cada paso.',
    exp: 'Tres calles: el cliente, la web renovada y el área comercial o distribuidor. Las decisiones son rombos: si conoce el modelo, si quiere comparar, si tiene intención de compra. La acción en morado (registrar la consulta) es la ampliación.',
    ej: 'Si el cliente no conoce el modelo, explora y filtra el catálogo; si lo conoce, lo busca directamente.', con: ['Calle', 'Decisión', 'Flujo'], preg: ['¿Dónde termina el sistema?', 'Al abrir WhatsApp: la atención y la orientación al punto de venta ocurren fuera de la web.'] },
  DG + 'V3_02_actividades.png', [['Qué muestra', 'El proceso comercial completo, con decisiones.'], ['Cómo leerlo', 'Del punto negro al final; cada calle es un participante.'], ['En Black Hawk', 'La web guía hasta «Cotizar»; la venta se concreta con el área comercial.']], 6.6, 'Adaptado del diagrama D-16 del proyecto.');
  diagSlide({ title: 'Diagrama de secuencia', kicker: '03 · Modelado y diseño', t: 60, msg: 'Cómo interactúan los componentes cuando el cliente consulta un producto por WhatsApp.',
    exp: 'Se lee de arriba hacia abajo, en el orden de los mensajes. La ficha pide el producto a WooCommerce, arma el mensaje con el modelo y abre WhatsApp. El recuadro morado es la ampliación: registrar el inicio de la consulta sin demorar la apertura.',
    ej: 'El mensaje 8 arma «quiero cotizar el modelo BH-SW12XXG».', con: ['Línea de vida', 'Mensaje', 'Fragmento'], preg: ['¿El sistema guarda la conversación?', 'No. Solo abriría un registro del inicio (ampliación); la conversación ocurre en WhatsApp.'] },
  DG + 'V3_03_secuencia.png', [['Qué muestra', 'El orden de los mensajes entre los objetos.'], ['Cómo leerlo', 'De arriba abajo; flecha continua = llamada; discontinua = respuesta.'], ['En Black Hawk', 'Ficha → WooCommerce → mensaje → WhatsApp.']], 8.9, 'Adaptado del diagrama D-14 del proyecto.');
  diagSlide({ title: 'Diagrama de clases', kicker: '03 · Modelado y diseño', t: 55, msg: 'Cómo se estructura la información del sistema.',
    exp: 'El producto es el centro: pertenece a una o más categorías y se compone de especificaciones e imágenes. Las clases en morado son propuestas: el evento de consulta registra que se inició una consulta, y el distribuidor forma el directorio.',
    ej: 'Si se elimina el producto BH-SW12XXG, sus especificaciones desaparecen con él: eso es la composición.', con: ['Clase', 'Asociación', 'Multiplicidad', 'Composición'], preg: ['¿Qué significa 1..*?', 'Uno o más: cada producto pertenece al menos a una categoría.'] },
  DG + 'V3_04_clases.png', [['Qué muestra', 'Las entidades y cómo se relacionan.'], ['Cómo leerlo', 'Rombo negro = composición; números = multiplicidad.'], ['En Black Hawk', 'Producto, categoría y especificación ya existen en WooCommerce.']], 8.4, 'Adaptado del modelo de dominio D-07 del proyecto.');
  diagSlide({ title: 'Arquitectura y componentes', kicker: '03 · Modelado y diseño', t: 60, msg: 'Cómo está organizado técnicamente el sistema.',
    exp: 'El rediseño vive en el tema hijo: plantillas, páginas y el botón de WhatsApp. WooCommerce maneja los productos; YITH Catalog Mode oculta precio y carrito; todo corre sobre WordPress y MySQL. El módulo propio en morado alojaría las ampliaciones.',
    ej: 'Como el rediseño está en el tema hijo, actualizar WooCommerce no borra los cambios.', con: ['Componente', 'Dependencia', 'Tema hijo'], preg: ['¿Dónde está su desarrollo?', 'En el tema hijo rozer-child: plantillas, estilos, scripts del buscador y del comparador, y las páginas nuevas.'] },
  DG + 'V3_05_componentes.png', [['Qué muestra', 'Las piezas de software y cómo dependen entre sí.'], ['Cómo leerlo', 'Flecha discontinua = depende de; morado = propuesto.'], ['En Black Hawk', 'Tema hijo (rediseño) + WooCommerce + YITH + WordPress + MySQL; WhatsApp es externo.']], 8.9, 'Adaptado del diagrama D-19. Despliegue: diapositiva de respaldo.');

  // ═══════════ BLOQUE IV — RESULTADO: WEB RENOVADA
  { // 20 Sistema renovado
    const s = add({ title: 'El sistema renovado', t: 55, kicker: '04 · La solución', msg: 'Lo que entrego a Black Hawk es la web renovada: rediseño, catálogo y recorrido comercial sobre la misma plataforma.',
      exp: 'Hay que separar tres cosas: el sitio original (punto de partida), la web renovada que desarrollo (la solución) y las ampliaciones que propongo (lo que viene después).',
      ej: 'La web renovada está construida como tema hijo sobre WordPress y WooCommerce y ya funciona en un entorno de prueba.', con: ['Original', 'Renovado', 'Ampliaciones'], preg: ['¿Qué parte es su aporte?', 'El rediseño completo del sitio: identidad visual, catálogo, fichas, comparador y el recorrido de cotización. Las ampliaciones son propuestas.'] });
    base(s, { kicker: '04 · La solución', title: 'Qué sistema entrego a Black Hawk' });
    V.TRES.forEach((t, i) => {
      const x = MX + i * 4.1;
      card(s, x, 1.55, 3.9, 1.75, i === 1 ? C.pur : i === 2 ? C.purL : C.paper);
      text(s, `${t.k} · ${t.n}`, { x: x + 0.25, y: 1.7, w: 3.4, h: 0.4, fontSize: 17, bold: true, color: i === 1 ? C.white : C.ink });
      text(s, t.d, { x: x + 0.25, y: 2.15, w: 3.4, h: 0.8, fontSize: 12, color: i === 1 ? C.purL : C.mute });
      tag(s, x + 0.25, 2.9, t.estado);
      if (i < 2) arrow(s, x + 3.92, 2.42, x + 4.08, 2.42, C.pur);
    });
    img(s, 'img/v3-N-home.png', MX, 3.55, 6.2, 3.1, true);
    tag(s, MX + 0.1, 3.65, 'DESPUÉS');
    card(s, 7.1, 3.55, W - MX - 7.1, 3.1, C.ink);
    text(s, 'La web renovada', { x: 7.35, y: 3.75, w: 5, h: 0.4, fontSize: 18, bold: true, color: C.white });
    bullets(s, ['Rediseña la marca y la navegación', 'Ordena el catálogo y las fichas', 'Lleva cada producto a una consulta', 'Tema hijo sobre WordPress + WooCommerce', 'Funcionando en un entorno de prueba'], { x: 7.35, y: 4.25, w: 5.1, h: 2.3, fontSize: 13.5, color: C.white, gap: 7 });
  }

  const adSlide = async (n, pair, meta) => {
    const s = add(meta);
    base(s, { kicker: '04 · Antes y después', title: meta.visibleT });
    pair.forEach((p, r) => {
      const y = 1.5 + r * 2.72, portrait = p.n.includes('celular');
      text(s, p.n, { x: MX, y, w: 3, h: 0.3, fontSize: 13, bold: true, color: C.pur });
      const iw = portrait ? 1.15 : 3.2, gap = portrait ? 0.3 : 0.2;
      const a = img(s, p.antes, MX, y + 0.35, iw, 2.2, true); tag(s, a.x + 0.06, a.y + 0.06, 'ANTES', 8.5);
      const b = img(s, p.despues, MX + iw + gap, y + 0.35, iw, 2.2, true); tag(s, b.x + 0.06, b.y + 0.06, 'DESPUÉS', 8.5);
      const tx = MX + 2 * iw + gap + 0.35, tw = W - MX - tx;
      const rows = [['Antes', p.a], ['Necesidad', p.nec], ['Modificación', p.sol], ['Beneficio esperado', p.ben]];
      rows.forEach(([k, v], j) => {
        const yy = y + 0.35 + j * 0.56;
        text(s, k, { x: tx, y: yy, w: 1.45, h: 0.5, fontSize: 10.5, bold: true, color: j === 2 ? C.pur : C.ink });
        text(s, v, { x: tx + 1.5, y: yy, w: tw - 1.5, h: 0.54, fontSize: 11 });
      });
    });
    source(s, `Capturas reales: sitio original y web renovada, mismas vistas (1440 × 900 y 390 × 844 px), ${V.FECHA}.`);
  };
  await adSlide(8, V.ANTES_DESPUES.slice(0, 2), { title: 'Antes y después: home y catálogo', visibleT: 'Antes y después: home y catálogo', kicker: '04 · Antes y después', t: 70,
    msg: 'Comparo pantallas equivalentes: qué había, qué necesidad detecté, qué cambié y qué espero lograr.',
    exp: 'Home: la marca ahora tiene jerarquía y el encabezado siempre ofrece buscar y cotizar. Catálogo: «Productos» ya no lleva a una tienda vacía; muestra los 118 productos con pestañas, contador y filtros.',
    ej: 'En el sitio original, al pulsar «Productos» aparecía «Tienda» sin productos; en la web renovada, el catálogo muestra 118.', con: ['Jerarquía visual', 'Llamada a la acción', 'Catálogo'], preg: ['¿Cómo sabe que mejoró?', 'Por comparación directa de pantallas equivalentes. La mejora en uso se medirá con datos reales cuando se publique; no afirmo aumentos de ventas.'] });
  await adSlide(9, V.ANTES_DESPUES.slice(2, 4), { title: 'Antes y después: ficha y recorrido móvil', visibleT: 'Antes y después: ficha y celular', kicker: '04 · Antes y después', t: 70,
    msg: 'La ficha pasa de mostrar datos a llevar a una consulta, también en el celular.',
    exp: 'Antes la ficha terminaba en las especificaciones. Ahora tiene «Cotizar» junto al modelo, «Comparar» y, en el celular, una barra fija con el botón de cotización.',
    ej: 'En el celular, la ficha renovada del BH-SW12XXG muestra abajo «Cotizar · BH-SW12XXG» todo el tiempo.', con: ['Ficha', 'CTA', 'Diseño adaptable'], preg: ['¿Un clic en «Cotizar» es una venta?', 'No. Solo abre WhatsApp con el mensaje; la conversación y la venta ocurren fuera de la web.'] });

  { // 23 Flujo comercial
    const s = add({ title: 'Flujo comercial propuesto', t: 60, kicker: '04 · La solución', msg: 'El recorrido completo, desde el catálogo hasta la atención comercial, separando lo desarrollado de lo propuesto.',
      exp: 'La fila negra es lo que ya funciona en la web renovada. Debajo, en morado punteado, las ampliaciones: registrar el inicio de la consulta, un directorio estructurado y el seguimiento, que requiere un mecanismo adicional.',
      ej: 'El mensaje dice: «Hola Black Hawk, vengo de la web y quiero cotizar el modelo BH-SW12XXG».', con: ['Recorrido', 'CTA', 'Ampliación'], preg: ['¿El sistema sabe si el cliente compró?', 'No. Solo sabe que se abrió WhatsApp desde una página; el resultado requiere seguimiento manual u otra herramienta.'] });
    base(s, { kicker: '04 · La solución', title: 'Flujo comercial: del catálogo a la atención' });
    const steps = [['LuUser', 'Cliente'], ['LuLayoutGrid', 'Catálogo'], ['LuFileText', 'Producto'], ['LuGitCompare', 'Comparación'], ['LuMousePointerClick', '«Cotizar»'], ['LuMessageCircle', 'Dónde comprar / WhatsApp'], ['LuHeadset', 'Atención comercial']];
    const fw = 1.55, gap = (W - 2 * MX - 7 * fw) / 6;
    for (let i = 0; i < 7; i++) {
      const x = MX + i * (fw + gap), last = i === 6;
      card(s, x, 1.8, fw, 1.55, last ? C.paper : C.ink, last ? C.line : null);
      s.addImage({ data: await icon(steps[i][0], last ? C.pur : C.purM), x: x + fw / 2 - 0.22, y: 1.95, w: 0.44, h: 0.44 });
      text(s, steps[i][1], { x: x + 0.06, y: 2.5, w: fw - 0.12, h: 0.75, fontSize: 12.5, bold: true, align: 'center', color: last ? C.ink : C.white });
      if (i < 6) arrow(s, x + fw + 0.02, 2.57, x + fw + gap - 0.02, 2.57, C.pur);
    }
    text(s, 'Desarrollado en la web renovada', { x: MX, y: 3.45, w: 5, h: 0.3, fontSize: 11, bold: true });
    text(s, '(fuera de la web)', { x: MX + 6 * (fw + gap), y: 3.45, w: fw, h: 0.3, fontSize: 10, italic: true, color: C.mute, align: 'center' });
    const amp = [[4, 'Registrar el inicio de la consulta'], [5, 'Directorio estructurado de distribuidores'], [6, 'Seguimiento y reportes (requiere un mecanismo adicional)']];
    amp.forEach(([i, t]) => {
      const x = MX + i * (fw + gap);
      arrow(s, x + fw / 2, 3.8, x + fw / 2, 4.25, C.pur, 'dash');
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 4.3, w: fw, h: 1.25, rectRadius: 0.08, fill: { color: C.purL }, line: { color: C.pur, width: 1, dashType: 'dash' } });
      text(s, t, { x: x + 0.08, y: 4.3, w: fw - 0.16, h: 1.25, fontSize: 11, bold: true, align: 'center', valign: 'middle' });
    });
    text(s, 'Ampliaciones propuestas', { x: MX + 4 * (fw + gap), y: 5.65, w: 5, h: 0.3, fontSize: 11, bold: true, color: C.pur });
    card(s, MX, 4.3, 4 * (fw + gap) - 0.35, 2.25, C.paper);
    text(s, 'Mensaje que genera la web renovada', { x: MX + 0.25, y: 4.45, w: 6, h: 0.3, fontSize: 11, bold: true, color: C.pur });
    text(s, '«Hola Black Hawk, vengo de la web y quiero cotizar el modelo BH-SW12XXG.»', { x: MX + 0.25, y: 4.85, w: 6.3, h: 0.6, fontSize: 15, bold: true });
    text(s, 'El clic abre una conversación: no equivale a una venta ni a una cotización aceptada.', { x: MX + 0.25, y: 5.6, w: 6.3, h: 0.7, fontSize: 12, italic: true, color: C.mute });
  }

  { // 24 Funcionalidades
    const s = add({ title: 'Funcionalidades principales', t: 55, kicker: '04 · La solución', msg: 'Cinco grupos de funciones: cuatro desarrollados en el rediseño y uno propuesto.',
      exp: 'No enumero módulos sueltos: agrupo por lo que resuelven. La administración usa el panel de WordPress y WooCommerce, que ya existía, sin programar uno nuevo.',
      ej: 'El comparador admite hasta 3 modelos y guarda la selección en el navegador durante 24 horas.', con: ['Rediseño', 'Catálogo', 'Recorrido comercial'], preg: ['¿Qué funciones siguen pendientes?', 'El registro de consultas, el directorio estructurado, los reportes y la auditoría: son ampliaciones propuestas.'] });
    base(s, { kicker: '04 · La solución', title: 'Funcionalidades principales' });
    const ic = ['LuPalette', 'LuLayoutGrid', 'LuMessageCircle', 'LuSettings', 'LuSparkles'];
    const cw = (W - 2 * MX - 4 * 0.18) / 5;
    for (let i = 0; i < 5; i++) {
      const f = V.FUNCIONES[i], x = MX + i * (cw + 0.18), prop = f.e === 'Propuesto';
      card(s, x, 1.6, cw, 4.95, prop ? C.purL : i === 2 ? C.ink : C.paper);
      await iconCircle(s, ic[i], x + 0.2, 1.8, 0.6, prop || i === 2 ? C.white : C.white, C.pur);
      text(s, `${f.k} · ${f.n}`, { x: x + 0.2, y: 2.55, w: cw - 0.35, h: 0.65, fontSize: 14.5, bold: true, color: i === 2 ? C.white : C.ink });
      tag(s, x + 0.2, 3.25, f.e, 8.5);
      bullets(s, f.items, { x: x + 0.2, y: 3.75, w: cw - 0.35, h: 2.7, fontSize: 11.5, gap: 7, color: i === 2 ? C.white : C.ink });
    }
  }

  // ═══════════ BLOQUE V — RESULTADOS
  { // 25 Resultado
    const s = add({ title: 'Resultado visual y funcional', t: 60, kicker: '05 · Resultados', msg: 'La web renovada ya resuelve las tres necesidades iniciales; las ampliaciones las completarían.',
      exp: 'Guiar al contacto: «Cotizar» en encabezado y ficha. Catálogo claro: 118 productos con filtros y comparador. Marca moderna: identidad nueva y diseño adaptable. Además, las páginas son más livianas.',
      ej: 'La ficha del BH-SW12XXG transfiere 0,38 MB en lugar de 5,28 MB.', con: ['Resultado', 'Evidencia', 'Medición'], preg: ['¿Aumentaron las ventas?', 'No lo sé ni lo afirmo: la web aún no está publicada. Se medirá con datos reales después.'] });
    base(s, { kicker: '05 · Resultados', title: 'Resultado: la web renovada' });
    const g = [['img/v3-N-shop.png', 'Catálogo'], ['img/v3-N-ficha.png', 'Ficha con «Cotizar»'], [EV + 'interactions/N-cmp-04-open-d.png', 'Comparador (23-09-2026)'], ['img/v3-N-distribuidores.png', 'Dónde comprar']];
    g.forEach(([f, l], i) => { const x = MX + (i % 2) * 3.55, y = 1.5 + Math.floor(i / 2) * 2.55; img(s, f, x, y, 3.4, 2.12, true); text(s, l, { x, y: y + 2.15, w: 3.4, h: 0.25, fontSize: 10.5, bold: true }); });
    const rx = 8.0, rw = W - MX - rx;
    V.NECESIDADES.forEach((n, i) => { const y = 1.5 + i * 1.12; card(s, rx, y, rw, 1.0, C.paper); text(s, n.t, { x: rx + 0.2, y: y + 0.1, w: rw - 0.4, h: 0.3, fontSize: 12.5, bold: true, color: C.pur }); text(s, ['«Cotizar» en encabezado y ficha; WhatsApp con el modelo', '118 productos, filtros, fichas en lista y comparador', 'Identidad renovada, diseño adaptable y páginas propias'][i], { x: rx + 0.2, y: y + 0.42, w: rw - 0.4, h: 0.55, fontSize: 11.5 }); });
    card(s, rx, 4.9, rw, 1.65, C.ink);
    text(s, 'MEDIDO (LIGHTHOUSE, 23-09-2026)', { x: rx + 0.2, y: 5.0, w: rw - 0.4, h: 0.25, fontSize: 9.5, bold: true, color: C.purM, charSpacing: 1 });
    V.MEDICIONES.forEach(([k, a, b], i) => { text(s, k, { x: rx + 0.2, y: 5.3 + i * 0.4, w: rw - 1.9, h: 0.38, fontSize: 10, color: C.mute2 }); text(s, `${a} → ${b}`, { x: rx + rw - 1.75, y: 5.3 + i * 0.4, w: 1.6, h: 0.38, fontSize: 11, bold: true, color: C.white, align: 'right' }); });
    source(s, 'Capturas reales de la web renovada. Peso y peticiones son comparables; los tiempos no, porque las dos webs usan servidores distintos.');
  }

  { // 26 Conclusiones y próximos pasos
    const s = add({ title: 'Conclusiones y próximos pasos', t: 60, kicker: '05 · Cierre', msg: 'Comprendí el negocio, desarrollé una solución real y la organicé con RUP y UML.',
      exp: 'Punto de partida: había plataforma, pero no guiaba a la venta. Solución: la web renovada rediseña marca, catálogo y recorrido. Metodología: RUP con Inicio y Elaboración realizados, Construcción avanzada y Transición planificada.',
      ej: 'Próximo paso inmediato: validar la web renovada con Black Hawk y publicarla en su dominio.', con: ['Necesidad', 'Solución', 'RUP'], preg: ['¿Qué haría después?', 'Validar con la empresa, publicar, medir con datos reales e implementar el registro de consultas y el directorio.'] });
    base(s, { kicker: '05 · Cierre', title: 'Conclusiones y próximos pasos', dark: true });
    V.CONCLUSIONES.forEach(([k, t], i) => { const x = MX + i * 4.1; text(s, `0${i + 1}`, { x, y: 1.6, w: 1, h: 0.6, fontSize: 28, bold: true, color: C.purM }); text(s, k, { x, y: 2.25, w: 3.8, h: 0.4, fontSize: 17, bold: true, color: C.white }); text(s, t, { x, y: 2.7, w: 3.8, h: 1.7, fontSize: 13, color: C.mute2 }); });
    card(s, MX, 4.6, W - 2 * MX, 1.95, C.ink2);
    text(s, 'PRÓXIMOS PASOS', { x: MX + 0.3, y: 4.75, w: 4, h: 0.3, fontSize: 10.5, bold: true, color: C.purM, charSpacing: 2 });
    V.PROXIMOS.forEach((p, i) => { const x = MX + 0.3 + i * 3.0; text(s, String(i + 1), { x, y: 5.15, w: 0.5, h: 0.5, fontSize: 22, bold: true, color: C.pur }); text(s, p, { x: x + 0.45, y: 5.18, w: 2.4, h: 1.2, fontSize: 12.5, color: C.white }); });
  }

  { // 27 Preguntas
    const s = add({ title: 'Preguntas', t: 10, msg: 'Abrimos la ronda de preguntas.', exp: 'Escuchar la pregunta completa antes de responder.', ej: '—', con: [], preg: ['', ''] });
    s.background = { color: C.ink };
    s.addImage({ path: 'research/logo-w-t.png', x: W / 2 - 1.1, y: 1.7, w: 2.2, h: 1.17 });
    text(s, '¿Preguntas?', { x: 0, y: 3.3, w: W, h: 1.2, fontSize: 54, bold: true, color: C.white, align: 'center' });
    text(s, 'Web renovada de Black Hawk · Aplicación de RUP', { x: 0, y: 4.6, w: W, h: 0.5, fontSize: 16, color: C.mute2, align: 'center' });
  }

  diagSlide({ title: 'Respaldo: diagrama de despliegue', kicker: 'Respaldo', t: 0, msg: 'Diapositiva de respaldo: dónde se ejecuta el sistema.',
    exp: 'Úsala solo si preguntan por la infraestructura: el navegador del cliente, el servidor web con WordPress y la base de datos, el entorno de prueba y los respaldos.',
    ej: 'La web renovada hoy corre en un entorno de prueba; la Transición la llevará al servidor de producción.', con: ['Nodo', 'Artefacto'], preg: ['¿Dónde se aloja?', 'En el hosting actual de Black Hawk, sobre el mismo WordPress; el entorno de prueba sirve para validar antes de publicar.'] },
  DG + 'D20_despliegue.png', [['Qué muestra', 'Nodos físicos y conexiones.'], ['Cómo leerlo', 'Cajas 3D = nodos; morado = propuesto.'], ['En Black Hawk', 'Servidor web con WordPress y base de datos; staging antes de producción.']], 8.3, 'Diagrama D-20 del proyecto.');

  await pres.writeFile({ fileName: '../BLACK_HAWK_RUP_PRESENTACION_V3.pptx' });
  META.forEach((m, i) => { m.n = i + 1; });
  fs.writeFileSync('slides_v3.json', JSON.stringify(META, null, 1));
  console.log('ok', META.length, 'diapositivas', Math.round(META.reduce((a, b) => a + b.t, 0) / 60), 'min');
})();
