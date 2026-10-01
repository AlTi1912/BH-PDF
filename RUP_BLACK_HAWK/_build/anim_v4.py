# Genera BLACK_HAWK_RUP_PRESENTACION_V4_ANIMADA.pptx a partir de la V4 (que no se modifica).
# - Fundido de 450 ms en todas las diapositivas.
# - Transformar (Morph) en secuencias de diapositivas duplicadas; los objetos se emparejan por nombre («!!…»).
# - Entrada «desvanecer + subir» (0,4 s), un elemento por clic, en los objetos nombrados «@grupoN».
# Los duplicados conservan el número de pie de página y no llevan notas (add_slide.py no las copia).
import json, os, re, shutil, subprocess, sys, zipfile
from lxml import etree

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'BLACK_HAWK_RUP_PRESENTACION_V4.pptx')
OUT = os.path.join(HERE, '..', 'BLACK_HAWK_RUP_PRESENTACION_V4_ANIMADA.pptx')
SKILL = sys.argv[1] if len(sys.argv) > 1 else '/root/.claude/skills/synced/bbf048cf-1638-4fee-9401-ba48416d8c23_19141966-e7c2-4632-9de2-c858c044e509/pptx/scripts'
WORK = os.path.join(HERE, 'qa', 'anim_work')

NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main', 'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
P = '{%s}' % NS['p']
EMU = 914400
SW, MX = 12192000, int(0.6 * EMU)

FADE_MS, ANIM_MS = 450, 400

# ── 1. Desempaquetar
shutil.rmtree(WORK, ignore_errors=True)
with zipfile.ZipFile(SRC) as z:
    z.extractall(WORK)
META = json.load(open(os.path.join(HERE, 'slides_v4.json')))
def idx(title):
    return next(m['n'] for m in META if m['title'] == title)

# ── 2. Duplicados (trabajo estructural primero)
def duplicate(src_n, after_file, count):
    made, after = [], after_file
    for _ in range(count):
        out = subprocess.run([sys.executable, os.path.join(SKILL, 'add_slide.py'), WORK, f'slide{src_n}.xml', '--after', after], capture_output=True, text=True, cwd=SKILL)
        m = re.search(r'(slide\d+\.xml)', out.stdout.split('Created', 1)[-1])
        assert out.returncode == 0 and m, out.stdout + out.stderr
        made.append(m.group(1)); after = m.group(1)
    return made

SEQ = {}  # clave → [archivo original, duplicados…] en orden de exposición
def seq(key, title, count):
    n = idx(title)
    SEQ[key] = [f'slide{n}.xml'] + duplicate(n, f'slide{n}.xml', count)

seq('ana', 'Análisis de la plataforma original', 6)
seq('est', 'Estructura general de RUP', 4)
seq('ad1', 'Antes y después: home y catálogo', 1)
seq('ad2', 'Antes y después: ficha y recorrido móvil', 1)
seq('cu', 'Diagrama de casos de uso', 3)
seq('fis', 'Modelo físico de datos', 3)
seq('flu', 'Flujo comercial propuesto', 7)

# ── 3. Utilidades XML
def load(f):
    return etree.parse(os.path.join(WORK, 'ppt', 'slides', f))
def save(t, f):
    t.write(os.path.join(WORK, 'ppt', 'slides', f), xml_declaration=True, encoding='UTF-8', standalone=True)
def shapes(t, prefix):
    out = []
    for c in t.iter('{%s}cNvPr' % NS['p']):
        nm = c.get('name', '')
        if nm.split('#')[0] == prefix or (prefix.endswith('*') and nm.startswith(prefix[:-1])):
            out.append(c.getparent().getparent())
    return out
def delete(t, prefix):
    for e in shapes(t, prefix):
        e.getparent().remove(e)
def off(e):
    return e.find('.//a:xfrm/a:off', NS)
def shift(t, prefix, dx):
    for e in shapes(t, prefix):
        o = off(e); o.set('x', str(int(o.get('x')) + int(dx)))
def next_id(t):
    return max(int(c.get('id')) for c in t.iter('{%s}cNvPr' % NS['p'])) + 1

# ── 4. Estados de cada secuencia
# Análisis: estado 0 sin hallazgos; estado k muestra los hallazgos 1…k (marcador en la captura y fila de la lista)
for k, f in enumerate(SEQ['ana']):
    t = load(f)
    for j in range(k + 1, 7):
        delete(t, f'!!hall{j}')
    save(t, f)

# Estructura de RUP: foco en la fase k (velos blancos semitransparentes sobre las demás columnas)
lx = MX + int(3.0 * EMU); cw = (SW - MX - lx) / 4
y0, y1 = int(1.5 * EMU), int(6.76 * EMU)
def veil(t, name, x, w):
    tree = t.find('.//p:spTree', NS)
    sp = etree.fromstring(f'<p:sp xmlns:p="{NS["p"]}" xmlns:a="{NS["a"]}"><p:nvSpPr><p:cNvPr id="{next_id(t)}" name="{name}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>'
                          f'<p:spPr><a:xfrm><a:off x="{int(x)}" y="{y0}"/><a:ext cx="{max(int(w), 9144)}" cy="{y1 - y0}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom>'
                          f'<a:solidFill><a:srgbClr val="FFFFFF"><a:alpha val="70000"/></a:srgbClr></a:solidFill><a:ln><a:noFill/></a:ln></p:spPr></p:sp>')
    tree.append(sp)
for k, f in enumerate(SEQ['est'][1:]):
    t = load(f)
    xa, xb = lx + k * cw, lx + (k + 1) * cw
    veil(t, '!!veil-l#1', lx, xa - lx)
    veil(t, '!!veil-r#1', xb, SW - MX - xb)
    save(t, f)

# Antes y después: estado 0 = la captura original ocupa el lugar de la renovada y la renovada espera fuera de la diapositiva
for key in ('ad1', 'ad2'):
    f = SEQ[key][0]; t = load(f)
    for r in (0, 1):
        xa = int(off(shapes(t, f'!!ad{r}-a')[0]).get('x')); xd = int(off(shapes(t, f'!!ad{r}-d')[0]).get('x'))
        shift(t, f'!!ad{r}-a', xd - xa); shift(t, f'!!ad{r}-ta', xd - xa)
        dx = SW + int(0.3 * EMU) - xd
        shift(t, f'!!ad{r}-d', dx); shift(t, f'!!ad{r}-td', dx)
        delete(t, f'!!ad{r}-txt')
    save(t, f)

# Zoom por recorte (Transformar anima el recorte): región en fracciones de la imagen (izq., arriba, der., abajo)
ZOOM = {
    'cu': [(0.0, 0.0553, 0.3436, 0.2886), (0.5687, 0.0332, 0.0, 0.5357)],   # 1: cotizar e «include»; 2: administración
    'fis': [(0.3197, 0.3112, 0.0, 0.0085), (0.0, 0.3131, 0.3643, 0.0512)],  # 1: productos y consultas; 2: categorías
}
for key, regions in ZOOM.items():
    for f, (l, tp, r, b) in zip(SEQ[key][1:3], regions):
        t = load(f)
        pic = shapes(t, '!!diag')[0]
        bf = pic.find('p:blipFill', NS)
        src = etree.SubElement(bf, '{%s}srcRect' % NS['a'], l=str(round(l * 100000)), t=str(round(tp * 100000)), r=str(round(r * 100000)), b=str(round(b * 100000)))
        bf.remove(src); bf.insert(1, src)
        save(t, f)

# Flujo comercial: estados 1…7 muestran los pasos 1…k; el último duplicado es la diapositiva completa
for k, f in enumerate(SEQ['flu'][:7], start=1):
    t = load(f)
    for j in range(k, 7):
        delete(t, f'!!fl{j}')
    for j in range(k - 1, 6):
        delete(t, f'!!fa{j}')
    delete(t, '!!flb*')
    save(t, f)

# ── 5. Orden final de exposición
pres = etree.parse(os.path.join(WORK, 'ppt', 'presentation.xml'))
rels = etree.parse(os.path.join(WORK, 'ppt', '_rels', 'presentation.xml.rels'))
rid2file = {r.get('Id'): os.path.basename(r.get('Target')) for r in rels.getroot()}
ORDER = [rid2file[s.get('{%s}id' % NS['r'])] for s in pres.find('p:sldIdLst', NS)]

# ── 6. Transiciones
def fade_xml():
    return (f'<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:p="{NS["p"]}">'
            f'<mc:Choice xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" Requires="p14"><p:transition spd="med" p14:dur="{FADE_MS}"><p:fade/></p:transition></mc:Choice>'
            f'<mc:Fallback><p:transition spd="med"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>')
def morph_xml(ms):
    return (f'<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:p="{NS["p"]}">'
            f'<mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" Requires="p159">'
            f'<p:transition spd="slow" p14:dur="{ms}"><p159:morph option="byObject"/></p:transition></mc:Choice>'
            f'<mc:Fallback><p:transition spd="med"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>')

MORPH = {}
MORPH[SEQ['ana'][0]] = 700                       # sitio original → análisis
for f in SEQ['ana'][1:]: MORPH[f] = 500          # marcadores uno a uno
for f in SEQ['est'][1:]: MORPH[f] = 600          # foco por fase
for t_ in ('Fase de Elaboración', 'Fase de Construcción', 'Fase de Transición'):
    MORPH[f'slide{idx(t_)}.xml'] = 700           # las fases avanzan
for key in ('ad1', 'ad2'): MORPH[SEQ[key][1]] = 900
for key in ('cu', 'fis'):
    for f in SEQ[key][1:]: MORPH[f] = 900
for f in SEQ['flu'][1:7]: MORPH[f] = 500
MORPH[SEQ['flu'][7]] = 700

# ── 7. Animaciones por clic
CLICK = {idx(t_): g for t_, g in [('Gestión de riesgos', 'rk'), ('Funcionalidades principales', 'fun'), ('Verificación y pruebas', 'pr'),
                                   ('Plan de transición y capacitación por rol', 'tr'), ('Conclusiones y próximos pasos', 'co')]}
def timing_xml(t, grp):
    groups = {}
    for c in t.iter('{%s}cNvPr' % NS['p']):
        m = re.match(rf'@{grp}(\d+)#', c.get('name', ''))
        if m:
            groups.setdefault(int(m.group(1)), []).append((c.get('id'), c.getparent().getparent().tag == P + 'sp'))
    ids = iter(range(3, 100000))
    def eff(spid, node):
        tg = f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl>'
        mv = lambda attr, v0: (f'<p:anim calcmode="lin" valueType="num"><p:cBhvr><p:cTn id="{next(ids)}" dur="{ANIM_MS}" decel="100000" fill="hold"/>{tg}'
                               f'<p:attrNameLst><p:attrName>{attr}</p:attrName></p:attrNameLst></p:cBhvr><p:tavLst><p:tav tm="0"><p:val><p:strVal val="{v0}"/></p:val></p:tav>'
                               f'<p:tav tm="100000"><p:val><p:strVal val="#{attr}"/></p:val></p:tav></p:tavLst></p:anim>')
        return (f'<p:par><p:cTn id="{next(ids)}" presetID="42" presetClass="entr" presetSubtype="0" fill="hold" grpId="0" nodeType="{node}"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>'
                f'<p:set><p:cBhvr><p:cTn id="{next(ids)}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>{tg}<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set>'
                f'<p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="{next(ids)}" dur="{ANIM_MS}"/>{tg}</p:cBhvr></p:animEffect>'
                + mv('ppt_x', '#ppt_x') + mv('ppt_y', '#ppt_y+0.03') + '</p:childTnLst></p:cTn></p:par>')
    clicks = []
    for g in sorted(groups):
        inner = ''.join(eff(spid, 'clickEffect' if i == 0 else 'withEffect') for i, (spid, _) in enumerate(groups[g]))
        clicks.append(f'<p:par><p:cTn id="{next(ids)}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst><p:childTnLst>'
                      f'<p:par><p:cTn id="{next(ids)}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>{inner}</p:childTnLst></p:cTn></p:par>'
                      f'</p:childTnLst></p:cTn></p:par>')
    bld = ''.join(f'<p:bldP spid="{spid}" grpId="0" animBg="1"/>' for g in sorted(groups) for spid, is_sp in groups[g] if is_sp)
    xml = (f'<p:timing xmlns:p="{NS["p"]}"><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
           f'<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>{"".join(clicks)}</p:childTnLst></p:cTn>'
           f'<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
           f'<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>'
           f'</p:childTnLst></p:cTn></p:par></p:tnLst><p:bldLst>{bld}</p:bldLst></p:timing>')
    return xml, len(groups)

REPORT = []
for pos, f in enumerate(ORDER, start=1):
    t = load(f)
    root = t.getroot()
    clr = root.find('p:clrMapOvr', NS)
    i = list(root).index(clr)
    root.insert(i + 1, etree.fromstring(morph_xml(MORPH[f]) if f in MORPH else fade_xml()))
    n = int(re.search(r'\d+', f).group())
    clicks = 0
    if n in CLICK:
        tx, clicks = timing_xml(t, CLICK[n])
        root.insert(i + 2, etree.fromstring(tx))
    save(t, f)
    orig = next((v[0] for v in SEQ.values() if f in v), f)
    on = int(re.search(r'\d+', orig).group())
    REPORT.append({'pos': pos, 'file': f, 'content': on, 'title': META[on - 1]['title'], 'dup': f != orig,
                   'trans': f'Transformar {MORPH[f]} ms' if f in MORPH else f'Fundido {FADE_MS} ms', 'clicks': clicks})

# ── 8. Empaquetar
if os.path.exists(OUT): os.remove(OUT)
with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as z:
    ct = os.path.join(WORK, '[Content_Types].xml')
    z.write(ct, '[Content_Types].xml')
    for dp, _, fs in os.walk(WORK):
        for fn in sorted(fs):
            full = os.path.join(dp, fn); arc = os.path.relpath(full, WORK)
            if arc != '[Content_Types].xml':
                z.write(full, arc)
json.dump(REPORT, open(os.path.join(HERE, 'qa', 'anim_report.json'), 'w'), ensure_ascii=False, indent=1)
print('ok', len(ORDER), 'diapositivas;', sum(r['dup'] for r in REPORT), 'duplicadas')
