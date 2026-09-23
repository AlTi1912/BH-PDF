#!/usr/bin/env python3
"""Construye black-hawk-evolucion-web.html a partir de la plantilla y la evidencia.

- Inyecta datos medidos (categorías, SEO, Lighthouse, matriz de evidencia).
- Convierte a WebP solo las capturas que cita el HTML (sin retoques: escala proporcional).
Uso: python3 tools/build.py   (desde la raíz del repositorio)
"""
import json, os, re, glob, html
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EV = os.path.join(ROOT, 'evidence')
tpl = open(os.path.join(ROOT, 'tools', 'report.template.html'), encoding='utf8').read()
esc = html.escape

# ---------- fonts ----------
tpl = tpl.replace('/*FONTS*/', open(os.path.join(ROOT, 'assets/fonts/fonts.css')).read())

# ---------- categorías ----------
cats = json.load(open(os.path.join(EV, 'data/categorias.json')))
names = {'amplificadores': 'Amplificadores', 'medio-rango': 'Medio Rango', 'tweeter': 'Tweeter', 'subwoofer': 'Subwoofer',
         'altavoces': 'Altavoces', 'drivers': 'Drivers', 'ecualizador': 'Ecualizador', 'procesadores': 'Procesadores',
         'componentes': 'Componentes', 'subwoofer-activo': 'Subwoofer Activo', 'parlantes': 'Parlantes', 'cargadores': 'Cargadores'}
rows = []
for k, v in cats.items():
    m = re.search(r'of (\d+)|all (\d+)', v['antes'].replace('&ndash;', '-'))
    a = (m.group(1) or m.group(2)) if m else None
    n = v['ahora']
    note = ''
    if a is None:
        note = 'Categoría nueva (404 en la versión anterior)'
    elif int(a) != int(n):
        note = f'{int(n) - int(a):+d}'
    rows.append(f'<tr><th scope="row">{names[k]}</th><td class="num">{a if a else "—"}</td><td class="num">{n}</td><td class="{"hl" if note else "dim"}">{note or "="}</td></tr>')
tpl = tpl.replace('/*CATROWS*/', '\n'.join(rows))

# ---------- búsqueda ----------
tpl = tpl.replace('/*FRSUBMIT*/', '77 productos (<code>/shop/?bh_q=FR</code>), incluye modelos fuera de la familia')
tpl = tpl.replace('/*SW12SUBMIT*/', '10 productos (incluye BH-SW12XZP, que no existe en la versión anterior)')
tpl = tpl.replace('/*MAYOR_LOGOS*/', 'Los 4 logos de marcas no cargan (imágenes con 0 px de ancho natural).')

# ---------- marcadores ficha (medidos con getBoundingClientRect, 1440×900) ----------
def mk(pts, cls=''):
    return ''.join(f'<span class="mk{cls}" style="--x:{x / 14.4:.1f}%;--y:{y / 9:.1f}%">{i + 1:02d}</span>' for i, (x, y) in enumerate(pts))
tpl = tpl.replace('/*MK_A_PROD*/', mk([(30, 184), (704, 346), (704, 440)], ' mk--antes'))
tpl = tpl.replace('/*MK_N_PROD*/', mk([(772, 236), (772, 479), (772, 566), (772, 690)]))

# ---------- SEO ----------
seo = json.load(open(os.path.join(EV, 'data/seo.json')))
labels = {'home': 'Home', 'catalogo': 'Catálogo', 'categoria': 'Categoría', 'producto': 'Ficha', 'galeria': 'Galería', 'mayoristas': 'Mayoristas'}
srows = []
for key, lab in labels.items():
    for ver in ('antes', 'ahora'):
        d = seo[f'{key}|{ver}']
        tag = '<span class="tag tag--antes">Antes</span>' if ver == 'antes' else '<span class="tag tag--ahora">Ahora</span>'
        ld = ', '.join(x for x in d['ld'] if x not in ('Organization', 'WebSite')) or ('—' if not d['ld'] else '')
        if 'Organization' in d['ld']:
            ld = (ld + ', ' if ld else '') + 'Organization, WebSite'
        noalt = d['img_noalt'] + d['img_emptyalt']
        srows.append(
            f'<tr><th scope="row">{lab if ver == "antes" else ""}</th><td>{tag}</td><td>{esc(d["title"])}</td>'
            f'<td class="{"" if d["desc"] else "dim"}">{"Sí" if d["desc"] else "No"}</td><td class="num">{len(d["h1"])}</td>'
            f'<td class="{"" if d["og"] else "dim"}">{"Sí" if d["og"] else "No"}</td><td>{esc(ld) or "—"}</td><td class="num">{noalt} de {d["img"]}</td></tr>')
tpl = tpl.replace('/*SEOROWS*/', '\n'.join(srows))

# ---------- Lighthouse ----------
lh = json.load(open(os.path.join(EV, 'data/lighthouse-medianas.json')))
pages = [('home', 'Home'), ('cat', 'Categoría'), ('prod', 'Ficha')]
prow = []
for ff, ffl in (('mobile', 'Móvil'), ('desktop', 'Desktop')):
    for pg, pgl in pages:
        a = lh[f'{pg}|{ff}|A']; n = lh[f'{pg}|{ff}|N']
        def c(x, y, fmt):
            return f'<td class="num">{fmt(x)}</td><td class="num">{fmt(y)}</td>'
        prow.append(
            f'<tr><th scope="row">{pgl}<br><span class="dim">{ffl}</span></th>'
            + c(a['perf'], n['perf'], lambda v: f'{v:.0f}')
            + c(a['lcp'], n['lcp'], lambda v: f'{v / 1000:.1f} s')
            + c(a['cls'], n['cls'], lambda v: f'{v:.3f}')
            + c(a['ttfb'], n['ttfb'], lambda v: f'{v:.0f} ms')
            + c(a['bytes'], n['bytes'], lambda v: f'{v / 1024:,.0f} KB'.replace(',', ' '))
            + c(a['nreq'], n['nreq'], lambda v: f'{v:.0f}')
            + c(a['a11y'], n['a11y'], lambda v: f'{v:.0f}')
            + '</tr>')
perf = f'''
    <div class="cols cols-12-5" style="align-items:start;margin-bottom:22px">
      <div class="why"><span class="tag tag--na">Las pruebas no son directamente comparables en tiempos</span><p>El ANTES se sirve desde producción (LiteSpeed) y el AHORA desde un túnel temporal de Cloudflare hacia el entorno de staging. El tiempo de respuesta del servidor (TTFB) y la red no son equivalentes, así que no se afirma que una versión sea «más rápida».</p></div>
      <ul class="plain plain--mut">
        <li><b>Herramienta:</b> Lighthouse 12.8.2, Chromium headless, throttling simulado.</li>
        <li><b>Móvil:</b> 412 × 823, RTT 150 ms, 1,6 Mbps, CPU ×4. <b>Desktop:</b> 1350 × 940, RTT 40 ms, 10 Mbps.</li>
        <li><b>Ejecuciones:</b> 3 por página, formato y versión, alternando ANTES/AHORA; se muestra la mediana. 23-09-2026, 22:39–22:50 UTC.</li>
      </ul>
    </div>
    <div class="tbl-wrap perf">
      <table>
        <thead>
          <tr><th scope="col" rowspan="2">Página · formato</th><th scope="colgroup" colspan="2">Rendimiento</th><th scope="colgroup" colspan="2">LCP</th><th scope="colgroup" colspan="2">CLS</th><th scope="colgroup" colspan="2">TTFB</th><th scope="colgroup" colspan="2">Peso transferido</th><th scope="colgroup" colspan="2">Peticiones</th><th scope="colgroup" colspan="2">Accesib. (auto)</th></tr>
          <tr>{'<th scope="col" class="num">Antes</th><th scope="col" class="num">Ahora</th>' * 7}</tr>
        </thead>
        <tbody>
{chr(10).join(prow)}
        </tbody>
      </table>
    </div>
  </div>
</section>
<section class="sheet" data-title="Rendimiento" data-folio="13 · RENDIMIENTO · LECTURA">
  <div class="wrap">
    <div class="head">
      <p class="eyebrow"><b>13</b> Rendimiento · cómo leer los datos</p>
      <h2>Menos peso, tiempos<br>que aún no se pueden comparar</h2>
    </div>
    <div class="cols cols-3">
      <div class="block block--red"><p class="kicker">Se observa en las 6 combinaciones</p><p>El rediseño transfiere menos datos y hace menos peticiones en las tres páginas, tanto en móvil como en desktop. Estas dos cifras dependen menos del servidor, aunque la compresión puede variar entre LiteSpeed y Cloudflare.</p></div>
      <div class="block"><p class="kicker">Resultados mixtos</p><p>En móvil simulado, el LCP del rediseño es menor en las tres páginas. En desktop, la versión anterior obtiene mejor puntuación en Categoría y Ficha. El TTFB del staging es igual o mayor en 5 de 6 casos.</p></div>
      <div class="block"><p class="kicker">Datos de campo</p><p><span class="tag tag--na">Evidencia no disponible</span> No hay datos de usuarios reales (CrUX): el staging no recibe tráfico. La comparación válida requiere medir ambas versiones en producción, con la misma infraestructura.</p></div>
    </div>
    <p class="note" style="margin-top:26px"><b>Accesibilidad (auto):</b> puntuación automática de Lighthouse (82–87 antes, 94–96 ahora en las páginas medidas). Detecta problemas como contraste, etiquetas o textos alternativos, pero no sustituye una revisión manual con teclado y lector de pantalla.</p>'''
tpl = tpl.replace('/*PERF*/', perf)

# ---------- matriz de evidencia ----------
evidence = {e['id']: e for e in json.load(open(os.path.join(EV, 'evidence.json')))}
for m in glob.glob(os.path.join(EV, 'frames-meta/*.json')):
    d = json.load(open(m))
    evidence[d['id'] + '-stitch'] = {'id': d['id'] + '-stitch', 'url': d['url'], 'viewport': f"{d['vp']['width']}x{d['vp']['height']}", 'http': d.get('http'), 'date': d['date'], 'kind': 'Página completa compuesta'}
desc = json.load(open(os.path.join(ROOT, 'tools', 'evidence-notes.json'), encoding='utf8'))

cited = []
for m in re.finditer(r'assets/images/(screens|interactions)/([A-Za-z0-9\-]+)\.webp', tpl):
    if m.group(2) not in cited:
        cited.append(m.group(2))

def info(i):
    base = i
    e = evidence.get(i) or evidence.get(re.sub(r'-(view|full)$', '', i))
    kind = 'Página completa compuesta' if i.endswith('-stitch') else ('Interacción' if i in interactions else 'Captura de viewport')
    ver = 'Antes' if i.startswith('A-') else 'Ahora'
    vp = e['viewport'] if e else ('390x844' if i.endswith('-m') or '-m-' in i or i.endswith('-m') else '1440x900')
    url = (e['url'] if e else desc.get(i, {}).get('url', '')).replace('https://obj-sociology-humidity-delhi.trycloudflare.com', 'staging').replace('https://www.blackhawkcaraudio.com', 'blackhawkcaraudio.com')
    http = f" · HTTP {e['http']}" if e and e.get('http') else ''
    return ver, kind, url + http, vp.replace('x', '×'), desc.get(i, {}).get('d', '')

interactions = {os.path.splitext(os.path.basename(f))[0] for f in glob.glob(os.path.join(EV, 'interactions/*.png'))}
mx = []
for i in cited:
    ver, kind, url, vp, d = info(i)
    tag = 'antes' if ver == 'Antes' else 'ahora'
    mx.append(f'<tr><th scope="row"><code>{i}</code></th><td><span class="tag tag--{tag}">{ver}</span></td><td>{kind}</td><td><code>{esc(url)}</code></td><td class="num">{vp}</td><td>{esc(d)}</td></tr>')
# split matrix across print sheets
chunk = 16
parts = [mx[k:k + chunk] for k in range(0, len(mx), chunk)]
first = tpl.index('/*MXROWS*/')
sheet_start = tpl.rfind('<section class="sheet"', 0, first)
sheet_end = tpl.index('</section>', first) + len('</section>')
sheet_tpl = tpl[sheet_start:sheet_end]
sheets = []
for k, p in enumerate(parts):
    s = sheet_tpl.replace('/*MXROWS*/', '\n'.join(p)).replace('/*MXCOUNT*/', str(len(mx)))
    s = s.replace('data-folio="15 · MATRIZ DE EVIDENCIA"', f'data-folio="15 · MATRIZ DE EVIDENCIA {k + 1}/{len(parts)}"')
    s = s.replace('<h2>Cada afirmación, una captura</h2>', f'<h2>Cada afirmación, una captura <span class="dim">({k + 1}/{len(parts)})</span></h2>')
    if k > 0:
        s = s.replace('<summary>', '<summary class="p-hide" hidden>')
    sheets.append(s)
tpl = tpl[:sheet_start] + '\n'.join(sheets) + tpl[sheet_end:]

# ---------- imágenes ----------
out_dir = os.path.join(ROOT, 'assets/images')
done = 0
for i in cited:
    kind = 'interactions' if i in interactions else 'screens'
    src = os.path.join(EV, kind, i + '.png')
    dst = os.path.join(out_dir, kind, i + '.webp')
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    if os.path.exists(dst) and os.path.getmtime(dst) > os.path.getmtime(src):
        continue
    im = Image.open(src).convert('RGB')
    if i.endswith('-stitch') and im.width == 780:          # móvil DPR2 → 390 px (límite WebP 16383 px)
        im = im.resize((390, round(im.height / 2)), Image.LANCZOS)
    im.save(dst, 'WEBP', quality=80, method=6)
    done += 1

# sanity: every referenced asset exists
missing = [p for p in set(re.findall(r'(?:src|data-full|poster)="(assets/[^"]+)"', tpl)) if not os.path.exists(os.path.join(ROOT, p))]
open(os.path.join(ROOT, 'black-hawk-evolucion-web.html'), 'w', encoding='utf8').write(tpl)
json.dump([dict(zip(['id', 'version', 'tipo', 'url', 'viewport', 'demuestra'], [i, *info(i)])) for i in cited], open(os.path.join(ROOT, 'assets/data/evidencia-citada.json'), 'w'), ensure_ascii=False, indent=1)
print('cited', len(cited), 'converted', done, 'missing', missing, 'leftover markers', re.findall(r'/\*[A-Z_0-9]+\*/', tpl))
