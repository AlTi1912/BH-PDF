// Genera BLACK_HAWK_RUP_GUIA_EXPOSICION_V3.docx a partir de slides_v3.json (diapositivas definitivas de la V3).
const fs = require('fs');
const V = require('./v3data');
const L = require('./docxlib');
const S = require('./slides_v3.json');
const { d } = L;
const { Document, Packer, Paragraph, TextRun, AlignmentType, Header, Footer, PageNumber, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, HeadingLevel } = d;

const W = 9638; // A4 con márgenes de 2 cm
const total = S.reduce((a, b) => a + b.t, 0);
const H1 = (t, br = false) => new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: br, children: [new TextRun(t)], spacing: { before: 120, after: 120 } });
const H2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, children: [new TextRun(t)], spacing: { before: 140, after: 60 } });
const small = (t, o = {}) => new Paragraph({ children: L.runs(t, { size: 18 }), spacing: { after: o.after ?? 30, line: 250 }, ...o });
const bl = (items) => items.map((t) => new Paragraph({ numbering: { reference: 'vinetas', level: 0 }, children: L.runs(t, { size: 18 }), spacing: { after: 20, line: 250 } }));
const b = { style: BorderStyle.SINGLE, size: 4, color: 'E3E4E8' };
const nb = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };

function grid(head, rows, widths) {
  const cell = (t, i, h) => new TableCell({ width: { size: widths[i], type: WidthType.DXA }, shading: h ? { fill: '0B0B0D', type: ShadingType.CLEAR, color: 'auto' } : (i === 0 ? { fill: 'F3EEFC', type: ShadingType.CLEAR, color: 'auto' } : undefined), margins: { top: 30, bottom: 30, left: 90, right: 90 }, borders: { top: b, bottom: b, left: nb, right: nb },
    children: [new Paragraph({ children: h ? [new TextRun({ text: t, bold: true, color: 'FFFFFF', size: 17 })] : L.runs(t, { size: 17 }), spacing: { line: 240 } })] });
  return [new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: widths, rows: [
    new TableRow({ tableHeader: true, children: head.map((t, i) => cell(t, i, true)) }),
    ...rows.map((r) => new TableRow({ cantSplit: true, children: r.map((t, i) => cell(t, i, false)) })),
  ] }), new Paragraph({ spacing: { after: 80 }, children: [] })];
}

function slideBlock(s) {
  const head = new TableRow({ cantSplit: true, children: [new TableCell({ columnSpan: 2, width: { size: W, type: WidthType.DXA }, shading: { fill: '0B0B0D', type: ShadingType.CLEAR, color: 'auto' }, margins: { top: 50, bottom: 50, left: 110, right: 110 }, borders: { top: nb, bottom: nb, left: nb, right: nb },
    children: [new Paragraph({ children: [new TextRun({ text: `${s.n}  `, bold: true, color: 'A78BFA', size: 20 }), new TextRun({ text: s.title, bold: true, color: 'FFFFFF', size: 20 }), new TextRun({ text: s.t ? `   ·  ${s.t} s` : '   ·  respaldo', color: '9CA3AF', size: 17 })] })] })] });
  const row = (k, content) => new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: 1750, type: WidthType.DXA }, shading: { fill: 'F3EEFC', type: ShadingType.CLEAR, color: 'auto' }, margins: { top: 30, bottom: 30, left: 110, right: 80 }, borders: { top: b, bottom: b, left: nb, right: nb }, children: [small(`**${k}**`)] }),
    new TableCell({ width: { size: W - 1750, type: WidthType.DXA }, margins: { top: 30, bottom: 30, left: 110, right: 110 }, borders: { top: b, bottom: b, left: nb, right: nb }, children: content }),
  ] });
  const rows = [head, row('Mensaje principal', [small(s.msg)]), row('Explicación natural', [small(s.exp)])];
  if (s.ej && s.ej !== '—') rows.push(row('Ejemplo Black Hawk', [small(s.ej)]));
  if (s.con && s.con.length) rows.push(row('Conceptos', [small(s.con.map((k) => `**${k}**`).join('  ·  '))]));
  if (s.preg && s.preg[0]) rows.push(row('Posible pregunta', [new Paragraph({ children: [new TextRun({ text: s.preg[0], bold: true, size: 18 })], spacing: { after: 30, line: 250 } }), small(s.preg[1])]));
  return [new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [1750, W - 1750], rows }), new Paragraph({ spacing: { after: 90 }, children: [] })];
}

const c = [];
c.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: 'GUÍA DE EXPOSICIÓN · V3', bold: true, size: 32 })] }));
c.push(new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: 'Aplicación de RUP en la renovación de la plataforma web de Black Hawk Car Audio', size: 20, color: L.MUTED })] }));
c.push(small(`**Cómo usar esta guía.** Corresponde diapositiva por diapositiva a BLACK_HAWK_RUP_PRESENTACION_V3.pptx (${S.length} diapositivas, unos ${Math.round(total / 60)} minutos; la 28 es de respaldo y solo se muestra si preguntan). No es un texto para memorizar: explica qué cuenta cada diapositiva para que lo digas con tus palabras. Las notas del orador del PowerPoint tienen el mismo contenido.`, { after: 60 }));
c.push(small('**Tres reglas.** (1) Separa siempre las tres partes: el **sitio original** (punto de partida), la **web renovada** (lo que desarrollaste) y las **ampliaciones** (lo que propones). (2) Si algo es propuesta, dilo: «esto lo propongo». (3) No prometas resultados comerciales: un clic en «Cotizar» abre WhatsApp, no es una venta.', { after: 60 }));
c.push(small('**Tiempos.** Contexto y problema (1–6): unos 5,5 min. Solución y antes/después (7–11): unos 5 min. RUP (12–18): unos 7 min. Requisitos y UML (19–24): unos 5,5 min. Cierre (25–27): unos 2 min.', { after: 140 }));

c.push(H1('1. El proyecto explicado en dos minutos'));
[
  'Black Hawk es una marca peruana de car audio que vende a través de su área comercial y de distribuidores. Su web no es una tienda: muestra el catálogo y orienta la compra. Ya tenía una plataforma en WordPress y WooCommerce con 110 productos en 11 categorías, así que el proyecto no parte de cero.',
  'Al analizar ese sitio original encontré que informa, pero no guía hacia una acción comercial: el botón «Productos» abre una tienda vacía, la ficha no tiene un paso para consultar, el menú no lleva a contacto ni a dónde comprar, y el canal mayorista está escondido. El problema es que la plataforma muestra el catálogo, pero no lleva al usuario desde el interés en un producto hasta el contacto comercial.',
  'Mi solución es la web renovada, construida sobre la misma plataforma con un tema hijo. Tiene una identidad visual nueva, un catálogo de 118 productos con filtros, fichas con especificaciones en lista, un comparador de hasta tres modelos y el botón «Cotizar», que abre WhatsApp con el modelo ya escrito. También agregué las páginas Dónde comprar, Mayoristas y Soporte. Hoy funciona en un entorno de prueba.',
  'Para organizar el trabajo usé RUP. En Inicio analicé el sitio y acordé el alcance; en Elaboración definí requisitos, modelé con UML y decidí la arquitectura; en Construcción desarrollé la web por incrementos (esa fase sigue en curso), y Transición, que es la publicación en el dominio oficial, está planificada. Además propongo ampliaciones: registrar el inicio de cada consulta, un directorio estructurado de distribuidores y reportes. No afirmo aumentos de ventas: se medirán con datos reales cuando la web se publique.',
].forEach((t) => c.push(small(t, { after: 70 })));

c.push(H1('2. Explicaciones clave'));

c.push(H2('2.1 El problema de la web original'));
c.push(small('No digas que Black Hawk «no tenía sistema»: tenía uno y funcionaba como catálogo. Lo que faltaba era el recorrido comercial. Los hallazgos están en capturas del sitio original del 29-09-2026 y se clasifican en tres tipos:', { after: 40 }));
c.push(...grid(['#', 'Hallazgo', 'Tipo'], V.HALLAZGOS.map((h) => [String(h.n), h.t, V.TIPOS[h.tipo]]), [500, 6638, 2500]));
c.push(small('Matiz importante: WhatsApp sí existe en el sitio original, pero solo en la página de ventas al mayor. Por eso el hallazgo 4 es «poco visible» y no «inexistente».', { after: 60 }));

c.push(H2('2.2 Qué sistema le brindo a Black Hawk'));
c.push(...grid(['Parte', 'Qué es', 'Estado'], V.TRES.map((x) => [`${x.k} · ${x.n}`, x.d, x.estado]), [2200, 5638, 1800]));
c.push(small('Frase para defenderlo: «Mi aporte es la web renovada: rediseñé la marca, el catálogo y el recorrido hasta la cotización, sobre la misma plataforma. Las ampliaciones son una propuesta para después».', { after: 60 }));

c.push(H2('2.3 Funcionalidades del rediseño'));
c.push(...grid(['Grupo', 'Qué incluye', 'Estado'], V.FUNCIONES.map((f) => [`${f.k} · ${f.n}`, f.items.join('; '), f.e === 'Propuesto' ? 'Ampliación propuesta' : f.e]), [2200, 5638, 1800]));
c.push(small('«Base WordPress» significa que la administración usa el panel que ya existía (WooCommerce y WordPress). No programé un panel nuevo y no hay que presentarlo como desarrollo propio.', { after: 60 }));

c.push(H2('2.4 Por qué RUP'));
c.push(...bl([
  '**Es iterativo:** la web no se hizo de una vez. Primero la identidad y la home, luego el catálogo y la ficha, y después el recorrido de cotización.',
  '**Está dirigido por casos de uso:** «Cotizar por WhatsApp» guió el diseño de la ficha, del mensaje y de las verificaciones.',
  '**Está centrado en la arquitectura:** la decisión clave (rediseñar con un tema hijo sobre WooCommerce en lugar de reemplazar la plataforma) se tomó en Elaboración, antes de construir.',
  '**Encaja con el curso:** exige análisis y diseño formales con UML, y RUP combina iteraciones con hitos y artefactos de modelado.',
]));

c.push(H2('2.5 Cómo se aplican las cuatro fases'));
c.push(...grid(['Fase · hito', 'Qué se hizo en Black Hawk', 'Estado'], V.FASES.map((f) => [`${f.n} · ${f.hito} (${f.hitoN})`, `${f.obj} ${f.bh}`, f.estado]), [2400, 5638, 1600]));
c.push(small(`Iteraciones: ${V.ITER.map((i) => `${i.id} (${i.e.toLowerCase()})`).join(', ')}. Construcción está en curso porque el rediseño funciona, pero las ampliaciones están planificadas. Transición no se ha hecho: no digas que la web está publicada.`, { after: 60 }));

c.push(H2('2.6 Qué representa cada diagrama UML'));
c.push(...grid(['Diagrama', 'Qué responde', 'Lo que conviene señalar'], [
  ['Casos de uso', '¿Quién usa la web y qué puede hacer?', 'Actores a la izquierda (visitante, cliente interesado, distribuidor) y el gestor a la derecha; WhatsApp es un sistema externo. Los casos en morado son propuestos.'],
  ['Actividades', '¿Cómo avanza el recorrido paso a paso?', 'Tres calles: cliente, web renovada y área comercial. La acción en morado (registrar la consulta) es la ampliación.'],
  ['Secuencia', '¿Qué mensajes se intercambian al cotizar?', 'La ficha pide el producto a WooCommerce, arma el mensaje con el modelo y abre WhatsApp. La web solo inicia la consulta.'],
  ['Clases', '¿Cómo se organiza la información?', 'Producto en el centro; categorías, especificaciones e imágenes. Distribuidor y EventoConsulta son clases propuestas.'],
  ['Componentes', '¿Cómo está armado técnicamente?', 'El rediseño vive en el tema hijo rozer-child; WooCommerce, YITH Catalog Mode, WordPress y MySQL son la base; el módulo propio es propuesto.'],
  ['Despliegue (respaldo)', '¿Dónde se ejecuta?', 'Navegador, servidor web con WordPress y base de datos; hoy en un entorno de prueba. Solo se muestra si preguntan.'],
], [1900, 3000, 4738]));
c.push(small('Recuerda la diferencia: **RUP** es la metodología, **UML** es el lenguaje de los diagramas y **Rational Rose** es una herramienta para dibujarlos. Los diagramas están en PlantUML y se pueden reconstruir en Rose.', { after: 60 }));

c.push(H2('2.7 Qué está desarrollado y qué está propuesto'));
c.push(...grid(['Desarrollado (web renovada)', 'Propuesto (ampliaciones)'], [
  ['Identidad visual, home y diseño adaptable al celular', 'Registro del inicio de cada consulta (qué producto, desde qué página)'],
  ['Catálogo de 118 productos con pestañas, contador y filtros', 'Directorio estructurado de distribuidores por ciudad'],
  ['Fichas con especificaciones en lista; búsqueda con tipo y potencia', 'Reportes de productos más consultados'],
  ['Comparador de hasta 3 modelos (se guarda 24 h en el navegador)', 'Auditoría de cambios en el catálogo'],
  ['«Cotizar» en encabezado y ficha, con el modelo en el mensaje de WhatsApp', 'Seguimiento comercial, si se añade un mecanismo adicional'],
  ['Páginas Dónde comprar, Mayoristas y Soporte', '—'],
], [4819, 4819]));
c.push(small('No forman parte del proyecto: carrito y pagos, ERP o inventario, un CRM, la API de WhatsApp Business y una aplicación móvil. El sistema no sabe si el cliente compró: solo que se abrió WhatsApp desde una página (y eso, solo con la ampliación de registro).', { after: 60 }));

c.push(H1('3. Guion por diapositiva', true));
S.forEach((s) => c.push(...slideBlock(s)));

c.push(H1('4. Preguntas difíciles'));
const Q = [
  ['¿Cuántas ventas generó la web renovada?', 'Ninguna cifra: la web aún no está publicada y un clic en «Cotizar» no es una venta. Cuando se publique, se podrá medir cuántas consultas se inician y desde qué productos.'],
  ['¿Usa un CRM o la API de WhatsApp Business?', 'No. El botón usa un enlace wa.me que abre WhatsApp con un mensaje escrito. La conversación la atiende el área comercial en su propio WhatsApp.'],
  ['¿Las capturas del «antes» son reales?', 'Sí: son del sitio original blackhawkcaraudio.com, tomadas el 29-09-2026. No usé capturas de la web renovada para representar el estado anterior.'],
  ['¿Qué mejoras tienen datos medidos?', 'Solo el peso y las peticiones de página (Lighthouse, 23-09-2026): la ficha del BH-SW12XXG pasó de 5,28 MB a 0,38 MB y de 61 a 35 peticiones; la home, de 2,53 MB a 1,15 MB. Lo demás es comparación de pantallas.'],
  ['¿Por qué Construcción está «en curso» si la web ya funciona?', 'Porque el rediseño está hecho, pero las ampliaciones (registro, directorio, reportes) y las pruebas formales están planificadas.'],
  ['¿Qué pruebas se ejecutaron?', 'Verificaciones funcionales documentadas con capturas: búsqueda, límite de 3 en el comparador, persistencia de la selección, menú y ficha en el celular. Las pruebas unitarias y de aceptación formales están planificadas.'],
  ['¿El catálogo tiene los mismos productos que el sitio original?', 'No exactamente: el sitio original publica 110 productos en 11 categorías; la web renovada, 118 en 12 (se agregó «Cargadores»). Siempre digo de qué web es cada cifra.'],
  ['¿Qué haría si Black Hawk pide vender en línea?', 'Sería un cambio de alcance: habría que revisar su modelo comercial, pagos, stock y logística. Hoy se excluye porque venden por distribuidores.'],
];
Q.forEach(([q, a], i) => { c.push(new Paragraph({ keepNext: true, spacing: { before: 60, after: 10 }, children: [new TextRun({ text: `${i + 1}. ${q}`, bold: true, size: 19 })] })); c.push(small(a, { after: 40 })); });

const header = new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Guía de exposición V3 · Black Hawk × RUP', size: 16, color: L.MUTED })] })] });
const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: L.MUTED })] })] });
const doc = new Document({
  creator: 'Proyecto RUP Black Hawk', title: 'Guía de exposición V3 — Black Hawk × RUP',
  styles: { ...L.baseStyles, paragraphStyles: L.baseStyles.paragraphStyles.map((s) => (s.id === 'Heading1' ? { ...s, run: { ...s.run, size: 26 }, paragraph: { ...s.paragraph, spacing: { before: 200, after: 100 } } } : s.id === 'Heading2' ? { ...s, run: { ...s.run, size: 21 } } : s)) },
  numbering: L.numbering,
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } }, headers: { default: header }, footers: { default: footer }, children: c }],
});
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync('../BLACK_HAWK_RUP_GUIA_EXPOSICION_V3.docx', buf); console.log('ok', S.length, Q.length, total); });
