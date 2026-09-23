#!/usr/bin/env python3
"""Recomprime las imágenes del PDF generado por tools/qa.js (150 ppp, calidad 82)."""
import os, pymupdf
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = os.path.join(ROOT, 'black-hawk-evolucion-web.pdf')
d = pymupdf.open(src)
d.rewrite_images(dpi_threshold=160, dpi_target=150, quality=82)
tmp = src + '.tmp'
d.save(tmp, garbage=4, deflate=True); d.close(); os.replace(tmp, src)
print(os.path.getsize(src))
