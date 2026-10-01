// Genera BLACK_HAWK_RUP_GUIA_PREGUNTAS_TECNICAS_V3.docx: respuestas predefinidas a preguntas técnicas del profesor,
// aplicadas al caso Black Hawk (web renovada). Los datos salen de model.js y v3data.js; no se inventan especificaciones.
const fs = require('fs');
const V = require('./v3data');
const L = require('./docxlib');
const { d } = L;
const { Document, Packer, Paragraph, TextRun, AlignmentType, Header, Footer, PageNumber, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, HeadingLevel } = d;

const W = 9638;
const H1 = (t, br = false) => new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: br, keepNext: true, children: [new TextRun(t)], spacing: { before: 120, after: 100 } });
const H2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, children: [new TextRun(t)], spacing: { before: 140, after: 60 } });
const small = (t, o = {}) => new Paragraph({ children: L.runs(t, { size: 18 }), spacing: { after: o.after ?? 40, line: 252 }, keepNext: o.keepNext });
const blt = (items) => items.map((t) => new Paragraph({ numbering: { reference: 'vinetas', level: 0 }, children: L.runs(t, { size: 18 }), spacing: { after: 20, line: 250 } }));
const b = { style: BorderStyle.SINGLE, size: 4, color: 'E3E4E8' };
const nb = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };

function grid(head, rows, widths) {
  const cell = (t, i, h) => new TableCell({ width: { size: widths[i], type: WidthType.DXA }, shading: h ? { fill: '0B0B0D', type: ShadingType.CLEAR, color: 'auto' } : (i === 0 ? { fill: 'F3EEFC', type: ShadingType.CLEAR, color: 'auto' } : undefined), margins: { top: 30, bottom: 30, left: 90, right: 90 }, borders: { top: b, bottom: b, left: nb, right: nb },
    children: [new Paragraph({ children: h ? [new TextRun({ text: t, bold: true, color: 'FFFFFF', size: 17 })] : L.runs(t, { size: 17 }), spacing: { line: 240 } })] });
  return [new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: widths, rows: [
    new TableRow({ tableHeader: true, children: head.map((t, i) => cell(t, i, true)) }),
    ...rows.map((r) => new TableRow({ cantSplit: true, children: r.map((t, i) => cell(t, i, false)) })),
  ] }), new Paragraph({ spacing: { after: 80 }, children: [] })];
}

// Ficha de pregunta: respuesta corta (lo que se dice en voz alta), ampliación y advertencia
function ficha(n, q, corta, mas, cuidado) {
  const head = new TableRow({ cantSplit: true, children: [new TableCell({ columnSpan: 2, width: { size: W, type: WidthType.DXA }, shading: { fill: '0B0B0D', type: ShadingType.CLEAR, color: 'auto' }, margins: { top: 50, bottom: 50, left: 110, right: 110 }, borders: { top: nb, bottom: nb, left: nb, right: nb },
    children: [new Paragraph({ keepNext: true, children: [new TextRun({ text: `${n}  `, bold: true, color: 'A78BFA', size: 20 }), new TextRun({ text: q, bold: true, color: 'FFFFFF', size: 20 })] })] })] });
  const row = (k, content, fill) => new TableRow({ cantSplit: content.length < 6, children: [
    new TableCell({ width: { size: 1500, type: WidthType.DXA }, shading: { fill: fill || 'F3EEFC', type: ShadingType.CLEAR, color: 'auto' }, margins: { top: 30, bottom: 30, left: 110, right: 80 }, borders: { top: b, bottom: b, left: nb, right: nb }, children: [small(`**${k}**`)] }),
    new TableCell({ width: { size: W - 1500, type: WidthType.DXA }, margins: { top: 30, bottom: 30, left: 110, right: 110 }, borders: { top: b, bottom: b, left: nb, right: nb }, children: content }),
  ] });
  const rows = [head, row('Respuesta corta', [small(corta)])];
  if (mas && mas.length) rows.push(row('Si profundiza', blt(mas)));
  if (cuidado) rows.push(row('Cuidado', [small(cuidado)], 'FDF2E9'));
  return [new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [1500, W - 1500], rows }), new Paragraph({ spacing: { after: 90 }, children: [] })];
}

const c = [];
c.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: 'GUÍA DE PREGUNTAS TÉCNICAS · V3', bold: true, size: 32 })] }));
c.push(new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: 'Respuestas predefinidas aplicadas al caso Black Hawk: base de datos, UML, RUP y requisitos', size: 20, color: L.MUTED })] }));
c.push(small('**Cómo usar esta guía.** Cada pregunta tiene tres partes. **Respuesta corta:** lo que dices en voz alta, unos 20–30 segundos; empieza con la definición general y cierra con «en nuestro proyecto…». **Si profundiza:** lo que añades si el profesor insiste. **Cuidado:** lo que no debes afirmar porque no está hecho o no está verificado.', { after: 50 }));
c.push(small('**Regla de oro.** Separa siempre lo **desarrollado** (la web renovada, en entorno de prueba) de lo **propuesto** (registro de consultas, directorio, reportes, auditoría). Si no sabes algo, usa las frases de la sección 5; es mejor que inventar.', { after: 50 }));
c.push(small('Las capturas de las preguntas de hoy mostraban un caso distinto (tienda, turnos, caja, inventario). Estas respuestas están escritas para **tu** proyecto, no para ese.', { after: 120 }));

// ───────────────────────── 1
c.push(H1('1. Las tres preguntas del profesor'));

c.push(...ficha('1', '¿Cuál es el modelo de base de datos físico?',
  'El modelo físico es el esquema real de tablas en el motor de base de datos. La web renovada funciona sobre WordPress con WooCommerce, así que su base física es **MySQL/MariaDB con el esquema estándar de WordPress**: los productos están en `wp_posts` (tipo «product») y `wp_postmeta`; las categorías, en `wp_terms` y `wp_term_taxonomy` (taxonomía «product_cat»); las imágenes son adjuntos de `wp_posts`; y los usuarios, en `wp_users`. Para lo ya desarrollado no creamos tablas propias. Para las ampliaciones propuestas diseñamos tablas propias, como `wp_bh_consulta` y `wp_bh_auditoria`.'.replace(/`/g, ''),
  [
    '**Tres niveles de modelo.** Conceptual: diagrama de clases (V3-04, adaptado de D-07). Lógico: diccionario de datos de 15 tablas con tipos y restricciones, y el modelo entidad-relación D-21. Físico: el esquema de WordPress más las tablas «wp_bh_*» propuestas.',
    '**Correspondencia lógico → físico** (hoja «Mapeo WordPress» de los anexos):',
    ...V.M.MAPEO.map(([e, f, s]) => `${e} → ${f} (${{ BASE: 'plataforma base', PAR: 'parcial', PRO: 'propuesto' }[s]})`),
    'El comparador **no** usa la base de datos: guarda la selección en el navegador durante 24 horas.',
  ],
  'No digas «creamos una base de datos de 15 tablas»: ese diccionario es el modelo lógico del sistema propuesto y no está implementado. Tampoco afirmes dónde se guardan las especificaciones técnicas sin comprobarlo (el mapeo las marca como parcial). **Esta V3 no tiene diapositiva de base de datos:** ten abierto el D-21 (DIAGRAMAS_UML/png/D21_entidad_relacion.png) y el diccionario de los anexos como respaldo.'));

c.push(...ficha('2', '¿Qué es un diagrama de casos de uso en su trabajo?',
  'Es el diagrama que muestra **quién usa el sistema y qué puede hacer con él**, sin explicar cómo lo hace. En la web renovada los actores son el visitante, el cliente interesado (que hereda del visitante), el distribuidor, el gestor del catálogo y WhatsApp, que es un sistema externo. Los casos de uso son, por ejemplo, explorar el catálogo, buscar, filtrar, consultar la ficha, comparar hasta tres productos, cotizar por WhatsApp y consultar dónde comprar. Los que están en morado, como registrar el inicio de la consulta, son ampliaciones propuestas.',
  [
    '**Por qué importa en RUP:** el proceso está dirigido por casos de uso. «Cotizar por WhatsApp» guió el diseño de la ficha, del mensaje y de las verificaciones.',
    '**Relaciones:** «Cotizar por WhatsApp» incluiría («include») registrar la consulta, y «Filtrar productos» extiende («extend») a «Explorar catálogo».',
    'El diagrama muestra 13 de los 22 casos de uso del catálogo completo (hoja «Casos de uso» de los anexos).',
  ],
  'Un actor es un rol, no una persona: la misma persona puede ser visitante y luego cliente interesado. El diagrama no muestra el orden de los pasos; eso lo hacen los diagramas de actividades y de secuencia. No lo presentes como código: es una vista de requisitos.'));

c.push(...ficha('3', '¿Cuáles son los pilares de RUP en su trabajo?',
  'RUP se apoya en tres características: es **dirigido por casos de uso**, **centrado en la arquitectura** e **iterativo e incremental**. En el proyecto: los casos de uso, como «Cotizar por WhatsApp», guiaron el diseño y las pruebas; la arquitectura se decidió en Elaboración, antes de construir: rediseñar sobre WordPress y WooCommerce con un tema hijo; y el trabajo fue iterativo: primero la identidad y la home, luego el catálogo y la ficha, y después el recorrido de cotización.',
  [
    '**Si «pilares» son las dos dimensiones:** en el tiempo, cuatro fases (Inicio, Elaboración, Construcción, Transición) con sus hitos; en el contenido, las disciplinas (requisitos, análisis y diseño, implementación, pruebas…).',
    '**Si se refiere a las seis mejores prácticas de RUP:** desarrollar iterativamente, gestionar requisitos, usar arquitecturas basadas en componentes, modelar visualmente (UML), verificar la calidad continuamente y controlar los cambios.',
  ],
  'Pregunta qué lista usa el curso (tres características o seis prácticas) antes de responder, o da la primera y menciona la segunda. No presentes las seis prácticas como si fueran «las tres».'));

// ───────────────────────── 2
c.push(H1('2. Más preguntas técnicas probables', true));

c.push(H2('2.1 Base de datos'));
c.push(...ficha('4', '¿Qué diferencia hay entre el modelo conceptual, el lógico y el físico? ¿Cuál tienen?',
  'El **conceptual** muestra las entidades y sus relaciones sin detalles técnicos; el **lógico** agrega atributos, tipos y claves, sin depender de un motor; y el **físico** es la implementación real en un motor concreto. Tenemos los tres, con distinto grado de avance: el conceptual es el diagrama de clases; el lógico es el diccionario de datos con el modelo entidad-relación; y el físico es el esquema de WordPress sobre MySQL, más las tablas propias propuestas.',
  ['Ejemplo: «Producto pertenece a una o más categorías» (conceptual) → tabla asociativa producto_categoria con dos claves (lógico) → `wp_term_relationships` (físico).'.replace(/`/g, '')],
  'El modelo lógico describe el sistema propuesto completo, no solo lo desarrollado.'));

c.push(...ficha('5', '¿Qué motor de base de datos usan y por qué?',
  'MySQL o MariaDB, porque es el que usa WordPress. No lo elegimos: viene con la plataforma. La decisión de fondo fue **rediseñar sobre la plataforma existente** en lugar de reemplazarla, porque ya tenía el catálogo y el equipo sabe administrarla.',
  ['El sitio original también corre sobre WordPress y WooCommerce, así que el rediseño no migra datos a otro motor.'],
  'No hables de PostgreSQL, Oracle ni NoSQL: nada de eso se usó. Verifica la versión exacta del motor en el hosting antes de citarla; no está en la documentación del proyecto.'));

c.push(...ficha('6', '¿Cuáles son las entidades principales y cómo se relacionan?',
  'El centro es el **Producto**. Pertenece a una o más categorías (relación muchos a muchos) y se compone de especificaciones técnicas e imágenes (composición). La categoría puede tener una categoría padre. Las clases propuestas son el **Distribuidor** y el **Evento de consulta**, que se relaciona con un producto y, si corresponde, con un distribuidor.',
  [
    '**Multiplicidades:** «1..*» significa uno o más (cada producto tiene al menos una categoría); «0..*» significa cero o más; «0..1» significa opcional.',
    '**Composición (rombo negro):** si se elimina el producto BH-SW12XXG, sus especificaciones e imágenes desaparecen con él. La asociación simple no tiene esa dependencia.',
    'Diagrama: V3-04 (diapositiva 18).',
  ],
  'Distribuidor y Evento de consulta no existen todavía en la web renovada; el «Dónde comprar» actual deriva a WhatsApp.'));

c.push(...ficha('7', '¿Qué son la clave primaria y la clave foránea? Dame un ejemplo de su modelo.',
  'La **clave primaria** identifica de forma única cada fila de una tabla; la **clave foránea** apunta a la clave primaria de otra tabla y relaciona ambas. Ejemplo: `wp_posts.ID` es la clave primaria de cada producto, y la tabla `wp_term_relationships` une el producto con su categoría mediante dos columnas, el identificador del objeto y el de la categoría. En el modelo lógico, eso es la tabla asociativa producto_categoria.'.replace(/`/g, ''),
  ['Otro ejemplo del modelo lógico: en consulta_comercial, id_producto es clave foránea hacia producto (propuesto).'],
  'WordPress no declara restricciones FOREIGN KEY en sus tablas: la integridad la maneja la aplicación. Si te preguntan, dilo así; no afirmes que el motor la garantiza.'));

c.push(...ficha('8', '¿Está normalizado el modelo?',
  'El modelo lógico se diseñó separando entidades y usando tablas asociativas para las relaciones muchos a muchos, de modo que no se repitan datos: producto, categoría, producto_categoria y especificación_técnica son tablas distintas. El esquema físico de WordPress es otra cosa: guarda muchos datos como pares clave-valor en `wp_postmeta`, lo que da flexibilidad pero no es una normalización estricta.'.replace(/`/g, ''),
  ['Ejemplo de una dependencia que no se normalizó del todo: en distribuidor, la región depende de la ciudad.'],
  'No afirmes «está en tercera forma normal»: no se verificó formalmente, y el esquema físico claramente no lo cumple en postmeta.'));

c.push(...ficha('9', '¿Dónde se guardan las consultas de WhatsApp?',
  'Hoy **no se guardan**. «Cotizar» abre WhatsApp con un mensaje que incluye el modelo del producto, y la conversación ocurre fuera de la web. Lo que se propone es una tabla `wp_bh_consulta` que registre el **inicio** de la consulta: fecha y hora, producto, origen e intención.'.replace(/`/g, ''),
  ['Se propone como ampliación porque permitiría saber qué productos generan más consultas.', 'El mensaje no incluye la URL del producto: verificado en los enlaces de las fichas.'],
  'Un clic en «Cotizar» no es una venta ni una cotización aceptada. No hay CRM ni API de WhatsApp Business: es un enlace wa.me.'));

c.push(H2('2.2 UML'));
c.push(...ficha('10', '¿Qué diferencia hay entre «include» y «extend»?',
  '**Include** es una parte obligatoria: el caso base siempre ejecuta el incluido. **Extend** es un comportamiento opcional, que ocurre solo bajo cierta condición. En el proyecto: «Cotizar por WhatsApp» incluiría «Registrar consulta» (siempre que se cotiza, se registra; propuesto), y «Filtrar productos» extiende «Explorar catálogo» (se puede explorar sin filtrar).',
  ['Dirección de las flechas: en include, del caso base al incluido; en extend, de la extensión al caso base.'],
  'No los confundas con la herencia entre actores: el cliente interesado hereda del visitante (flecha con triángulo).'));

c.push(...ficha('11', '¿Qué diferencia hay entre el diagrama de actividades y el de secuencia?',
  'El de **actividades** muestra el flujo del trabajo, con decisiones y calles que indican quién hace cada paso. El de **secuencia** muestra el orden de los mensajes entre objetos o componentes a lo largo del tiempo. En el proyecto, el de actividades es el recorrido comercial (cliente, web renovada y área comercial), y el de secuencia es «Cotizar por WhatsApp»: la ficha pide el producto a WooCommerce, arma el mensaje con el modelo y abre WhatsApp.',
  ['Las decisiones del de actividades son rombos: si conoce el modelo, si quiere comparar, si tiene intención de compra.', 'El de secuencia se lee de arriba hacia abajo; flecha continua es una llamada y discontinua, una respuesta.'],
  'En ambos, lo que ocurre dentro de WhatsApp queda fuera del sistema. El recuadro morado del de secuencia es la ampliación.'));

c.push(...ficha('12', '¿Cómo es la arquitectura y por qué usaron un tema hijo?',
  'Es una arquitectura **en capas**: presentación (el tema hijo `rozer-child` con las plantillas, las páginas y el botón de WhatsApp), lógica (WooCommerce para productos y YITH Catalog Mode para ocultar precio y carrito) y datos (MySQL). WhatsApp es un sistema externo. Usamos un tema hijo porque así el rediseño vive aparte: **actualizar WooCommerce o el tema base no borra los cambios**.'.replace(/`/g, ''),
  ['El «módulo propio» del diagrama de componentes alojaría las ampliaciones; está en morado porque es propuesto.', 'El diagrama de despliegue (respaldo, diapositiva 28) muestra el navegador, el servidor web con WordPress y la base de datos; hoy en un entorno de prueba.'],
  'No la llames MVC ni microservicios. El rediseño no creó un panel de administración nuevo: usa el de WordPress y WooCommerce.'));

c.push(H2('2.3 RUP'));
c.push(...ficha('13', '¿Cuáles son las fases de RUP y cómo termina cada una?',
  'Cuatro. **Inicio** termina con el hito LCO, objetivos y alcance acordados. **Elaboración**, con LCA, la arquitectura validada. **Construcción**, con IOC, una versión operativa. **Transición**, con PR, la publicación del producto. En el proyecto, Inicio y Elaboración están realizadas, Construcción está en curso y Transición está planificada.',
  [
    'LCO es Lifecycle Objectives; LCA, Lifecycle Architecture; IOC, Initial Operational Capability; PR, Product Release.',
    '**Inicio:** análisis del sitio original, interesados, alcance. **Elaboración:** requisitos, UML, arquitectura, diseño de pantallas. **Construcción:** la web por incrementos. **Transición:** validar con Black Hawk, publicar, capacitar.',
  ],
  'No digas que la web está publicada: falta la Transición. Construcción sigue en curso porque las ampliaciones y las pruebas formales están planificadas.'));

c.push(...ficha('14', '¿Qué diferencia hay entre fase, iteración y disciplina?',
  'La **fase** es un periodo con un objetivo y un hito; la **iteración** es un ciclo corto dentro de una fase que produce un entregable; y la **disciplina** es un tipo de trabajo (requisitos, diseño, implementación, pruebas…) que ocurre en varias fases. Por eso RUP no es una cascada: en Elaboración ya se programó un prototipo, y en Construcción se ajustaron requisitos.',
  [
    'RUP tiene nueve disciplinas: seis de ingeniería (modelado del negocio, requisitos, análisis y diseño, implementación, pruebas, despliegue) y tres de apoyo (gestión de configuración y cambios, gestión del proyecto y entorno).',
    `Siete iteraciones: ${V.ITER.map((i) => `${i.id} (${i.e.toLowerCase()})`).join(', ')}. La matriz de la diapositiva 13 muestra el entregable de cada disciplina en cada iteración.`,
  ],
  'El orden y el contenido de las iteraciones es una reconstrucción a partir de la evidencia del rediseño. Si tu proceso real fue distinto, di el real.'));

c.push(...ficha('15', '¿Qué artefactos produjeron en cada fase?',
  V.FASES.map((f) => `**${f.n}:** ${f.art.join(', ').toLowerCase()}.`).join(' '),
  ['Los artefactos de modelado (casos de uso, actividades, secuencia, clases, componentes y despliegue) están en PlantUML, editable y reconstruible.'],
  'Los artefactos de Transición (acta de aceptación, manual del gestor, plan de despliegue) están planificados, no entregados.'));

c.push(H2('2.4 Requisitos, calidad y metodología'));
c.push(...ficha('16', '¿Qué es un requisito funcional y uno no funcional? ¿Cómo se validan?',
  'El **funcional** dice qué hace el sistema; el **no funcional**, con qué calidad. Funcional del proyecto: comparar hasta tres modelos (RF-007), cuyo criterio de aceptación es que el comparador rechace un cuarto producto. No funcional: páginas livianas (RNF-003); la ficha del BH-SW12XXG pasó de 5,28 MB a 0,38 MB transferidos en escritorio. Cada requisito se valida con su **criterio de aceptación**.',
  [
    'Otros no funcionales: adaptabilidad al celular (360–1440 px), usabilidad, idioma español y protección de datos en formularios.',
    'Los no funcionales se clasifican con ISO/IEC 25010 (eficiencia, usabilidad, compatibilidad…).',
    'Mediciones comparables (Lighthouse, 23-09-2026): peso y peticiones; los tiempos no, porque los servidores son distintos.',
  ],
  'No presentes la mejora de peso como aumento de ventas ni de tráfico: no hay datos de uso.'));

c.push(...ficha('17', '¿Cómo garantizan la trazabilidad y qué pruebas hicieron?',
  'La trazabilidad enlaza cada **necesidad** con sus requisitos, casos de uso, componentes y casos de prueba (hoja «Trazabilidad» de los anexos). Pruebas: hicimos **verificaciones funcionales documentadas con capturas** (búsqueda, límite de tres en el comparador, persistencia de la selección, menú y ficha en el celular). Los 32 casos de prueba formales están **diseñados, no ejecutados**.',
  ['Las pruebas unitarias y de aceptación formales están planificadas, no ejecutadas.'],
  'No digas «probamos todo» ni «pasó todas las pruebas». Un caso de prueba diseñado no es una prueba ejecutada.'));

c.push(...ficha('18', '¿Qué diferencia hay entre RUP, UML y Rational Rose? ¿Por qué RUP y no Scrum o cascada?',
  '**RUP** es la metodología, **UML** es el lenguaje de los diagramas y **Rational Rose** es una herramienta para dibujarlos. Elegimos RUP porque el curso exige análisis y diseño formales con UML, y RUP combina iteraciones con hitos y artefactos de modelado. No es cascada porque cada fase repite ciclos de análisis, diseño, desarrollo y prueba.',
  ['Scrum organiza el trabajo en sprints, pero no prescribe artefactos de modelado; la cascada no corrige a tiempo.', 'Los diagramas están hechos en PlantUML, con una guía para reconstruirlos en Rose.'],
  'No tenemos archivos .mdl de Rational Rose; no digas que los diagramas se hicieron en Rose.'));

// ───────────────────────── 3
c.push(H1('3. Cuadro de bolsillo', true));
c.push(...grid(['Tema', 'Lo que debes recordar'], [
  ['Pilares de RUP', 'Casos de uso · Arquitectura · Iterativo e incremental'],
  ['Fases e hitos', V.FASES.map((f) => `${f.n}: ${f.hito} (${f.estado.toLowerCase()})`).join(' · ')],
  ['Modelo de datos', 'Conceptual: V3-04 · Lógico: diccionario de 15 tablas y D-21 (propuesto) · Físico: WordPress sobre MySQL, más tablas «wp_bh_*» propuestas'],
  ['Tablas físicas clave', 'wp_posts (productos y adjuntos) · wp_postmeta · wp_terms y wp_term_taxonomy (categorías) · wp_term_relationships (producto-categoría) · wp_users'],
  ['Casos de uso', 'Actores: visitante, cliente interesado, distribuidor, gestor, WhatsApp (externo) · include: Cotizar → Registrar consulta (propuesto) · extend: Filtrar → Explorar'],
  ['Cifras', 'Sitio original: 110 productos, 11 categorías · Web renovada: 118 productos, 12 categorías · Comparador: 3 modelos, 24 h en el navegador · Ficha: 5,28 → 0,38 MB'],
  ['Desarrollado', 'Rediseño, catálogo con filtros, búsqueda, comparador, «Cotizar» por WhatsApp con el modelo, páginas Dónde comprar, Mayoristas y Soporte'],
  ['Propuesto', 'Registro del inicio de consulta, directorio estructurado de distribuidores, reportes, auditoría, seguimiento'],
  ['No existe', 'Carrito y pagos · CRM · API de WhatsApp Business · .mdl de Rose · pruebas formales ejecutadas · publicación en el dominio oficial'],
], [2300, 7338]));

// ───────────────────────── 4
c.push(H1('4. Cómo construir una respuesta'));
c.push(...blt([
  '**Definición en una frase.** «Un diagrama de casos de uso muestra quién usa el sistema y qué puede hacer.»',
  '**Ejemplo propio.** «En Black Hawk, el cliente interesado cotiza por WhatsApp desde la ficha.»',
  '**Límite.** «Eso ya funciona» o «eso es una propuesta».',
  'Si la pregunta tiene dos lecturas posibles (por ejemplo «pilares»), nómbralas y responde la que corresponde. No improvises cifras.',
]));

// ───────────────────────── 5
c.push(H1('5. Si no sabes la respuesta'));
c.push(...grid(['Situación', 'Frase'], [
  ['Piden un dato que no verificaste', '«Eso no lo verifiqué. Lo que sí tengo documentado es…» y citas el dato verificado.'],
  ['Piden algo que está en el anexo', '«Está en el anexo; en la presentación lo resumí en…».'],
  ['Preguntan por algo no implementado', '«Eso es una ampliación propuesta; hoy la web hace… y la ampliación agregaría…».'],
  ['Preguntan si se probó', '«Verificamos las funciones principales y las documentamos con capturas; las pruebas formales están planificadas».'],
  ['La pregunta es ambigua', '«¿Se refiere a… o a…?» y respondes la que corresponda.'],
], [3200, 6438]));

// ───────────────────────── 6
c.push(H1('6. Verifica antes de exponer'));
c.push(...blt([
  '**Base de datos real.** Abre phpMyAdmin o WP-CLI en el entorno de prueba y confirma el prefijo de las tablas («wp_» puede ser distinto), que existen `wp_posts`, `wp_postmeta` y `wp_term_relationships`, y cuántos productos hay (`SELECT COUNT(*) FROM wp_posts WHERE post_type = \'product\' AND post_status = \'publish\';` debería acercarse a 118). Averigua dónde están las especificaciones técnicas.'.replace(/`/g, ''),
  '**Respaldo visual del modelo de datos.** Abre D-21 y el diccionario en el celular o en una diapositiva de respaldo: la V3 no incluye ninguno.',
  '**Iteraciones.** Confirma que I1–T1 describen tu proceso real; si no, corrige `v3data.js` y regenera.'.replace(/`/g, ''),
  '**Pilares.** Revisa en el material del curso si piden tres características o seis mejores prácticas.',
  '**Diagrama de casos de uso.** Repásalo: muestra 13 de los 22 casos, con los propuestos en morado.',
]));

const header = new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Guía de preguntas técnicas V3 · Black Hawk × RUP', size: 16, color: L.MUTED })] })] });
const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: L.MUTED })] })] });
const doc = new Document({
  creator: 'Proyecto RUP Black Hawk', title: 'Guía de preguntas técnicas V3 — Black Hawk × RUP',
  styles: { ...L.baseStyles, paragraphStyles: L.baseStyles.paragraphStyles.map((s) => (s.id === 'Heading1' ? { ...s, run: { ...s.run, size: 26 }, paragraph: { ...s.paragraph, spacing: { before: 200, after: 100 } } } : s.id === 'Heading2' ? { ...s, run: { ...s.run, size: 21 } } : s)) },
  numbering: L.numbering,
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } }, headers: { default: header }, footers: { default: footer }, children: c }],
});
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync('../BLACK_HAWK_RUP_GUIA_PREGUNTAS_TECNICAS_V3.docx', buf); console.log('ok'); });
