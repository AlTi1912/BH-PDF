// Genera BLACK_HAWK_RUP_GUIA_EXPOSICION_V2.docx a partir de slides_v2.json (diapositivas definitivas de la V2).
const fs = require('fs');
const V = require('./v2data');
const L = require('./docxlib');
const S = require('./slides_v2.json');
const { d, P, bullets } = L;
const { Document, Packer, Paragraph, TextRun, AlignmentType, Header, Footer, PageNumber, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, HeadingLevel } = d;

const W = 9638; // A4 con márgenes de 2 cm
const total = S.reduce((a, b) => a + b.t, 0);
const H1 = (t, br = false) => new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: br, children: [new TextRun(t)], spacing: { before: 120, after: 120 } });
const small = (t, o = {}) => new Paragraph({ children: L.runs(t, { size: 18 }), spacing: { after: o.after ?? 30, line: 250 }, ...o });
const b = { style: BorderStyle.SINGLE, size: 4, color: 'E3E4E8' };
const nb = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };

function slideBlock(s) {
  const head = new TableRow({ cantSplit: true, children: [new TableCell({ columnSpan: 2, width: { size: W, type: WidthType.DXA }, shading: { fill: '0B0B0D', type: ShadingType.CLEAR, color: 'auto' }, margins: { top: 50, bottom: 50, left: 110, right: 110 }, borders: { top: nb, bottom: nb, left: nb, right: nb },
    children: [new Paragraph({ children: [new TextRun({ text: `${s.n}  `, bold: true, color: 'A78BFA', size: 20 }), new TextRun({ text: s.visible || s.title, bold: true, color: 'FFFFFF', size: 20 }), new TextRun({ text: `   ·  ${s.t} s`, color: '9CA3AF', size: 17 })] })] })] });
  const row = (k, content) => new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: 1700, type: WidthType.DXA }, shading: { fill: 'F3EEFC', type: ShadingType.CLEAR, color: 'auto' }, margins: { top: 30, bottom: 30, left: 110, right: 80 }, borders: { top: b, bottom: b, left: nb, right: nb }, children: [small(`**${k}**`)] }),
    new TableCell({ width: { size: W - 1700, type: WidthType.DXA }, margins: { top: 30, bottom: 30, left: 110, right: 110 }, borders: { top: b, bottom: b, left: nb, right: nb }, children: content }),
  ] });
  const rows = [head, row('Idea principal', [small(s.idea)])];
  if (s.n !== 15) {
    rows.push(row('Qué explicar', s.explicar.map((e) => new Paragraph({ numbering: { reference: 'vinetas', level: 0 }, children: L.runs(e, { size: 18 }), spacing: { after: 10, line: 250 } }))));
    rows.push(row('Ejemplo Black Hawk', [small(s.ejemplo)]));
    rows.push(row('Palabras clave', [small(s.claves.map((k) => `**${k}**`).join('  ·  '))]));
    rows.push(row('Transición', [small(`_«${s.trans}»_`)]));
  }
  return [new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [1700, W - 1700], rows }), new Paragraph({ spacing: { after: 90 }, children: [] })];
}

const c = [];
c.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: 'GUÍA DE EXPOSICIÓN · V2', bold: true, size: 32 })] }));
c.push(new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: 'Aplicación de la metodología RUP en el diseño de un sistema de información para Black Hawk · SGCD-BH', size: 20, color: L.MUTED })] }));
c.push(small(`**Cómo usar esta guía.** No es un texto para memorizar: explica qué cuenta cada diapositiva para que lo digas con tus palabras. Corresponde a BLACK_HAWK_RUP_PRESENTACION_V2.pptx (${S.length} diapositivas, unos ${Math.round(total / 60)} minutos). Las notas del orador del PowerPoint tienen el mismo contenido.`, { after: 60 }));
c.push(small('**Reparto sugerido:** integrante 1, diapositivas 1–4 (la empresa y el problema); integrante 2, 5–7 (la propuesta); integrante 3, 8–9 (RUP); integrante 4, 10–12 (el diseño); integrante 5, 13–15 (resultados y cierre).', { after: 60 }));
c.push(small('**Tres reglas.** (1) Si algo es propuesta, dilo: «esto lo proponemos». (2) Si algo existe, di de dónde lo sabes: «lo vimos en la web renovada». (3) Nombra los modelos tal como aparecen en la web: BH-FR1500.1, BH-SW12XZP.', { after: 140 }));

c.push(H1('1. El proyecto explicado en dos minutos'));
[
  'Black Hawk es una marca peruana de audio para autos. Su web renovada tiene 118 productos en 12 categorías y funciona como catálogo: no vende en línea. El cliente busca un producto, revisa la ficha, compara hasta tres modelos y pulsa «Cotizar», que abre WhatsApp con el modelo ya escrito. La compra ocurre después, con el área comercial o un distribuidor.',
  'El problema es que a ese recorrido le faltan tres cosas: la información técnica está como texto y no como datos ordenados, no hay un directorio para llegar a un distribuidor y las consultas no dejan registro, así que la empresa no sabe qué productos generan interés.',
  'Proponemos el SGCD-BH, un sistema que se construye sobre la misma web (WordPress y WooCommerce) con un módulo propio. Registra cada consulta antes de abrir WhatsApp, agrega el enlace del producto al mensaje, organiza a los distribuidores por ciudad y permite al gestor dar seguimiento y ver reportes. No es una tienda ni un ERP.',
  'Para desarrollarlo usamos RUP, que es iterativo, dirigido por casos de uso y centrado en la arquitectura. En Inicio definimos el problema y el alcance; en Elaboración, los requisitos, los casos de uso, los diagramas UML y la arquitectura. Construcción y Transición quedan planificadas. Esta entrega cubre el análisis y el diseño; los beneficios se medirán cuando el sistema se implemente.',
].forEach((t) => c.push(small(t, { after: 70 })));

c.push(H1('2. Guion por diapositiva'));
S.forEach((s) => c.push(...slideBlock(s)));

c.push(H1('3. Preguntas que podría hacer el profesor'));
const Q = [
  ['¿Qué es RUP?', 'Una metodología de desarrollo de software que organiza el trabajo en cuatro fases con iteraciones. Es iterativa e incremental, dirigida por casos de uso y centrada en la arquitectura.'],
  ['¿Por qué RUP y no otra metodología?', 'Porque el curso pide análisis y diseño formales con UML, y porque en este caso lo más riesgoso es definir bien qué se publica y cómo se mide la consulta: RUP valida eso en Elaboración, antes de construir.'],
  ['¿Cuáles son las cuatro fases y cómo termina cada una?', 'Inicio (LCO: objetivos acordados), Elaboración (LCA: arquitectura validada), Construcción (IOC: versión operativa) y Transición (PR: entrega del producto).'],
  ['¿RUP no es una cascada?', 'No. En cada fase se repiten ciclos de análisis, diseño, desarrollo y prueba; cambia el peso de cada actividad. Por ejemplo, en Elaboración ya se programa un prototipo.'],
  ['¿Cuál es el objetivo del sistema?', 'Ordenar la información de los productos, llevar al comprador hasta un distribuidor y registrar las consultas para darles seguimiento.'],
  ['¿Qué diferencia hay entre un requisito funcional y uno no funcional?', 'El funcional dice qué hace el sistema (registrar una consulta); el no funcional, cómo debe hacerlo (cargar en 2,5 s o menos, funcionar en el celular).'],
  ['¿Qué es un caso de uso y qué es un actor?', 'Un caso de uso es algo que el sistema hace y que le da valor a un actor. Un actor es un rol, no una persona: el cliente, el gestor, el distribuidor o WhatsApp como sistema externo.'],
  ['¿Qué significa «include» en el diagrama?', 'Que un caso de uso siempre incluye a otro: cada vez que se envía una consulta, se registra.'],
  ['¿Qué diferencia hay entre RUP, UML y Rational Rose?', 'RUP es la metodología, UML es el lenguaje de los diagramas y Rational Rose es la herramienta para construirlos.'],
  ['¿Qué muestra el diagrama de clases?', 'Cómo se relacionan los datos: un producto pertenece a categorías y tiene especificaciones; una consulta puede referirse a un producto y derivarse a un distribuidor.'],
  ['¿Cómo es la arquitectura?', 'En capas: interfaz web, lógica (WooCommerce, YITH Catalog Mode y un módulo propio) y datos (MySQL). WhatsApp es externo: el sistema solo genera el enlace.'],
  ['¿Por qué no una tienda en línea?', 'Porque Black Hawk vende a través de su área comercial y de distribuidores. Un carrito sería una función sin proceso de negocio detrás.'],
  ['¿Qué es real y qué es propuesta?', 'Real: catálogo, fichas, comparador de 3 y «Cotizar» con el modelo. Propuesta: registro y seguimiento de consultas, enlace en el mensaje, directorio de distribuidores, datos estructurados y reportes.'],
  ['¿El sistema ya funciona?', 'No. Esta entrega es el análisis y el diseño. La construcción y la transición están planificadas en 14 semanas, como estimación académica.'],
  ['¿Cómo sabrán si cumple sus objetivos?', 'Con los criterios de aceptación de cada requisito y, después de implementarlo, con indicadores como el porcentaje de consultas con el producto identificado.'],
];
Q.forEach(([q, a], i) => { c.push(new Paragraph({ keepNext: true, spacing: { before: 60, after: 10 }, children: [new TextRun({ text: `${i + 1}. ${q}`, bold: true, size: 19 })] })); c.push(small(a, { after: 40 })); });

const header = new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Guía de exposición V2 · SGCD-BH', size: 16, color: L.MUTED })] })] });
const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: L.MUTED })] })] });
const doc = new Document({
  creator: 'Equipo del proyecto SGCD-BH', title: 'Guía de exposición V2 — SGCD-BH',
  styles: { ...L.baseStyles, paragraphStyles: L.baseStyles.paragraphStyles.map((s) => (s.id === 'Heading1' ? { ...s, run: { ...s.run, size: 26 }, paragraph: { ...s.paragraph, spacing: { before: 200, after: 100 } } } : s)) },
  numbering: L.numbering,
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } }, headers: { default: header }, footers: { default: footer }, children: c }],
});
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync('../BLACK_HAWK_RUP_GUIA_EXPOSICION_V2.docx', buf); console.log('ok', S.length, Q.length); });
