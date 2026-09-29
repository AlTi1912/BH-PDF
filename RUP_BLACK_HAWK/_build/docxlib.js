// Utilidades comunes para los documentos Word (monografía y guía de exposición).
const fs = require('fs');
const d = require('docx');
const {
  Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, ShadingType,
  BorderStyle, ImageRun, PageBreak, SequentialIdentifier, LevelFormat,
} = d;

const FONT = 'Arial';
const INK = '111111', MUTED = '5F6368', PURPLE = '6D28D9', PURPLE_L = 'F3EEFC', GREY_L = 'F2F2F4';
const CONTENT_W = 9070; // A4 con márgenes de 2,5 cm (DXA)

function pngSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

// Texto con **negrita** y _cursiva_ en línea
function runs(text, base = {}) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|_[^_]+_)/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(new TextRun({ text: text.slice(last, m.index), ...base }));
    const t = m[0];
    if (t.startsWith('**')) out.push(new TextRun({ text: t.slice(2, -2), ...base, bold: true }));
    else out.push(new TextRun({ text: t.slice(1, -1), ...base, italics: true }));
    last = m.index + t.length;
  }
  if (last < text.length) out.push(new TextRun({ text: text.slice(last), ...base }));
  return out;
}

const P = (text, opt = {}) => new Paragraph({
  children: runs(text, opt.run || {}),
  alignment: opt.align || AlignmentType.JUSTIFIED,
  spacing: { after: opt.after ?? 120, before: opt.before ?? 0, line: opt.line ?? 300 },
  indent: opt.indent, keepNext: opt.keepNext,
  style: opt.style,
});
const H1 = (t, pageBreak = true) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)], pageBreakBefore: pageBreak });
const H2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const H3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(t)] });
const bullets = (items, level = 0) => items.map((t) => new Paragraph({ numbering: { reference: 'vinetas', level }, children: runs(t), spacing: { after: 60, line: 288 } }));
let numInst = 0;
const numbered = (items) => { numInst += 1; return items.map((t) => new Paragraph({ numbering: { reference: 'numeros', level: 0, instance: numInst }, children: runs(t), spacing: { after: 60, line: 288 } })); };
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

// Pie de tabla o figura (APA 7: rótulo en negrita, título en cursiva, arriba del elemento)
const counters = { Figura: 0, Tabla: 0 };
function caption(kind, title) {
  counters[kind] += 1;
  return new Paragraph({
    style: kind === 'Figura' ? 'FigCaption' : 'TabCaption',
    keepNext: true, spacing: { before: 200, after: 80 },
    children: [new TextRun({ text: `${kind} ${counters[kind]}. `, bold: true }), new TextRun({ text: title, italics: true })],
  });
}
const note = (t) => new Paragraph({ children: runs(t, { size: 17, color: MUTED }), spacing: { after: 200, before: 60 }, alignment: AlignmentType.LEFT });

const border = { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' };
const borders = { top: border, bottom: border, left: border, right: border };
function table(head, rows, widths, opt = {}) {
  const total = widths.reduce((a, b) => a + b, 0);
  const scale = CONTENT_W / total;
  const w = widths.map((x) => Math.floor(x * scale));
  w[w.length - 1] += CONTENT_W - w.reduce((a, b) => a + b, 0);
  const size = opt.size || 17;
  const cell = (txt, i, hdr, shade) => new TableCell({
    width: { size: w[i], type: WidthType.DXA }, borders,
    shading: hdr ? { fill: INK, type: ShadingType.CLEAR, color: 'auto' } : (shade ? { fill: shade, type: ShadingType.CLEAR, color: 'auto' } : undefined),
    margins: { top: 50, bottom: 50, left: 90, right: 90 },
    children: String(txt ?? '').split('\n').map((line) => new Paragraph({ children: runs(line, { size, color: hdr ? 'FFFFFF' : INK, bold: hdr || undefined }), spacing: { after: 20, line: 250 } })),
  });
  const trs = [new TableRow({ tableHeader: true, cantSplit: true, children: head.map((h, i) => cell(h, i, true)) })];
  rows.forEach((r, k) => trs.push(new TableRow({ cantSplit: true, children: r.map((c, i) => cell(c, i, false, (opt.firstColShade && i === 0) ? PURPLE_L : (k % 2 ? 'FAFAFB' : undefined))) })));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: w, rows: trs });
}

function image(file, maxW = 16, maxH = 21) { // cm
  const { w, h } = pngSize(file);
  const pxPerCm = 37.8;
  let cw = maxW, ch = cw * h / w;
  if (ch > maxH) { ch = maxH; cw = ch * w / h; }
  return new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 60 }, keepNext: false,
    children: [new ImageRun({ type: 'png', data: fs.readFileSync(file), transformation: { width: Math.round(cw * pxPerCm), height: Math.round(ch * pxPerCm) }, altText: { title: file.split('/').pop(), description: file.split('/').pop(), name: file.split('/').pop() } })],
  });
}

const baseStyles = {
  default: { document: { run: { font: FONT, size: 22, color: INK } } },
  paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 32, bold: true, font: FONT, color: INK }, paragraph: { spacing: { before: 120, after: 240 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, font: FONT, color: PURPLE }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1, keepNext: true } },
    { id: 'FigCaption', name: 'FigCaption', basedOn: 'Normal', next: 'Normal', run: { size: 20, font: FONT, color: INK } },
    { id: 'TabCaption', name: 'TabCaption', basedOn: 'Normal', next: 'Normal', run: { size: 20, font: FONT, color: INK } },
    { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 23, bold: true, font: FONT, color: INK }, paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2, keepNext: true } },
  ],
};
const numbering = {
  config: [
    { reference: 'vinetas', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }, { level: 1, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1000, hanging: 270 } } } }] },
    { reference: 'numeros', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 320 } } } }] },
  ],
};

module.exports = { counters, d, FONT, INK, MUTED, PURPLE, PURPLE_L, GREY_L, CONTENT_W, runs, P, H1, H2, H3, bullets, numbered, pageBreak, caption, note, table, image, baseStyles, numbering, pngSize };
