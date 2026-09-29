# Informe de auditoría · Proyecto RUP Black Hawk (V1 → V2)

**Fecha:** 29-09-2026 · **Alcance:** los cuatro entregables de la versión 1, contrastados entre sí y con la web renovada en vivo (`https://fiction-videos-written-appearing.trycloudflare.com/`) y el sitio oficial.

Los archivos de la V1 no se modificaron. La V2 se generó como archivos nuevos:

| V1 (se conserva) | V2 (nuevo) | Tamaño V1 → V2 |
|---|---|---|
| `BLACK_HAWK_RUP_PRESENTACION.pptx` | `BLACK_HAWK_RUP_PRESENTACION_V2.pptx` | 45 → 15 diapositivas · unos 40 → 14 min |
| `BLACK_HAWK_RUP_MONOGRAFIA.docx` | `BLACK_HAWK_RUP_MONOGRAFIA_V2.docx` | 73 → 20 páginas (cuerpo: 48 → 12) |
| `BLACK_HAWK_RUP_GUIA_EXPOSICION.docx` | `BLACK_HAWK_RUP_GUIA_EXPOSICION_V2.docx` | 36 → 5 páginas |
| `ANEXOS/BLACK_HAWK_RUP_ANEXOS.xlsx` | `ANEXOS/BLACK_HAWK_RUP_ANEXOS_V2.xlsx` | 14 → 17 hojas, con índice por niveles |

## 1. Verificación con la web renovada (29-09-2026)

| Dato | Resultado | Cómo se verificó |
|---|---|---|
| Productos | 118 | Sitemap de productos |
| Categorías | 12 (el sitio oficial tiene 11; «Cargadores» solo existe en la renovada) | Sitemap de categorías |
| Especificaciones | Las 118 fichas las tienen, con la leyenda «Especificaciones técnicas verificadas por Black Hawk»; 112 en lista y 6 en párrafo (BH-653CST, BH-654CST, BH-658CST, BH-603BN PRO, BH-SQ6.5, BH-SW12LJD) | Descarga y análisis de las 118 fichas |
| Comparador | Máximo 3 productos; la selección se guarda en el navegador y caduca a las 24 h | Código del tema (`navigation.js`) |
| Mensaje de WhatsApp | Incluye el modelo; **no** incluye la URL del producto | Enlaces `wa.me` de las fichas |
| Directorio de distribuidores | No existe: «Dónde comprar» deriva a WhatsApp | Página `/distribuidores/` |
| Modelos de referencia | 9 de 10 existen. BH-605BN PRO no aparece en ninguna de las dos webs (sí existen BH-603BN PRO y BH-605LA) | Sitemap de productos |
| «Próximamente» | BH-FR15000.1 y BH-FR40000.1 | Fichas |

## 2. Auditoría (A–J)

**A. Indispensable para la primera presentación.** Qué es Black Hawk y su modelo comercial (catálogo sin venta en línea); el flujo actual hasta WhatsApp; el problema en una frase y tres necesidades; qué es el SGCD-BH y quién lo usa; objetivos y alcance; las tres características de RUP; las cuatro fases con sus hitos; requisitos representativos; un diagrama de casos de uso y uno de clases; la arquitectura en capas; resultados esperados; conclusiones.

**B. Importante, pero resumible.** Stakeholders (8 → 4 usuarios del sistema); 12 módulos (→ 4 áreas funcionales); 6 buenas prácticas de RUP (→ integradas en las 3 características); 9 disciplinas (→ una frase); 7 decisiones de arquitectura (→ 3 en la monografía); 12 riesgos (→ 5 en la monografía, ninguno en pantalla); cronograma de 11 tareas (→ semanas por fase dentro de la diapositiva de fases).

**C. Trasladado a anexos.** Catálogo completo de RF y RNF con criterios de aceptación; especificaciones de casos de uso; los 22 diagramas UML; modelo entidad-relación y diccionario de datos; matriz de trazabilidad; 32 casos de prueba; endpoints REST; controles de seguridad; plan de despliegue y reversión; esfuerzo (560 h) y presupuesto referencial; EDT; matriz de riesgos completa; iteraciones detalladas.

**D. Redundante en la V1.** Seis diapositivas repetían la misma idea: 6 y 23 (existente frente a propuesto); 12 y 38 (fases frente a cronograma); 11 y 13 (dos vistas de las disciplinas); 9 y 10 (características y buenas prácticas). En la monografía, los requisitos se presentaban dos veces (distribución en el capítulo IV y catálogo en el anexo A), además del libro de anexos, y la guía repetía textualmente las notas del orador.

**E. Demasiado especializado para una primera exposición.** Endpoints (`/wp-json/bh/v1/...`), nombres de tablas (`wp_bh_consulta`), `sendBeacon`, códigos RF/CU/CP en pantalla, secuencias con mensajes numerados, diagramas de componentes y despliegue, máquina de estados, modelo entidad-relación, cinco estados de implementación, hitos con nombres en inglés sin traducir.

**F. Contradicciones e inconsistencias encontradas.** Detalladas y resueltas en la sección 4.

**G. Diagramas que aportan valor a la explicación.** Casos de uso (quién usa el sistema y qué puede hacer), clases (cómo se relacionan los datos) y actividades (cómo funciona el proceso). En la V2 están dibujados con formas editables de PowerPoint (diapositivas 7 y 11) y como vistas simplificadas S-01 a S-04 en la monografía.

**H. Diagramas de respaldo técnico.** Casos de uso del negocio (D-01), casos de uso por módulo (D-03 a D-06), análisis (D-08), clases de diseño (D-09, D-10), objetos (D-11), secuencias (D-12 a D-15), actividades de administración (D-17), estados (D-18), componentes (D-19), despliegue (D-20), entidad-relación (D-21) y capas detalladas (D-22).

**I. Información real frente a supuestos académicos.**

| Real (verificado) | Supuesto académico o estimación |
|---|---|
| 118 productos, 12 categorías, web tipo catálogo sin carrito | Que las consultas sin registro impiden saber qué genera interés (inferido del diseño) |
| Comparador de 3, «Cotizar» con el modelo en el mensaje | Stakeholders y su nivel de influencia (sin entrevistas) |
| Sin directorio de distribuidores | 14 semanas, 560 h y S/ 16 800 (tarifa hipotética) |
| Especificaciones en las 118 fichas (6 en párrafo) | Beneficios esperados e indicadores |
| Formulario de mayoristas con consentimiento | Riesgos y sus valores de probabilidad e impacto |

Además, «Marca líder en car audio en Perú» y «una década en el sector» son afirmaciones de la propia marca: la V2 no las presenta como hechos verificados.

**J. Lo que hacía difícil memorizar la V1.** 45 diapositivas; unas 40 cifras distintas (27, 13, 22, 32, 12, 7, 560…); códigos en pantalla (RF-014, CU-09, COMP-06, CP-014); cinco estados de implementación; siete iteraciones con nombre propio; guion de 36 páginas redactado para leer y no para entender.

## 3. Qué se hizo

**Se eliminó de la exposición** (se conserva en anexos): diapositivas de buenas prácticas, disciplinas, stakeholders, viabilidad, construcción por incrementos, módulos existentes frente a propuestos, pruebas, criterios de salida, despliegue, UML frente a Rose como diapositiva propia, secuencia, estados, componentes, despliegue, entidad-relación, riesgos, trazabilidad, recomendaciones y referencias en pantalla.

**Se fusionó:**
- Fases de RUP + cronograma → una sola diapositiva (9) con qué haremos, qué entregaremos, relación con Black Hawk, semanas estimadas e hitos.
- Existente frente a propuesto (V1: diapositivas 6 y 23) → diapositiva 3 (existe hoy) y diapositiva 7 (lo propuesto en el flujo).
- 12 módulos → 4 áreas funcionales.
- 5 estados de implementación → «Existe» / «Propuesto» en pantalla (los 5 se mantienen en los anexos).
- RUP, UML y Rational Rose → una franja de tres conceptos en la diapositiva 11.
- Diagrama de actividades → es la propia diapositiva 7 («¿Cómo funcionará?»).

**Se conservó:** el modelo conceptual completo (requisitos, casos de uso, clases, arquitectura, riesgos, trazabilidad), la identidad visual, las imágenes reales y la distinción entre existente y propuesto. La monografía V1 queda como documentación técnica de respaldo.

**Se creó:** diagramas simplificados S-01 a S-04 (PlantUML, PNG y SVG); diagramas de actividades, casos de uso y clases dibujados con formas editables en el PowerPoint; capturas nuevas de la web renovada (`_build/img/v2-*.png`); hojas «LÉEME», «Datos verificados» y «Productos de referencia», y la columna «En la presentación V2» en RF y RNF.

## 4. Inconsistencias corregidas

1. **Modelos no verificados.** La V1 marcaba BH-FR3000.1, BH-FR15000.1, BH-FR40000.1, BH-70CHR y BH-200CHR como no encontrados. La web renovada sí los publica. BH-605BN PRO sigue sin encontrarse y así se indica.
2. **Nombres de modelos.** La V1 escribía «FR 1500.1»; la web usa «BH-FR1500.1». La V2 usa los nombres de la web. También se actualizaron las fuentes de D-11 y W-02; la imagen incrustada en la monografía V1 conserva la versión anterior.
3. **Problema de especificaciones.** La V1 afirmaba que había fichas sin especificaciones (cierto en el sitio oficial el 23-09-2026, con BH-8.12DSP). En la web renovada, las 118 fichas las tienen. La V2 reformula la necesidad: pasar de texto dentro de cada ficha a datos estructurados con fuente y estado, y deja claro que no se trata de corregir datos erróneos.
4. **BH-4.8DSP.** El enunciado lo llama procesador; la web lo ubica en la categoría «Ecualizador». La V2 lo aclara.
5. **Disponibilidad del rediseño.** La V1 indicaba que la URL temporal ya no servía el sitio; con la nueva URL, la V2 se basa en observaciones del 29-09-2026.
6. **Comparador.** «Selección guardada entre páginas» se precisa: se guarda en el navegador y caduca a las 24 h.
7. **Mezcla de fuentes en cifras.** La V1 combinaba 110 productos (sitio oficial), 118 (rediseño) y 12 categorías sin decir a qué web correspondía cada dato. La V2 cita siempre la fuente (hoja «Datos verificados»).
8. **Afirmaciones de marca.** «Marca líder» y «más de 10 años» ya no se presentan como hechos.
9. **Defecto de formato en la monografía V1.** Los nombres con guion bajo (`wp_bh_consulta`, 7 casos) se mostraban sin guiones y en cursiva. El generador se corrigió y la V2 no tiene el defecto. La V1 no se regeneró para no sobrescribirla.
10. **Duración.** La guía V1 indicaba unos 40 min (versión corta de unos 30). La V2 dura unos 14 min y su guion coincide diapositiva por diapositiva con el PowerPoint V2, porque ambos se generan del mismo archivo (`_build/slides_v2.json`).
11. **Tiempo verbal.** La V2 usa «se propone», «se diseñará» y «se espera» para lo futuro, y «se definió» y «se modeló» solo para los artefactos de análisis y diseño ya elaborados. Ninguna prueba se describe como ejecutada.

## 5. Control final de calidad

- La narrativa de la presentación responde, en orden, a las cinco preguntas: empresa (2–3), necesidad (4), sistema y funcionamiento (5–7), RUP (8–9) y diseño (10–12), y cierra con resultados y conclusiones (13–14).
- Se revisaron las 15 diapositivas renderizadas: sin textos cortados ni superposiciones. Los diagramas de las diapositivas 7 y 11 son formas editables.
- Los tres archivos de Office pasan la validación de formato. Los índices de la monografía V2 se generaron y se comprobaron sus números de página.
- Todas las cifras de la V2 están en la hoja «Datos verificados», con su fuente, o marcadas como estimación académica.
