# Informe de auditoría · Proyecto RUP Black Hawk (V2 → V3)

**Fecha:** 29-09-2026 · **Alcance:** presentación, monografía, guía y anexos de la V2, contrastados con el sitio original (`https://www.blackhawkcaraudio.com/`) y con la web renovada.

Las versiones V1 y V2 no se modificaron. La V3 se generó como archivos nuevos:

| V2 (se conserva) | V3 (nuevo) | Tamaño V3 |
|---|---|---|
| `BLACK_HAWK_RUP_PRESENTACION_V2.pptx` | `BLACK_HAWK_RUP_PRESENTACION_V3.pptx` | 28 diapositivas: 26 de contenido, preguntas y una de respaldo; unos 25 min |
| `BLACK_HAWK_RUP_MONOGRAFIA_V2.docx` | `BLACK_HAWK_RUP_MONOGRAFIA_V3.docx` | 22 páginas (cuerpo: 15), 10 figuras y 10 tablas |
| `BLACK_HAWK_RUP_GUIA_EXPOSICION_V2.docx` | `BLACK_HAWK_RUP_GUIA_EXPOSICION_V3.docx` | 11 páginas |
| `ANEXOS/BLACK_HAWK_RUP_ANEXOS_V2.xlsx` | `ANEXOS/BLACK_HAWK_RUP_ANEXOS_V3.xlsx` | 20 hojas (3 nuevas, 4 corregidas) |

## 1. Error de enfoque de la V2

La V2 presentaba un sistema propuesto (SGCD-BH) cuyo núcleo era registrar consultas, directorio y reportes, y trataba la web renovada como «lo que existe hoy». Eso mezclaba tres cosas distintas y dejaba sin mérito el trabajo principal, que es el rediseño. La V3 las separa en todos los entregables:

| Parte | Qué es | Estado |
|---|---|---|
| A · Sitio original | blackhawkcaraudio.com: el punto de partida | Existente |
| B · Web renovada | Rediseño visual, catálogo y consulta, recorrido comercial; administración sobre WordPress/WooCommerce | Desarrollada (entorno de prueba) |
| C · Ampliaciones | Registro del inicio de consulta, directorio estructurado, reportes, auditoría, seguimiento | Propuestas |

## 2. Cambios de contenido

1. **Sitio original como punto de partida.** Nuevas diapositivas 3 y 4 con capturas reales del 29-09-2026 y seis hallazgos numerados sobre ellas, clasificados como *inexistente*, *existe, poco visible* o *recorrido mejorable*. Ejemplo del matiz: WhatsApp sí existe en el sitio original, pero solo en «Ventas al mayor»; por eso no se dice que «no tiene WhatsApp».
2. **Problema reformulado:** «La plataforma original muestra el catálogo, pero no guía al usuario desde el interés en un producto hasta el contacto comercial». Sustituye el problema de la V2, centrado en la falta de registro de consultas.
3. **Antes y después (diapositivas 8 y 9).** Cuatro pares de pantallas equivalentes (home, catálogo, ficha, celular), todas capturas auténticas de cada sitio. Cada par indica antes, necesidad, modificación y beneficio esperado. Ninguna promete ventas.
4. **WhatsApp.** Se eliminó toda afirmación de que un clic equivale a una venta o de que el sistema «sabe» el resultado. No se menciona un CRM ni la API de WhatsApp Business, salvo como exclusiones.
5. **RUP aplicado al proceso real.** Una diapositiva por fase con objetivo, actividades, aplicación a Black Hawk, artefactos, hito y estado (Inicio y Elaboración realizadas, Construcción en curso, Transición planificada), más una matriz disciplinas × iteraciones × entregables.
6. **UML nuevo (V3-01 a V3-05)**, una diapositiva grande por diagrama: casos de uso, actividades, secuencia de «Cotizar por WhatsApp», clases y componentes (tema hijo `rozer-child`). Los elementos propuestos van en morado y con el estereotipo «propuesto». El despliegue queda como respaldo.
7. **Resultados con evidencia:** solo se usan las mediciones comparables de Lighthouse (peso y peticiones). La ficha del BH-SW12XXG pasó de 5,28 MB a 0,38 MB, y de 61 a 35 peticiones.
8. **Guía V3:** corresponde diapositiva por diapositiva (se genera del mismo `slides_v3.json`). Para cada una incluye mensaje principal, explicación natural, ejemplo, conceptos y posible pregunta con respuesta. Añade «el proyecto en dos minutos», siete explicaciones clave y ocho preguntas difíciles.
9. **Anexos V3**, corregidos solo donde cambia el enfoque:
   - **Hojas nuevas:** «Sitio original», «Antes y después» e «Iteraciones V3».
   - **«Datos verificados»:** reescrita, separando las cifras de cada sitio.
   - **RF:** columnas «Sitio original» y «Web renovada / proyecto (V3)».
   - **RF y RNF:** «En la presentación V3».
   - **Inventario de diagramas:** incluye los V3.
   - **Resto de hojas:** se conserva sin cambios.

## 3. Puntos que debes revisar

- **Iteraciones y actividades de Elaboración.** El orden y el contenido de I1–T1 (C1 home, C2 catálogo, C3 cotización) son una reconstrucción a partir de la evidencia del rediseño. Si tu proceso real fue distinto, corrige `ITER`, `MATRIZ` y `FASES` en `_build/v3data.js` y reconstruye.
- **Tamaño.** Pediste 22–26 diapositivas. Hay 26 de contenido más «Preguntas» y una de respaldo que solo se muestra si preguntan por la infraestructura.
- **RF-004 y RF-015 aparecen como «Parcial» en los anexos**, aunque la diapositiva 19 dice «Desarrollado»:
  - RF-004: la diapositiva describe la ficha con especificaciones en lista, que sí está hecha. El requisito formal pide además datos estructurados con fuente, que no existen.
  - RF-015: la diapositiva describe la página Mayoristas con formulario, que sí existe. La validación del RUC que exige el criterio de aceptación no se verificó.
- **Capturas del «antes».** Son suficientes para las cuatro comparaciones: home, tienda, ficha y celular. No se generó ni reconstruyó ninguna.
- **Defecto heredado.** La monografía V1 sigue mostrando en cursiva y sin guiones bajos nombres como `wp_bh_consulta`. No se regeneró para no sobrescribirla. Las versiones V2 y V3 no tienen el defecto.

## 4. Control de calidad

- Los tres archivos de Office pasan la validación de formato. Se revisaron las 28 diapositivas, las 22 páginas de la monografía y las 11 de la guía, renderizadas con LibreOffice, sin textos cortados ni superposiciones.
- Los índices de la monografía V3 están generados y sus números de página se comprobaron: 40 entradas, 10 figuras y 10 tablas.
- Cada cifra de la presentación figura en la hoja «Datos verificados», con su fuente y fecha.
