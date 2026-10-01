# Proyecto RUP · Black Hawk Car Audio (SGCD-BH)

Proyecto académico del curso **Diseño de Sistemas de Información**: aplicación de la metodología RUP al análisis, diseño y planificación del **Sistema de Gestión de Catálogo y Distribuidores Black Hawk (SGCD-BH)**.

## Versión 4 · presentación final (usar esta)

`BLACK_HAWK_RUP_PRESENTACION_V4.pptx`: 32 diapositivas, unos 30 min, sin animaciones. Parte de la V3 con los ajustes del autor (portada completa, sin notas de fuente internas) y agrega gestión de riesgos, modelo físico de datos, diagrama de despliegue en el bloque de diseño, verificación y pruebas, y plan de transición con capacitación por rol (hito PR). Diagramas nuevos y ampliados: `DIAGRAMAS_UML/*/V4_0*`.

`BLACK_HAWK_RUP_PRESENTACION_V4_ANIMADA.pptx`: la misma V4 con fundidos de 450 ms, Transformar (Morph) en 7 secuencias de diapositivas duplicadas (57 en total) y entradas por clic en riesgos, funcionalidades, pruebas, transición y conclusiones. Requiere PowerPoint de Microsoft 365 o 2019 en adelante para Transformar. Reconstruir: `cd _build && node presentacion_v4.js && python3 anim_v4.py`.

## Versión 3 · sitio original → web renovada → ampliaciones

| Archivo | Contenido |
|---|---|
| `BLACK_HAWK_RUP_PRESENTACION_V3.pptx` | 28 diapositivas (26 de contenido, preguntas y respaldo), unos 25 min. Tres bloques: situación original con capturas anotadas (1–6); diseño con RUP fase por fase, requisitos y cinco diagramas UML grandes (7–19); y resultado: web renovada, antes y después, flujo y funcionalidades (20–27). |
| `BLACK_HAWK_RUP_MONOGRAFIA_V3.docx` | 22 páginas (cuerpo: 15), 10 figuras, 10 tablas, referencias APA 7 y anexos A–B. |
| `BLACK_HAWK_RUP_GUIA_EXPOSICION_V3.docx` | 11 páginas: el proyecto en dos minutos, siete explicaciones clave y, por diapositiva, mensaje principal, explicación natural, ejemplo, conceptos y posible pregunta. |
| `BLACK_HAWK_RUP_GUIA_PREGUNTAS_TECNICAS_V3.docx` | 7 páginas: 18 preguntas técnicas probables (base de datos físico, casos de uso, pilares de RUP, UML, requisitos, pruebas) con respuesta corta, ampliación y advertencias; cuadro de bolsillo y lista de verificación previa. |
| `ANEXOS/BLACK_HAWK_RUP_ANEXOS_V3.xlsx` | Libro V2 corregido: hojas nuevas «Sitio original», «Antes y después» e «Iteraciones V3»; RF con estado en el sitio original y en la web renovada. |
| `INFORME_AUDITORIA_V3.md` | Cambios respecto de la V2 y puntos que debes revisar. |
| `DIAGRAMAS_UML/*/V3_0*` | Casos de uso, actividades, secuencia, clases y componentes de la web renovada. |

Reconstruir la V3 (después de los pasos de la V1):

```bash
cd _build
node -e "const v=require('./v3data');const o={...v};delete o.M;require('fs').writeFileSync('v3data.json',JSON.stringify(o,null,1));require('fs').writeFileSync('v3orig.json',JSON.stringify(require('./v3orig'),null,1))"
NODE_PATH=/opt/node22/lib/node_modules node shots_v3.js   # capturas de ambos sitios (Playwright)
./render_diagrams.sh
node presentacion_v3.js                                     # PPTX + slides_v3.json
./build_docx.sh monografia_v3.js ../BLACK_HAWK_RUP_MONOGRAFIA_V3.docx qa/mono_v3.pdf
node guia_v3.js
python3 anexos_v3.py                                        # parte del libro V2
```

## Versión 2 · primera presentación

| Archivo | Contenido |
|---|---|
| `BLACK_HAWK_RUP_PRESENTACION_V2.pptx` | 15 diapositivas, unos 14 min. Responde a cinco preguntas: qué es Black Hawk, qué necesita, qué problema se resuelve, qué sistema se propone y cómo se aplicará RUP. Los diagramas de actividades, casos de uso y clases están dibujados con formas editables. |
| `BLACK_HAWK_RUP_MONOGRAFIA_V2.docx` | 20 páginas (cuerpo: 12), con las 15 secciones pedidas, referencias en APA 7 y anexos A–C. |
| `BLACK_HAWK_RUP_GUIA_EXPOSICION_V2.docx` | 5 páginas: el proyecto en dos minutos, una ficha por diapositiva (idea, qué explicar, ejemplo, palabras clave, transición) y 15 preguntas del profesor. |
| `ANEXOS/BLACK_HAWK_RUP_ANEXOS_V2.xlsx` | Anexos organizados en tres niveles (hoja «LÉEME»), con las hojas nuevas «Datos verificados» y «Productos de referencia». |
| `INFORME_AUDITORIA_V2.md` | Qué se eliminó, fusionó, conservó y trasladó a anexos, y las inconsistencias corregidas. |

Datos verificados en la web renovada el 29-09-2026. La versión 1 (abajo) queda como documentación técnica de respaldo.

Reconstruir la V2 (después de los pasos de la V1):

```bash
cd _build
node -e "const m=require('./model');const v=require('./v2data');const fs=require('fs');fs.writeFileSync('model.json',JSON.stringify(m,null,1));const o={...v};delete o.M;fs.writeFileSync('v2data.json',JSON.stringify(o,null,1))"
node presentacion_v2.js
./build_docx.sh monografia_v2.js ../BLACK_HAWK_RUP_MONOGRAFIA_V2.docx qa/mono_v2.pdf
node guia_v2.js
python3 anexos_v2.py
```

## Versión 1 · documentación técnica completa


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
