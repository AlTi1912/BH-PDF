// Genera BLACK_HAWK_RUP_GUIA_EXPOSICION_V4.docx: guion hablado para BLACK_HAWK_RUP_PRESENTACION_V4_ANIMADA.pptx,
// con señales de clic, qué omitir (por redundancia, repetición o irrelevancia) y tiempos.
const fs = require('fs');
const L = require('./docxlib');
const R = require('./qa/anim_report.json');
const { d } = L;
const { Document, Packer, Paragraph, TextRun, AlignmentType, Header, Footer, PageNumber, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, HeadingLevel } = d;

const W = 9638;
const PUR = '6D28D9';
const H1 = (t, br = false) => new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: br, keepNext: true, children: [new TextRun(t)], spacing: { before: 120, after: 100 } });
const small = (t, o = {}) => new Paragraph({ children: L.runs(t, { size: 18 }), spacing: { after: o.after ?? 40, line: 252 }, keepNext: o.keepNext });
const b = { style: BorderStyle.SINGLE, size: 4, color: 'E3E4E8' };
const nb = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };

// Una línea del guion; las que empiezan con «▶» son un clic
const line = (t) => {
  const click = t.startsWith('▶');
  const body = click ? t.slice(1).trim() : t;
  return new Paragraph({ spacing: { after: 40, line: 252 }, indent: click ? { left: 200 } : undefined,
    children: [...(click ? [new TextRun({ text: '▸ CLIC  ', bold: true, color: PUR, size: 17 })] : []), ...L.runs(body, { size: 18 })] });
};

function grid(head, rows, widths) {
  const cell = (t, i, h) => new TableCell({ width: { size: widths[i], type: WidthType.DXA }, shading: h ? { fill: '0B0B0D', type: ShadingType.CLEAR, color: 'auto' } : (i === 0 ? { fill: 'F3EEFC', type: ShadingType.CLEAR, color: 'auto' } : undefined), margins: { top: 30, bottom: 30, left: 90, right: 90 }, borders: { top: b, bottom: b, left: nb, right: nb },
    children: [new Paragraph({ children: h ? [new TextRun({ text: t, bold: true, color: 'FFFFFF', size: 17 })] : L.runs(t, { size: 17 }), spacing: { line: 240 } })] });
  return [new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: widths, rows: [
    new TableRow({ tableHeader: true, children: head.map((t, i) => cell(t, i, true)) }),
    ...rows.map((r) => new TableRow({ cantSplit: true, children: r.map((t, i) => cell(t, i, false)) })),
  ] }), new Paragraph({ spacing: { after: 80 }, children: [] })];
}

// ── Guion por diapositiva de contenido (número de pie)
const G = [
  [1, 20, ['Buenos días. Soy Nils Tovar. Presento cómo apliqué RUP para analizar, diseñar y desarrollar la web renovada de Black Hawk Car Audio: del sitio original a una plataforma que guía al cliente hasta la consulta comercial.'],
    'Curso, docente e institución: se ven en pantalla.'],
  [2, 40, ['Black Hawk es una marca peruana de car audio: amplificadores, subwoofers, procesadores. Vende a través de su área comercial y de distribuidores; por eso su web es un **catálogo, no una tienda**: no tiene carrito ni pagos. Su sitio original publica 110 productos en 11 categorías.'],
    'Las cuatro filas (sector, productos, público, modelo) una por una: solo el modelo comercial importa para lo que sigue.', '¿Por qué la web no vende? → Porque la venta pasa por el área comercial y los distribuidores; la web orienta la compra.'],
  [3, 35, ['Black Hawk ya tenía un sistema web: WordPress con WooCommerce, catálogo por categorías, buscador y fichas. **No partimos de cero**: el proyecto no reemplaza la plataforma; rediseña su presentación, su catálogo y el camino hasta el contacto comercial.', '(Al avanzar, las capturas se reacomodan en la vista de análisis.)'],
    'La lista «Lo que ya tiene» y la fecha de las capturas: basta con decir que son capturas reales.'],
  [4, 90, ['Analicé el sitio con capturas reales y clasifiqué cada hallazgo en tres tipos: lo que **no existe**, lo que **existe pero está oculto** y el **recorrido que se puede mejorar**.',
    '▶ 1. Al pulsar «Productos» se abre una tienda vacía: los productos solo aparecen entrando por categoría.',
    '▶ 2. La ficha del BH-SW12XXG no tiene ningún botón para consultar.',
    '▶ 3. El menú no lleva ni a contacto ni a dónde comprar.',
    '▶ 4. WhatsApp sí existe, pero escondido en «Ventas al mayor»: por eso lo marco como poco visible, no como inexistente.',
    '▶ 5. El catálogo informa poco y conserva textos en inglés, como «Showing 1–12 of 16 results».',
    '▶ 6. Y no hay comparador ni una página de dónde comprar.'],
    'La etiqueta de tipo de cada hallazgo: la clasificación ya la explicaste al inicio. Dedica más tiempo a 1, 2 y 4; los demás, una frase.', '¿Cómo sabe que son problemas reales? → Están en capturas del sitio original; en el caso de WhatsApp, además, revisé los enlaces de la página.'],
  [5, 45, ['Todo esto se resume en un problema: **la plataforma muestra el catálogo, pero no guía al usuario desde el interés en un producto hasta el contacto comercial.** De ahí salen tres necesidades: guiar del interés al contacto, un catálogo claro y comparable, y una marca moderna que funcione en el celular.'],
    'La frase «Necesidad central» (repite el problema) y las referencias «Hallazgos: 2, 3, 4»: los hallazgos ya se vieron.'],
  [6, 45, ['El objetivo general es desarrollar la web renovada aplicando RUP. El alcance tiene cinco grupos: rediseño visual, catálogo y consulta y recorrido comercial, los tres desarrollados; la administración, que usa el panel de WordPress; y mejoras complementarias, que son propuesta. Queda fuera la venta en línea, un ERP, un CRM y una aplicación móvil.'],
    'Los cuatro objetivos específicos: siguen el mismo orden que las fases de RUP que vienen a continuación.', '¿Por qué no incluye carrito? → Porque el modelo comercial de Black Hawk no vende en línea.'],
  [7, 50, ['RUP organiza el desarrollo en fases e iteraciones y tiene tres características. Es **iterativo e incremental**: la web creció por partes, home, catálogo, ficha y cotización. Está **dirigido por casos de uso**: «Cotizar por WhatsApp» guió el diseño de la ficha y del mensaje. Y está **centrado en la arquitectura**: antes de construir decidí trabajar con un tema hijo sobre WooCommerce. Lo elegí porque obliga a analizar y modelar antes de construir, y cada fase cierra con un hito.'],
    'La definición textual con la cita y la franja «Por qué RUP»: dilas con tus palabras, no las leas.', '¿Por qué RUP y no Scrum? → El curso exige análisis y diseño formales con UML, y RUP combina iteraciones con hitos y artefactos de modelado.'],
  [8, 70, ['RUP tiene dos dimensiones: en el tiempo, cuatro fases con sus iteraciones; en el contenido, las disciplinas. Las barras muestran cuánto trabajo tiene cada disciplina en cada fase: no es una cascada, todas conviven.',
    '▶ Inicio: entender el negocio. Cierra con el hito LCO.',
    '▶ Elaboración: requisitos, modelos y arquitectura. Hito LCA.',
    '▶ Construcción: desarrollo por incrementos. Hito IOC.',
    '▶ Transición: la entrega a la empresa. Hito PR. Veamos qué se hizo en cada una.'],
    'Los nombres de las nueve disciplinas y la leyenda de hitos de abajo. Aquí solo una línea por fase: el detalle va en las cuatro diapositivas siguientes.'],
  [9, 40, ['En Inicio documenté el sitio original, identifiqué a los interesados y confirmé la viabilidad: la plataforma y el canal de WhatsApp ya existían. Está **realizada**: hito LCO, objetivos y alcance acordados.'],
    'Las actividades y los artefactos (se ven en pantalla). No repitas los hallazgos uno por uno: nómbralos en una frase.'],
  [10, 40, ['En Elaboración definí requisitos, casos de uso, diagramas y arquitectura. La decisión clave fue **rediseñar sobre la misma plataforma con un tema hijo**, en lugar de reemplazarla: así las actualizaciones no borran los cambios. Realizada: hito LCA, arquitectura validada.'],
    'Los cuatro puntos de la decisión de arquitectura. Los diagramas solo se nombran aquí; se explican más adelante.'],
  [11, 45, ['En Construcción desarrollé por incrementos: C1, identidad y home; C2, catálogo, fichas, búsqueda y comparador; C3, el recorrido de cotización con WhatsApp y las páginas de dónde comprar, mayoristas y soporte. Está **en curso**: el rediseño funciona en un entorno de prueba y las ampliaciones están planificadas.'],
    'El recuadro de pruebas: lo explicas en «Verificación y pruebas» (pie 28).'],
  [12, 20, ['Transición es la entrega: validar con Black Hawk, publicar en su dominio y capacitar. Está **planificada**; el plan detallado lo presento al final.'],
    'Los criterios para publicar y los artefactos: los cubre «Plan de transición» (pie 30). Es la diapositiva más corta.'],
  [13, 35, ['Esta matriz resume las siete iteraciones: qué se entregó en cada una y su estado. Dos cosas a notar: requisitos y diseño aparecen varias veces, que es lo iterativo, y la implementación empieza con un prototipo en Elaboración. C3 sigue en curso y T1 está planificada.'],
    'Leer celdas: su contenido ya se contó en las fases.', '¿Por qué hay implementación en Elaboración? → Porque en RUP se construye un prototipo para validar la arquitectura antes de la construcción completa.'],
  [14, 60, ['RUP ataca los riesgos temprano. A la izquierda, probabilidad por impacto; a la derecha, la respuesta a cada riesgo.',
    '▶ 1. Que una actualización rompa el rediseño: mitigado con el tema hijo y probando primero en el entorno de prueba.',
    '▶ 2. Que el alcance crezca hacia una tienda o un ERP: controlado desde Inicio con las exclusiones.',
    '▶ 3. Páginas lentas: mitigado y medido; el dato lo muestro en el resultado.',
    '▶ 4. Especificaciones con errores: sigue abierto hasta revisarlas con Black Hawk.',
    '▶ 5. Falla al publicar: respaldo previo y plan de reversión.',
    '▶ 6. Seguridad de WordPress: actualizaciones controladas, privilegio mínimo y respaldos.'],
    'El color de cada celda. Aclara una sola vez que la valoración es cualitativa, del equipo.', '¿Cómo se valoraron? → Cualitativamente, en tres niveles de probabilidad e impacto; no son cifras estadísticas.'],
  [15, 40, ['Los requisitos dicen qué hace la web y con qué calidad. Seis grupos funcionales ya están desarrollados: explorar, buscar, ver la ficha, comparar hasta tres modelos, cotizar y consultar dónde comprar; el séptimo, registro, directorio y reportes, es propuesto. Los no funcionales: celular, «Cotizar» siempre visible, páginas livianas, español y protección de datos. Cada requisito tiene un criterio de aceptación: por ejemplo, el comparador debe rechazar un cuarto modelo.'],
    'Los códigos RF y RNF (no se leen) y el peso medido de la ficha: se dice en el resultado.'],
  [16, 70, ['El diagrama de casos de uso muestra quién usa la web y qué puede hacer. A la izquierda, visitante, cliente interesado y distribuidor; a la derecha, el gestor del catálogo; abajo, WhatsApp, que es un sistema externo.',
    '▶ Zoom: el caso central es «Cotizar por WhatsApp». Incluiría «Registrar inicio de consulta», en morado porque es propuesto. «Filtrar» extiende a «Explorar»: es opcional.',
    '▶ Zoom: en administración, el gestor maneja productos, categorías y contenidos; el directorio y los reportes son propuestos.',
    '▶ Vista completa: lo que está en negro funciona hoy; lo morado es ampliación.'],
    'Leer los 13 casos de uso uno por uno.', '¿Qué diferencia hay entre actor y usuario? → El actor es un rol: la misma persona puede ser visitante y luego cliente interesado.'],
  [17, 40, ['El diagrama de actividades muestra el proceso paso a paso y quién hace cada paso, en tres calles: cliente, web renovada y área comercial. Las decisiones son los rombos: si conoce el modelo lo busca, si no explora; si quiere, compara; si tiene intención de compra, cotiza. La web termina al abrir WhatsApp; la venta ocurre después, con el área comercial.'],
    'Recorrer cada acción: bastan las tres decisiones. El mismo recorrido vuelve en el flujo comercial (pie 26): no lo expliques dos veces.'],
  [18, 35, ['La secuencia muestra el orden de los mensajes cuando el cliente cotiza: la ficha pide el producto a WooCommerce, que lo lee de la base de datos; la ficha arma el mensaje con el modelo y abre WhatsApp. El recuadro morado es la ampliación: registrar el inicio de la consulta.'],
    'Los mensajes numerados y el texto del mensaje de WhatsApp: se lee en el flujo comercial.'],
  [19, 35, ['El diagrama de clases muestra cómo se organiza la información. El producto es el centro: pertenece a una o más categorías y se compone de especificaciones e imágenes. Si se elimina un producto, sus especificaciones desaparecen con él: eso es la composición. Distribuidor y evento de consulta están en morado: son propuestos.'],
    'Las multiplicidades una por una: explica solo «1..*», uno o más.'],
  [20, 60, ['El diagrama de clases era el modelo conceptual; este es el **físico**: las tablas reales de MySQL que usan WordPress y WooCommerce, con sus claves primarias y foráneas.',
    '▶ Zoom: cada producto es una fila de wp_posts con tipo «product», y sus datos adicionales van en wp_postmeta. La tabla morada, wp_bh_consulta, es la propuesta para registrar el inicio de cada consulta.',
    '▶ Zoom: las categorías están en wp_terms y wp_term_taxonomy; wp_term_relationships une productos y categorías: es la relación muchos a muchos.',
    '▶ Vista completa: para lo desarrollado no creé tablas nuevas; uso el esquema estándar. WordPress no declara claves foráneas en el motor: la integridad la controla la aplicación.'],
    'Los tipos de dato de cada columna y la tabla wp_users: solo si preguntan.', '¿Crearon tablas nuevas? → No para lo desarrollado. wp_bh_consulta es propuesta.'],
  [21, 35, ['En componentes se ve dónde está mi desarrollo: el **tema hijo rozer-child**, con las plantillas, las páginas, los scripts del buscador y del comparador y el botón de WhatsApp. WooCommerce maneja los productos, YITH Catalog Mode oculta precio y carrito, y todo corre sobre WordPress y MySQL. El módulo propio en morado alojaría las ampliaciones.'],
    'Describir cada flecha.'],
  [22, 30, ['El despliegue muestra dónde se ejecuta: los navegadores del cliente y del gestor se conectan por HTTPS al servidor de producción, con LiteSpeed, PHP y la base de datos local. Hoy la web renovada está en el entorno de prueba; en la Transición pasa a producción. WhatsApp se abre desde el navegador del cliente: el servidor no se conecta con WhatsApp.'],
    'Listar los artefactos del servidor: ya los nombraste en componentes.'],
  [23, 40, ['Con todo eso diseñado, lo que entrego es la web renovada. Separo tres cosas: el **sitio original**, que es el punto de partida; la **web renovada**, que es mi desarrollo y ya funciona en un entorno de prueba; y las **ampliaciones**, que propongo para después.'],
    'Los cinco puntos de la tarjeta negra: se ven en las comparaciones siguientes.'],
  [24, 45, ['Comparo pantallas equivalentes. Este es el sitio original.',
    '▶ Entra la web renovada. Home: la marca gana jerarquía y el encabezado ofrece siempre buscar y cotizar. Catálogo: «Productos» ya no lleva a una tienda vacía; muestra los 118 productos con pestañas, contador y filtros.'],
    'Las cuatro filas de cada par (antes, necesidad, modificación, beneficio): di la modificación y, si hay tiempo, el beneficio.'],
  [25, 40, ['Ahora la ficha y el celular.',
    '▶ La ficha tiene «Cotizar» junto al modelo y «Comparar»; en el celular, una barra fija con el botón de cotización. Ninguna comparación promete ventas: la mejora en uso se medirá cuando se publique.'],
    'Repetir el «antes» de la ficha: ya se mostró en el análisis (hallazgo 2).'],
  [26, 50, ['El recorrido completo, como quedó implementado. Primero, el cliente.',
    '▶ Catálogo.', '▶ Producto.', '▶ Comparación.', '▶ «Cotizar».', '▶ Dónde comprar o WhatsApp.', '▶ Atención comercial, fuera de la web.',
    '▶ El mensaje llega así: «Hola Black Hawk, vengo de la web y quiero cotizar el modelo BH-SW12XXG». El clic abre una conversación: no equivale a una venta. Abajo, en morado, las ampliaciones: registrar el inicio de la consulta, el directorio y el seguimiento.'],
    'Volver a explicar las decisiones del diagrama de actividades: aquí los pasos se nombran rápido, uno por clic.', '¿El sistema sabe si el cliente compró? → No. Solo que se abrió WhatsApp desde una página.'],
  [27, 40, ['Resumo la solución en cinco grupos.', '▶ Rediseño visual.', '▶ Catálogo y consulta, con el comparador de hasta tres modelos, que guarda la selección 24 horas.', '▶ Recorrido comercial: «Cotizar» con el modelo y las páginas de dónde comprar, mayoristas y soporte.', '▶ Administración: usa el panel de WordPress y WooCommerce; no programé uno nuevo.', '▶ Y las mejoras complementarias, que son propuesta.'],
    'Las viñetas de los grupos A y B: ya se vieron en el antes y después.'],
  [28, 50, ['Cada función se verificó en la web renovada y quedó documentada con capturas.', '▶ Búsqueda.', '▶ Filtro del catálogo.', '▶ Comparar tres modelos.', '▶ Un cuarto modelo se rechaza: es la captura de la derecha.', '▶ La selección se conserva al cambiar de página.', '▶ «Cotizar» abre WhatsApp con el modelo.', '▶ Menú y búsqueda en el celular.', '▶ Aceptación con Black Hawk…', '▶ …y pruebas en el dominio oficial: estas dos están planificadas; no las presento como hechas.'],
    'El resultado esperado de cada fila: di la prueba y avanza. Cierra con el recuadro negro: siete ejecutadas, dos planificadas.', '¿Hicieron pruebas unitarias? → No. Verificación funcional con capturas; las pruebas formales de aceptación están planificadas.'],
  [29, 45, ['¿Se resolvieron las necesidades? Guiar al contacto: «Cotizar» en el encabezado y en la ficha. Catálogo claro: filtros, fichas en lista y comparador. Marca moderna y adaptable. Y lo medido: **la ficha del BH-SW12XXG pasó de 5,28 a 0,38 MB transferidos, y de 61 a 35 peticiones.** Las ventas no las afirmo: la web aún no está publicada.'],
    'Describir las cuatro capturas: ya se vieron. No repitas los 118 productos.', '¿Aumentaron las ventas? → No lo sé ni lo afirmo; se medirá con datos reales después de publicar.'],
  [30, 50, ['Para cerrar el ciclo falta la Transición. La puesta en producción tiene cinco pasos:', '▶ la aceptación de Black Hawk en el entorno de prueba,', '▶ un respaldo completo del sitio actual,', '▶ la publicación en blackhawkcaraudio.com,', '▶ la verificación en el dominio oficial,', '▶ y, si algo falla, la reversión con el respaldo. Además, capacitación según el rol: el gestor edita el catálogo, el área comercial atiende las consultas y el administrador mantiene el sitio. Cumplido todo eso, se alcanza el hito PR.'],
    'Leer la descripción de cada rol.', '¿Qué pasa si la publicación falla? → Se restaura el respaldo y el sitio original vuelve a funcionar mientras se corrige en el entorno de prueba.'],
  [31, 45, ['▶ Punto de partida: Black Hawk tenía plataforma, pero no guiaba a una acción comercial.', '▶ Solución: la web renovada rediseña la marca, ordena el catálogo y lleva cada producto a una consulta, sobre la misma plataforma.', '▶ Metodología: RUP organizó el trabajo; Inicio y Elaboración están realizadas, Construcción avanzada y Transición planificada, con modelos UML que sustentan cada decisión.', '▶ Próximos pasos: validar con Black Hawk, publicar y medir con datos reales, implementar el registro de consultas y el directorio, y capacitar al gestor.'],
    'Cifras: ninguna conclusión necesita repetirlas.'],
  [32, 5, ['Muchas gracias. Quedo atento a sus preguntas.'], '—'],
];

const META = require('./slides_v4.json');
const total = G.reduce((a, g) => a + g[1], 0);
const files = (n) => { const r = R.filter((x) => x.content === n).map((x) => x.pos); return r.length > 1 ? `${r[0]}–${r[r.length - 1]}` : `${r[0]}`; };
const clicks = (n) => R.filter((x) => x.content === n).reduce((a, x) => a + x.clicks, 0) + R.filter((x) => x.content === n).length - 1;

function block([n, t, decir, omitir, preg]) {
  const title = META[n - 1].visible || META[n - 1].title;
  const k = clicks(n);
  const head = new TableRow({ cantSplit: true, children: [new TableCell({ columnSpan: 2, width: { size: W, type: WidthType.DXA }, shading: { fill: '0B0B0D', type: ShadingType.CLEAR, color: 'auto' }, margins: { top: 50, bottom: 50, left: 110, right: 110 }, borders: { top: nb, bottom: nb, left: nb, right: nb },
    children: [new Paragraph({ keepNext: true, children: [new TextRun({ text: `${n}  `, bold: true, color: 'A78BFA', size: 20 }), new TextRun({ text: title, bold: true, color: 'FFFFFF', size: 20 }),
      new TextRun({ text: `   ·  ~${t} s  ·  ${k ? k + (k === 1 ? ' clic' : ' clics') : 'sin clics'}  ·  archivo ${files(n)}`, color: '9CA3AF', size: 16 })] })] })] });
  const row = (lbl, content, fill) => new TableRow({ cantSplit: content.length < 7, children: [
    new TableCell({ width: { size: 1300, type: WidthType.DXA }, shading: { fill: fill || 'F3EEFC', type: ShadingType.CLEAR, color: 'auto' }, margins: { top: 30, bottom: 30, left: 110, right: 80 }, borders: { top: b, bottom: b, left: nb, right: nb }, children: [small(`**${lbl}**`)] }),
    new TableCell({ width: { size: W - 1300, type: WidthType.DXA }, margins: { top: 30, bottom: 30, left: 110, right: 110 }, borders: { top: b, bottom: b, left: nb, right: nb }, children: content }),
  ] });
  const rows = [head, row('Decir', decir.map(line))];
  if (omitir && omitir !== '—') rows.push(row('Omitir', [small(omitir)], 'FDF2E9'));
  if (preg) rows.push(row('Si preguntan', [small(preg)]));
  return [new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [1300, W - 1300], rows }), new Paragraph({ spacing: { after: 90 }, children: [] })];
}

const c = [];
c.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: 'GUION DE EXPOSICIÓN · V4', bold: true, size: 32 })] }));
c.push(new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: 'Para BLACK_HAWK_RUP_PRESENTACION_V4_ANIMADA.pptx · 32 diapositivas de contenido · 57 en el archivo', size: 20, color: L.MUTED })] }));
c.push(small(`**Cómo leer este guion.** Cada bloque corresponde al número de pie que se ve en pantalla. **Decir** es el texto hablado; cada «▸ CLIC» marca un clic y lo que dices después. **Omitir** indica qué no leer o no repetir, y por qué. Duración objetivo: unos ${Math.round(total / 60)} minutos.`, { after: 60 }));
c.push(small('**Cuatro reglas.** (1) No leas la diapositiva: el público ya la ve. (2) Cada cifra se dice **una sola vez**, en el lugar indicado en la sección 1. (3) Di siempre si algo está desarrollado o propuesto. (4) En las secuencias con Transformar, habla **después** del clic, cuando el movimiento termina.', { after: 120 }));

c.push(H1('1. Mapa de repeticiones'));
c.push(small('Varios temas aparecen en más de una diapositiva. Explica cada uno en un solo lugar y en los demás solo nómbralo.', { after: 60 }));
c.push(...grid(['Tema', 'Se explica en', 'Solo se menciona en'], [
  ['Hallazgos del sitio original', '4 (uno por clic)', '5 (problema) y 9 (Inicio): en una frase'],
  ['Fases de RUP', '9–12 (lo hecho en cada fase)', '8: una línea por fase; 13: solo el resumen'],
  ['Transición y capacitación', '30 (plan completo)', '12: «está planificada; la detallo al final»'],
  ['Pruebas', '28', '11: no leas el recuadro de pruebas'],
  ['Recorrido comercial', '17 (lógica y decisiones)', '26: pasos rápidos, uno por clic; 18: solo los mensajes técnicos'],
  ['Texto del mensaje de WhatsApp', '26', '18: «arma el mensaje con el modelo»'],
  ['Peso de la ficha (5,28 → 0,38 MB)', '29', '14 y 15: «se midió; lo muestro en el resultado»'],
  ['118 productos', '24', '29: «catálogo con filtros», sin la cifra'],
  ['Sitio original / web renovada / ampliaciones', '23', '6: alcance en cinco grupos'],
], [3000, 2700, 3938]));

c.push(H1('2. Si vas corto de tiempo'));
c.push(small('En este orden, sin perder coherencia (unos 2,5 minutos en total):', { after: 40 }));
[
  '**13 Matriz:** una frase: «Resume lo que acabo de contar por iteración; lo iterativo se ve en que requisitos y diseño se repiten».',
  '**18 Secuencia:** una frase: «Es el mismo «Cotizar», visto como mensajes entre componentes».',
  '**22 Despliegue:** solo «hoy en el entorno de prueba; en Transición pasa a producción».',
  '**28 Pruebas:** haz los clics 1–3 sin hablar y detente en el 4 (la captura) y en los dos planificados.',
  '**25 Antes y después 2:** solo la barra fija de «Cotizar» en el celular.',
].forEach((t) => c.push(new Paragraph({ numbering: { reference: 'numeros', level: 0 }, children: L.runs(t, { size: 18 }), spacing: { after: 30, line: 250 } })));
c.push(small('**No recortes nunca:** 4 (análisis), 5 (problema), 20 (modelo físico), 23 (qué entrego) y 29 (resultado). Son las preguntas que el profesor suele hacer.', { after: 80 }));

c.push(H1('3. Guion por diapositiva', true));
const BLOQ = { 1: '01 · Situación original', 7: '02 · Metodología RUP', 15: '03 · Modelado y diseño', 23: '04 · La solución', 29: '05 · Resultados y cierre' };
G.forEach((g) => {
  if (BLOQ[g[0]]) c.push(new Paragraph({ keepNext: true, spacing: { before: 120, after: 60 }, children: [new TextRun({ text: BLOQ[g[0]].toUpperCase(), bold: true, color: PUR, size: 18, characterSpacing: 40 })] }));
  c.push(...block(g));
});

const header = new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Guion de exposición V4 · Black Hawk × RUP', size: 16, color: L.MUTED })] })] });
const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: L.MUTED })] })] });
const doc = new Document({
  creator: 'Nils Alexander Tovar Pinzón', title: 'Guion de exposición V4 — Black Hawk × RUP',
  styles: { ...L.baseStyles, paragraphStyles: L.baseStyles.paragraphStyles.map((s) => (s.id === 'Heading1' ? { ...s, run: { ...s.run, size: 26 }, paragraph: { ...s.paragraph, spacing: { before: 200, after: 100 } } } : s)) },
  numbering: L.numbering,
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } }, headers: { default: header }, footers: { default: footer }, children: c }],
});
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync('../BLACK_HAWK_RUP_GUIA_EXPOSICION_V4.docx', buf); console.log('ok', G.length, 'diapositivas', Math.round(total / 60), 'min'); });
