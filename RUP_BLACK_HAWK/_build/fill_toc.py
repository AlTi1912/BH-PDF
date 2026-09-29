# Rellena el resultado en caché de los campos TOC de un .docx generado con docx-js,
# usando los números de página del PDF que produce LibreOffice. Word puede volver a
# actualizar los campos (F9); así el índice ya se ve completo en cualquier visor.
import re, sys, zipfile, subprocess, html, shutil, os

docx, pdf = sys.argv[1], sys.argv[2]
maxlvl = 1 if 'TOC \\h \\o &quot;1-1&quot;' in zipfile.ZipFile(sys.argv[1]).read('word/document.xml').decode('utf8') else 2
z = zipfile.ZipFile(docx)
xml = z.read('word/document.xml').decode('utf8')

def norm(s):
    return re.sub(r'\s+', ' ', s.replace('­', '')).strip()

pages = subprocess.run(['pdftotext', '-layout', pdf, '-'], capture_output=True, text=True).stdout.split('\f')
pages_n = [norm(p) for p in pages]
def first_line(p):
    lines = [l.strip() for l in p.split('\n') if l.strip()]
    return norm(lines[1]) if len(lines) > 1 else ''  # la línea 0 es el encabezado de página

# Entradas en orden del documento
entries = []  # (tipo, nivel, texto)
for m in re.finditer(r'<w:p>(?:(?!</w:p>).)*?</w:p>|<w:p (?:(?!</w:p>).)*?</w:p>', xml, flags=re.S):
    p = m.group(0)
    st = re.search(r'<w:pStyle w:val="([^"]+)"', p)
    if not st: continue
    st = st.group(1)
    txt = html.unescape(''.join(re.findall(r'<w:t[^>]*>([^<]*)</w:t>', p)))
    if st in ('Heading1', 'Heading2'): entries.append(('H', 1 if st == 'Heading1' else 2, norm(txt)))
    elif st in ('FigCaption', 'TabCaption'): entries.append((st, 1, norm(txt)))

ptr = 0
found = []
for kind, lvl, txt in entries:
    pg = None
    for i in range(ptr, len(pages)):
        if kind == 'H' and lvl == 1:
            if first_line(pages[i]).startswith(txt[:60]): pg = i; break
        else:
            if txt[:45] in pages_n[i] and not re.search(re.escape(txt[:30]) + r'[^.]*\.{5,}', pages_n[i]): pg = i; break
    if pg is None:
        print('NO ENCONTRADO:', kind, txt); pg = ptr
    ptr = pg
    found.append((kind, lvl, txt, pg + 1))

def entry_xml(txt, pg, indent):
    t = html.escape(txt, quote=False)
    return (f'<w:p><w:pPr><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9060"/></w:tabs>'
            f'<w:spacing w:after="40" w:line="264" w:lineRule="auto"/><w:ind w:left="{indent}" w:hanging="0"/></w:pPr>'
            f'<w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve">{t}</w:t></w:r>'
            f'<w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:tab/></w:r><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>{pg}</w:t></w:r></w:p>')

def fill(xml, instr_pat, items):
    i = xml.find(instr_pat)
    if i < 0: return xml
    j = xml.find('</w:p>', i) + len('</w:p>')
    return xml[:j] + ''.join(items) + xml[j:]

toc = [entry_xml(t, p, 0 if l == 1 else 360) for k, l, t, p in found if k == 'H' and l <= maxlvl]
figs = [entry_xml(t, p, 0) for k, l, t, p in found if k == 'FigCaption']
tabs = [entry_xml(t, p, 0) for k, l, t, p in found if k == 'TabCaption']
xml = fill(xml, 'TOC \\h \\o', toc)
xml = fill(xml, 'TOC \\h \\t &quot;FigCaption', figs)
xml = fill(xml, 'TOC \\h \\t &quot;TabCaption', tabs)
xml = xml.replace(' w:dirty="true"', '')

tmp = docx + '.tmp'
with zipfile.ZipFile(docx) as zin, zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = zin.read(item.filename)
        if item.filename == 'word/document.xml': data = xml.encode('utf8')
        zout.writestr(item, data)
shutil.move(tmp, docx)
print(f'TOC: {len(toc)} entradas, figuras: {len(figs)}, tablas: {len(tabs)}')
