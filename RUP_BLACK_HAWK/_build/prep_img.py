# Convierte a PNG las capturas archivadas del rediseño que usan la monografía y la presentación.
from PIL import Image
import os
os.makedirs('img', exist_ok=True)
for f in ['cotizar', 'comparador']:
    Image.open(f'../../assets/exec/{f}.webp').convert('RGB').save(f'img/{f}.png')
