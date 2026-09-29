// Genera BLACK_HAWK_RUP_PRESENTACION.pptx y slides_meta.json (base de la guía de exposición).
const fs = require('fs');
const pptxgen = require('pptxgenjs');
const React = require('react');
const RDS = require('react-dom/server');
const sharp = require('sharp');
const lu = require('react-icons/lu');
const M = require('./model');
const { pngSize } = require('./docxlib');

const C = { ink: '0B0B0D', ink2: '1A1B1F', white: 'FFFFFF', paper: 'F5F5F7', line: 'E3E4E8', mute: '6B7280', mute2: '9CA3AF', pur: '6D28D9', purL: 'EDE4FB', purM: 'A78BFA', wa: '25D366' };
const F = 'Arial';
const W = 13.333, H = 7.5, MX = 0.6;
const DG = '../DIAGRAMAS_UML/png/';

const ICONS = {};
async function icon(name, color) {
  const key = name + color;
  if (ICONS[key]) return ICONS[key];
  const svg = RDS.renderToStaticMarkup(React.createElement(lu[name], { color: '#' + color, size: 256 }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  ICONS[key] = 'image/png;base64,' + buf.toString('base64');
  return ICONS[key];
}

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'Aplicación de RUP — SGCD-BH Black Hawk';
pres.author = 'Equipo del proyecto SGCD-BH';
const META = [];

// ───── helpers
function base(s, { kicker, title, dark = false, sub }) {
  if (title) META[META.length - 1].visible = title;
  s.background = { color: dark ? C.ink : C.white };
  if (kicker) s.addText(kicker.toUpperCase(), { x: MX, y: 0.38, w: 9, h: 0.3, fontFace: F, fontSize: 11, bold: true, color: dark ? C.purM : C.pur, charSpacing: 3, margin: 0, isTextBox: true });
  if (title) s.addText(title, { x: MX, y: 0.68, w: W - 2 * MX, h: 0.75, fontFace: F, fontSize: 30, bold: true, color: dark ? C.white : C.ink, margin: 0, valign: 'top', isTextBox: true });
  if (sub) s.addText(sub, { x: MX, y: 1.4, w: W - 2 * MX, h: 0.45, fontFace: F, fontSize: 15, color: dark ? C.mute2 : C.mute, margin: 0, valign: 'top', isTextBox: true });
  const n = META.length;
  s.addText(`SGCD-BH · RUP   ${n}`, { x: W - 3.2, y: H - 0.42, w: 2.6, h: 0.25, fontFace: F, fontSize: 9, color: dark ? C.mute : C.mute2, align: 'right', margin: 0, isTextBox: true });
}
function text(s, t, o) { s.addText(t, { fontFace: F, fontSize: 15, color: C.ink, margin: 0, valign: 'top', isTextBox: true, ...o }); }
function card(s, x, y, w, h, { fill = C.paper, line } = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: line ? { color: line, width: 1 } : { type: 'none' }, rectRadius: 0.08 });
}
function pill(s, x, y, label, kind) {
  const prop = kind === 'PRO', part = kind === 'PAR' || kind === 'PEN';
  const w = 0.2 + label.length * 0.085;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.28, rectRadius: 0.14, fill: { color: prop ? C.pur : part ? C.purL : C.white }, line: { color: prop ? C.pur : part ? C.purM : C.ink, width: 0.75 } });
  s.addText(label, { x, y, w, h: 0.28, fontFace: F, fontSize: 9.5, bold: true, color: prop ? C.white : C.ink, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
  return w;
}
function img(s, file, x, y, w, h, align = 'center') {
  const { w: pw, h: ph } = pngSize(file);
  let iw = w, ih = w * ph / pw;
  if (ih > h) { ih = h; iw = h * pw / ph; }
  const ix = align === 'left' ? x : x + (w - iw) / 2;
  s.addImage({ path: file, x: ix, y: y + (h - ih) / 2, w: iw, h: ih });
  return { x: ix, y: y + (h - ih) / 2, w: iw, h: ih };
}
async function iconCircle(s, name, x, y, d = 0.62, fill = C.purL, color = C.pur) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: 'none' } });
  s.addImage({ data: await icon(name, color), x: x + d * 0.24, y: y + d * 0.24, w: d * 0.52, h: d * 0.52 });
}
function add(meta) { const s = pres.addSlide(); META.push(meta); s.addNotes(meta.oral); return s; }
function source(s, t, dark) { text(s, t, { x: MX, y: H - 0.45, w: 9, h: 0.3, fontSize: 9, color: dark ? C.mute : C.mute2 }); }
function diagSlide(meta, file, caption, opt = {}) {
  const s = add(meta);
  base(s, { kicker: meta.kicker, title: meta.title });
  const top = 1.5, bottom = H - 0.55;
  if (opt.side) {
    img(s, file, MX, top, opt.imgW || 8.6, bottom - top);
    const sx = MX + (opt.imgW || 8.6) + 0.35, sw = W - MX - sx;
    card(s, sx, top, sw, bottom - top, { fill: C.paper });
    text(s, opt.side.map((t, i) => ({ text: t, options: { breakLine: i < opt.side.length - 1, paraSpaceAfter: 8, bullet: opt.noBullet ? false : { code: '25A0' } } })), { x: sx + 0.25, y: top + 0.25, w: sw - 0.45, h: bottom - top - 0.5, fontSize: 13.5, color: C.ink });
  } else {
    img(s, file, MX, top, W - 2 * MX, bottom - top - 0.1);
  }
  if (caption) source(s, caption);
  return s;
}

(async () => {
  // Pre-render icons
  const I = async (n, c = C.pur) => icon(n, c);

  // 1 ─ Portada
  {
    const s = add({ n: 1, title: 'Portada', kicker: '', t: 40,
      obj: 'Presentar el tema, el caso de estudio y al equipo.',
      oral: 'Buenos días. Nuestro proyecto aplica la metodología RUP para analizar, diseñar y planificar un sistema de información web para Black Hawk Car Audio, una marca peruana de audio para autos. Lo llamamos SGCD-BH: Sistema de Gestión de Catálogo y Distribuidores Black Hawk. No vamos a explicar RUP en abstracto; vamos a mostrar cómo cada fase y cada diagrama se aplican a este caso concreto.',
      conceptos: ['RUP', 'SGCD-BH', 'Caso de estudio real'], trans: 'Primero les muestro cómo está organizada la exposición.' });
    s.background = { color: C.ink };
    s.addImage({ path: '../../assets/images/brand/subwoofer-960.jpg', x: 6.35, y: 0, w: 6.983, h: 7.5, sizing: { type: 'cover', w: 6.983, h: 7.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 6.35, y: 0, w: 6.983, h: 7.5, fill: { color: C.ink, transparency: 35 }, line: { type: 'none' } });
    s.addImage({ path: 'research/logo-w-t.png', x: MX, y: 0.6, w: 1.5, h: 0.8 });
    text(s, 'DISEÑO DE SISTEMAS DE INFORMACIÓN', { x: MX, y: 1.85, w: 5.6, h: 0.3, fontSize: 11, bold: true, color: C.purM, charSpacing: 3 });
    text(s, 'Aplicación de RUP a un sistema web para Black Hawk Car Audio', { x: MX, y: 2.25, w: 5.6, h: 2.2, fontSize: 32, bold: true, color: C.white });
    text(s, 'SGCD-BH · Sistema de Gestión de Catálogo y Distribuidores Black Hawk', { x: MX, y: 4.5, w: 5.5, h: 0.7, fontSize: 15, color: C.mute2 });
    text(s, [{ text: 'Integrantes: [nombres del equipo]', options: { breakLine: true } }, { text: 'Docente: [nombre del docente]', options: { breakLine: true } }, { text: '[Institución] · [Ciudad], 2026' }], { x: MX, y: 5.7, w: 5.5, h: 1.0, fontSize: 12, color: C.mute2, paraSpaceAfter: 4 });
  }

  // 2 ─ Índice
  {
    const s = add({ n: 2, title: 'Contenido', kicker: 'Agenda', t: 30,
      obj: 'Dar el mapa de la exposición.',
      oral: 'La exposición tiene cinco bloques. Primero, el caso Black Hawk y el problema. Segundo, qué es RUP. Tercero, cómo aplicamos las cuatro fases al caso. Cuarto, los modelos UML que produjimos. Y quinto, la planificación, los riesgos, la trazabilidad y las conclusiones.',
      conceptos: ['Estructura de la exposición'], trans: 'Empecemos por conocer a la empresa.' });
    base(s, { kicker: 'Agenda', title: 'Cinco bloques, un mismo sistema' });
    const b = [['01', 'El caso Black Hawk', 'Empresa, plataforma, problema y propuesta'], ['02', 'Metodología RUP', 'Características, fases y disciplinas'], ['03', 'Aplicación a Black Hawk', 'Inicio, Elaboración, Construcción, Transición'], ['04', 'Modelado UML', 'Casos de uso, clases, secuencia, actividades, arquitectura'], ['05', 'Gestión y resultados', 'Cronograma, riesgos, trazabilidad y conclusiones']];
    b.forEach(([n, t, d], i) => {
      const x = MX + i * 2.45;
      card(s, x, 2.0, 2.25, 4.3, { fill: i === 2 ? C.ink : C.paper });
      text(s, n, { x: x + 0.25, y: 2.25, w: 1.6, h: 0.8, fontSize: 36, bold: true, color: i === 2 ? C.purM : C.pur });
      text(s, t, { x: x + 0.25, y: 3.35, w: 1.85, h: 0.9, fontSize: 17, bold: true, color: i === 2 ? C.white : C.ink });
      text(s, d, { x: x + 0.25, y: 4.35, w: 1.85, h: 1.6, fontSize: 12.5, color: i === 2 ? C.mute2 : C.mute });
    });
  }

  // 3 ─ Black Hawk
  {
    const s = add({ n: 3, title: 'Presentación de Black Hawk', kicker: '01 · El caso', t: 50,
      obj: 'Presentar a la empresa y su modelo comercial.',
      oral: 'Black Hawk es una marca de audio automotriz orientada al mercado peruano: amplificadores, subwoofers, procesadores, componentes, cargadores. Algunos modelos de referencia de nuestro caso son el procesador BH-4.8DSP, el subwoofer BH-SW12XZP o los amplificadores de la línea FR. Un detalle clave: la web no vende. No hay precios ni carrito. Funciona como catálogo, y la compra se concreta después, con el equipo comercial o un distribuidor. Esa decisión de negocio condiciona todo el diseño.',
      conceptos: ['Modelo de catálogo', 'Sin venta en línea', 'Red de distribuidores'], trans: 'Veamos sobre qué plataforma funciona hoy.' });
    base(s, { kicker: '01 · El caso', title: 'Black Hawk Car Audio' });
    s.addImage({ path: '../../assets/images/brand/amplificadores-960.jpg', x: 6.9, y: 1.55, w: 5.83, h: 3.26 });
    source(s, 'Imagen: sitio oficial de Black Hawk. Cifras: evidencia archivada del rediseño (23-09-2026).');
    const st = [['12', 'categorías de producto'], ['118', 'productos en el rediseño (110 en el sitio oficial)'], ['0', 'pagos en línea: la web es un catálogo']];
    st.forEach(([n, l], i) => {
      text(s, n, { x: MX, y: 1.6 + i * 1.45, w: 1.8, h: 0.9, fontSize: 48, bold: true, color: i === 2 ? C.pur : C.ink });
      text(s, l, { x: MX + 1.9, y: 1.85 + i * 1.45, w: 4.1, h: 0.8, fontSize: 16, color: C.mute });
    });
    text(s, 'Modelos de referencia: BH-4.8DSP · BH-SW12XZP · FR 1500.1 · FR 2000.1 · FR 3000.1 · FR 15000.1 · FR 40000.1 · BH-70CHR · BH-200CHR · BH-605BN PRO', { x: 6.9, y: 5.05, w: 5.83, h: 1.0, fontSize: 12.5, color: C.ink });
    text(s, 'No se transcriben especificaciones técnicas: un dato sin fuente se muestra como «Pendiente de verificación».', { x: 6.9, y: 6.0, w: 5.83, h: 0.6, fontSize: 11.5, italic: true, color: C.mute });
  }

  // 4 ─ Contexto: plataforma y flujo
  {
    const s = add({ n: 4, title: 'Contexto empresarial y plataforma', kicker: '01 · El caso', t: 60,
      obj: 'Explicar la plataforma existente y el flujo comercial.',
      oral: 'La plataforma ya existe: WordPress con WooCommerce, un tema hijo propio y el plugin YITH Catalog Mode, que oculta precio, carrito y pago. El flujo comercial tiene ocho pasos: el cliente entra al catálogo, busca, revisa la ficha técnica, compara si lo necesita, va a «Dónde comprar», llega a los distribuidores y termina en WhatsApp con un mensaje que incluye su intención, el modelo y, en nuestra propuesta, la URL del producto. Hay que notar dónde termina el sistema: en WhatsApp la conversación ya ocurre fuera.',
      conceptos: ['WordPress + WooCommerce', 'YITH Catalog Mode', 'Flujo de 8 pasos'], trans: 'Con este contexto, ¿cuál es el problema?' });
    base(s, { kicker: '01 · El caso', title: 'Una plataforma de catálogo que termina en WhatsApp' });
    const stack = ['WordPress', 'WooCommerce', 'Tema hijo', 'YITH Catalog Mode'];
    stack.forEach((t, i) => { card(s, MX + i * 3.06, 1.65, 2.86, 0.62, { fill: i === 3 ? C.purL : C.paper }); text(s, t, { x: MX + i * 3.06, y: 1.65, w: 2.86, h: 0.62, fontSize: 15, bold: true, align: 'center', valign: 'middle' }); });
    const flow = ['Ingresa al catálogo', 'Busca o selecciona', 'Consulta la ficha', 'Compara modelos', '«Dónde comprar»', 'Directorio de distribuidores', 'Contacto por WhatsApp', 'Mensaje: intención + modelo + URL'];
    const fw = (W - 2 * MX - 7 * 0.14) / 8;
    for (let i = 0; i < 8; i++) {
      const x = MX + i * (fw + 0.14);
      const last = i >= 6;
      s.addShape(pres.shapes.CHEVRON, { x, y: 3.0, w: fw + 0.12, h: 1.25, fill: { color: last ? C.pur : i === 5 ? C.purL : C.ink }, line: { type: 'none' } });
      text(s, String(i + 1), { x: x + 0.3, y: 3.0, w: fw - 0.4, h: 1.25, fontSize: 22, bold: true, color: i === 5 ? C.pur : C.white, align: 'center', valign: 'middle' });
      text(s, flow[i], { x, y: 4.45, w: fw + 0.05, h: 0.9, fontSize: 12, align: 'center', color: C.ink });
    }
    card(s, MX, 5.6, W - 2 * MX, 0.95, { fill: C.paper });
    text(s, [{ text: 'No hay checkout: ', options: { bold: true } }, { text: 'carrito, pago y wishlist no forman parte del flujo principal. El paso 6 (directorio) y la URL del paso 8 son ampliaciones propuestas; hoy «Dónde comprar» deriva directamente a WhatsApp.' }], { x: MX + 0.3, y: 5.72, w: W - 2 * MX - 0.6, h: 0.75, fontSize: 13.5, valign: 'middle' });
  }

  // 5 ─ Problema
  {
    const s = add({ n: 5, title: 'Problema identificado', kicker: '01 · El caso', t: 60,
      obj: 'Formular el problema con sus causas y efectos.',
      oral: 'El problema no es que falte una web: la web existe. El problema es que la información de productos y la derivación de compradores hacia los distribuidores no están estructuradas ni son trazables. Las causas: fichas con especificaciones incompletas, no hay directorio de puntos de venta y, sobre todo, WhatsApp se abre fuera del sitio sin dejar registro. Los efectos: el cliente no siempre encuentra datos fiables, la empresa no sabe qué productos generan interés y existe riesgo de publicar datos erróneos. Distinguimos lo observado en la evidencia de lo que es un supuesto académico.',
      conceptos: ['Árbol de problemas', 'Trazabilidad de consultas', 'Observado frente a supuesto'], trans: 'Por eso separamos claramente qué existe y qué proponemos.' });
    base(s, { kicker: '01 · El caso', title: 'El problema no es la web: es el dato y la derivación' });
    const eff = ['El cliente no siempre encuentra datos fiables', 'Consultas sin el modelo correcto', 'No se sabe qué productos generan interés'];
    const cau = [['Especificaciones incompletas', 'Observado'], ['Sin directorio de puntos de venta', 'Observado'], ['WhatsApp abre fuera, sin registro', 'Supuesto académico']];
    text(s, 'EFECTOS', { x: MX, y: 1.6, w: 2, h: 0.3, fontSize: 10, bold: true, color: C.mute, charSpacing: 2 });
    eff.forEach((t, i) => { card(s, MX + i * 4.1, 1.95, 3.9, 0.85, { fill: C.paper }); text(s, t, { x: MX + i * 4.1 + 0.2, y: 1.95, w: 3.5, h: 0.85, fontSize: 14, valign: 'middle' }); });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: MX, y: 3.2, w: W - 2 * MX, h: 1.1, fill: { color: C.pur }, line: { type: 'none' }, rectRadius: 0.08 });
    text(s, 'La información de productos y la derivación de compradores a distribuidores no están estructuradas ni son trazables', { x: MX + 0.3, y: 3.2, w: W - 2 * MX - 0.6, h: 1.1, fontSize: 19, bold: true, color: C.white, valign: 'middle', align: 'center' });
    text(s, 'CAUSAS', { x: MX, y: 4.65, w: 2, h: 0.3, fontSize: 10, bold: true, color: C.mute, charSpacing: 2 });
    cau.forEach(([t, e], i) => { card(s, MX + i * 4.1, 5.0, 3.9, 1.25, { fill: C.white, line: C.line }); text(s, t, { x: MX + i * 4.1 + 0.2, y: 5.1, w: 3.5, h: 0.6, fontSize: 14, bold: true }); pill(s, MX + i * 4.1 + 0.2, 5.8, e, e === 'Observado' ? 'EXI' : 'PAR'); });
    source(s, 'Árbol completo: monografía, Figura 1. Evidencia: sitio oficial (29-09-2026) y rediseño archivado (23-09-2026).');
  }

  // 6 ─ Qué existe y qué se propone
  {
    const s = add({ n: 6, title: 'Qué existe y qué se propone', kicker: '01 · El caso', t: 60,
      obj: 'Distinguir lo conocido, lo problemático, lo propuesto y su estado.',
      oral: 'Esta diapositiva es importante para ser honestos con el alcance. En la columna A está lo que ya existe y se puede verificar: catálogo, búsqueda, comparador de hasta tres modelos, botón Cotizar con el modelo escrito. En B, los problemas del caso. En C, lo que proponemos nosotros. Y en D, el estado: usamos cinco etiquetas, desde «existente verificado» hasta «propuesto». Así nadie confunde el diseño con algo ya implementado.',
      conceptos: ['Existente frente a propuesto', 'Cinco estados de implementación'], trans: 'Con eso claro, estos son nuestros objetivos.' });
    base(s, { kicker: '01 · El caso', title: 'Cuatro columnas para no confundir diseño con realidad' });
    const cols = [
      ['A · Conocido', ['Catálogo en 12 categorías', 'Búsqueda con sugerencias', 'Comparador de hasta 3 modelos', 'Cotizar: WhatsApp con el modelo', 'Formulario de mayoristas'], C.paper],
      ['B · Problema', ['Especificaciones heterogéneas', 'Sin directorio de distribuidores', 'Consultas sin registro', 'Sin auditoría de cambios', 'Staging temporal inestable'], C.paper],
      ['C · Propuesta', ['Estado de verificación por dato', 'Directorio de distribuidores', 'Registro y seguimiento de consultas', 'Reportes y auditoría', 'Roles, 2FA y respaldos'], C.purL],
    ];
    cols.forEach(([t, items, fill], i) => {
      const x = MX + i * 3.1;
      card(s, x, 1.65, 2.9, 4.95, { fill });
      text(s, t, { x: x + 0.25, y: 1.85, w: 2.5, h: 0.4, fontSize: 16, bold: true, color: i === 2 ? C.pur : C.ink });
      text(s, items.map((it, k) => ({ text: it, options: { breakLine: k < items.length - 1, bullet: { code: '25A0' }, paraSpaceAfter: 10 } })), { x: x + 0.25, y: 2.4, w: 2.5, h: 4.0, fontSize: 13.5 });
    });
    const x4 = MX + 3 * 3.1;
    card(s, x4, 1.65, W - MX - x4, 4.95, { fill: C.ink });
    text(s, 'D · Estado', { x: x4 + 0.25, y: 1.85, w: 2.8, h: 0.4, fontSize: 16, bold: true, color: C.white });
    const est = [['Existente (verificado)', 'EXI'], ['Nativo de la plataforma', 'BASE'], ['Parcial', 'PAR'], ['Pendiente de validación', 'PEN'], ['Propuesto (académico)', 'PRO']];
    est.forEach(([l, k], i) => pill(s, x4 + 0.25, 2.5 + i * 0.72, l, k));
    text(s, `De 27 RF: ${M.RF.filter((r) => r.e === 'EXI').length} existentes, ${M.RF.filter((r) => r.e === 'BASE').length} nativos, ${M.RF.filter((r) => r.e === 'PAR').length} parciales, ${M.RF.filter((r) => r.e === 'PEN').length} pendientes, ${M.RF.filter((r) => r.e === 'PRO').length} propuestos.`, { x: x4 + 0.25, y: 6.0, w: W - MX - x4 - 0.45, h: 0.5, fontSize: 11, color: C.mute2 });
  }

  // 7 ─ Objetivos
  {
    const s = add({ n: 7, title: 'Objetivos del proyecto', kicker: '01 · El caso', t: 50,
      obj: 'Presentar el objetivo general y los específicos.',
      oral: 'El objetivo general es aplicar RUP para analizar, diseñar y planificar el SGCD-BH: un sistema que centraliza el catálogo, facilita consultar y comparar, conecta con los distribuidores y permite dar seguimiento a las consultas. Los objetivos específicos siguen las disciplinas de RUP: modelar el negocio, especificar requisitos, modelar casos de uso, diseñar la arquitectura, producir los diagramas UML, planificar y asegurar la trazabilidad.',
      conceptos: ['Objetivo general', 'Objetivos específicos alineados con disciplinas'], trans: '¿Y qué sistema proponemos exactamente?' });
    base(s, { kicker: '01 · El caso', title: 'Objetivos' });
    card(s, MX, 1.6, 4.6, 5.0, { fill: C.ink });
    text(s, 'OBJETIVO GENERAL', { x: MX + 0.35, y: 1.9, w: 4, h: 0.3, fontSize: 10, bold: true, color: C.purM, charSpacing: 2 });
    text(s, 'Aplicar RUP para analizar, diseñar y planificar el SGCD-BH: centralizar el catálogo, facilitar la consulta y la comparación, conectar con los distribuidores y dar seguimiento a las consultas.', { x: MX + 0.35, y: 2.35, w: 3.9, h: 3.8, fontSize: 18, color: C.white });
    const esp = [['LuWorkflow', 'Modelar el negocio y sus actores'], ['LuListChecks', 'Especificar RF y RNF con criterios de aceptación'], ['LuUsers', 'Modelar y especificar los casos de uso'], ['LuLayers', 'Diseñar la arquitectura lógica, física y de datos'], ['LuPenTool', 'Producir los diagramas UML para Rational Rose'], ['LuLink', 'Planificar iteraciones, riesgos y pruebas, con trazabilidad']];
    for (let i = 0; i < esp.length; i++) {
      const y = 1.6 + i * 0.84;
      await iconCircle(s, esp[i][0], 5.55, y + 0.05, 0.6);
      text(s, esp[i][1], { x: 6.35, y, w: 6.4, h: 0.7, fontSize: 16, valign: 'middle' });
    }
  }

  // 8 ─ Propuesta del sistema: módulos
  {
    const s = add({ n: 8, title: 'Propuesta del sistema: SGCD-BH', kicker: '01 · El caso', t: 60,
      obj: 'Mostrar los 12 módulos y cuáles son ampliaciones.',
      oral: 'El SGCD-BH tiene doce módulos. En blanco, los que ya existen en el rediseño o que WordPress y WooCommerce resuelven de forma nativa: catálogo, categorías, búsqueda, comparador, contenido. En morado, las ampliaciones que proponemos: gestión de distribuidores, registro y seguimiento de consultas, reportes y auditoría. Lo importante es lo que no incluimos: no es una tienda en línea, no es un ERP ni un sistema de inventario. Mantener ese límite fue una decisión consciente.',
      conceptos: ['12 módulos', 'Alcance realista', 'Exclusiones'], trans: 'Pasemos a la metodología: ¿qué es RUP?' });
    base(s, { kicker: '01 · El caso', title: '12 módulos sobre la plataforma existente' });
    const st = { M01: 'BASE', M02: 'BASE', M03: 'BASE', M04: 'PAR', M05: 'EXI', M06: 'EXI', M07: 'PRO', M08: 'PAR', M09: 'BASE', M10: 'PRO', M11: 'PRO', M12: 'PRO' };
    const ic = { M01: 'LuUsers', M02: 'LuPackage', M03: 'LuTags', M04: 'LuFileText', M05: 'LuSearch', M06: 'LuGitCompare', M07: 'LuStore', M08: 'LuMessageCircle', M09: 'LuNewspaper', M10: 'LuHistory', M11: 'LuChartBar', M12: 'LuShieldCheck' };
    const cw = (W - 2 * MX - 3 * 0.2) / 4, ch = 1.18;
    for (let i = 0; i < 12; i++) {
      const m = M.MODULOS[i], x = MX + (i % 4) * (cw + 0.2), y = 1.6 + Math.floor(i / 4) * (ch + 0.18);
      const prop = st[m.id] === 'PRO';
      card(s, x, y, cw, ch, { fill: prop ? C.pur : C.paper });
      await iconCircle(s, ic[m.id], x + 0.2, y + 0.28, 0.6, prop ? C.white : C.white, C.pur);
      text(s, m.n, { x: x + 0.95, y, w: cw - 1.1, h: ch, fontSize: 14, bold: true, color: prop ? C.white : C.ink, valign: 'middle' });
    }
    text(s, [{ text: 'Fuera del alcance: ', options: { bold: true } }, { text: M.ALCANCE_OUT.slice(0, 3).join(' · ') }], { x: MX, y: 5.85, w: W - 2 * MX, h: 0.55, fontSize: 13, color: C.mute });
    s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 6.5, w: 0.22, h: 0.22, fill: { color: C.pur }, line: { type: 'none' } });
    text(s, 'Ampliación propuesta en este proyecto (alcance académico). Gris: existente o nativo de la plataforma.', { x: MX + 0.35, y: 6.47, w: 10, h: 0.3, fontSize: 11.5, color: C.mute });
  }

  // 9 ─ Qué es RUP
  {
    const s = add({ n: 9, title: '¿Qué es RUP?', kicker: '02 · Metodología', t: 60,
      obj: 'Definir RUP y sus tres características esenciales.',
      oral: 'RUP, el Proceso Unificado de Rational, es un proceso de ingeniería de software que organiza quién hace qué, cómo y cuándo. Tiene tres características que hay que saber de memoria: está dirigido por casos de uso, porque los casos de uso guían desde los requisitos hasta las pruebas; está centrado en la arquitectura, porque la arquitectura se valida temprano; y es iterativo e incremental, porque el sistema crece en iteraciones que entregan algo ejecutable. Por eso las fases no son una cascada.',
      conceptos: ['Dirigido por casos de uso', 'Centrado en la arquitectura', 'Iterativo e incremental'], trans: 'Esas características se apoyan en seis buenas prácticas.' });
    base(s, { kicker: '02 · Metodología', title: 'RUP: un proceso, tres ideas' });
    text(s, 'Rational Unified Process: proceso de ingeniería de software que define quién hace qué, cómo y cuándo, para producir software de calidad dentro de un plazo y un presupuesto (Kruchten, 2004).', { x: MX, y: 1.55, w: 8.5, h: 0.9, fontSize: 16, color: C.mute });
    const c3 = [['LuUsers', 'Dirigido por casos de uso', 'Los casos de uso guían los requisitos, el diseño, las pruebas y la planificación.', 'En el SGCD-BH: CU-08 define la arquitectura de la consulta.'], ['LuLayers', 'Centrado en la arquitectura', 'Se valida una arquitectura ejecutable antes de construir.', 'En el SGCD-BH: prototipo de registro + WhatsApp en E2.'], ['LuRepeat', 'Iterativo e incremental', 'Cada iteración recorre varias disciplinas y entrega un incremento.', 'En el SGCD-BH: 7 iteraciones en 14 semanas.']];
    for (let i = 0; i < 3; i++) {
      const x = MX + i * 4.1;
      card(s, x, 2.75, 3.9, 3.85, { fill: i === 0 ? C.purL : C.paper });
      await iconCircle(s, c3[i][0], x + 0.3, 3.0, 0.72, C.white);
      text(s, c3[i][1], { x: x + 0.3, y: 3.9, w: 3.3, h: 0.5, fontSize: 18, bold: true });
      text(s, c3[i][2], { x: x + 0.3, y: 4.5, w: 3.3, h: 1.0, fontSize: 14 });
      text(s, c3[i][3], { x: x + 0.3, y: 5.65, w: 3.3, h: 0.8, fontSize: 12.5, italic: true, color: C.pur });
    }
  }

  // 10 ─ Principios
  {
    const s = add({ n: 10, title: 'Principios fundamentales', kicker: '02 · Metodología', t: 45,
      obj: 'Presentar las seis buenas prácticas de RUP.',
      oral: 'RUP se apoya en seis buenas prácticas. Desarrollar de forma iterativa, gestionar los requisitos, usar arquitecturas basadas en componentes, modelar visualmente con UML, verificar la calidad de forma continua y controlar los cambios. En nuestro proyecto cada práctica tiene algo concreto: por ejemplo, la arquitectura por componentes es el plugin bh-core separado del tema, y el control de cambios es Git más la matriz de trazabilidad.',
      conceptos: ['Seis buenas prácticas', 'Aplicación concreta'], trans: 'Veamos cómo se organiza RUP en el tiempo.' });
    base(s, { kicker: '02 · Metodología', title: 'Seis buenas prácticas, aplicadas al caso' });
    const p = [['LuRepeat', 'Desarrollar iterativamente', '7 iteraciones, cada una con un incremento'], ['LuListChecks', 'Gestionar requisitos', '40 requisitos con criterio de aceptación'], ['LuBoxes', 'Arquitectura de componentes', 'Tema hijo + plugin bh-core desacoplado'], ['LuPenTool', 'Modelar visualmente', '22 diagramas UML'], ['LuClipboardCheck', 'Verificar la calidad', '32 casos de prueba diseñados'], ['LuGitBranch', 'Controlar los cambios', 'Git + matriz de trazabilidad']];
    for (let i = 0; i < 6; i++) {
      const x = MX + (i % 3) * 4.1, y = 1.65 + Math.floor(i / 3) * 2.5;
      card(s, x, y, 3.9, 2.25, { fill: C.paper });
      await iconCircle(s, p[i][0], x + 0.3, y + 0.3, 0.62, C.white);
      text(s, p[i][1], { x: x + 0.3, y: y + 1.05, w: 3.4, h: 0.45, fontSize: 17, bold: true });
      text(s, p[i][2], { x: x + 0.3, y: y + 1.5, w: 3.4, h: 0.6, fontSize: 13.5, color: C.mute });
    }
  }

  // 11 ─ Arquitectura general de RUP (jorobas)
  diagSlide({ n: 11, title: 'Arquitectura general de RUP', kicker: '02 · Metodología', t: 60,
    obj: 'Explicar el gráfico de fases y disciplinas (dos dimensiones).',
    oral: 'Este es el gráfico clásico de RUP, construido con los datos de nuestro proyecto. Tiene dos dimensiones: en horizontal, el tiempo, con fases e iteraciones; en vertical, las disciplinas. El área de cada curva es el esfuerzo. Fíjense: requisitos es fuerte en Inicio y Elaboración pero no desaparece; implementación empieza ya en Elaboración con el prototipo; y despliegue se concentra al final. Esto demuestra que RUP no es una cascada: todas las disciplinas conviven, con distinta intensidad.',
    conceptos: ['Dimensión dinámica: fases', 'Dimensión estática: disciplinas', 'Esfuerzo variable'], trans: 'Detallemos las cuatro fases y sus hitos.' },
  DG + 'G01_esfuerzo_rup.png', 'Elaboración propia a partir de la matriz de intensidad del proyecto (Tabla 21 de la monografía).', { side: ['Horizontal: tiempo (fases e iteraciones).', 'Vertical: disciplinas.', 'Área: esfuerzo relativo.', 'Morado: ingeniería. Gris: soporte.', 'Ninguna disciplina es una etapa aislada.'], imgW: 8.9 });

  // 12 ─ Fases e iteraciones
  {
    const s = add({ n: 12, title: 'Fases e iteraciones', kicker: '02 · Metodología', t: 60,
      obj: 'Presentar las fases, las iteraciones y los hitos del proyecto.',
      oral: 'Las cuatro fases son Inicio, Elaboración, Construcción y Transición. Cada una termina con un hito, que es un punto de decisión: LCO, objetivos del ciclo de vida; LCA, arquitectura del ciclo de vida; IOC, capacidad operativa inicial; y PR, liberación del producto. En nuestro plan de 14 semanas: Inicio con una iteración, Elaboración con dos, Construcción con tres y Transición con una. Siete iteraciones en total.',
      conceptos: ['LCO', 'LCA', 'IOC', 'PR', '7 iteraciones'], trans: '¿Y qué disciplinas se trabajan en esas fases?' });
    base(s, { kicker: '02 · Metodología', title: '4 fases · 7 iteraciones · 4 hitos' });
    const tot = 14, x0 = MX, ww = W - 2 * MX;
    M.FASES.forEach((f, i) => {
      const x = x0 + (f.sem[0] - 1) / tot * ww, w = (f.sem[1] - f.sem[0] + 1) / tot * ww;
      s.addShape(pres.shapes.RECTANGLE, { x, y: 1.8, w: w - 0.05, h: 1.1, fill: { color: [C.mute2, C.purM, C.pur, C.ink][i] }, line: { type: 'none' } });
      text(s, f.n, { x: x + 0.15, y: 1.8, w: w - 0.2, h: 0.6, fontSize: 17, bold: true, color: C.white, valign: 'middle' });
      text(s, `S${f.sem[0]}–S${f.sem[1]}`, { x: x + 0.15, y: 2.35, w: w - 0.2, h: 0.4, fontSize: 12, color: C.white });
      f.it.forEach((it, k) => {
        const iw = (w - 0.05) / f.it.length;
        card(s, x + k * iw + 0.03, 3.05, iw - 0.06, 0.55, { fill: C.paper });
        text(s, it, { x: x + k * iw, y: 3.05, w: iw, h: 0.55, fontSize: 14, bold: true, align: 'center', valign: 'middle' });
      });
      const hx = x + w - 0.05;
      s.addShape(pres.shapes.LINE, { x: hx, y: 3.7, w: 0, h: 0.5, line: { color: C.ink, width: 1.25, dashType: 'dash' } });
      const hw = i >= 2 ? 1.9 : 2.9, hxl = i === 3 ? W - MX - hw : i === 2 ? Math.min(hx - hw / 2, W - MX - 2 * hw - 0.1) : Math.max(hx - hw / 2, MX);
      text(s, f.hito.split(' — ')[0], { x: hxl, y: 4.25, w: hw, h: 0.45, fontSize: 20, bold: true, color: C.pur, align: i === 3 ? 'right' : 'center' });
      text(s, f.hito.split(' — ')[1], { x: hxl, y: 4.7, w: hw, h: 0.55, fontSize: 11.5, color: C.mute, align: i === 3 ? 'right' : 'center' });
    });
    card(s, MX, 5.45, W - 2 * MX, 1.05, { fill: C.ink });
    text(s, 'Una fase no es una etapa de cascada: es un periodo con un objetivo y un hito de decisión. Dentro de cada iteración se trabajan varias disciplinas a la vez.', { x: MX + 0.35, y: 5.45, w: W - 2 * MX - 0.7, h: 1.05, fontSize: 15, color: C.white, valign: 'middle' });
  }

  // 13 ─ Disciplinas
  {
    const s = add({ n: 13, title: 'Disciplinas de RUP', kicker: '02 · Metodología', t: 55,
      obj: 'Explicar las 9 disciplinas y su intensidad por fase.',
      oral: 'RUP tiene nueve disciplinas: seis de ingeniería (modelado del negocio, requisitos, análisis y diseño, implementación, pruebas y despliegue) y tres de soporte (gestión de configuración y cambios, gestión del proyecto y entorno). La matriz muestra con qué intensidad trabajamos cada una en cada fase. Por ejemplo, análisis y diseño es máxima en Elaboración, e implementación en Construcción.',
      conceptos: ['6 disciplinas de ingeniería', '3 de soporte', 'Matriz de intensidad'], trans: 'Ahora sí, apliquemos esto a Black Hawk, empezando por la fase de Inicio.' });
    base(s, { kicker: '02 · Metodología', title: '9 disciplinas con distinta intensidad por fase' });
    const rows = [[{ text: 'Disciplina', options: { bold: true, color: C.white, fill: { color: C.ink } } }, ...['Inicio', 'Elaboración', 'Construcción', 'Transición'].map((t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.ink }, align: 'center' } }))]];
    const dots = ['', '●', '●●', '●●●', '●●●●'];
    M.DISCIPLINAS.forEach((d) => rows.push([{ text: d.n + (d.t === 'Soporte' ? '  (soporte)' : ''), options: { color: d.t === 'Soporte' ? C.mute : C.ink } }, ...d.v.map((v) => ({ text: dots[v] || '—', options: { align: 'center', color: v >= 3 ? C.pur : C.mute2, fill: v === 4 ? { color: C.purL } : undefined } }))]));
    s.addTable(rows, { x: MX, y: 1.6, w: W - 2 * MX, colW: [4.5, 2.03, 2.03, 2.03, 2.04], fontFace: F, fontSize: 13.5, rowH: 0.47, border: { type: 'solid', color: C.line, pt: 0.75 }, valign: 'middle' });
    source(s, 'Intensidad: ● baja · ●● media · ●●● alta · ●●●● máxima. Aplicación de cada disciplina: monografía, Tabla 21.');
  }

  // 14 ─ Fase de Inicio
  {
    const f = M.FASES[0];
    const s = add({ n: 14, title: 'Fase de Inicio', kicker: '03 · Aplicación · Inicio', t: 60,
      obj: 'Mostrar qué se hizo en Inicio y cómo se cierra el hito LCO.',
      oral: 'En Inicio, semanas uno y dos, el objetivo es ponerse de acuerdo sobre qué problema se resuelve y si vale la pena. Produjimos la visión, el modelo de casos de uso del negocio, el glosario, la lista de riesgos y el caso de negocio. La fase termina en el hito LCO cuando los stakeholders aceptan la visión y el alcance, están identificados los casos de uso críticos, los riesgos principales tienen respuesta y la viabilidad está aprobada.',
      conceptos: ['Visión', 'Caso de negocio', 'Hito LCO'], trans: '¿Quiénes son esos stakeholders?' });
    base(s, { kicker: '03 · Aplicación · Inicio', title: 'Inicio: acordar qué se construye y por qué', sub: `Semanas ${f.sem[0]}–${f.sem[1]} · Iteración I1 · ${f.resp}` });
    card(s, MX, 2.1, 5.9, 4.45, { fill: C.paper });
    text(s, 'ARTEFACTOS', { x: MX + 0.3, y: 2.3, w: 3, h: 0.3, fontSize: 10, bold: true, color: C.pur, charSpacing: 2 });
    text(s, f.art.map((a, i) => ({ text: a, options: { breakLine: i < f.art.length - 1, bullet: { code: '25A0' }, paraSpaceAfter: 8 } })), { x: MX + 0.3, y: 2.75, w: 5.3, h: 3.6, fontSize: 15 });
    card(s, 6.75, 2.1, W - MX - 6.75, 4.45, { fill: C.ink });
    text(s, 'HITO LCO · CRITERIOS', { x: 7.05, y: 2.3, w: 5, h: 0.3, fontSize: 10, bold: true, color: C.purM, charSpacing: 2 });
    text(s, f.crit.map((a, i) => ({ text: a, options: { breakLine: i < f.crit.length - 1, bullet: { code: '2713' }, paraSpaceAfter: 10 } })), { x: 7.05, y: 2.75, w: W - MX - 7.35, h: 3.6, fontSize: 15, color: C.white });
  }

  // 15 ─ Stakeholders
  {
    const s = add({ n: 15, title: 'Stakeholders', kicker: '03 · Aplicación · Inicio', t: 50,
      obj: 'Identificar a los interesados por influencia e interés.',
      oral: 'Identificamos ocho stakeholders y los ubicamos por influencia e interés. Con alta influencia y alto interés están la gerencia y el área comercial: hay que gestionarlos de cerca. El gestor de contenidos, los distribuidores y los clientes tienen mucho interés, pero menos poder de decisión: hay que mantenerlos informados. Aclaramos que son stakeholders identificados para el caso; no hicimos entrevistas formales con la empresa.',
      conceptos: ['Matriz influencia–interés', 'Stakeholder frente a actor'], trans: 'Con ellos definimos el modelo del negocio.' });
    base(s, { kicker: '03 · Aplicación · Inicio', title: 'Ocho stakeholders, cuatro estrategias' });
    const q = [['Mantener satisfechos', 'Alta influencia · interés medio', ['Docente del curso']], ['Gestionar de cerca', 'Alta influencia · alto interés', ['Gerencia de Black Hawk', 'Área comercial']], ['Monitorear', 'Baja influencia · bajo interés', ['Proveedor de hosting']], ['Mantener informados', 'Influencia media o baja · alto interés', ['Gestor de contenidos', 'Distribuidores y tiendas', 'Clientes finales', 'Equipo de desarrollo']]];
    q.forEach(([t, d, items], i) => {
      const x = MX + 1.0 + (i % 2) * 5.75, y = 1.6 + Math.floor(i / 2) * 2.5;
      card(s, x, y, 5.55, 2.3, { fill: i === 1 ? C.pur : C.paper });
      text(s, t, { x: x + 0.3, y: y + 0.2, w: 5, h: 0.4, fontSize: 17, bold: true, color: i === 1 ? C.white : C.ink });
      text(s, d, { x: x + 0.3, y: y + 0.6, w: 5, h: 0.3, fontSize: 11.5, color: i === 1 ? C.purL : C.mute });
      text(s, items.join(' · '), { x: x + 0.3, y: y + 1.05, w: 5, h: 1.1, fontSize: 14.5, color: i === 1 ? C.white : C.ink });
    });
    text(s, 'INFLUENCIA ↑', { x: MX - 0.1, y: 3.4, w: 1.0, h: 0.5, fontSize: 10, bold: true, color: C.mute, rotate: 270 });
    text(s, 'INTERÉS →', { x: 6.2, y: 6.65, w: 2, h: 0.3, fontSize: 10, bold: true, color: C.mute });
  }

  // 16 ─ Modelo del negocio
  diagSlide({ n: 16, title: 'Modelo del negocio', kicker: '03 · Aplicación · Inicio', t: 55,
    obj: 'Explicar el diagrama de casos de uso del negocio.',
    oral: 'Este diagrama modela el negocio, no el software. Los actores del negocio son el cliente final y el distribuidor; los casos de uso del negocio son los procesos que les dan valor: difundir el catálogo, atender la consulta, derivar al punto de venta, incorporar distribuidores y dar soporte. La barra diagonal en los íconos es la notación de negocio. El área comercial no aparece como actor porque trabaja dentro del negocio: es un trabajador del negocio.',
    conceptos: ['Actor del negocio', 'Caso de uso del negocio', 'Trabajador del negocio'], trans: 'De aquí salen el alcance y la viabilidad.' },
  DG + 'D01_cu_negocio.png', 'D-01 · Elaboración propia. Fuente editable: DIAGRAMAS_UML/fuente_plantuml.', { side: ['Modela procesos de la organización, no pantallas.', 'Actores del negocio: cliente final y distribuidor.', '«Derivar al punto de venta» extiende «Atender consulta» cuando el cliente prefiere comprar en tienda.', 'La venta ocurre fuera de la web.'], imgW: 7.4 });

  // 17 ─ Alcance y viabilidad
  {
    const s = add({ n: 17, title: 'Alcance y viabilidad', kicker: '03 · Aplicación · Inicio', t: 55,
      obj: 'Delimitar el alcance y justificar la viabilidad.',
      oral: 'El alcance incluye el catálogo, el comparador, las consultas por WhatsApp con registro, el directorio de distribuidores, la administración y la auditoría. Excluimos lo que supondría vender en línea: carrito, pagos, inventario, facturación y la API de WhatsApp Business. La viabilidad es técnica, porque WordPress ya ofrece roles, API REST y tipos de contenido; económica, porque reutilizamos la plataforma; y operativa, porque el área comercial sigue usando WhatsApp.',
      conceptos: ['Alcance', 'Exclusiones', 'Viabilidad técnica, económica y operativa'], trans: 'Con el LCO aprobado pasamos a Elaboración.' });
    base(s, { kicker: '03 · Aplicación · Inicio', title: 'Qué entra, qué no y por qué es viable' });
    card(s, MX, 1.6, 4.0, 4.95, { fill: C.paper });
    text(s, 'INCLUIDO', { x: MX + 0.3, y: 1.8, w: 3, h: 0.3, fontSize: 10, bold: true, color: C.pur, charSpacing: 2 });
    text(s, M.ALCANCE_IN.map((a, i) => ({ text: a, options: { breakLine: i < M.ALCANCE_IN.length - 1, bullet: { code: '2713' }, paraSpaceAfter: 7 } })), { x: MX + 0.3, y: 2.2, w: 3.45, h: 4.2, fontSize: 12.5 });
    card(s, 4.8, 1.6, 4.0, 4.95, { fill: C.white, line: C.line });
    text(s, 'EXCLUIDO', { x: 5.1, y: 1.8, w: 3, h: 0.3, fontSize: 10, bold: true, color: C.mute, charSpacing: 2 });
    text(s, M.ALCANCE_OUT.map((a, i) => ({ text: a, options: { breakLine: i < M.ALCANCE_OUT.length - 1, bullet: { code: '2715' }, paraSpaceAfter: 7 } })), { x: 5.1, y: 2.2, w: 3.45, h: 4.2, fontSize: 12.5, color: C.mute });
    const v = [['Técnica', 'Roles, REST, tipos de contenido y tablas propias en WordPress'], ['Económica', 'Reutiliza plataforma y contenido; sin licencias nuevas obligatorias'], ['Operativa', 'WhatsApp sigue siendo el canal; capacitación breve']];
    v.forEach(([t, d], i) => { const y = 1.6 + i * 1.7; card(s, 9.0, y, W - MX - 9.0, 1.55, { fill: C.ink }); text(s, `Viabilidad ${t.toLowerCase()}`, { x: 9.25, y: y + 0.15, w: 3.3, h: 0.4, fontSize: 15, bold: true, color: C.white }); text(s, d, { x: 9.25, y: y + 0.6, w: 3.3, h: 0.85, fontSize: 12, color: C.mute2 }); });
  }

  // 18 ─ Fase de Elaboración
  {
    const f = M.FASES[1];
    const s = add({ n: 18, title: 'Fase de Elaboración', kicker: '03 · Aplicación · Elaboración', t: 60,
      obj: 'Mostrar qué se estabiliza en Elaboración y qué valida el LCA.',
      oral: 'Elaboración es la fase más importante para un analista. En las iteraciones E1 y E2 detallamos los requisitos, especificamos los casos de uso, construimos los modelos de dominio y de análisis, y diseñamos la arquitectura. Lo que la distingue es el prototipo arquitectónico: no basta con dibujar, hay que probar que el flujo más riesgoso funciona. En nuestro caso, registrar la consulta sin retrasar la apertura de WhatsApp. El hito LCA exige al menos el 80 % de los casos de uso especificados y la arquitectura probada.',
      conceptos: ['Prototipo arquitectónico', 'SRS y SAD', 'Hito LCA'], trans: 'Veamos los requisitos que salieron de esta fase.' });
    base(s, { kicker: '03 · Aplicación · Elaboración', title: 'Elaboración: estabilizar requisitos y probar la arquitectura', sub: `Semanas ${f.sem[0]}–${f.sem[1]} · Iteraciones E1 y E2 · ${f.resp}` });
    const ar = f.art;
    ar.forEach((a, i) => { const x = MX + (i % 3) * 2.75, y = 2.2 + Math.floor(i / 3) * 1.45; card(s, x, y, 2.6, 1.3, { fill: i === 4 ? C.purL : C.paper }); text(s, a, { x: x + 0.2, y, w: 2.2, h: 1.3, fontSize: 14, bold: true, valign: 'middle', color: i === 4 ? C.pur : C.ink }); });
    card(s, 9.05, 2.2, W - MX - 9.05, 2.75, { fill: C.ink });
    text(s, 'PROTOTIPO ARQUITECTÓNICO (E2)', { x: 9.3, y: 2.35, w: 3.4, h: 0.3, fontSize: 10, bold: true, color: C.purM, charSpacing: 1 });
    text(s, 'Registrar la consulta con una llamada asíncrona (sendBeacon) y abrir WhatsApp sin esperar. Mitiga el riesgo R-05.', { x: 9.3, y: 2.75, w: 3.4, h: 2.0, fontSize: 14, color: C.white });
    card(s, MX, 5.2, W - 2 * MX, 1.3, { fill: C.paper });
    text(s, [{ text: 'Hito LCA: ', options: { bold: true, color: C.pur } }, { text: f.crit.join(' · ') }], { x: MX + 0.3, y: 5.2, w: W - 2 * MX - 0.6, h: 1.3, fontSize: 14, valign: 'middle' });
  }

  // 19 ─ Requisitos
  {
    const s = add({ n: 19, title: 'Requisitos funcionales y no funcionales', kicker: '03 · Aplicación · Elaboración', t: 60,
      obj: 'Presentar el catálogo de requisitos y su estado.',
      oral: 'Especificamos 27 requisitos funcionales y 13 no funcionales. Cada uno tiene código, prioridad, actor, caso de uso, criterio de aceptación y estado. El gráfico muestra el estado de los funcionales: una parte ya existe en el rediseño o en la plataforma, y el resto es propuesta. Un ejemplo funcional: RF-014, registrar la consulta antes de abrir WhatsApp. Un ejemplo no funcional: RNF-003, que la página cargue en menos de 2,5 segundos según Core Web Vitals. Los no funcionales se clasifican con la norma ISO/IEC 25010.',
      conceptos: ['RF frente a RNF', 'Criterio de aceptación', 'MoSCoW', 'ISO/IEC 25010'], trans: 'Los requisitos se organizan en casos de uso.' });
    base(s, { kicker: '03 · Aplicación · Elaboración', title: '27 RF + 13 RNF, cada uno verificable' });
    const keys = Object.keys(M.ESTADOS);
    s.addChart(pres.charts.BAR, [{ name: 'RF', labels: keys.map((k) => M.ESTADOS[k].replace(' (alcance académico)', '').replace('Existente en la plataforma base', 'Nativo de la plataforma')), values: keys.map((k) => M.RF.filter((r) => r.e === k).length) }], {
      x: MX, y: 1.6, w: 6.3, h: 4.9, barDir: 'bar', chartColors: [C.pur], showValue: true, dataLabelPosition: 'outEnd', dataLabelFontSize: 13, dataLabelColor: C.ink,
      catAxisLabelColor: C.ink, catAxisLabelFontSize: 12, valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' }, showLegend: false,
      showTitle: true, title: 'Requisitos funcionales por estado de implementación', titleFontSize: 13, titleColor: C.ink, catAxisLabelFontFace: F, titleFontFace: F, barGapWidthPct: 60,
    });
    const ex = [['RF-014', 'Registrar consulta comercial', 'Antes de abrir WhatsApp se registran fecha, producto, origen e intención. Aceptación: se crea el registro y WhatsApp abre sin demora perceptible.', 'PRO'], ['RF-007', 'Agregar y quitar del comparador', 'Máximo 3 productos. Aceptación: el cuarto producto se rechaza con un aviso.', 'EXI'], ['RNF-003', 'Rendimiento de carga', 'LCP ≤ 2,5 s, INP ≤ 200 ms y CLS ≤ 0,1 en el percentil 75.', 'PEN']];
    ex.forEach(([c, n, d, e], i) => { const y = 1.6 + i * 1.66; card(s, 7.2, y, W - MX - 7.2, 1.5, { fill: C.paper }); pill(s, 7.45, y + 0.12, M.ESTADOS[e].split(' (')[0].replace('Pendiente de validación', 'Pendiente'), e); text(s, `${c} · ${n}`, { x: 7.45, y: y + 0.47, w: W - MX - 7.7, h: 0.35, fontSize: 14.5, bold: true }); text(s, d, { x: 7.45, y: y + 0.84, w: W - MX - 7.7, h: 0.62, fontSize: 11.5, color: C.mute }); });
  }

  // 20 ─ Casos de uso
  {
    const s = add({ n: 20, title: 'Casos de uso', kicker: '03 · Aplicación · Elaboración', t: 55,
      obj: 'Mostrar los actores y los casos de uso significativos.',
      oral: 'Definimos seis actores y 22 casos de uso. Hay que diferenciar: visitante, cliente interesado y distribuidor son humanos externos; gestor del catálogo y administrador son roles internos; y WhatsApp es un sistema externo. La base de datos no es actor, porque es parte del sistema. De los 22 casos especificamos seis en detalle, los arquitectónicamente significativos: consultar ficha, comparar, enviar consulta por WhatsApp con su registro, gestionar productos, gestionar distribuidores y dar seguimiento a consultas.',
      conceptos: ['Actor humano, rol interno y sistema externo', 'Caso de uso significativo'], trans: '¿Sobre qué arquitectura se implementan?' });
    base(s, { kicker: '03 · Aplicación · Elaboración', title: '6 actores · 22 casos de uso · 6 especificados en detalle' });
    const groups = [['Humanos externos', ['Visitante', 'Cliente interesado', 'Distribuidor'], 'LuUsers'], ['Roles internos', ['Gestor del catálogo', 'Administrador del sistema'], 'LuSettings'], ['Sistema externo', ['Servicio de WhatsApp'], 'LuMessageCircle']];
    for (let i = 0; i < 3; i++) {
      const y = 1.6 + i * 1.62;
      card(s, MX, y, 4.9, 1.45, { fill: C.paper });
      await iconCircle(s, groups[i][2], MX + 0.25, y + 0.4, 0.62, C.white);
      text(s, groups[i][0], { x: MX + 1.1, y: y + 0.18, w: 3.6, h: 0.4, fontSize: 15, bold: true });
      text(s, groups[i][1].join(' · '), { x: MX + 1.1, y: y + 0.6, w: 3.7, h: 0.75, fontSize: 13, color: C.mute });
    }
    text(s, 'La base de datos no es un actor: es parte del sistema.', { x: MX, y: 6.5, w: 5, h: 0.35, fontSize: 11.5, italic: true, color: C.mute });
    const sig = [['CU-04', 'Consultar ficha técnica', 'PAR'], ['CU-05', 'Comparar productos', 'EXI'], ['CU-08', 'Enviar consulta por WhatsApp «include» CU-09', 'PAR'], ['CU-12', 'Gestionar productos', 'BASE'], ['CU-16', 'Gestionar distribuidores', 'PRO'], ['CU-18', 'Dar seguimiento a consultas', 'PRO']];
    text(s, 'CASOS DE USO ARQUITECTÓNICAMENTE SIGNIFICATIVOS', { x: 5.9, y: 1.6, w: 6.8, h: 0.3, fontSize: 10, bold: true, color: C.pur, charSpacing: 1.5 });
    sig.forEach(([c, n, e], i) => { const y = 2.05 + i * 0.73; s.addShape(pres.shapes.LINE, { x: 5.9, y: y + 0.66, w: W - MX - 5.9, h: 0, line: { color: C.line, width: 0.75 } }); text(s, c, { x: 5.9, y, w: 1.0, h: 0.6, fontSize: 15, bold: true, color: C.pur, valign: 'middle' }); text(s, n, { x: 6.95, y, w: 4.2, h: 0.6, fontSize: 14, valign: 'middle' }); pill(s, W - MX - 1.2, y + 0.16, e === 'PRO' ? 'Propuesto' : e === 'PAR' ? 'Parcial' : e === 'BASE' ? 'Nativo' : 'Existente', e); });
  }

  // 21 ─ Arquitectura
  diagSlide({ n: 21, title: 'Arquitectura', kicker: '03 · Aplicación · Elaboración', t: 60,
    obj: 'Explicar la arquitectura en capas y las decisiones principales.',
    oral: 'La arquitectura tiene cuatro capas: presentación, aplicación, dominio y acceso a datos, e infraestructura. Las dependencias van siempre hacia abajo. Las tres decisiones más importantes: mantener WordPress y WooCommerce en lugar de reescribir; poner todo lo nuevo en un plugin propio llamado bh-core, para que las actualizaciones no borren nada; e integrar WhatsApp con enlaces wa.me, sin la API de pago, registrando antes la consulta. En morado está lo propuesto.',
    conceptos: ['Arquitectura en capas', 'Plugin bh-core', 'Decisiones de arquitectura'], trans: 'Con la arquitectura validada, entramos a Construcción.' },
  DG + 'D22_arquitectura_capas.png', 'D-22 · Elaboración propia. Decisiones completas: monografía, Tabla 16.', { side: ['AD-01 Mantener WordPress + WooCommerce.', 'AD-02 Modo catálogo con YITH.', 'AD-03 Tema hijo + plugin bh-core.', 'AD-04 WhatsApp con wa.me y registro previo.', 'AD-06 Tablas propias para consultas y auditoría.'], imgW: 8.4 });

  // 22 ─ Fase de Construcción
  {
    const s = add({ n: 22, title: 'Fase de Construcción', kicker: '03 · Aplicación · Construcción', t: 55,
      obj: 'Mostrar la organización por incrementos.',
      oral: 'En Construcción, semanas siete a doce, el sistema crece en tres incrementos. C1: catálogo, fichas, especificaciones y modo catálogo. C2: comparador, WhatsApp y registro de consultas. C3: distribuidores, reportes, roles, auditoría y seguridad. Ordenamos así por valor y riesgo: primero la base del catálogo, luego el flujo comercial y al final la administración. El hito IOC exige los casos de uso de prioridad alta implementados y ninguna incidencia crítica abierta.',
      conceptos: ['Incremento', 'Priorización por valor y riesgo', 'Hito IOC'], trans: '¿Qué módulos ya existen y cuáles se construyen?' });
    base(s, { kicker: '03 · Aplicación · Construcción', title: 'Construcción: tres incrementos hacia el IOC' });
    const its = M.ITERACIONES.filter((i) => i.f === 'Construcción');
    its.forEach((it, i) => { const x = MX + i * 4.1; card(s, x, 1.65, 3.9, 3.7, { fill: i === 1 ? C.ink : C.paper }); text(s, it.id, { x: x + 0.3, y: 1.85, w: 2, h: 0.8, fontSize: 40, bold: true, color: i === 1 ? C.purM : C.pur }); text(s, `Semanas ${it.s[0]}–${it.s[1]}`, { x: x + 0.3, y: 2.7, w: 3, h: 0.3, fontSize: 12, color: i === 1 ? C.mute2 : C.mute }); text(s, it.obj, { x: x + 0.3, y: 3.1, w: 3.3, h: 1.3, fontSize: 15, bold: true, color: i === 1 ? C.white : C.ink }); text(s, it.cu, { x: x + 0.3, y: 4.45, w: 3.3, h: 0.75, fontSize: 11.5, color: i === 1 ? C.mute2 : C.mute }); });
    card(s, MX, 5.6, W - 2 * MX, 0.95, { fill: C.purL });
    text(s, [{ text: 'Hito IOC: ', options: { bold: true, color: C.pur } }, { text: M.FASES[2].crit.join(' · ') }], { x: MX + 0.3, y: 5.6, w: W - 2 * MX - 0.6, h: 0.95, fontSize: 14, valign: 'middle' });
  }

  // 23 ─ Módulos del sistema
  {
    const s = add({ n: 23, title: 'Módulos del sistema', kicker: '03 · Aplicación · Construcción', t: 50,
      obj: 'Distinguir el desarrollo real de la implementación propuesta.',
      oral: 'Aquí separamos el desarrollo real de nuestra propuesta. Ya desarrollado en el rediseño: tema hijo, catálogo con filtros, búsqueda, comparador, botón Cotizar y las páginas de dónde comprar, soporte y mayoristas. Propuesto en este proyecto: el plugin bh-core con registro y seguimiento de consultas, directorio de distribuidores, verificación de especificaciones, reportes, auditoría y seguridad reforzada. Lo propuesto está especificado y diseñado, pero no decimos que ya funcione.',
      conceptos: ['Desarrollo real', 'Implementación propuesta'], trans: 'Veamos la pieza central de la propuesta: la integración con WhatsApp.' });
    base(s, { kicker: '03 · Aplicación · Construcción', title: 'Lo que ya existe y lo que se construye' });
    const real = ['Tema hijo Black Hawk', 'Catálogo con filtros y contadores', 'Búsqueda con sugerencias en vivo', 'Comparador de hasta 3 modelos', '«Cotizar» con WhatsApp y modelo', 'Dónde comprar, soporte, mayoristas, privacidad'];
    const prop = ['Plugin bh-core', 'Registro de consultas (wp_bh_consulta)', 'Seguimiento con estados', 'Directorio de distribuidores', 'Estado de verificación de especificaciones', 'Reportes, auditoría, 2FA y respaldos'];
    [[real, 'YA DESARROLLADO EN EL REDISEÑO', C.paper, C.ink], [prop, 'PROPUESTO EN ESTE PROYECTO', C.pur, C.white]].forEach(([items, t, fill, col], i) => {
      const x = MX + i * 6.15;
      card(s, x, 1.65, 5.95, 4.9, { fill });
      text(s, t, { x: x + 0.35, y: 1.9, w: 5.3, h: 0.3, fontSize: 11, bold: true, color: i ? C.purL : C.pur, charSpacing: 2 });
      text(s, items.map((a, k) => ({ text: a, options: { breakLine: k < items.length - 1, bullet: { code: i ? '25CB' : '25CF' }, paraSpaceAfter: 12 } })), { x: x + 0.35, y: 2.4, w: 5.3, h: 4.0, fontSize: 16, color: col });
    });
  }

  // 24 ─ Implementación propuesta: WhatsApp
  {
    const s = add({ n: 24, title: 'Implementación propuesta: integración con WhatsApp', kicker: '03 · Aplicación · Construcción', t: 60,
      obj: 'Explicar cómo funciona la integración con WhatsApp.',
      oral: 'A la izquierda está la ficha real del rediseño, con el botón Cotizar. Hoy ese botón abre WhatsApp con el mensaje «quiero cotizar el modelo BH-SW12XXG». Nuestra propuesta agrega dos cosas: la URL de la ficha en el mensaje y un registro previo. El flujo: el sistema construye el mensaje, envía el registro de forma asíncrona con sendBeacon y abre wa.me. Si el registro falla, WhatsApp igual se abre: nunca bloqueamos al cliente. Y como no usamos la API de WhatsApp Business, el sistema no lee la conversación; el seguimiento lo hace el gestor.',
      conceptos: ['Enlace wa.me', 'sendBeacon asíncrono', 'Tolerancia a fallos'], trans: '¿Cómo comprobamos que todo esto funciona? Con pruebas.' });
    base(s, { kicker: '03 · Aplicación · Construcción', title: 'WhatsApp: registrar primero, sin hacer esperar al cliente' });
    const r = img(s, 'img/cotizar.png', MX, 1.65, 6.2, 3.2, 'left');
    text(s, 'Ficha real del rediseño (evidencia 23-09-2026)', { x: MX, y: r.y + r.h + 0.08, w: 6, h: 0.3, fontSize: 10, color: C.mute2 });
    card(s, MX, 5.35, 6.2, 1.2, { fill: C.ink });
    text(s, [{ text: 'https://wa.me/<número>?text=', options: { color: C.purM } }, { text: 'Hola Black Hawk, vengo de la web y quiero cotizar el modelo BH-SW12XXG. ', options: { color: C.white } }, { text: '<URL de la ficha>', options: { color: C.purM, bold: true } }], { x: MX + 0.25, y: 5.35, w: 5.7, h: 1.2, fontFace: 'Courier New', fontSize: 12, valign: 'middle' });
    const steps = [['1', 'Construir el mensaje', 'Intención + modelo + URL (RF-012, RF-013)'], ['2', 'Registrar la consulta', 'POST /bh/v1/consultas con sendBeacon (RF-014)'], ['3', 'Abrir wa.me', 'Se abre aunque el registro falle'], ['4', 'Dar seguimiento', 'El gestor cambia el estado (CU-18)']];
    steps.forEach(([n, t, d], i) => { const y = 1.65 + i * 1.23; s.addShape(pres.shapes.OVAL, { x: 7.3, y: y + 0.1, w: 0.6, h: 0.6, fill: { color: i === 1 ? C.pur : C.ink }, line: { type: 'none' } }); text(s, n, { x: 7.3, y: y + 0.1, w: 0.6, h: 0.6, fontSize: 16, bold: true, color: C.white, align: 'center', valign: 'middle' }); text(s, t, { x: 8.1, y: y + 0.02, w: 4.6, h: 0.4, fontSize: 16, bold: true }); text(s, d, { x: 8.1, y: y + 0.45, w: 4.6, h: 0.6, fontSize: 13, color: C.mute }); });
  }

  // 25 ─ Pruebas
  {
    const s = add({ n: 25, title: 'Pruebas', kicker: '03 · Aplicación · Construcción', t: 55,
      obj: 'Presentar la estrategia de pruebas y su estado real.',
      oral: 'Diseñamos 32 casos de prueba en cinco niveles: unitarias, de integración, funcionales, de sistema y de aceptación. Cada uno está asociado a un requisito. Por ejemplo, CP-007 prueba que el comparador rechace un cuarto producto, y CP-014 prueba que el registro se cree antes de abrir WhatsApp. Somos claros: están diseñados, no ejecutados. Ejecutarlos requiere implementar las ampliaciones en un entorno de pruebas.',
      conceptos: ['Niveles de prueba', 'Caso de prueba asociado a requisito', 'Diseñado frente a ejecutado'], trans: 'Con el IOC alcanzado, sigue la Transición.' });
    base(s, { kicker: '03 · Aplicación · Construcción', title: '32 casos de prueba, cada uno ligado a un requisito' });
    const lv = ['Unitaria', 'Integración', 'Funcional', 'Sistema', 'Aceptación'];
    const count = lv.map((l) => M.CP.filter((c) => c.t === l).length);
    lv.forEach((l, i) => { const w = 6.0 - i * 0.9, x = MX + (6.0 - w) / 2, y = 5.55 - i * 0.92; s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.8, fill: { color: [C.ink, C.ink2, '3B2A66', '5B2FB0', C.pur][i] }, line: { type: 'none' } }); text(s, `${l} · ${count[i]}`, { x, y, w, h: 0.8, fontSize: 15, bold: true, color: C.white, align: 'center', valign: 'middle' }); });
    const ex = [['CP-007', 'Unitaria', 'Límite de 3 en el comparador', 'El cuarto producto se rechaza con aviso'], ['CP-014', 'Integración', 'Registro previo a la redirección', 'Registro REGISTRADA; WhatsApp abre sin demora'], ['CP-031', 'Aceptación', 'Usabilidad con 5 usuarios', '≥ 4 de 5 inician la consulta sin ayuda']];
    ex.forEach(([c, t, n, r], i) => { const y = 1.65 + i * 1.35; card(s, 7.1, y, W - MX - 7.1, 1.2, { fill: C.paper }); text(s, `${c} · ${t}`, { x: 7.35, y: y + 0.1, w: 5, h: 0.35, fontSize: 12, bold: true, color: C.pur }); text(s, n, { x: 7.35, y: y + 0.42, w: 5, h: 0.35, fontSize: 14.5, bold: true }); text(s, r, { x: 7.35, y: y + 0.78, w: 5.2, h: 0.35, fontSize: 12, color: C.mute }); });
    card(s, 7.1, 5.75, W - MX - 7.1, 0.8, { fill: C.ink });
    text(s, 'Estado: diseñados, no ejecutados en este trabajo.', { x: 7.35, y: 5.75, w: 5.2, h: 0.8, fontSize: 14, bold: true, color: C.white, valign: 'middle' });
  }

  // 26 ─ Fase de Transición
  {
    const s = add({ n: 26, title: 'Fase de Transición', kicker: '03 · Aplicación · Transición', t: 55,
      obj: 'Presentar los criterios objetivos para salir a producción.',
      oral: 'La Transición pone el sistema en manos de los usuarios. Para no decidir «a ojo», definimos criterios objetivos de salida: el 100 % de las pruebas de prioridad alta aprobadas, cero incidencias críticas o altas, al menos cuatro de cinco usuarios completan la consulta sin ayuda, LCP de 2,5 segundos o menos, restauración de respaldo en menos de cuatro horas, sin noindex en producción y usuarios capacitados. Si todo se cumple, se firma el acta y se alcanza el hito PR.',
      conceptos: ['Criterios de salida', 'Pruebas de aceptación', 'Hito PR'], trans: '¿Cómo se despliega y se mantiene?' });
    base(s, { kicker: '03 · Aplicación · Transición', title: 'Transición: siete criterios objetivos para salir a producción' });
    const cr = [['100 %', 'pruebas de prioridad alta aprobadas'], ['0', 'incidencias críticas o altas'], ['4 de 5', 'usuarios completan la consulta sin ayuda'], ['≤ 2,5 s', 'LCP en home, catálogo y ficha'], ['≤ 4 h', 'restauración de respaldo en staging'], ['Sin noindex', 'canonical al dominio oficial'], ['Acta', 'gestor y administrador capacitados']];
    cr.forEach(([n, l], i) => { const x = MX + (i % 4) * 3.07, y = 1.65 + Math.floor(i / 4) * 2.4; card(s, x, y, 2.9, 2.2, { fill: i === 6 ? C.pur : C.paper }); text(s, n, { x: x + 0.25, y: y + 0.25, w: 2.5, h: 0.8, fontSize: 30, bold: true, color: i === 6 ? C.white : C.pur }); text(s, l, { x: x + 0.25, y: y + 1.1, w: 2.45, h: 0.95, fontSize: 14, color: i === 6 ? C.white : C.ink }); });
  }

  // 27 ─ Despliegue y mantenimiento
  {
    const s = add({ n: 27, title: 'Despliegue y mantenimiento', kicker: '03 · Aplicación · Transición', t: 55,
      obj: 'Explicar el despliegue, la reversión y el mantenimiento.',
      oral: 'El despliegue sigue siete pasos, desde congelar la versión candidata hasta activar el monitoreo. Dos detalles importantes: no migramos productos, porque ya existen; solo cargamos los distribuidores validados y creamos las tablas nuevas. Y hay plan de reversión: si falla la prueba de humo, se restaura el respaldo y se desactiva el plugin, y el catálogo sigue funcionando. Después viene el mantenimiento, en cuatro tipos: correctivo, adaptativo, perfectivo y preventivo.',
      conceptos: ['Plan de despliegue', 'Plan de reversión', 'Tipos de mantenimiento'], trans: 'Pasemos al bloque de modelado: UML y Rational Rose.' });
    base(s, { kicker: '03 · Aplicación · Transición', title: 'Desplegar con red de seguridad' });
    const st = ['Congelar v1.0-rc y regresión en staging', 'Respaldar producción (punto de reversión)', 'Desplegar tema hijo y bh-core; crear tablas wp_bh_*', 'Cargar distribuidores validados', 'Retirar noindex; revisar canonical y sitemap', 'Prueba de humo: ficha → Cotizar → registro', 'Activar monitoreo y respaldo diario'];
    st.forEach((t, i) => { const y = 1.6 + i * 0.68; s.addShape(pres.shapes.OVAL, { x: MX, y: y + 0.08, w: 0.46, h: 0.46, fill: { color: C.ink }, line: { type: 'none' } }); text(s, String(i + 1), { x: MX, y: y + 0.08, w: 0.46, h: 0.46, fontSize: 13, bold: true, color: C.white, align: 'center', valign: 'middle' }); text(s, t, { x: MX + 0.65, y, w: 6.2, h: 0.62, fontSize: 14.5, valign: 'middle' }); });
    card(s, 7.7, 1.6, W - MX - 7.7, 1.7, { fill: C.pur });
    text(s, [{ text: 'Plan de reversión', options: { bold: true, breakLine: true } }, { text: 'Restaurar el respaldo del paso 2 y desactivar bh-core. El catálogo no depende del plugin.' }], { x: 7.95, y: 1.75, w: 4.5, h: 1.45, fontSize: 14, color: C.white });
    const mt = [['Correctivo', 'incidencias'], ['Adaptativo', 'actualizaciones en staging'], ['Perfectivo', 'mejoras de uso'], ['Preventivo', 'respaldos y seguridad']];
    mt.forEach(([t, d], i) => { const x = 7.7 + (i % 2) * 2.55, y = 3.55 + Math.floor(i / 2) * 1.5; card(s, x, y, 2.4, 1.35, { fill: C.paper }); text(s, t, { x: x + 0.2, y: y + 0.2, w: 2.1, h: 0.4, fontSize: 15, bold: true }); text(s, d, { x: x + 0.2, y: y + 0.65, w: 2.1, h: 0.55, fontSize: 12.5, color: C.mute }); });
  }

  // 28 ─ UML y Rational Rose
  {
    const s = add({ n: 28, title: 'UML y Rational Rose', kicker: '04 · Modelado', t: 60,
      obj: 'Distinguir UML (lenguaje) de Rational Rose (herramienta).',
      oral: 'Una distinción que siempre preguntan: UML es un lenguaje de modelado, un estándar del OMG que define la notación. Rational Rose es una herramienta CASE que implementa UML. Rose organiza el modelo en cuatro vistas: casos de uso, lógica, componentes y despliegue, y a cada una le corresponden nuestros diagramas. No entregamos un archivo .mdl porque no podíamos verificar su compatibilidad; entregamos las fuentes PlantUML editables, SVG, PNG y una guía paso a paso para reconstruir el modelo en Rose.',
      conceptos: ['UML = lenguaje', 'Rational Rose = herramienta', 'Cuatro vistas de Rose'], trans: 'Empecemos por el diagrama general de casos de uso.' });
    base(s, { kicker: '04 · Modelado', title: 'UML es el lenguaje; Rational Rose, la herramienta' });
    card(s, MX, 1.6, 5.9, 1.8, { fill: C.ink });
    text(s, [{ text: 'UML', options: { bold: true, fontSize: 24, color: C.purM, breakLine: true } }, { text: 'Lenguaje estándar del OMG (v2.5.1) para especificar, visualizar y documentar sistemas. Define la notación, no el proceso.', options: { color: C.white, fontSize: 14 } }], { x: MX + 0.3, y: 1.75, w: 5.3, h: 1.55 });
    card(s, MX, 3.6, 5.9, 1.8, { fill: C.paper });
    text(s, [{ text: 'Rational Rose', options: { bold: true, fontSize: 24, color: C.pur, breakLine: true } }, { text: 'Herramienta CASE (Rational/IBM) para construir modelos UML, documentarlos y generar código esqueleto.', options: { fontSize: 14 } }], { x: MX + 0.3, y: 3.75, w: 5.3, h: 1.55 });
    text(s, 'Entregado: fuentes PlantUML editables, SVG, PNG, XMI experimental de clases y guía de reconstrucción en Rose. Sin archivo .mdl: su compatibilidad no se pudo verificar.', { x: MX, y: 5.6, w: 5.9, h: 0.9, fontSize: 12, color: C.mute });
    const v = [['Use Case View', 'D-01 a D-06 · actores y casos de uso'], ['Logical View', 'D-07 a D-18 · clases, secuencias, actividades, estados'], ['Component View', 'D-19 · componentes y dependencias'], ['Deployment View', 'D-20 · nodos y conexiones']];
    text(s, 'CUATRO VISTAS DE ROSE → NUESTROS DIAGRAMAS', { x: 6.95, y: 1.6, w: 5.8, h: 0.3, fontSize: 10, bold: true, color: C.pur, charSpacing: 1.5 });
    v.forEach(([t, d], i) => { const y = 2.05 + i * 1.12; card(s, 6.95, y, W - MX - 6.95, 0.98, { fill: i % 2 ? C.paper : C.purL }); text(s, t, { x: 7.2, y: y + 0.1, w: 5.3, h: 0.4, fontSize: 16, bold: true }); text(s, d, { x: 7.2, y: y + 0.5, w: 5.3, h: 0.4, fontSize: 12.5, color: C.mute }); });
  }

  // 29 ─ Diagrama general CU
  diagSlide({ n: 29, title: 'Diagrama general de casos de uso', kicker: '04 · Modelado', t: 60,
    obj: 'Leer el diagrama general de casos de uso.',
    oral: 'Este es el diagrama general: 22 casos de uso en dos paquetes. A la izquierda están los actores externos y a la derecha los internos. Tiene dos generalizaciones: el cliente interesado hereda del visitante y el administrador hereda del gestor. Solo usamos dos relaciones entre casos de uso, y ambas se justifican: filtrar extiende a explorar, porque es opcional; y enviar consulta incluye registrar consulta, porque siempre ocurre. Autenticarse no se repite como include: es precondición. Los óvalos morados son propuestos.',
    conceptos: ['Generalización de actores', '«include» frente a «extend»', 'Precondición'], trans: 'Veamos un caso de uso en detalle.' },
  DG + 'D02_cu_general.png', 'D-02 · Elaboración propia.', { side: ['«extend»: CU-03 Filtrar → CU-01 Explorar (opcional).', '«include»: CU-08 Enviar consulta → CU-09 Registrar (siempre).', 'Cliente interesado → Visitante; Administrador → Gestor.', 'Morado: propuesto.'], imgW: 7.9 });

  // 30 ─ CU detallado
  {
    const sp = SPECS_BY('CU-08');
    const s = add({ n: 30, title: 'Casos de uso detallados', kicker: '04 · Modelado', t: 60,
      obj: 'Explicar una especificación de caso de uso completa.',
      oral: 'Aquí está la especificación del caso de uso más importante: CU-08, enviar consulta por WhatsApp. Tiene actores, precondiciones, flujo básico, flujos alternativos y postcondiciones. El flujo básico: el cliente pulsa Cotizar, el sistema identifica el origen, construye el mensaje, registra la consulta, abre WhatsApp y el cliente envía. Los alternativos cubren lo que puede salir mal; el más importante es el 4a: si el registro falla, WhatsApp se abre igual. A la derecha está el diagrama del módulo comercial.',
      conceptos: ['Flujo básico', 'Flujos alternativos', 'Pre y postcondiciones'], trans: 'Pasemos a la estructura: el diagrama de clases.' });
    base(s, { kicker: '04 · Modelado', title: 'CU-08 Enviar consulta por WhatsApp' });
    card(s, MX, 1.55, 7.3, 5.0, { fill: C.paper });
    text(s, [{ text: 'Actores: ', options: { bold: true } }, { text: sp.actores, options: { breakLine: true } }, { text: 'Precondición: ', options: { bold: true } }, { text: sp.pre[0] }], { x: MX + 0.3, y: 1.7, w: 6.7, h: 0.85, fontSize: 12 });
    text(s, 'FLUJO BÁSICO', { x: MX + 0.3, y: 2.6, w: 3, h: 0.3, fontSize: 10, bold: true, color: C.pur, charSpacing: 2 });
    text(s, sp.flujo.map((f, i) => ({ text: f, options: { breakLine: i < sp.flujo.length - 1, bullet: { type: 'number' }, paraSpaceAfter: 3 } })), { x: MX + 0.3, y: 2.9, w: 6.7, h: 2.3, fontSize: 11.5 });
    text(s, 'ALTERNATIVOS CLAVE', { x: MX + 0.3, y: 5.2, w: 3, h: 0.3, fontSize: 10, bold: true, color: C.pur, charSpacing: 2 });
    text(s, [sp.alt[1], sp.alt[2]].map((f, i) => ({ text: f, options: { breakLine: i < 1, paraSpaceAfter: 3 } })), { x: MX + 0.3, y: 5.5, w: 6.7, h: 1.0, fontSize: 11 });
    img(s, DG + 'D04_cu_comercial.png', 8.15, 1.55, W - MX - 8.15, 5.0);
  }

  // 31 ─ Clases
  diagSlide({ n: 31, title: 'Diagrama de clases', kicker: '04 · Modelado', t: 60,
    obj: 'Explicar el modelo de dominio y las multiplicidades.',
    oral: 'El diagrama de clases muestra la estructura estática del sistema. Este es el modelo de dominio, con doce clases. Fíjense en las multiplicidades: un producto pertenece a una o más categorías; las especificaciones y las imágenes son composiciones, porque no existen sin su producto; una comparación tiene entre 2 y 3 productos, que es la regla del comparador; y una consulta tiene cero o un producto, porque también hay consultas generales. Las versiones de diseño, con tipos y operaciones, están en los anexos.',
    conceptos: ['Clase', 'Asociación y multiplicidad', 'Composición'], trans: 'La estructura se completa con el comportamiento: secuencias.' },
  DG + 'D07_dominio.png', 'D-07 · Clases de diseño completas: D-09 y D-10 (monografía, Figuras 12 y 13).', { side: ['Producto 1..* Categoría.', 'Composición: la especificación y la imagen no existen sin su producto.', 'Comparación: 2..3 productos (RN-04).', 'Consulta: 0..1 producto y 0..1 distribuidor.'], imgW: 8.3 });

  // 32 ─ Secuencia
  diagSlide({ n: 32, title: 'Diagrama de secuencia', kicker: '04 · Modelado', t: 60,
    obj: 'Leer la secuencia del contacto con el distribuidor.',
    oral: 'La secuencia muestra los mensajes entre objetos en el tiempo. En este caso, el contacto por WhatsApp. Arriba, en un fragmento opt, el directorio propuesto: filtrar por ciudad. Luego el cliente pulsa Cotizar, el servicio construye el mensaje y el enlace. El mensaje 12 tiene punta abierta: es asíncrono, y es la decisión de arquitectura llevada al diseño. Se crea la consulta en estado REGISTRADA y se abre WhatsApp. La nota final recuerda que la conversación ocurre fuera del sistema.',
    conceptos: ['Línea de vida', 'Mensaje síncrono y asíncrono', 'Fragmentos opt, alt y loop'], trans: 'Veamos el proceso completo con un diagrama de actividades.' },
  DG + 'D14_seq_contacto.png', 'D-14 · Otras secuencias: consulta de producto (D-12), comparación (D-13) y administración (D-15).');

  // 33 ─ Actividades
  diagSlide({ n: 33, title: 'Diagrama de actividades', kicker: '04 · Modelado', t: 55,
    obj: 'Explicar el proceso comercial con calles.',
    oral: 'El diagrama de actividades muestra el proceso comercial completo, con una calle por participante: cliente, sistema, área comercial y distribuidor. El cliente decide si busca o explora, si compara y si tiene intención de compra. El sistema solo interviene en dos momentos: al registrar y generar el mensaje, y al final, al cerrar la consulta. Ese cierre es lo que hace medible un proceso que ocurre mayormente fuera de la web.',
    conceptos: ['Calles', 'Decisiones', 'Proceso medible'], trans: 'La consulta tiene estados; los vemos en el diagrama de estados.' },
  DG + 'D16_act_proceso_comercial.png', 'D-16 · También: administración del catálogo (D-17).', { side: ['Cuatro calles: cliente, sistema, área comercial, distribuidor.', 'El sistema registra, genera el mensaje y cierra.', 'La venta ocurre fuera del sistema.', 'El cierre de la consulta permite medir la derivación.'], imgW: 7.0 });

  // 34 ─ Estados
  diagSlide({ n: 34, title: 'Diagrama de estados', kicker: '04 · Modelado', t: 45,
    obj: 'Justificar y explicar la máquina de estados de ConsultaComercial.',
    oral: 'Elegimos ConsultaComercial para el diagrama de estados porque su comportamiento depende del estado. Nace REGISTRADA con el clic; pasa a ATENDIDA cuando el gestor responde; puede DERIVARSE a un distribuidor; y termina CERRADA o DESCARTADA. Hay una regla importante: no se puede cerrar sin atender. Y un evento de tiempo: si pasan 30 días sin atención, se descarta sola.',
    conceptos: ['Estado', 'Transición con evento y acción', 'Evento temporal after'], trans: 'Vamos a la vista de implementación: componentes.' },
  DG + 'D18_estados_consulta.png', 'D-18 · Elaboración propia.', { side: ['Se modela porque las acciones permitidas dependen del estado.', 'Regla: Registrada no pasa a Cerrada sin atención.', 'after(30 días): descarte automático.'], imgW: 8.0 });

  // 35 ─ Componentes
  diagSlide({ n: 35, title: 'Diagrama de componentes', kicker: '04 · Modelado', t: 50,
    obj: 'Mostrar la organización física del software.',
    oral: 'El diagrama de componentes muestra cómo se organiza el software. En el servidor: WordPress, WooCommerce, YITH Catalog Mode, el tema hijo y el plugin bh-core con sus tres componentes propuestos. Las interfaces son los endpoints REST: los nativos de WordPress y WooCommerce, y los nuestros, bh/v1. En el navegador está el comparador en JavaScript. Y WhatsApp está fuera, conectado por enlace.',
    conceptos: ['Componente', 'Interfaz provista', 'Dependencia'], trans: '¿Dónde se ejecuta todo esto? En el diagrama de despliegue.' },
  DG + 'D19_componentes.png', 'D-19 · Elaboración propia.');

  // 36 ─ Despliegue
  diagSlide({ n: 36, title: 'Diagrama de despliegue', kicker: '04 · Modelado', t: 50,
    obj: 'Mostrar los nodos físicos y sus conexiones.',
    oral: 'El despliegue muestra el hardware y dónde corre cada artefacto. El visitante y el gestor se conectan por HTTPS, a través de una CDN o WAF que proponemos. El servidor de producción ejecuta LiteSpeed y PHP, que es lo que observamos en el sitio oficial, con WordPress y los plugins, y la base de datos local. Hay un servidor de staging, un repositorio Git para el despliegue y un almacenamiento externo de respaldos.',
    conceptos: ['Nodo', 'Artefacto', 'Protocolo de conexión'], trans: 'Por último, el modelo de datos.' },
  DG + 'D20_despliegue.png', 'D-20 · Elaboración propia. Versión de PHP por confirmar con el hosting.', { side: ['HTTPS 443 en todas las conexiones externas.', 'CDN/WAF y respaldo externo: propuestos.', 'Staging → producción solo tras la aprobación.', 'La base de datos puede estar en el mismo host.'], imgW: 7.6 });

  // 37 ─ ER
  diagSlide({ n: 37, title: 'Modelo entidad-relación', kicker: '04 · Modelado', t: 55,
    obj: 'Explicar el modelo de datos y su relación con WordPress.',
    oral: 'El modelo entidad-relación tiene 15 tablas en tercera forma normal. Las relaciones de muchos a muchos se resuelven con tablas intermedias: producto_categoria, rol_permiso y comparacion_producto. Es coherente con el diagrama de clases: cada clase persistente es una tabla. En la implementación real, lo nativo vive en las tablas de WordPress y solo creamos tablas propias para consultas, comparaciones y auditoría.',
    conceptos: ['Clave primaria y foránea', 'Cardinalidad', '3FN', 'Mapeo a WordPress'], trans: 'Pasamos al último bloque: gestión y resultados.' },
  DG + 'D21_entidad_relacion.png', 'D-21 · Notación de patas de gallo. Diccionario de datos: monografía, Anexo E.');

  // 38 ─ Planificación de iteraciones / cronograma (Gantt nativo)
  {
    const s = add({ n: 38, title: 'Planificación y cronograma', kicker: '05 · Gestión', t: 55,
      obj: 'Mostrar el cronograma y su coherencia con las iteraciones.',
      oral: 'El cronograma dura 14 semanas y coincide con las iteraciones: el hito LCO en la semana 2, LCA en la 6, IOC en la 12 y PR en la 14. Fíjense en que las pruebas de integración empiezan en la semana 8 y se solapan con la construcción: en RUP las pruebas son continuas, no una etapa final. El esfuerzo estimado es de 560 horas-persona; el presupuesto referencial usa una tarifa hipotética, no es un costo real de la empresa.',
      conceptos: ['Gantt', 'Hitos', 'Solapamiento de disciplinas', 'Estimación referencial'], trans: '¿Qué puede salir mal? Los riesgos.' });
    base(s, { kicker: '05 · Gestión', title: '14 semanas, hitos al cierre de cada fase' });
    const lx = MX + 3.6, gw = W - MX - lx, y0 = 1.95, rh = 0.36;
    for (let w = 1; w <= 14; w++) text(s, 'S' + w, { x: lx + (w - 1) / 14 * gw, y: 1.6, w: gw / 14, h: 0.3, fontSize: 10, color: C.mute, align: 'center' });
    const col = { Inicio: C.mute2, 'Elaboración': C.purM, 'Construcción': C.pur, 'Transición': C.ink };
    M.GANTT.forEach((g, i) => { const y = y0 + i * rh; text(s, g.t, { x: MX, y, w: 3.5, h: rh, fontSize: 11.5, valign: 'middle', align: 'right' }); s.addShape(pres.shapes.RECTANGLE, { x: lx + (g.s - 1) / 14 * gw + 0.02, y: y + 0.06, w: (g.e - g.s + 1) / 14 * gw - 0.04, h: rh - 0.12, fill: { color: col[g.f] }, line: { type: 'none' } }); });
    const yb = y0 + M.GANTT.length * rh;
    M.HITOS.forEach((h) => { const x = lx + h.s / 14 * gw; s.addShape(pres.shapes.LINE, { x, y: y0 - 0.05, w: 0, h: yb - y0 + 0.1, line: { color: C.ink, width: 1, dashType: 'dash' } }); text(s, h.n, { x: x - 0.5, y: yb + 0.08, w: 1.0, h: 0.35, fontSize: 13, bold: true, color: C.pur, align: 'center' }); });
    const tot = M.ESFUERZO.reduce((a, b) => a + b.h, 0);
    card(s, MX, 6.25, W - 2 * MX, 0.6, { fill: C.paper });
    text(s, [{ text: `Esfuerzo estimado: ${tot} horas-persona · `, options: { bold: true } }, { text: M.ESFUERZO.map((e) => `${e.f} ${e.h} h`).join(' · ') + ` · Presupuesto referencial: S/ ${(tot * M.TARIFA_REF).toLocaleString('es-PE')} (tarifa hipotética de S/ ${M.TARIFA_REF}/h; no es un costo real)` }], { x: MX + 0.25, y: 6.25, w: W - 2 * MX - 0.5, h: 0.6, fontSize: 11.5, valign: 'middle' });
  }

  // 39 ─ Matriz de riesgos
  {
    const s = add({ n: 39, title: 'Matriz de riesgos', kicker: '05 · Gestión', t: 55,
      obj: 'Presentar los riesgos principales y su mitigación.',
      oral: 'Identificamos doce riesgos y los ubicamos por probabilidad e impacto. El más alto es R-01: especificaciones técnicas no verificadas, que es probable y tiene alto impacto; lo mitigamos con el estado de verificación y publicando «pendiente» en lugar de inventar. Otros relevantes: R-07, vulnerabilidades de WordPress; R-02, actualizaciones incompatibles de plugins; y R-11, que el alcance crezca hacia una tienda en línea. RUP ataca los riesgos temprano: por eso varios se tratan ya en Elaboración.',
      conceptos: ['Probabilidad × impacto', 'Mitigación', 'Riesgo atacado temprano'], trans: '¿Cómo demostramos que todo es un mismo sistema? Con la trazabilidad.' });
    base(s, { kicker: '05 · Gestión', title: '12 riesgos, atacados desde las primeras fases' });
    const gx = MX + 0.6, gy = 1.65, cs = 0.88;
    for (let p = 5; p >= 1; p--) for (let i = 1; i <= 5; i++) {
      const sc = p * i, fill = sc < 6 ? 'F3F4F6' : sc < 12 ? 'DDD6FE' : sc < 16 ? C.purM : C.pur;
      const x = gx + (i - 1) * cs, y = gy + (5 - p) * cs;
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: cs - 0.04, h: cs - 0.04, fill: { color: fill }, line: { type: 'none' } });
      const ids = M.RIESGOS.filter((r) => r.p === p && r.i === i).map((r) => r.id);
      if (ids.length) text(s, ids.join('\n'), { x, y, w: cs - 0.04, h: cs - 0.04, fontSize: 10, bold: true, color: sc >= 16 ? C.white : C.ink, align: 'center', valign: 'middle' });
    }
    text(s, 'Probabilidad ↑', { x: MX - 0.55, y: gy + 2.0, w: 1.6, h: 0.3, fontSize: 10, color: C.mute, rotate: 270 });
    text(s, 'Impacto →', { x: gx, y: gy + 5 * cs + 0.05, w: 4.4, h: 0.3, fontSize: 10, color: C.mute, align: 'center' });
    const top = [...M.RIESGOS].sort((a, b) => b.p * b.i - a.p * a.i).slice(0, 4);
    top.forEach((r, i) => { const y = 1.65 + i * 1.22; card(s, 5.9, y, W - MX - 5.9, 1.1, { fill: i === 0 ? C.pur : C.paper }); text(s, `${r.id} · P×I = ${r.p * r.i}`, { x: 6.1, y: y + 0.08, w: 2.6, h: 0.3, fontSize: 11, bold: true, color: i === 0 ? C.purL : C.pur }); text(s, r.n, { x: 6.1, y: y + 0.36, w: 6.5, h: 0.32, fontSize: 13.5, bold: true, color: i === 0 ? C.white : C.ink }); text(s, r.m, { x: 6.1, y: y + 0.68, w: 6.5, h: 0.4, fontSize: 10.5, color: i === 0 ? C.purL : C.mute }); });
  }

  // 40 ─ Trazabilidad
  {
    const t = M.TRAZA.find((x) => x.nb === 'NB-06');
    const s = add({ n: 40, title: 'Trazabilidad', kicker: '05 · Gestión', t: 60,
      obj: 'Demostrar que todos los artefactos pertenecen al mismo sistema.',
      oral: 'La trazabilidad conecta cinco niveles: necesidad del negocio, requisito, caso de uso, componente y caso de prueba. Un ejemplo completo: la necesidad NB-06, dar trazabilidad a las consultas, se cubre con el requisito RF-014, registrar la consulta; que se modela en el caso de uso CU-09; se implementa en el componente de consultas de WhatsApp; y se verifica con el caso de prueba CP-014. Si mañana cambia RF-014, la matriz nos dice exactamente qué revisar. Las nueve necesidades tienen su cadena completa.',
      conceptos: ['Matriz de trazabilidad', 'Análisis de impacto'], trans: '¿Qué resultados obtuvimos?' });
    base(s, { kicker: '05 · Gestión', title: 'Una cadena por cada necesidad del negocio' });
    const chain = [['Necesidad', 'NB-06', 'Trazabilidad de consultas'], ['Requisito', 'RF-014', 'Registrar consulta comercial'], ['Caso de uso', 'CU-09', 'Registrar consulta comercial'], ['Componente', 'COMP-06', 'Consultas WhatsApp'], ['Prueba', 'CP-014', 'Registro previo a la redirección']];
    const cw = (W - 2 * MX - 4 * 0.3) / 5;
    chain.forEach(([k, c, d], i) => { const x = MX + i * (cw + 0.3); card(s, x, 1.7, cw, 2.1, { fill: i === 2 ? C.pur : C.ink }); text(s, k.toUpperCase(), { x: x + 0.2, y: 1.85, w: cw - 0.3, h: 0.3, fontSize: 10, bold: true, color: C.purL, charSpacing: 1.5 }); text(s, c, { x: x + 0.2, y: 2.2, w: cw - 0.3, h: 0.6, fontSize: 24, bold: true, color: C.white }); text(s, d, { x: x + 0.2, y: 2.85, w: cw - 0.3, h: 0.8, fontSize: 12.5, color: C.mute2 }); if (i < 4) text(s, '→', { x: x + cw, y: 2.4, w: 0.3, h: 0.6, fontSize: 20, bold: true, color: C.pur, align: 'center' }); });
    const rows = [[{ text: 'Necesidad', options: { bold: true, color: C.white, fill: { color: C.ink } } }, { text: 'Requisitos', options: { bold: true, color: C.white, fill: { color: C.ink } } }, { text: 'Casos de uso', options: { bold: true, color: C.white, fill: { color: C.ink } } }, { text: 'Pruebas', options: { bold: true, color: C.white, fill: { color: C.ink } } }]];
    M.TRAZA.slice(2, 7).forEach((r) => rows.push([`${r.nb} ${M.NECESIDADES.find((n) => n.id === r.nb).t}`, r.rf.join(', '), r.cu.join(', '), r.cp.join(', ')].map((x) => ({ text: x, options: r.nb === 'NB-06' ? { fill: { color: C.purL } } : {} }))));
    s.addTable(rows, { x: MX, y: 4.1, w: W - 2 * MX, colW: [4.6, 2.9, 2.2, 2.43], fontFace: F, fontSize: 11, rowH: 0.36, border: { type: 'solid', color: C.line, pt: 0.75 }, valign: 'middle' });
    source(s, 'Extracto (5 de 9 necesidades). Matriz completa: monografía, Tabla 28, y el libro de anexos.');
  }

  // 41 ─ Resultados esperados
  {
    const s = add({ n: 41, title: 'Resultados esperados', kicker: '05 · Resultados', t: 55,
      obj: 'Diferenciar resultados documentados, de diseño y beneficios esperados.',
      oral: 'Separamos tres tipos de resultado. Documentados: lo que la evidencia muestra del rediseño, por ejemplo 118 productos y el comparador. De diseño: lo que produjimos nosotros, con 40 requisitos, 22 casos de uso, 22 diagramas UML, 15 tablas y 32 pruebas. Y beneficios esperados, que son hipótesis: para cada uno proponemos un indicador medible, como el porcentaje de consultas con producto identificado. No afirmamos mejoras de ventas ni de tráfico, porque no tenemos esos datos.',
      conceptos: ['Resultado documentado', 'Resultado de diseño', 'Beneficio esperado con indicador'], trans: 'Con esto, nuestras conclusiones.' });
    base(s, { kicker: '05 · Resultados', title: 'Documentado, diseñado y esperado: tres cosas distintas' });
    const c3 = [['DOCUMENTADO', 'Evidencia archivada', ['118 productos en 12 categorías', 'Comparador de hasta 3 modelos', '«Cotizar» con el modelo escrito', 'Sin directorio de distribuidores'], C.paper, C.ink], ['DISEÑADO', 'Producto de este proyecto', [`${M.RF.length} RF + ${M.RNF.length} RNF`, `${M.CU.length} casos de uso`, `${M.DIAGRAMAS.length} diagramas UML`, `${Object.keys(M.DICCIONARIO).length} tablas · ${M.CP.length} pruebas`], C.ink, C.white], ['ESPERADO', 'Hipótesis con indicador', ['% de fichas con datos VERIFICADOS', '% de consultas con el producto identificado', 'Consultas por producto y mes', '% derivadas o cerradas en 7 días'], C.purL, C.ink]];
    c3.forEach(([k, d, items, fill, col], i) => { const x = MX + i * 4.1; card(s, x, 1.65, 3.9, 4.9, { fill }); text(s, k, { x: x + 0.3, y: 1.85, w: 3.3, h: 0.35, fontSize: 12, bold: true, color: i === 1 ? C.purM : C.pur, charSpacing: 2 }); text(s, d, { x: x + 0.3, y: 2.2, w: 3.3, h: 0.35, fontSize: 12.5, color: i === 1 ? C.mute2 : C.mute }); text(s, items.map((a, k2) => ({ text: a, options: { breakLine: k2 < items.length - 1, paraSpaceAfter: 14 } })), { x: x + 0.3, y: 2.8, w: 3.3, h: 3.6, fontSize: 16, bold: true, color: col }); });
  }

  // 42 ─ Conclusiones
  {
    const s = add({ n: 42, title: 'Conclusiones', kicker: '05 · Resultados', t: 60,
      obj: 'Cerrar con las conclusiones principales.',
      oral: 'Cuatro conclusiones. Primera: RUP nos permitió pasar de «mejorar la web» a un sistema delimitado de 22 casos de uso, con un alcance protegido. Segunda: el valor está en el tramo entre la ficha y el distribuidor; por eso los casos de uso críticos son consultar, comparar y enviar la consulta. Tercera: la arquitectura extiende en lugar de reemplazar, lo que reduce costo y riesgo. Cuarta: la trazabilidad demuestra que todos los entregables describen el mismo sistema y que lo propuesto está claramente separado de lo existente.',
      conceptos: ['Alcance protegido', 'Valor en el flujo comercial', 'Extender, no reemplazar'], trans: 'Y nuestras recomendaciones.' });
    base(s, { kicker: '05 · Resultados', title: 'Conclusiones', dark: true });
    const cc = [['01', 'RUP convirtió «mejorar la web» en 22 casos de uso con el alcance protegido por reglas: sin checkout, sin inventario, sin ERP.'], ['02', 'El valor está entre la ficha y el distribuidor: CU-04, CU-05 y CU-08/09 son los casos críticos.'], ['03', 'La arquitectura extiende la plataforma existente con un plugin propio: menor costo y menor riesgo.'], ['04', 'La trazabilidad une todos los entregables, y lo propuesto queda separado de lo existente.']];
    cc.forEach(([n, t], i) => { const x = MX + (i % 2) * 6.15, y = 1.75 + Math.floor(i / 2) * 2.45; text(s, n, { x, y, w: 1.0, h: 0.7, fontSize: 32, bold: true, color: C.purM }); text(s, t, { x: x + 1.05, y: y + 0.05, w: 4.85, h: 2.1, fontSize: 17, color: C.white }); });
  }

  // 43 ─ Recomendaciones
  {
    const s = add({ n: 43, title: 'Recomendaciones', kicker: '05 · Resultados', t: 45,
      obj: 'Proponer los siguientes pasos concretos.',
      oral: 'Recomendamos, en orden: primero, obtener la documentación técnica oficial de cada modelo antes de publicar especificaciones. Segundo, implementar el registro de consultas, porque es barato y genera un dato que hoy no existe. Tercero, validar la lista de distribuidores con el área comercial. Cuarto, medir el rendimiento en producción y no en el entorno temporal. Y quinto, evaluar la API de WhatsApp Business solo si el volumen lo justifica.',
      conceptos: ['Priorización de siguientes pasos'], trans: 'Estas son las fuentes que usamos.' });
    base(s, { kicker: '05 · Resultados', title: 'Recomendaciones, en orden de prioridad' });
    const rr = [['LuFileSearch', 'Obtener la documentación técnica oficial antes de publicar especificaciones.'], ['LuHistory', 'Implementar primero el registro de consultas (CU-09): bajo costo, dato nuevo.'], ['LuMapPin', 'Validar con el área comercial la lista inicial de distribuidores.'], ['LuRocket', 'Medir el rendimiento en producción y retirar el noindex al publicar.'], ['LuMessageCircle', 'Evaluar la API de WhatsApp Business solo si el volumen lo justifica.']];
    for (let i = 0; i < rr.length; i++) { const y = 1.75 + i * 1.02; await iconCircle(s, rr[i][0], MX, y + 0.08, 0.66, i === 1 ? C.pur : C.purL, i === 1 ? C.white : C.pur); text(s, rr[i][1], { x: MX + 0.95, y, w: 11.2, h: 0.82, fontSize: 17, valign: 'middle', bold: i === 1 }); }
  }

  // 44 ─ Referencias
  {
    const s = add({ n: 44, title: 'Referencias', kicker: 'Fuentes', t: 20,
      obj: 'Mostrar las fuentes principales.',
      oral: 'Estas son las fuentes principales: los textos de Kruchten y de Jacobson, Booch y Rumbaugh sobre RUP y UML, la especificación UML del OMG, Larman para el análisis orientado a objetos y Quatrani para Rational Rose. La lista completa, en formato APA 7, está en la monografía.',
      conceptos: ['APA 7'], trans: 'Muchas gracias. Quedamos atentos a sus preguntas.' });
    base(s, { kicker: 'Fuentes', title: 'Referencias principales' });
    const refs = M.REFERENCIAS.filter((r) => /Kruchten|Jacobson|Booch|Object Management|Larman|Quatrani|Sommerville|Pressman|Bass/.test(r));
    text(s, refs.map((r, i) => ({ text: r, options: { breakLine: i < refs.length - 1, paraSpaceAfter: 7 } })), { x: MX, y: 1.6, w: W - 2 * MX, h: 4.9, fontSize: 12.5, color: C.ink });
    source(s, 'Lista completa en APA 7: monografía, sección Referencias. Caso: sitio oficial de Black Hawk (consultado el 29-09-2026) y evidencia archivada del rediseño.');
  }

  // 45 ─ Preguntas
  {
    const s = add({ n: 45, title: 'Preguntas', kicker: '', t: 20,
      obj: 'Abrir la ronda de preguntas.',
      oral: 'Gracias por su atención. Quedamos atentos a sus preguntas.',
      conceptos: [], trans: '—' });
    s.background = { color: C.ink };
    s.addImage({ path: 'research/logo-w-t.png', x: W / 2 - 1.1, y: 1.6, w: 2.2, h: 1.17 });
    text(s, '¿Preguntas?', { x: 0, y: 3.2, w: W, h: 1.2, fontSize: 54, bold: true, color: C.white, align: 'center' });
    text(s, 'SGCD-BH · Aplicación de RUP a Black Hawk Car Audio', { x: 0, y: 4.5, w: W, h: 0.5, fontSize: 16, color: C.mute2, align: 'center' });
  }

  await pres.writeFile({ fileName: '../BLACK_HAWK_RUP_PRESENTACION.pptx' });
  fs.writeFileSync('slides_meta.json', JSON.stringify(META, null, 1));
  console.log('ok', META.length);
})();

function SPECS_BY(id) { return require('./specs').find((x) => x.id === id); }
