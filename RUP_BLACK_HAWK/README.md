# Proyecto RUP · Black Hawk Car Audio (SGCD-BH)

Proyecto académico del curso **Diseño de Sistemas de Información**: aplicación de la metodología RUP al análisis, diseño y planificación del **Sistema de Gestión de Catálogo y Distribuidores Black Hawk (SGCD-BH)**.

## Entregables

| # | Archivo | Contenido |
|---|---|---|
| 1 | `BLACK_HAWK_RUP_PRESENTACION.pptx` | 45 diapositivas 16:9 editables, con notas del orador. Unos 40 min (versión corta: unos 30 min). |
| 2 | `BLACK_HAWK_RUP_MONOGRAFIA.docx` | Monografía APA 7: 9 capítulos, 31 figuras, 37 tablas, referencias y anexos A–G. Índices ya generados. |
| 3 | `BLACK_HAWK_RUP_GUIA_EXPOSICION.docx` | Guion por diapositiva (coincide con las 45 diapositivas), cómo explicar cada diagrama y 24 preguntas de defensa con sus respuestas. |
| 4 | `DIAGRAMAS_UML/` | 22 diagramas UML, EDT, gráficos y prototipos en PNG, SVG y PlantUML editable; XMI experimental de clases; guía de reconstrucción en Rational Rose (`DIAGRAMAS_UML/README.md`). |
| 5 | `ANEXOS/BLACK_HAWK_RUP_ANEXOS.xlsx` | Versión editable de las matrices: RF, RNF, casos de uso, trazabilidad, plan de pruebas, riesgos, cronograma, EDT, esfuerzo, diccionario de datos, mapeo a WordPress, inventario de diagramas, glosario y stakeholders. |
| — | `VISTA_PREVIA_PDF/` | PDF de los tres documentos renderizados con LibreOffice, para verlos rápido. La paginación puede variar ligeramente respecto de Word o PowerPoint. |

**Campos por completar:** institución, carrera, integrantes, docente y ciudad (portadas de la monografía, la presentación y la guía).

**Al abrir en Word:** el documento pide actualizar los campos. Acepta para que Word recalcule los números de página de los índices; ya vienen llenos, así que también se ven bien si no los actualizas.

## Qué es real y qué es propuesta

Todos los entregables usan cinco estados: *Existente (verificado)*, *Existente en la plataforma base*, *Parcial*, *Pendiente de validación* y *Propuesto (alcance académico)*.

- **Existente:** catálogo en 12 categorías, búsqueda con sugerencias, comparador de hasta 3 modelos, «Cotizar» por WhatsApp con el modelo en el mensaje, y páginas de dónde comprar, soporte, mayoristas y privacidad. Fuente: evidencia archivada del rediseño (23-09-2026) en este repositorio.
- **Propuesto:** plugin `bh-core` con registro y seguimiento de consultas, URL en el mensaje, directorio de distribuidores, estado de verificación de especificaciones, reportes, auditoría, segundo factor y respaldos.
- **No ejecutado:** los 32 casos de prueba están diseñados, no ejecutados. El presupuesto usa una tarifa hipotética (S/ 30 por hora) y no es un costo real.

## Fuentes y limitaciones

- Sitio oficial <https://www.blackhawkcaraudio.com/>, consultado el 29-09-2026: sitemap con 110 productos y 11 categorías.
- Rediseño: el 29-09-2026 la URL temporal de Cloudflare indicada ya no servía el sitio WordPress (respondía la página de acceso de otro dispositivo). Por eso solo se usó la evidencia archivada el 23-09-2026 (`../evidence/`, `../assets/`, informe `../black-hawk-evolucion-web-informe-completo.html`).
- Modelos de referencia: BH-4.8DSP y FR 2000.1 figuran en el sitemap oficial; BH-SW12XZP y FR 1500.1 figuran en la evidencia del rediseño; FR 3000.1, FR 15000.1, FR 40000.1, BH-70CHR, BH-200CHR y BH-605BN PRO no se encontraron en la evidencia y se marcan como pendientes de verificar. No se transcribió ninguna especificación técnica.
- No hay datos de Analytics, Search Console ni ventas: no se afirman mejoras de tráfico ni de conversión.

## Reconstruir

Requiere Node 22, Python 3 (Pillow, matplotlib, openpyxl), Java, Graphviz, LibreOffice (Writer e Impress, con `python3-uno`) y `pdftotext`.

```bash
cd _build
npm install pptxgenjs docx react-icons react react-dom sharp
# plantuml.jar: https://github.com/plantuml/plantuml/releases/download/v1.2024.8/plantuml-1.2024.8.jar
node -e "const m=require('./model');require('fs').writeFileSync('model.json',JSON.stringify(m,null,1))"
python3 prep_img.py                 # capturas del rediseño → PNG
./render_diagrams.sh                # PlantUML → PNG/SVG
dot -Tpng -Gdpi=180 arbol.dot -o ../DIAGRAMAS_UML/png/G05_arbol_problemas.png
python3 charts.py                   # gráficos G01–G04
python3 anexos_xlsx.py              # libro de anexos
node presentacion.js                # PPTX + slides_meta.json
./build_docx.sh monografia.js ../BLACK_HAWK_RUP_MONOGRAFIA.docx qa/mono.pdf
./build_docx.sh guia.js ../BLACK_HAWK_RUP_GUIA_EXPOSICION.docx qa/guia.pdf
```

`model.js` es la única fuente de requisitos, casos de uso, riesgos, trazabilidad y demás datos: al cambiarlo y reconstruir, todos los entregables se actualizan juntos. `specs.js` contiene las especificaciones detalladas de casos de uso. `build_docx.sh` genera el `.docx`, calcula la paginación con LibreOffice y llena los índices.
