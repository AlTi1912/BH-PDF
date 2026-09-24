#!/usr/bin/env python3
"""Presentación ejecutiva: recorta capturas ya archivadas en evidence/ y genera el HTML.

Sin nuevas capturas: solo recortes y escalado proporcional de la evidencia existente.
Uso: python3 tools/build_exec.py   (desde la raíz del repositorio)
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EV = os.path.join(ROOT, 'evidence')
OUT = os.path.join(ROOT, 'assets/exec')
os.makedirs(OUT, exist_ok=True)

# nombre destino: (origen, caja de recorte o None, ancho final)
CROPS = {
    'partida':        ('screens/A-home-d-stitch.png', (0, 0, 1440, 1500), 1200),
    'home-antes':     ('screens/A-home-d-stitch.png', (0, 0, 1440, 900), 1200),
    'home-ahora':     ('screens/N-home-d-stitch.png', (0, 0, 1440, 900), 1200),
    'shop-antes':     ('screens/A-shop-d-view.png', None, 1000),
    'shop-ahora':     ('screens/N-shop-d-view.png', None, 1300),
    'buscar':         ('interactions/N-search-04-live-sw12-d.png', None, 1300),
    'tarjetas':       ('screens/N-cat-sub-d-stitch.png', (320, 1240, 1410, 1712), 1090),
    'ficha-antes':    ('screens/A-prod-sw12xxg-d-view.png', None, 1200),
    'ficha-ahora':    ('screens/N-prod-sw12xxg-d-view.png', None, 1200),
    'comparador':     ('interactions/N-cmp-04-open-d.png', (110, 24, 1330, 876), 1220),
    'cotizar':        ('screens/N-prod-sw12xxg-d-view.png', (40, 78, 1420, 640), 1100),
    'pag-marca':      ('screens/N-nosotros-d-stitch.png', (0, 0, 1440, 1900), 800),
    'pag-comprar':    ('screens/N-distri-d-stitch.png', (0, 0, 1440, 1900), 800),
    'pag-soporte':    ('screens/N-soporte-d-stitch.png', (0, 0, 1440, 1900), 800),
    'pag-mayoristas': ('screens/N-mayor-d-stitch.png', (0, 0, 1440, 1900), 800),
    'm-home':         ('screens/N-hero1-m.png', None, 520),
    'm-menu':         ('interactions/N-mmenu-02-productos-m.png', None, 520),
    'm-ficha':        ('screens/N-prod-sw12xxg-m-stitch.png', (0, 0, 780, 1688), 520),
    'm-comparador':   ('interactions/N-cmp-04-open-m.png', None, 520),
    'psi-antes':      ('pagespeed/psi-antes-mobile-campo.png', None, 1300),
}

for name, (src, box, width) in CROPS.items():
    im = Image.open(os.path.join(EV, src)).convert('RGB')
    if box:
        im = im.crop((box[0], box[1], box[2], min(box[3], im.height)))  # sin rellenar más allá de la captura
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=84, method=6)
    print(f'{name:15s} {im.size}')

tpl = open(os.path.join(ROOT, 'tools/exec.template.html'), encoding='utf8').read()
tpl = tpl.replace('/*FONTS*/', open(os.path.join(ROOT, 'assets/fonts/fonts.css')).read())
open(os.path.join(ROOT, 'black-hawk-evolucion-ejecutiva.html'), 'w', encoding='utf8').write(tpl)
print('ok')
