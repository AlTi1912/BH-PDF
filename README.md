# Black Hawk: evolución de la experiencia web

Documenta la evolución entre la web anterior de Black Hawk Car Audio y el rediseño actual, en dos niveles:

1. **Presentación ejecutiva** (`black-hawk-evolucion-ejecutiva.*`): 11 diapositivas para dirección y gerencia. Poco texto, capturas grandes y una idea por página, con el eje descubrir → comparar → consultar.
2. **Informe completo** (`black-hawk-evolucion-web-informe-completo.*`): el respaldo técnico. Contiene la metodología, la matriz de evidencia, SEO, Lighthouse y las limitaciones.

- **ANTES:** <https://www.blackhawkcaraudio.com/>, sitio en producción.
- **AHORA:** rediseño publicado en un túnel temporal de Cloudflare (`obj-sociology-humidity-delhi.trycloudflare.com`).
- **Fecha de la evidencia:** 23-09-2026, entre las 22:00 y las 22:54 UTC (Lighthouse: 22:39–22:50 UTC).

## Archivos

| Ruta | Contenido |
|---|---|
| `black-hawk-evolucion-ejecutiva.html` | Presentación ejecutiva en 16:9. Se navega con ← → o con los botones, y tiene modo «Presentar» a pantalla completa. |
| `black-hawk-evolucion-ejecutiva.pdf` | La presentación en PDF, 11 páginas en 16:9. |
| `black-hawk-evolucion-web-informe-completo.html` | Informe técnico completo e interactivo: comparadores antes/ahora, índice, ampliación de capturas y vídeo. |
| `black-hawk-evolucion-web-informe-completo.pdf` | Informe completo en PDF, 28 páginas en 16:9. |
| `black-hawk-evolucion-web.zip` | Paquete autónomo con los dos niveles, `assets/` y este README. |
| `assets/exec/` | Recortes de las capturas archivadas que usa la presentación ejecutiva. Sin retoques: solo recorte y escalado proporcional. |
| `assets/images/` | Capturas en WebP usadas por el informe (`screens/`, `interactions/`) y recursos de marca (`brand/`: logo SVG y banner «Siente el poder» descargados del sitio). |
| `assets/video/` | Vídeo del comparador (`comparador.webm`, 23 s, sin sonido) y su fotograma. |
| `assets/fonts/` | Saira Condensed, Archivo e IBM Plex Mono (Google Fonts, licencia OFL), servidas en local. |
| `assets/data/evidencia-citada.json` | Matriz de las 38 evidencias citadas en el informe. |
| `evidence/` | Evidencia original: PNG sin comprimir, metadatos (`evidence.json`, `frames-meta/`), datos extraídos (`data/`) y los 36 informes Lighthouse (`lighthouse/*.json.gz`). |
| `tools/` | Scripts de captura (Playwright), extracción, build y QA para reproducir el informe. |

## Cómo abrirlo

Abre `black-hawk-evolucion-ejecutiva.html` (presentación) o `black-hawk-evolucion-web-informe-completo.html` (respaldo) en cualquier navegador moderno, con la carpeta `assets/` al lado. Funciona sin conexión: no carga recursos externos. El único enlace externo es el del sitio anterior, en la sección Metodología.

- **Comparadores antes/ahora:** arrastra el divisor, usa las flechas ← → con el foco en la imagen o pulsa «Ver antes», «Comparar» o «Ver ahora».
- **Capturas:** haz clic en una captura para ampliarla; Esc la cierra.

## Metodología resumida

1. **Mapa de ambos sitios:** a partir de los enlaces de cada home, `wp-sitemap.xml` y `robots.txt`.
2. **Capturas:** Playwright 1.56.1 con Chromium y viewports idénticos para ambas versiones: 1440 × 900 (DPR 1) y 390 × 844 (DPR 2, táctil). Antes de capturar se espera a que la red, las fuentes y las imágenes terminen de cargar, y se recorre la página despacio para activar la carga diferida y las animaciones de entrada.
3. **Páginas completas:** los archivos `*-stitch.png` unen capturas de viewport sucesivas. La captura de página completa del navegador estira las secciones con altura en `vh` y deja huecos que ningún visitante ve, así que se descartó.
4. **Producto común:** se cruzaron los 110 y 118 productos de ambos sitemaps (109 coincidencias). Se eligió BH-SW12XXG porque está destacado en las dos homes y tiene los mismos datos técnicos en las dos versiones.
5. **Interacciones probadas:** búsqueda (modelo exacto, familia y fragmento), comparador (añadir, límite, quitar, limpiar, persistencia, móvil), lightbox de galería, menú y búsqueda en móvil, vista rápida, filtros y enlaces de WhatsApp.
6. **Rendimiento:** Lighthouse 12.8.2 con throttling simulado. 3 ejecuciones por página, formato y versión, alternando ANTES y AHORA, y se reporta la mediana.

Las capturas no están retocadas: solo se recortaron, se escalaron de forma proporcional y se convirtieron a WebP.

## Pendiente de verificar y limitaciones

- **Rendimiento:** no es directamente comparable en tiempos. ANTES se sirve desde producción (LiteSpeed) y AHORA desde un túnel hacia staging. Solo el peso transferido y el número de peticiones son relativamente comparables. No hay datos de campo (CrUX).
- **SEO:** el staging tiene `noindex, nofollow` y su canonical apunta al dominio temporal. No se afirma nada sobre posicionamiento, tráfico ni conversiones, porque no hay datos de Search Console ni Analytics.
- **BH-8.12DSP:** el origen de las especificaciones que muestra el rediseño no está verificado.
- **`bh-eq842prd` → `bh-842prd`:** no está verificado que sean el mismo producto renombrado.
- **Formularios:** no se envió el formulario mayorista para no generar solicitudes reales.
- **Quick View de la home anterior:** no se probó su funcionamiento.
- **Datos del comparador:** en BH-SW12LJD las especificaciones aparecen en un párrafo, no en lista. Es una inconsistencia de contenido observada en el rediseño.
- **Túnel temporal:** si deja de estar activo, el informe sigue funcionando, porque todas las capturas están en `assets/` y `evidence/`. El 23-09-2026 a las 23:20 UTC el túnel ya respondía 502; la presentación ejecutiva se construyó solo con la evidencia archivada.
- **Presentación ejecutiva:** el dato «5,3 MB → 0,4 MB» es el peso transferido por la ficha BH-SW12XXG en escritorio (mediana de Lighthouse). Los tiempos de carga no se comparan porque producción y staging usan infraestructuras distintas.

## Reconstruir

```bash
python3 tools/build_exec.py          # presentación ejecutiva: recortes + HTML
node tools/qa_exec.js /tmp/qa-exec   # QA de la presentación + PDF
python3 tools/build.py               # informe completo: datos + capturas → HTML
node tools/qa.js /tmp/qa             # QA del informe completo + PDF
python3 tools/compress_pdf.py        # recomprime las imágenes de ambos PDF
```

Requiere Python 3 con Pillow, PyMuPDF y pikepdf, y Node con Playwright.
