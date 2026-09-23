#!/usr/bin/env python3
"""Recomprime las imágenes grandes de los PDF generados por Chromium sin tocar el resto del documento.

Solo reemplaza el flujo de cada imagen (JPEG, calidad 85, máx. 1700 px de lado);
degradados, patrones, enlaces y texto quedan intactos.
Uso: python3 tools/compress_pdf.py [archivo.pdf ...]
"""
import io, os, sys, zlib
import pikepdf
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAX = 1700

def shrink(pdf):
    seen = set()
    for obj in pdf.objects:
        if not isinstance(obj, pikepdf.Stream) or obj.get('/Subtype') != '/Image':
            continue
        if obj.objgen in seen or '/SMask' in obj or obj.get('/ImageMask'):
            continue
        seen.add(obj.objgen)
        try:
            im = pikepdf.PdfImage(obj).as_pil_image()
        except Exception:
            continue
        if im.mode not in ('RGB', 'L'):
            continue
        w, h = im.size
        if w * h < 400_000:
            continue
        if max(w, h) > MAX:
            k = MAX / max(w, h)
            im = im.resize((round(w * k), round(h * k)), Image.LANCZOS)
        buf = io.BytesIO(); im.save(buf, 'JPEG', quality=85, optimize=True)
        data = buf.getvalue()
        if len(data) >= len(obj.read_raw_bytes()):
            continue
        obj.write(data, filter=pikepdf.Name.DCTDecode)
        obj.Width, obj.Height = im.size
        obj.ColorSpace = pikepdf.Name.DeviceRGB if im.mode == 'RGB' else pikepdf.Name.DeviceGray
        obj.BitsPerComponent = 8
        for k in ('/DecodeParms', '/Decode'):
            if k in obj:
                del obj[k]

for name in sys.argv[1:] or ['black-hawk-evolucion-web-informe-completo.pdf', 'black-hawk-evolucion-ejecutiva.pdf']:
    src = os.path.join(ROOT, name)
    with pikepdf.open(src, allow_overwriting_input=True) as pdf:
        shrink(pdf)
        pdf.save(src, compress_streams=True, object_stream_mode=pikepdf.ObjectStreamMode.generate)
    print(name, os.path.getsize(src))
