// Genera BLACK_HAWK_RUP_MONOGRAFIA.docx a partir del modelo único.
const fs = require('fs');
const M = require('./model');
const SPECS = require('./specs');
const L = require('./docxlib');
const { d, P, H1, H2, H3, bullets, numbered, caption, note, table, image, pageBreak } = L;
const { Document, Packer, Paragraph, TextRun, AlignmentType, Header, Footer, PageNumber, TableOfContents, ImageRun } = d;

const DG = '../DIAGRAMAS_UML/png/';
const IMG = 'img/';
const E = M.ESTADOS;
const cuName = Object.fromEntries(M.CU.map((c) => [c.id, c.n]));
const fig = (file, title, src, maxW, maxH) => [caption('Figura', title), image(file, maxW, maxH), note(src)];
const tab = (title, head, rows, widths, src, opt) => [caption('Tabla', title), table(head, rows, widths, opt), note(src)];
const SRC_OWN = '_Nota._ Elaboración propia.';
const SRC_EV = '_Nota._ Elaboración propia a partir de la evidencia archivada del rediseño (23-09-2026) y del sitio oficial (consultado el 29-09-2026).';

const c = []; // contenido del cuerpo

// ───────────────────────── PRELIMINARES
const cover = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400, after: 80 }, children: [new TextRun({ text: '[INSTITUCIÓN EDUCATIVA]', bold: true, size: 30 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'Carrera profesional de [CARRERA PROFESIONAL]', size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 500 }, children: [new TextRun({ text: 'Curso: ' + M.SISTEMA.curso, size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new ImageRun({ type: 'png', data: fs.readFileSync('research/logo-b.png'), transformation: { width: 170, height: 91 }, altText: { title: 'Logotipo Black Hawk', description: 'Logotipo de Black Hawk tomado del sitio oficial', name: 'logo' } })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200, line: 360 }, children: [new TextRun({ text: M.SISTEMA.titulo.toUpperCase(), bold: true, size: 32 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 700 }, children: [new TextRun({ text: `Caso de estudio: ${M.SISTEMA.nombre} (${M.SISTEMA.sigla})`, italics: true, size: 24, color: L.PURPLE })] }),
  ...['Integrantes: [Apellidos y nombres del integrante 1]', '[Apellidos y nombres del integrante 2]', '[Apellidos y nombres del integrante 3]', '[Apellidos y nombres del integrante 4]', '[Apellidos y nombres del integrante 5]'].map((t) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: t, size: 22 })] })),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 40 }, children: [new TextRun({ text: 'Docente: [Nombre del docente]', size: 22 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600, after: 40 }, children: [new TextRun({ text: '[Ciudad], Perú', size: 22 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '2026', size: 22 })] }),
];

const prelim = [
  H1('Resumen', false),
  P(`El presente trabajo aplica la metodología Rational Unified Process (RUP) al análisis, diseño y propuesta de desarrollo del ${M.SISTEMA.nombre} (${M.SISTEMA.sigla}), un sistema de información web para Black Hawk Car Audio, marca peruana de audio automotriz que comercializa amplificadores, subwoofers, procesadores, componentes y cargadores. La plataforma existente se basa en WordPress, WooCommerce, un tema hijo y YITH Catalog Mode, y opera como catálogo: no vende en línea, sino que conecta al comprador con el equipo comercial y los distribuidores mediante WhatsApp.`),
  P('A partir de la evidencia archivada del sitio oficial y de su rediseño, el trabajo distingue lo que ya existe (catálogo con 12 categorías, búsqueda con sugerencias, comparador de hasta tres modelos y enlaces de WhatsApp con el modelo prellenado) de lo que se propone: especificaciones con estado de verificación, directorio de distribuidores, registro y seguimiento de consultas comerciales, reportes, roles y auditoría. El desarrollo recorre las cuatro fases de RUP (Inicio, Elaboración, Construcción y Transición) en siete iteraciones de 14 semanas, con sus hitos LCO, LCA, IOC y PR. Produce 27 requisitos funcionales, 13 no funcionales, 22 casos de uso, 22 diagramas UML preparados para Rational Rose, un modelo de datos de 15 tablas, 32 casos de prueba diseñados y una matriz de trazabilidad que conecta cada necesidad del negocio con sus requisitos, casos de uso, componentes y pruebas.'),
  P('Se concluye que RUP es adecuado para este caso porque el riesgo principal no está en programar el catálogo, sino en definir con precisión qué información se publica, cómo se deriva al comprador y cómo se mide esa derivación. Los resultados son de diseño: las pruebas se especificaron, pero no se ejecutaron sobre un sistema en producción.'),
  P('**Palabras clave:** RUP, UML, Rational Rose, sistema de información web, catálogo de productos, WooCommerce, trazabilidad de requisitos, Black Hawk.'),
  H1('Abstract', true),
  P(`This project applies the Rational Unified Process (RUP) to the analysis, design and development proposal of the ${M.SISTEMA.sigla}, a web information system for Black Hawk Car Audio, a Peruvian car-audio brand. The current platform is built on WordPress, WooCommerce, a child theme and YITH Catalog Mode; it works as a catalogue with no online checkout, connecting buyers with the sales team and distributors through WhatsApp.`),
  P('Based on archived evidence of the official site and its redesign, the work separates existing features (12-category catalogue, live search, a three-model comparator and WhatsApp links with the model pre-filled) from proposed ones: verification status for technical specifications, a distributor directory, logging and follow-up of sales enquiries, reports, roles and auditing. The four RUP phases are developed over seven iterations in 14 weeks, with the LCO, LCA, IOC and PR milestones, producing 27 functional and 13 non-functional requirements, 22 use cases, 22 UML diagrams prepared for Rational Rose, a 15-table data model, 32 designed test cases and a traceability matrix. The results are design results: tests were specified but not executed on a production system.'),
  P('**Keywords:** RUP, UML, Rational Rose, web information system, product catalogue, WooCommerce, requirements traceability, Black Hawk.'),
  H1('Índice', true),
  new TableOfContents('Índice', { hyperlink: true, headingStyleRange: '1-2' }),
  H1('Índice de figuras', true),
  new TableOfContents('Índice de figuras', { hyperlink: true, stylesWithLevels: [new d.StyleLevel('FigCaption', 1)] }),
  H1('Índice de tablas', true),
  new TableOfContents('Índice de tablas', { hyperlink: true, stylesWithLevels: [new d.StyleLevel('TabCaption', 1)] }),
];

// ───────────────────────── CAPÍTULO I
c.push(H1('Capítulo I. Generalidades'));
c.push(H2('1.1 Introducción'));
c.push(P('Un sistema de información no se justifica por la tecnología que usa, sino por el proceso de negocio que ordena. En Black Hawk Car Audio el proceso central no es la venta en línea: es conseguir que una persona encuentre el modelo correcto, entienda sus características y llegue a quien puede vendérselo. Ese recorrido, que hoy termina en una conversación de WhatsApp, es el objeto de este proyecto.'));
c.push(P(`El trabajo aplica RUP para convertir ese recorrido en un sistema especificado, modelado y planificado: el ${M.SISTEMA.nombre} (${M.SISTEMA.sigla}). No se describe RUP en abstracto; cada fase, disciplina y diagrama se construye con los actores, los productos y las restricciones reales de la marca, y cada afirmación se clasifica como conocida, identificada para el caso o propuesta.`));
c.push(H2('1.2 Descripción empresarial'));
c.push(P('Black Hawk es una marca de audio automotriz orientada al mercado peruano. Su sitio oficial se presenta con más de diez años de dedicación a la industria del car audio, y su rediseño declara «Marca líder en car audio en Perú»; esta última es una afirmación de marca que el proyecto no verifica. El catálogo incluye amplificadores, subwoofers, medios, tweeters, drivers, procesadores, ecualizadores, componentes y cargadores. La Tabla 1 lista los modelos que el equipo definió como referencia y la fuente que respalda cada uno. Las especificaciones técnicas (potencia RMS, impedancia, canales) no se transcriben: cuando un atributo no está documentado, el sistema lo trata como «Pendiente de verificación».'));
c.push(...tab('Modelos de referencia del caso de estudio y fuente que los respalda', ['Modelo', 'Tipo', 'Fuente / estado de verificación'], M.PRODUCTOS.map((p) => [p.modelo, p.tipo, p.fuente]), [18, 24, 58], SRC_EV));
c.push(P('La Tabla 2 muestra la cantidad de productos por categoría en ambas versiones del sitio, según la evidencia del 23-09-2026.'));
c.push(...tab('Productos por categoría: sitio oficial frente al rediseño', ['Categoría', 'Sitio oficial', 'Rediseño'], M.CATEGORIAS.map(([n, a, b]) => [n, a ?? 'No existe (HTTP 404)', b]), [40, 30, 30], SRC_EV));
c.push(H2('1.3 Antecedentes del caso'));
c.push(P('El sitio oficial (blackhawkcaraudio.com) y su rediseño comparten la misma base tecnológica. El rediseño se publicó temporalmente en un túnel de Cloudflare para su revisión y se documentó con capturas, extracción de enlaces y mediciones en un informe técnico previo del equipo. Ese material es la evidencia de este proyecto. El 29-09-2026 la URL temporal ya no servía el sitio, así que no se hicieron nuevas observaciones sobre el rediseño. La Tabla 3 resume las características conocidas (distinción A del enunciado).'));
c.push(...tab('A. Características conocidas de la plataforma', ['Aspecto', 'Característica conocida', 'Fuente'], M.CONOCIDO, [16, 60, 24], SRC_EV));
c.push(H2('1.4 Formulación del problema'));
c.push(P('La Tabla 4 separa los problemas observados de los que se infieren como supuesto académico (distinción B). Ninguno se presenta como falla comprobada de la gestión de la empresa: son limitaciones de la plataforma frente al proceso comercial descrito.'));
c.push(...tab('B. Problemas identificados para el caso de estudio', ['Código', 'Problema', 'Descripción', 'Base'], M.PROBLEMAS.map((p) => [p.id, p.t, p.d, p.ev]), [9, 20, 53, 18], SRC_EV));
c.push(P('**Problema general.** ¿Cómo estructurar la información de productos y la derivación de compradores hacia los distribuidores de Black Hawk, de modo que sea consultable, comparable, administrable y trazable, sin convertir el catálogo en una tienda en línea?'));
c.push(...fig(DG + 'G05_arbol_problemas.png', 'Árbol de problemas del caso Black Hawk', SRC_OWN, 16, 8));
c.push(H2('1.5 Justificación'));
c.push(P('**Técnica.** La plataforma existente ya resuelve la publicación del catálogo. El valor está en ordenar los datos (especificaciones con fuente y estado), completar el paso de la consulta (URL y registro) y agregar la gestión de distribuidores sobre la misma base, sin reemplazarla.'));
c.push(P('**Económica.** Se reutilizan WordPress, WooCommerce y los 118 productos cargados. Las ampliaciones se implementan en un plugin propio y no requieren licencias de pago nuevas, salvo decisiones de hosting que la empresa ya asume.'));
c.push(P('**Operativa.** El área comercial ya atiende por WhatsApp; el sistema no le cambia el canal, le entrega la consulta con el modelo identificado y un registro para medir el interés por producto.'));
c.push(P('**Académica.** El caso permite aplicar RUP completo con un alcance acotado y verificable: actores reales, un sistema externo (WhatsApp), reglas de negocio claras y una arquitectura con decisiones que se pueden justificar.'));
c.push(H2('1.6 Objetivos'));
c.push(H3('Objetivo general'));
c.push(P(`Aplicar la metodología RUP para analizar, diseñar y planificar el desarrollo del ${M.SISTEMA.sigla}, un sistema de información web que centralice el catálogo de Black Hawk, facilite la consulta y la comparación de productos, conecte a los compradores con los distribuidores y permita dar seguimiento a las consultas comerciales.`));
c.push(H3('Objetivos específicos'));
c.push(...numbered([
  'Modelar el negocio de Black Hawk e identificar sus actores, procesos y necesidades de información.',
  'Especificar los requisitos funcionales y no funcionales, con criterios de aceptación y prioridad.',
  'Elaborar el modelo de casos de uso y las especificaciones de los casos arquitectónicamente significativos.',
  'Diseñar la arquitectura lógica, física y de datos sobre la plataforma WordPress + WooCommerce.',
  'Producir los diagramas UML del sistema, preparados para su reconstrucción en Rational Rose.',
  'Planificar las iteraciones, los riesgos, las pruebas y el despliegue según las fases de RUP.',
  'Asegurar la trazabilidad entre necesidades, requisitos, casos de uso, componentes y pruebas.',
]));
c.push(H2('1.7 Alcance'));
c.push(P('La Tabla 5 delimita el alcance del sistema. La regla es simple: se incluye lo que sirve al recorrido descubrir → evaluar → consultar y a su administración; se excluye lo que supone un proceso de venta en línea que la empresa no tiene.'));
c.push(...tab('Alcance y exclusiones del SGCD-BH', ['Incluido en el alcance', 'Excluido del alcance'], M.ALCANCE_IN.map((x, i) => [x, M.ALCANCE_OUT[i] || '']), [55, 45], SRC_OWN));
c.push(H2('1.8 Limitaciones'));
c.push(...bullets([
  'No se dispone de Google Analytics, Search Console ni datos de ventas: no se afirman mejoras de tráfico, posicionamiento ni conversión.',
  'Las especificaciones técnicas de los productos no se verificaron con documentación del fabricante.',
  'El formulario mayorista del rediseño no se envió, para no generar solicitudes reales.',
  'La URL temporal del rediseño dejó de estar disponible; se trabajó con la evidencia archivada.',
  'Las pruebas se diseñaron, pero no se ejecutaron sobre un sistema en producción. Las funcionalidades propuestas requieren la validación de Black Hawk.',
]));

// ───────────────────────── CAPÍTULO II
c.push(H1('Capítulo II. Marco teórico'));
c.push(H2('2.1 Sistemas de información'));
c.push(P('Un sistema de información es un conjunto de componentes interrelacionados que recolectan, procesan, almacenan y distribuyen información para apoyar la toma de decisiones y el control de una organización (Laudon & Laudon, 2020). Su valor no reside en el software, sino en el proceso que soporta: en este caso, la difusión del catálogo y la derivación comercial.'));
c.push(H2('2.2 Ingeniería de software'));
c.push(P('La ingeniería de software aplica un enfoque sistemático, disciplinado y cuantificable al desarrollo, operación y mantenimiento del software (Pressman & Maxim, 2015). Sommerville (2016) agrupa sus actividades fundamentales en especificación, diseño e implementación, validación y evolución, y cualquier proceso, incluido RUP, las organiza de alguna forma.'));
c.push(H2('2.3 Metodologías de desarrollo'));
c.push(P('La Tabla 6 compara tres enfoques frente a las condiciones del proyecto. Se eligió RUP porque el curso exige artefactos formales de análisis y diseño, y porque el riesgo principal del caso (qué dato se publica y cómo se mide la consulta) se reduce mejor con una fase de elaboración explícita, centrada en la arquitectura, antes de construir.'));
c.push(...tab('Comparación de metodologías frente al caso Black Hawk', ['Criterio', 'Cascada', 'RUP', 'Scrum'], [
  ['Ciclo de vida', 'Secuencial', 'Iterativo e incremental por fases', 'Iterativo en sprints'],
  ['Guía del proceso', 'Documento de requisitos', 'Casos de uso y arquitectura', 'Backlog de producto'],
  ['Tratamiento del riesgo', 'Tardío (se ve al integrar)', 'Temprano (fase de Elaboración)', 'Continuo, sin fase dedicada'],
  ['Artefactos de modelado', 'Extensos', 'Definidos y ajustables (UML)', 'Mínimos'],
  ['Adecuación al curso', 'Baja: no es iterativa', 'Alta: fases, disciplinas y UML', 'Media: poco modelado formal'],
], [22, 24, 30, 24], SRC_OWN));
c.push(H2('2.4 Metodología RUP: características y principios'));
c.push(P('RUP es un proceso de ingeniería de software derivado del Proceso Unificado (Jacobson et al., 1999) y comercializado por Rational Software. Kruchten (2004) lo resume en tres características:'));
c.push(...bullets([
  '**Dirigido por casos de uso:** los casos de uso guían el análisis, el diseño, las pruebas y la planificación de las iteraciones.',
  '**Centrado en la arquitectura:** la arquitectura se valida temprano con un prototipo ejecutable y es la base de la construcción.',
  '**Iterativo e incremental:** cada iteración recorre varias disciplinas y entrega un incremento; las fases no son etapas de cascada.',
]));
c.push(P('Estas características se apoyan en seis buenas prácticas: desarrollar de forma iterativa, gestionar los requisitos, usar arquitecturas basadas en componentes, modelar visualmente con UML, verificar continuamente la calidad y controlar los cambios (Kroll & Kruchten, 2003).'));
c.push(H2('2.5 Fases de RUP'));
c.push(P('El ciclo de vida se divide en cuatro fases, cada una cerrada por un hito de decisión (Kruchten, 2004): **Inicio** (Lifecycle Objectives, LCO), **Elaboración** (Lifecycle Architecture, LCA), **Construcción** (Initial Operational Capability, IOC) y **Transición** (Product Release, PR). Cada fase contiene una o más iteraciones, y en todas ellas se trabajan varias disciplinas con distinta intensidad.'));
c.push(H2('2.6 Disciplinas de RUP'));
c.push(P('Las disciplinas agrupan actividades relacionadas. Seis son de ingeniería (modelado del negocio, requisitos, análisis y diseño, implementación, pruebas y despliegue) y tres de soporte (gestión de configuración y cambios, gestión del proyecto y entorno). La relación entre disciplinas y fases se representa con el gráfico de «jorobas»: el esfuerzo de cada disciplina crece y decrece a lo largo del tiempo (Kruchten, 2004). En la sección 4.5 se aplica al proyecto.'));
c.push(H2('2.7 Artefactos'));
c.push(P('Un artefacto es un producto de trabajo del proceso: un documento (visión, especificación de requisitos), un modelo (casos de uso, diseño, datos), código o un ejecutable. RUP define roles responsables de cada artefacto y los hitos evalúan su estado. Los artefactos de este proyecto se detallan por fase en el Capítulo IV.'));
c.push(H2('2.8 UML'));
c.push(P('El Lenguaje Unificado de Modelado (UML) es un lenguaje gráfico estándar del Object Management Group para especificar, visualizar, construir y documentar sistemas (Object Management Group, 2017; Booch et al., 2005). Es un lenguaje, no un método: RUP indica qué modelar y cuándo, y UML aporta la notación. Sus diagramas se agrupan en estructurales (clases, objetos, componentes, despliegue, paquetes) y de comportamiento (casos de uso, actividades, estados, secuencia).'));
c.push(H2('2.9 Rational Rose'));
c.push(P('Rational Rose es una herramienta CASE de modelado visual con UML, desarrollada por Rational Software y luego distribuida por IBM. Organiza el modelo en cuatro vistas: vista de casos de uso, vista lógica, vista de componentes y vista de despliegue, y permite documentar cada elemento y generar código esqueleto (Quatrani, 2002). Conviene distinguirlos: **UML es el lenguaje y Rational Rose es una herramienta** que lo implementa. Los mismos modelos pueden construirse en otras herramientas; en este proyecto se entregan en PlantUML editable, con una guía para reconstruirlos en Rose (Anexo F).'));
c.push(H2('2.10 Arquitectura de software'));
c.push(P('La arquitectura de software es el conjunto de estructuras necesarias para razonar sobre un sistema: sus elementos, sus relaciones y sus propiedades (Bass et al., 2012). RUP describe la arquitectura con el modelo de vistas «4+1» de Kruchten (1995): vista lógica, de procesos, de desarrollo (implementación) y física (despliegue), integradas por los escenarios o casos de uso. El Capítulo VI aplica este enfoque.'));

// ───────────────────────── CAPÍTULO III
c.push(H1('Capítulo III. Análisis del negocio'));
c.push(H2('3.1 La empresa y su modelo comercial'));
c.push(P('Black Hawk comercializa productos de audio automotriz a través de una red de distribuidores y tiendas, y usa su sitio web como catálogo de marca. El sitio no muestra precios ni permite comprar: la compra se concreta tras una consulta, fuera de la web. Esta decisión de negocio es la restricción de diseño más importante del proyecto (RN-01).'));
c.push(H2('3.2 Procesos de negocio'));
c.push(...bullets([
  '**Difundir el catálogo:** publicar y mantener la información de los productos y las novedades de la marca.',
  '**Atender la consulta comercial:** responder por WhatsApp con precio, disponibilidad y recomendación.',
  '**Derivar al punto de venta:** orientar al comprador hacia el distribuidor de su ciudad.',
  '**Incorporar distribuidores:** recibir y evaluar solicitudes de tiendas y negocios (formulario mayorista).',
  '**Brindar soporte posventa:** orientar sobre garantía y manuales (página de soporte del rediseño).',
]));
c.push(H2('3.3 Stakeholders'));
c.push(...tab('Identificación de stakeholders', ['Stakeholder', 'Rol', 'Interés principal', 'Influencia', 'Interés'], M.STAKEHOLDERS.map((s) => [s.n, s.r, s.i, s.inf, s.int]), [22, 15, 37, 13, 13], '_Nota._ Elaboración propia. Stakeholders identificados para el caso de estudio; no se realizaron entrevistas formales.'));
c.push(H2('3.4 Situación actual'));
c.push(P('La evidencia muestra dos momentos. En el sitio oficial, la ficha de producto termina sin un paso de consulta: no tiene enlaces a WhatsApp, teléfono ni correo, y WhatsApp aparece solo en /ventas-al-mayor/, sin enlace desde el menú. En el rediseño, la ficha incorpora el botón «Cotizar», que abre WhatsApp con el modelo escrito, y se agregan el comparador, «Dónde comprar», «Soporte» y «Mayoristas». Aun así, persisten tres vacíos: no hay directorio de distribuidores, no queda registro de las consultas y la calidad de las especificaciones depende de la carga manual.'));
c.push(...fig(IMG + 'cotizar.png', 'Ficha del rediseño: botón «Cotizar» que abre WhatsApp con el modelo', '_Nota._ Captura archivada del rediseño, ficha BH-SW12XXG, 1440 × 900 px (23-09-2026). Sin retoques.', 15, 7));
c.push(H2('3.5 Necesidades'));
c.push(...tab('Necesidades del negocio', ['Código', 'Necesidad'], M.NECESIDADES.map((n) => [n.id, n.t]), [14, 86], SRC_OWN));
c.push(H2('3.6 Proceso actual frente al proceso propuesto'));
c.push(...tab('Proceso comercial: situación actual frente a la propuesta', ['Paso', 'Sitio oficial', 'Rediseño (existente)', 'SGCD-BH (propuesto)'], [
  ['Encontrar', 'Menú y buscador con sugerencias', 'Catálogo con filtros y contadores', 'Igual, más búsqueda por atributos verificados'],
  ['Evaluar', 'Ficha; algunas sin especificaciones', 'Ficha y comparador (máx. 3)', 'Especificaciones con estado de verificación'],
  ['Consultar', 'Sin paso de consulta en la ficha', 'WhatsApp con el modelo escrito', 'WhatsApp con modelo, intención y URL + registro'],
  ['Derivar', 'Manual, sin directorio', '«Dónde comprar» deriva a WhatsApp', 'Directorio de distribuidores ACTIVOS'],
  ['Medir', 'No existe', 'No existe', 'Estados de la consulta y reportes'],
], [12, 26, 28, 34], SRC_EV));
c.push(H2('3.7 Modelo de casos de uso del negocio'));
c.push(P('La Figura 3 representa el negocio (no el software): los actores del negocio son el cliente final y el distribuidor, y los casos de uso del negocio son los procesos que les entregan valor. Los trabajadores del negocio (área comercial, gestor de contenidos, administración) pertenecen al modelo de objetos del negocio, por eso aparecen en una nota y no como actores.'));
c.push(...fig(DG + 'D01_cu_negocio.png', 'Modelo de casos de uso del negocio (D-01)', SRC_OWN, 13, 11));

// ───────────────────────── CAPÍTULO IV
c.push(H1('Capítulo IV. Aplicación de RUP'));
c.push(P('La Tabla 10 resume cómo se organizó el ciclo de vida. Las fases no son etapas de cascada: en la iteración E2 ya se implementa un prototipo del flujo de consulta y en la Construcción se siguen refinando los requisitos. Lo que cambia entre fases es el énfasis y el hito que las cierra.'));
c.push(...tab('Fases, iteraciones e hitos del proyecto', ['Fase', 'Semanas', 'Iteraciones', 'Objetivo', 'Hito'], M.FASES.map((f) => [`${f.n} (${f.en})`, `S${f.sem[0]}–S${f.sem[1]}`, f.it.join(', '), f.obj, f.hito]), [16, 10, 11, 43, 20], SRC_OWN));
const faseDetalle = (f, extra) => {
  c.push(H3('Objetivo, responsables e iteraciones'));
  c.push(P(`**Objetivo:** ${f.obj} **Responsables:** ${f.resp}. **Iteraciones:** ${f.it.join(', ')} (semanas ${f.sem[0]} a ${f.sem[1]}).`));
  c.push(H3('Actividades y artefactos'));
  c.push(table(['Actividades', 'Artefactos / entregables'], Array.from({ length: Math.max(f.act.length, f.art.length) }, (_, i) => [f.act[i] || '', f.art[i] || '']), [50, 50]));
  c.push(H3('Riesgos atendidos y criterios de evaluación'));
  c.push(P(`**Riesgos atendidos en la fase:** ${f.riesgos.map((r) => `${r} (${M.RIESGOS.find((x) => x.id === r).n.toLowerCase()})`).join('; ')}.`));
  c.push(P(`**Hito ${f.hito}.** La fase termina cuando se cumplen estos criterios:`));
  c.push(...bullets(f.crit));
  if (extra) extra();
};

// Fase I
c.push(H2('4.1 Fase I: Inicio'));
faseDetalle(M.FASES[0]);
c.push(H3('Visión del producto'));
c.push(P(`_Para_ los clientes y distribuidores de Black Hawk, _que_ necesitan encontrar, comparar y consultar productos de audio automotriz con información fiable, el **${M.SISTEMA.sigla}** es un sistema de información web _que_ centraliza el catálogo, conecta al comprador con el punto de venta por WhatsApp y registra cada consulta para su seguimiento. _A diferencia de_ una tienda en línea, no vende ni cobra: ordena la información y la derivación comercial sobre la plataforma que la marca ya tiene.`));
c.push(H3('Actores identificados'));
c.push(...tab('Actores del sistema', ['Código', 'Actor', 'Tipo', 'Descripción'], M.ACTORES.map((a) => [a.id, a.n, a.tipo, a.d]), [10, 20, 24, 46], SRC_OWN));
c.push(P('Un actor es un rol, no una persona: la misma persona del área comercial puede actuar como Gestor del catálogo y como Administrador. La base de datos no es actor, porque forma parte del sistema.'));
c.push(H3('Requisitos preliminares y reglas de negocio'));
c.push(P('En el Inicio se identificaron los requisitos de mayor riesgo y valor: la ficha con especificaciones confiables, el comparador, la consulta por WhatsApp con registro y el directorio de distribuidores. Se detallan en la Elaboración. Las reglas de negocio de la Tabla 12 condicionan todo el diseño.'));
c.push(...tab('Reglas de negocio', ['Código', 'Regla'], M.REGLAS, [12, 88], SRC_OWN));
c.push(H3('Restricciones'));
c.push(...bullets(M.RESTRICCIONES));
c.push(H3('Análisis preliminar de riesgos y estimación de recursos'));
c.push(P(`Se identificaron 12 riesgos (Tabla 26, Capítulo VII). Los de mayor exposición al inicio son R-01 (especificaciones no verificadas) y R-11 (crecimiento del alcance hacia el comercio electrónico). Recursos: equipo de 5 integrantes con los roles de la Tabla 13, entorno de staging, repositorio Git, PlantUML/Rational Rose y hojas de cálculo. Esfuerzo total estimado: ${M.ESFUERZO.reduce((a, b) => a + b.h, 0)} horas-persona (supuesto académico).`));
c.push(...tab('Roles del equipo del proyecto', ['Rol', 'Responsabilidad principal'], M.EQUIPO.map((e) => [e.rol, e.resp]), [34, 66], SRC_OWN));
c.push(H3('Viabilidad y caso de negocio'));
c.push(...tab('Análisis de viabilidad', ['Dimensión', 'Evaluación', 'Conclusión'], [
  ['Técnica', 'WordPress y WooCommerce ofrecen roles, REST API, tipos de contenido y tablas propias. Las ampliaciones son un plugin y plantillas del tema hijo.', 'Viable'],
  ['Económica', 'Reutiliza la plataforma y el contenido. El costo es el esfuerzo de desarrollo (estimación referencial en la sección 7.6); sin licencias nuevas obligatorias.', 'Viable, sujeta a la aprobación del presupuesto'],
  ['Operativa', 'El área comercial mantiene WhatsApp como canal; se agrega un panel de seguimiento. Requiere capacitación breve.', 'Viable con capacitación'],
], [14, 66, 20], SRC_OWN));
c.push(P('**Caso de negocio.** El proyecto se justifica si, con un costo acotado, permite (1) que ninguna ficha publique datos no verificados como si lo fueran, (2) que toda consulta llegue con el modelo y la URL, y (3) que la empresa conozca por primera vez qué productos y qué páginas generan consultas. Son indicadores medibles tras el despliegue (sección 8.3); no se proyectan ventas.'));

// Fase II
c.push(H2('4.2 Fase II: Elaboración'));
faseDetalle(M.FASES[1]);
c.push(H3('Análisis y priorización de requisitos'));
c.push(P(`Se especificaron ${M.RF.length} requisitos funcionales y ${M.RNF.length} no funcionales (Anexos A y B). La prioridad sigue MoSCoW: Alta = imprescindible (_Must_), Media = importante (_Should_), Baja = deseable (_Could_). Cada requisito tiene un criterio de aceptación verificable y un estado de implementación (distinción D del enunciado). La Tabla 15 resume la distribución.`));
const cnt = (arr, k, v) => arr.filter((x) => x[k] === v).length;
c.push(...tab('Distribución de requisitos funcionales por prioridad y estado', ['Estado', 'Alta', 'Media', 'Baja', 'Total'], Object.keys(E).map((k) => { const a = M.RF.filter((r) => r.e === k); return [E[k], cnt(a, 'p', 'Alta'), cnt(a, 'p', 'Media'), cnt(a, 'p', 'Baja'), a.length]; }).concat([['Total', cnt(M.RF, 'p', 'Alta'), cnt(M.RF, 'p', 'Media'), cnt(M.RF, 'p', 'Baja'), M.RF.length]]), [40, 15, 15, 15, 15], SRC_OWN));
c.push(H3('Especificación de casos de uso'));
c.push(P('Se especificaron en detalle los seis casos de uso arquitectónicamente significativos, es decir, los que ejercitan todas las capas y los riesgos principales: CU-04, CU-05, CU-08 (con CU-09), CU-12, CU-16 y CU-18 (Anexo C). El resto se describe en el inventario de casos de uso.'));
c.push(H3('Modelos de dominio y de análisis'));
c.push(P('El modelo de dominio (Figura 10) fija el vocabulario: doce conceptos y sus asociaciones. El modelo de análisis (Figura 11) distribuye las responsabilidades de los casos de uso críticos en clases de interfaz, de control y de entidad, antes de decidir la tecnología.'));
c.push(H3('Arquitectura y decisiones'));
c.push(P('La arquitectura se documenta en el Capítulo VI. Las decisiones de la Tabla 16 se tomaron en esta fase y se validaron con el prototipo arquitectónico de la iteración E2: un endpoint REST que registra la consulta y un botón que abre WhatsApp sin esperar la respuesta.'));
c.push(...tab('Decisiones de arquitectura', ['Código', 'Decisión', 'Justificación'], M.DECISIONES, [10, 30, 60], SRC_OWN));
c.push(H3('Diseño preliminar de la interfaz y prototipos'));
c.push(P('Para las pantallas existentes, el prototipo es el propio rediseño (Figuras 2 y 23). Para las pantallas nuevas se elaboraron prototipos de baja fidelidad: el directorio de distribuidores (Figura 24) y el panel de seguimiento de consultas (Figura 25).'));
c.push(H3('Riesgos arquitectónicos'));
c.push(...bullets([
  '**Registro de la consulta frente a la apertura de WhatsApp (R-05):** si el registro bloquea la redirección, el usuario percibe lentitud. Mitigación: navigator.sendBeacon (asíncrono) y tolerancia a fallos (CU-08, flujo 4a).',
  '**Dependencia de plugins (R-02):** las personalizaciones residen en bh-core y en el tema hijo; nunca se editan WooCommerce ni YITH.',
  '**Volumen de registros:** consultas y auditoría en tablas propias con índices por fecha y estado, no en wp_postmeta (AD-06).',
]));
c.push(H3('Validación de requisitos y plan de pruebas'));
c.push(P('Los requisitos se validan con tres técnicas: revisión con el área comercial al cierre de E1, recorrido de prototipos por caso de uso en E2 y verificación de trazabilidad (cada RF tiene un CU y al menos un caso de prueba). El plan de pruebas define niveles, responsables y criterios (sección 7.4).'));

// Fase III
c.push(H2('4.3 Fase III: Construcción'));
faseDetalle(M.FASES[2]);
c.push(H3('Organización de las iteraciones'));
c.push(...tab('Iteraciones de construcción', ['Iteración', 'Semanas', 'Objetivo', 'Casos de uso'], M.ITERACIONES.filter((i) => i.f === 'Construcción').map((i) => [i.id, `S${i.s[0]}–S${i.s[1]}`, i.obj, i.cu]), [12, 12, 46, 30], SRC_OWN));
c.push(H3('Desarrollo real frente a implementación propuesta'));
c.push(P('Esta distinción es central para interpretar el capítulo (distinción D). **Ya desarrollado en el rediseño:** tema hijo, catálogo con filtros, búsqueda con sugerencias, comparador de hasta 3 modelos, botón «Cotizar» con WhatsApp y páginas de dónde comprar, soporte, mayoristas y privacidad. **Propuesto en este proyecto:** plugin bh-core con registro y seguimiento de consultas, directorio de distribuidores, estado de verificación de especificaciones, reportes, auditoría y endurecimiento de la seguridad. Todo lo propuesto se especifica y se diseña; no se afirma que esté implementado ni probado.'));
c.push(H3('Diseño detallado e implementación de los módulos'));
c.push(...tab('Módulos del sistema e implementación prevista', ['Módulo', 'Implementación prevista', 'Estado'], [
  ['Gestión de usuarios y roles', 'Roles de WordPress: Administrador y rol «Gestor del catálogo» basado en shop_manager, con capacidades propias (manage_distribuidores, manage_consultas).', E.BASE],
  ['Administración del catálogo y categorías', 'Producto y product_cat de WooCommerce; validación de publicación (RN-02) con el hook de transición de estado.', E.BASE],
  ['Gestión de fichas técnicas', 'Atributos de producto + metadato de verificación y fuente por atributo; presentador que imprime «Pendiente de verificación».', E.PAR],
  ['Búsqueda y filtrado', 'Buscador con sugerencias y filtros con URL compartible (existente).', E.EXI],
  ['Comparación de productos', 'JS del cliente con localStorage, límite de 3; tabla desde REST (existente). Analítica anónima (propuesta).', E.EXI],
  ['Gestión de distribuidores', 'Tipo de contenido bh_distribuidor, taxonomía región/ciudad, estados y directorio público.', E.PRO],
  ['Consultas por WhatsApp', 'ServicioConsulta: mensaje, enlace wa.me y POST /bh/v1/consultas con sendBeacon.', E.PAR],
  ['Contenido y novedades', 'Entradas y páginas de WordPress; programación de publicación.', E.BASE],
  ['Registro y seguimiento de consultas', 'Tabla wp_bh_consulta y pantalla de administración con estados (D-18).', E.PRO],
  ['Reportes administrativos', 'Consultas por producto, origen y periodo; exportación CSV.', E.PRO],
  ['Seguridad, mantenimiento y auditoría', 'Tabla wp_bh_auditoria, segundo factor, bloqueo por intentos, respaldos.', E.PRO],
], [24, 56, 20], SRC_OWN));
c.push(H3('Integración con WhatsApp'));
c.push(P('La integración usa enlaces de clic para chatear: https://wa.me/<número>?text=<mensaje>, donde el número va en formato internacional sin signos y el mensaje se codifica con encodeURIComponent. El mensaje propuesto sigue la plantilla «Hola Black Hawk, vengo de la web y quiero cotizar el modelo {modelo}. {url}». El rediseño ya incluye el modelo; la URL y el registro previo son la ampliación (RF-013, RF-014). No se usa la API de WhatsApp Business, así que el sistema no lee las conversaciones: por diseño, el seguimiento posterior es manual (CU-18).'));
c.push(H3('Roles, permisos y validación de formularios'));
c.push(...tab('Matriz de roles y permisos', ['Capacidad', 'Visitante', 'Gestor del catálogo', 'Administrador'], [
  ['Ver catálogo, fichas, comparador', 'Sí', 'Sí', 'Sí'],
  ['Crear y editar productos, categorías, especificaciones e imágenes', '—', 'Sí', 'Sí'],
  ['Gestionar distribuidores y novedades', '—', 'Sí', 'Sí'],
  ['Dar seguimiento a consultas', '—', 'Sí', 'Sí'],
  ['Gestionar usuarios y roles', '—', '—', 'Sí'],
  ['Ver reportes y auditoría; respaldos', '—', '—', 'Sí'],
], [46, 16, 20, 18], SRC_OWN));
c.push(P('Validación de formularios: en el cliente (HTML5 y JS) para dar respuesta inmediata, y siempre en el servidor, que es la validación que cuenta. RUC de 11 dígitos, WhatsApp con formato internacional, consentimiento obligatorio, saneamiento de entradas (sanitize_text_field) y escape de salidas (esc_html), con nonces contra CSRF en las acciones administrativas.'));
c.push(H3('Pruebas, incidencias, versiones y documentación'));
c.push(P('Cada iteración ejecuta, en un escenario real, pruebas unitarias (PHPUnit para los servicios; Jest para el comparador), de integración (endpoints REST con la base de datos), funcionales (casos de uso) y de sistema (rendimiento, adaptabilidad, seguridad). Las incidencias se registran con severidad (crítica, alta, media, baja), pasos para reproducirlas y el requisito afectado; ninguna crítica puede quedar abierta en el hito IOC. El control de versiones usa Git con una rama principal protegida, ramas por funcionalidad y etiquetas por incremento (v0.1-C1, v0.2-C2, v0.3-C3). La documentación técnica incluye el SAD, el diccionario de datos, los endpoints y la guía de despliegue.'));

// Fase IV
c.push(H2('4.4 Fase IV: Transición'));
faseDetalle(M.FASES[3]);
c.push(H3('Criterios objetivos para entrar en operación'));
c.push(...tab('Criterios de salida a producción', ['Criterio', 'Umbral', 'Evidencia'], [
  ['Casos de prueba de prioridad alta', '100 % aprobados', 'Informe de pruebas'],
  ['Incidencias abiertas', '0 críticas y 0 altas', 'Registro de incidencias'],
  ['Prueba de aceptación con usuarios', '≥ 4 de 5 completan la consulta sin ayuda', 'CP-031'],
  ['Rendimiento (home, catálogo, ficha)', 'LCP ≤ 2,5 s; CLS ≤ 0,1', 'CP-029 (PageSpeed/Lighthouse)'],
  ['Respaldo y restauración', 'Restauración en staging ≤ 4 h', 'CP-032'],
  ['SEO de producción', 'Sin noindex; canonical al dominio oficial', 'Revisión de metadatos'],
  ['Capacitación', 'Gestor y administrador capacitados', 'Acta de capacitación'],
], [38, 32, 30], SRC_OWN));
c.push(H3('Preparación, despliegue, migración y respaldo'));
c.push(...numbered([
  'Congelar la versión candidata (etiqueta v1.0-rc) y ejecutar la regresión en staging.',
  'Respaldar la base de datos y los archivos de producción (punto de reversión).',
  'Desplegar el tema hijo y bh-core; ejecutar las migraciones que crean las tablas wp_bh_consulta, wp_bh_comparacion y wp_bh_auditoria.',
  'Migrar datos: no se migran productos (ya existen). Se cargan los distribuidores iniciales validados por el área comercial y se asigna el estado de verificación a las especificaciones existentes.',
  'Retirar el noindex del entorno de desarrollo y verificar el canonical, el sitemap y robots.txt.',
  'Prueba de humo: ficha → Cotizar → registro creado; directorio; panel de consultas.',
  'Activar el monitoreo de disponibilidad y los respaldos diarios cifrados fuera del servidor.',
]));
c.push(P('**Plan de reversión:** si falla la prueba de humo, se restaura el respaldo del paso 2 y se desactiva bh-core; el catálogo existente sigue funcionando porque no depende del plugin.'));
c.push(H3('Capacitación, documentación de usuario y usabilidad'));
c.push(P('Se prevé una sesión práctica de dos horas para el gestor (productos, especificaciones, distribuidores, consultas) y una de una hora para el administrador (usuarios, reportes, auditoría, respaldo), con un manual de usuario con capturas. La usabilidad se evalúa con cinco usuarios representativos en tres tareas (encontrar un modelo, comparar dos, iniciar una consulta) y el cuestionario SUS.'));
c.push(H3('Monitoreo, mantenimiento y mejora continua'));
c.push(P('Durante las dos primeras semanas se revisan a diario los errores y la disponibilidad, y cada semana los reportes de consultas. El mantenimiento se organiza en correctivo (incidencias), adaptativo (actualizaciones de WordPress y plugins, primero en staging), perfectivo (mejoras de la retroalimentación) y preventivo (respaldos y revisión de seguridad mensuales). La mejora continua usa los indicadores de la sección 8.3 para priorizar el siguiente ciclo, por ejemplo la integración con la API de WhatsApp Business si el volumen lo justifica.'));
c.push(P('**Hito Product Release (PR):** acta de conformidad firmada por Black Hawk, sistema en producción, manuales entregados y cierre con lecciones aprendidas.'));

// Disciplinas
c.push(H2('4.5 Disciplinas de RUP aplicadas'));
c.push(P('La Tabla 21 relaciona cada disciplina con las fases (intensidad de 0 a 4) y describe su aplicación al caso. La Figura 4 representa la misma matriz como curvas de esfuerzo en el tiempo.'));
const lvl = ['—', 'Baja', 'Media', 'Alta', 'Máxima'];
c.push(...tab('Matriz de disciplinas por fase (intensidad de trabajo)', ['Disciplina', 'Tipo', 'Inicio', 'Elab.', 'Constr.', 'Trans.', 'Aplicación en el SGCD-BH'], M.DISCIPLINAS.map((x) => [x.n, x.t, ...x.v.map((v) => lvl[v]), x.d]), [20, 11, 9, 9, 9, 9, 33], SRC_OWN, { firstColShade: true }));
c.push(...fig(DG + 'G01_esfuerzo_rup.png', 'Distribución del esfuerzo por disciplina a lo largo del ciclo de vida', '_Nota._ Elaboración propia. Curvas ilustrativas derivadas de la matriz de intensidad de la Tabla 21, a la manera del gráfico de fases y disciplinas de Kruchten (2004).', 16, 11));
c.push(P('**Relación entre fases, iteraciones, disciplinas y artefactos.** Una fase se compone de iteraciones; en cada iteración se ejecutan todas las disciplinas necesarias, con más o menos esfuerzo; y cada disciplina produce o actualiza artefactos. Por ejemplo, en E2 la disciplina de Análisis y diseño produce el SAD y el modelo de datos, la de Implementación produce el prototipo arquitectónico y la de Pruebas valida que el registro no retrase la apertura de WhatsApp. El hito LCA evalúa esos artefactos en conjunto.'));

// ───────────────────────── CAPÍTULO V
c.push(H1('Capítulo V. Modelado del sistema'));
c.push(P('Todos los diagramas usan notación UML 2.5 y el mismo vocabulario del modelo de dominio. Los elementos en morado claro con el estereotipo «propuesto» son ampliaciones del proyecto; los demás existen en el rediseño o son nativos de la plataforma. Las fuentes editables están en la carpeta DIAGRAMAS_UML.'));
const diag = (code, file, title, text, maxW = 16, maxH = 20) => { c.push(H2(`${code} ${title}`)); c.push(P(text)); c.push(...fig(DG + file + '.png', `${title} (${code.split(' ')[0]})`, SRC_OWN, maxW, maxH)); };
c.push(H2('5.1 Diagrama general de casos de uso'));
c.push(P('Muestra los 22 casos de uso agrupados en dos paquetes y los seis actores. Hay dos generalizaciones: el Cliente interesado hereda las interacciones del Visitante, y el Administrador hereda las del Gestor del catálogo. Solo hay dos relaciones entre casos de uso, ambas justificadas: CU-03 «extend» CU-01, porque filtrar es opcional dentro de la exploración, y CU-08 «include» CU-09, porque toda consulta enviada se registra siempre. Autenticarse (CU-11) se trata como precondición de los casos administrativos y no como «include» repetido.'));
c.push(...fig(DG + 'D02_cu_general.png', 'Diagrama general de casos de uso del sistema (D-02)', SRC_OWN, 16, 15));
c.push(H2('5.2 Casos de uso por módulo'));
c.push(P('Los diagramas por módulo repiten los casos de uso del general con más detalle (puntos de extensión, notas de reglas) para que cada uno sea legible por separado.'));
c.push(...fig(DG + 'D03_cu_catalogo.png', 'Casos de uso del catálogo público (D-03)', SRC_OWN, 13, 11));
c.push(...fig(DG + 'D04_cu_comercial.png', 'Casos de uso de consultas y distribuidores (D-04)', SRC_OWN, 11, 13));
c.push(...fig(DG + 'D05_cu_admin_catalogo.png', 'Casos de uso de administración del catálogo (D-05)', SRC_OWN, 13, 10));
c.push(...fig(DG + 'D06_cu_admin_sistema.png', 'Casos de uso de administración del sistema (D-06)', SRC_OWN, 13, 8));
c.push(H2('5.3 Modelo de dominio y modelo de análisis'));
c.push(P('El dominio contiene 12 conceptos. Las composiciones (rombo relleno) indican que las especificaciones y las imágenes no existen sin su producto. La comparación asocia de 2 a 3 productos (RN-04). Las consultas se asocian opcionalmente (0..1) a un producto, porque hay consultas generales, y a un distribuidor, porque no todas se derivan.'));
c.push(...fig(DG + 'D07_dominio.png', 'Modelo de dominio (D-07)', SRC_OWN, 16, 12));
c.push(...fig(DG + 'D08_analisis.png', 'Modelo de análisis con clases de interfaz, control y entidad (D-08)', SRC_OWN, 16, 10));
c.push(H2('5.4 Diagramas de clases de diseño'));
c.push(P('Por legibilidad, el modelo de diseño se divide en dos paquetes. Se agregan tipos, visibilidades, operaciones, enumeraciones para los estados y clases de servicio. Las dependencias (flecha discontinua) indican uso sin asociación estructural.'));
c.push(...fig(DG + 'D09_clases_catalogo.png', 'Clases de diseño del paquete Catálogo (D-09)', SRC_OWN, 15, 15));
c.push(...fig(DG + 'D10_clases_comercial.png', 'Clases de diseño de los paquetes Comercial y Seguridad (D-10)', SRC_OWN, 16, 13));
c.push(H2('5.5 Diagrama de objetos'));
c.push(P('Instancia el modelo en un momento concreto: un visitante compara FR 1500.1 y FR 2000.1 (categoría Amplificadores) y cotiza el segundo. La especificación «Potencia RMS» de FR 1500.1 aparece con valor nulo y estado PENDIENTE, lo que ilustra la regla RN-03: el modelo no inventa datos.'));
c.push(...fig(DG + 'D11_objetos.png', 'Diagrama de objetos de una consulta desde el comparador (D-11)', SRC_OWN, 13, 10));
c.push(H2('5.6 Diagramas de secuencia'));
c.push(P('Las cuatro secuencias usan participantes de interfaz, control y entidad coherentes con el modelo de análisis. Los fragmentos alt, opt y loop representan alternativas, opciones y repeticiones. La base de datos aparece como participante del sistema, no como actor.'));
c.push(...fig(DG + 'D12_seq_consulta_producto.png', 'Secuencia de la consulta de producto (D-12)', SRC_OWN, 16, 11));
c.push(...fig(DG + 'D13_seq_comparacion.png', 'Secuencia de la comparación de productos (D-13)', SRC_OWN, 16, 12));
c.push(...fig(DG + 'D14_seq_contacto.png', 'Secuencia del contacto con el distribuidor por WhatsApp (D-14)', SRC_OWN, 16, 10));
c.push(P('En la Figura 17, el mensaje 12 es asíncrono (punta abierta): el registro no bloquea la apertura de WhatsApp. Es la decisión AD-04 llevada al diseño.'));
c.push(...fig(DG + 'D15_seq_admin_producto.png', 'Secuencia de la administración de producto (D-15)', SRC_OWN, 16, 9));
c.push(H2('5.7 Diagramas de actividades'));
c.push(...fig(DG + 'D16_act_proceso_comercial.png', 'Actividades del proceso comercial propuesto (D-16)', SRC_OWN, 15, 15));
c.push(P('Las calles muestran quién hace cada acción. El sistema interviene solo en el registro y la generación del mensaje; la atención y la venta ocurren fuera. El cierre de la consulta vuelve al sistema para que el proceso sea medible.'));
c.push(...fig(DG + 'D17_act_admin_catalogo.png', 'Actividades de la administración del catálogo (D-17)', SRC_OWN, 14, 13));
c.push(H2('5.8 Diagrama de estados'));
c.push(P('Se modeló la máquina de estados de ConsultaComercial porque es la entidad cuyo comportamiento depende de su estado: qué acciones se permiten, qué transición es válida (no se cierra sin atender) y qué evento temporal la descarta (after 30 días). Un producto también tiene estados, pero sus transiciones son lineales y ya las cubre el diagrama de actividades.'));
c.push(...fig(DG + 'D18_estados_consulta.png', 'Máquina de estados de ConsultaComercial (D-18)', SRC_OWN, 13, 10));
c.push(H2('5.9 Componentes, despliegue y datos'));
c.push(P('Los diagramas de componentes (Figura 26), despliegue (Figura 27) y entidad-relación (Figura 28) se explican en el Capítulo VI, junto con la arquitectura.'));

// ───────────────────────── CAPÍTULO VI
c.push(H1('Capítulo VI. Diseño y arquitectura'));
c.push(H2('6.1 Modelo lógico'));
c.push(P('La vista lógica organiza el sistema en cuatro capas con dependencias hacia abajo (Figura 22). La presentación (tema hijo y pantallas de administración) no accede directamente a la base de datos: lo hace a través de servicios. Esto permite cambiar una plantilla sin tocar las reglas de negocio.'));
c.push(...fig(DG + 'D22_arquitectura_capas.png', 'Arquitectura lógica en capas (D-22)', SRC_OWN, 16, 9));
c.push(H2('6.2 Interfaces'));
c.push(P('La interfaz pública es el rediseño existente (Figura 23). Las nuevas interfaces se prototipan en baja fidelidad (Figuras 24 y 25). La Tabla 22 define los endpoints REST propios del plugin.'));
c.push(...fig(IMG + 'comparador.png', 'Comparador del rediseño con tres modelos y «Cotizar por WhatsApp» por columna', '_Nota._ Captura archivada del rediseño (23-09-2026). Los valores mostrados son los publicados en el sitio; este proyecto no los verifica.', 13, 9));
c.push(...fig(DG + 'W01_wireframe_directorio.png', 'Prototipo del directorio de distribuidores (propuesto)', '_Nota._ Elaboración propia. Los nombres de distribuidores son ejemplos, no datos reales.', 15, 6));
c.push(...fig(DG + 'W02_wireframe_consultas.png', 'Prototipo del panel de seguimiento de consultas (propuesto)', '_Nota._ Elaboración propia. Datos ficticios de ejemplo.', 16, 6));
c.push(...tab('Endpoints REST del plugin bh-core (propuestos)', ['Método y ruta', 'Uso', 'Acceso'], [
  ['GET /wp-json/bh/v1/comparar?ids=', 'Especificaciones alineadas de 2 o 3 productos', 'Público (solo lectura)'],
  ['POST /wp-json/bh/v1/consultas', 'Registrar una consulta (origen, intención, producto, URL)', 'Público con nonce y límite de frecuencia'],
  ['POST /wp-json/bh/v1/comparaciones', 'Registrar una comparación anónima', 'Público con límite de frecuencia'],
  ['GET /wp-json/bh/v1/distribuidores?ciudad=', 'Directorio de distribuidores ACTIVOS', 'Público (solo lectura)'],
  ['PATCH /wp-json/bh/v1/consultas/{id}', 'Cambiar el estado de una consulta', 'Gestor autenticado'],
  ['GET /wp-json/bh/v1/reportes/consultas', 'Reporte por periodo (JSON o CSV)', 'Administrador'],
], [36, 40, 24], SRC_OWN));
c.push(H2('6.3 Arquitectura de componentes e integraciones'));
c.push(P('La vista de implementación (Figura 26) separa lo existente (tema hijo, WooCommerce, YITH, núcleo de WordPress) de lo propuesto (plugin bh-core con tres componentes). WooCommerce actúa como motor de catálogo y YITH Catalog Mode oculta precio, carrito y checkout. La integración externa es WhatsApp mediante enlaces wa.me desde el navegador del visitante.'));
c.push(...fig(DG + 'D19_componentes.png', 'Diagrama de componentes (D-19)', SRC_OWN, 16, 11));
c.push(H2('6.4 Modelo físico'));
c.push(P('La vista física (Figura 27) muestra el servidor de producción con LiteSpeed y PHP (tecnología observada en el sitio oficial), la base de datos MySQL/MariaDB, el entorno de staging, el repositorio Git, el almacenamiento externo de respaldos y una CDN/WAF propuesta. La versión de PHP depende del hosting y queda por confirmar.'));
c.push(...fig(DG + 'D20_despliegue.png', 'Diagrama de despliegue (D-20)', SRC_OWN, 15, 11));
c.push(H2('6.5 Arquitectura de datos'));
c.push(P('El modelo entidad-relación lógico (Figura 28) tiene 15 tablas normalizadas hasta la tercera forma normal. Las relaciones de muchos a muchos se resuelven con tablas asociativas (producto_categoria, rol_permiso, comparacion_producto). En la implementación real, las entidades nativas se almacenan en las tablas de WordPress, como muestra la Tabla 23: el modelo lógico no obliga a duplicar datos.'));
c.push(...fig(DG + 'D21_entidad_relacion.png', 'Modelo entidad-relación lógico (D-21)', '_Nota._ Elaboración propia. Notación de patas de gallo: ||, exactamente uno; o|, cero o uno; o{, cero o muchos; |{, uno o muchos.', 16, 7));
c.push(...tab('Correspondencia del modelo lógico con el almacenamiento en WordPress', ['Entidad', 'Almacenamiento físico', 'Estado'], M.MAPEO.map(([a, b, s]) => [a, b, E[s]]), [26, 50, 24], SRC_OWN));
c.push(H2('6.6 Seguridad'));
c.push(...tab('Controles de seguridad', ['Riesgo', 'Control', 'Requisito'], [
  ['Acceso no autorizado al panel', 'Roles de privilegio mínimo, segundo factor, bloqueo tras 5 intentos fallidos', 'RNF-004, RF-016'],
  ['Interceptación de datos', 'HTTPS obligatorio con HSTS', 'RNF-004'],
  ['Inyección SQL y XSS', '$wpdb->prepare, saneamiento de entradas y escape de salidas', 'RNF-009'],
  ['CSRF en acciones administrativas', 'Nonces de WordPress y verificación de capacidades', 'RF-024'],
  ['Abuso de endpoints públicos', 'Límite de frecuencia por IP; sin datos personales en consultas', 'RF-014, RNF-005'],
  ['Pérdida de datos', 'Respaldo diario cifrado externo; restauración probada', 'RF-027, RNF-010'],
  ['Cambios no trazables', 'Auditoría inmutable desde la interfaz, conservada 12 meses', 'RF-026, RNF-013'],
  ['Datos personales', 'Consentimiento, finalidad y política de privacidad (Ley N.° 29733)', 'RNF-005'],
], [26, 52, 22], SRC_OWN));

// ───────────────────────── CAPÍTULO VII
c.push(H1('Capítulo VII. Planificación y validación'));
c.push(H2('7.1 Estructura de desglose del trabajo'));
c.push(...fig(DG + 'EDT_wbs.png', 'Estructura de desglose del trabajo (EDT/WBS)', SRC_OWN, 16, 10));
c.push(H2('7.2 Cronograma'));
c.push(P('El cronograma de 14 semanas es coherente con las iteraciones del Capítulo IV: cada hito coincide con el cierre de una fase (LCO en S2, LCA en S6, IOC en S12 y PR en S14). Las pruebas de integración y de sistema se solapan con la construcción desde la S8, porque en RUP las pruebas son continuas y no una etapa final.'));
c.push(...fig(DG + 'G02_gantt.png', 'Cronograma de Gantt del proyecto', SRC_OWN, 16, 8));
c.push(...tab('Plan de iteraciones', ['Iteración', 'Fase', 'Semanas', 'Objetivo', 'Entregable'], M.ITERACIONES.map((i) => [i.id, i.f, `S${i.s[0]}–S${i.s[1]}`, i.obj, i.ent]), [10, 14, 10, 44, 22], SRC_OWN));
c.push(H2('7.3 Riesgos'));
c.push(...fig(DG + 'G03_matriz_riesgos.png', 'Matriz de probabilidad e impacto', SRC_OWN, 12, 10));
c.push(...tab('Registro de riesgos y estrategias de mitigación', ['Código', 'Riesgo', 'P', 'I', 'P×I', 'Mitigación', 'Responsable'], M.RIESGOS.map((r) => [r.id, r.n, r.p, r.i, r.p * r.i, r.m, r.resp]), [10, 23, 5, 5, 7, 36, 14], '_Nota._ Elaboración propia. P = probabilidad e I = impacto, en escala de 1 a 5, según la técnica de matriz de probabilidad e impacto (Project Management Institute, 2017).'));
c.push(H2('7.4 Estrategia de pruebas'));
c.push(...tab('Niveles de prueba', ['Nivel', 'Objetivo', 'Herramienta', 'Responsable', 'Casos'], [
  ['Unitaria', 'Verificar servicios y funciones aisladas', 'PHPUnit, Jest', 'Desarrollador', 'CP-005, 007, 012, 013, 019'],
  ['Integración', 'Verificar REST, base de datos y servicios juntos', 'PHPUnit + BD de prueba', 'Desarrollador', 'CP-008, 011, 014, 023, 025, 026'],
  ['Funcional', 'Verificar casos de uso y reglas', 'Guiones manuales, Playwright', 'Analista de pruebas', 'CP-001–003, 009, 010, 015, 017, 018, 020–022'],
  ['Sistema', 'Rendimiento, adaptabilidad, seguridad, restauración', 'Lighthouse, Playwright, revisión manual', 'Analista de pruebas', 'CP-004, 006, 016, 024, 027–030'],
  ['Aceptación', 'Validación con usuarios y cliente', 'Tareas guiadas, SUS, acta', 'Jefe de proyecto', 'CP-031, CP-032'],
], [12, 30, 22, 14, 22], '_Nota._ Elaboración propia. Los 32 casos de prueba están diseñados; ninguno se ejecutó como parte de este trabajo (Anexo D).'));
c.push(H2('7.5 Trazabilidad'));
c.push(P('La matriz de la Tabla 28 prueba que todos los entregables describen el mismo sistema: cada necesidad del negocio se cubre con requisitos, cada requisito con un caso de uso, cada caso de uso con un componente y cada componente con al menos una prueba. Si un requisito cambia, la fila indica qué casos de uso, componentes y pruebas se deben revisar (análisis de impacto).'));
const comp = Object.fromEntries(M.COMPONENTES.map((x) => [x.id, x.n]));
c.push(...tab('Matriz de trazabilidad: necesidad → requisito → caso de uso → componente → prueba', ['Necesidad', 'Requisitos', 'Casos de uso', 'Componentes', 'Pruebas'], M.TRAZA.map((t) => [`${t.nb} ${M.NECESIDADES.find((n) => n.id === t.nb).t}`, t.rf.join(', '), t.cu.join(', '), t.comp.map((x) => `${x} ${comp[x]}`).join('\n'), t.cp.join(', ')]), [28, 18, 16, 22, 16], SRC_OWN, { size: 16 }));
c.push(H2('7.6 Criterios de aceptación y estimación de esfuerzo'));
c.push(P('Los criterios de aceptación del producto son los de la Tabla 20 (salida a producción) más los criterios individuales de cada requisito (Anexos A y B). La Tabla 29 presenta la estimación de esfuerzo y un presupuesto referencial.'));
const tot = M.ESFUERZO.reduce((a, b) => a + b.h, 0);
const money = (n) => 'S/ ' + n.toLocaleString('es-PE');
c.push(...tab('Estimación de esfuerzo y presupuesto referencial (cifras estimadas)', ['Fase', 'Horas-persona', '%', 'Costo referencial'], M.ESFUERZO.map((e) => [e.f, e.h, Math.round(100 * e.h / tot) + ' %', money(e.h * M.TARIFA_REF)]).concat([['Total', tot, '100 %', money(tot * M.TARIFA_REF)]]), [34, 22, 14, 30], `_Nota._ Elaboración propia. Cifras ESTIMADAS con una tarifa hipotética de S/ ${M.TARIFA_REF} por hora-persona para fines académicos. No representan gastos reales de Black Hawk ni una cotización. No se incluyen hosting ni dominio, que la empresa ya tiene contratados.`));

// ───────────────────────── CAPÍTULO VIII
c.push(H1('Capítulo VIII. Resultados y discusión'));
c.push(H2('8.1 Resultados documentados'));
c.push(P('Son hechos verificables en la evidencia archivada, no productos de este proyecto: el rediseño lista 118 productos en 12 categorías frente a 110 del sitemap oficial; incorpora un comparador de hasta 3 modelos con la selección persistente; su botón «Cotizar» genera un mensaje de WhatsApp con el modelo; y agrega las páginas de dónde comprar, soporte, mayoristas y privacidad. También se documentaron limitaciones: no hay directorio de distribuidores y algunas fichas no tienen especificaciones o las tienen en texto libre.'));
c.push(H2('8.2 Resultados del diseño'));
c.push(...tab('Artefactos producidos por el proyecto', ['Artefacto', 'Cantidad', 'Ubicación'], [
  ['Requisitos funcionales / no funcionales', `${M.RF.length} / ${M.RNF.length}`, 'Anexos A y B; libro de anexos'],
  ['Casos de uso (6 especificados en detalle)', M.CU.length, 'Capítulo V; Anexo C'],
  ['Diagramas UML y de apoyo', `${M.DIAGRAMAS.length} UML + 2 prototipos + 5 de apoyo`, 'Capítulos III–VII; carpeta DIAGRAMAS_UML'],
  ['Tablas del modelo de datos', Object.keys(M.DICCIONARIO).length, 'Figura 28; Anexo E'],
  ['Casos de prueba diseñados', M.CP.length, 'Anexo D'],
  ['Riesgos con mitigación', M.RIESGOS.length, 'Tabla 26'],
  ['Decisiones de arquitectura', M.DECISIONES.length, 'Tabla 16'],
], [48, 22, 30], SRC_OWN));
c.push(H2('8.3 Beneficios esperados'));
c.push(P('Son hipótesis que el sistema permitiría medir; no son resultados obtenidos. Se proponen indicadores con su forma de cálculo para evaluarlas tras el despliegue:'));
c.push(...tab('Indicadores propuestos para evaluar los beneficios', ['Beneficio esperado', 'Indicador', 'Fuente'], [
  ['Información técnica fiable', '% de fichas publicadas con todas las especificaciones VERIFICADAS', 'Reporte de catálogo'],
  ['Consultas mejor identificadas', '% de consultas registradas con el producto identificado', 'wp_bh_consulta'],
  ['Conocimiento del interés por producto', 'Consultas por producto, categoría y origen por mes', 'Reporte de consultas'],
  ['Mejor derivación', '% de consultas DERIVADAS o CERRADAS dentro de 7 días', 'Estados de la consulta'],
  ['Catálogo actualizado', 'Tiempo medio entre el cambio de un dato y su publicación', 'Auditoría'],
  ['Red de distribuidores', 'Distribuidores ACTIVOS por región', 'Directorio'],
], [30, 46, 24], SRC_OWN));
c.push(H2('8.4 Discusión'));
c.push(P('Tres puntos merecen discusión. Primero, **el registro mide intención, no ventas**: como la conversación ocurre en WhatsApp, el sistema no sabe si hubo compra. El diseño lo asume con estados manuales en lugar de prometer una métrica que no puede calcular. Segundo, **RUP puede parecer pesado para un sitio WordPress**; la respuesta fue adaptar el proceso: 7 iteraciones, 6 casos de uso especificados en detalle y artefactos proporcionales al riesgo, tal como recomienda RUP al configurar el proceso para cada proyecto (Kroll & Kruchten, 2003). Tercero, **la calidad del dato es un problema de proceso, no de software**: el sistema puede marcar un dato como pendiente, pero verificarlo requiere que Black Hawk facilite la documentación técnica de los modelos.'));

// ───────────────────────── CAPÍTULO IX
c.push(H1('Capítulo IX. Conclusiones y recomendaciones'));
c.push(H2('9.1 Conclusiones'));
c.push(...numbered([
  'RUP permitió pasar de un problema difuso («mejorar la web») a un sistema delimitado de 22 casos de uso, con el alcance protegido por reglas explícitas: sin checkout, sin inventario y sin ERP.',
  'El modelado del negocio mostró que el valor del sistema está en el tramo entre la ficha y el distribuidor. Por eso los casos de uso críticos son CU-04, CU-05 y CU-08/CU-09, y no la administración del catálogo, que la plataforma ya resuelve.',
  'La arquitectura se centra en extender, no en reemplazar: WooCommerce como motor de catálogo, YITH para el modo catálogo y un plugin propio para las ampliaciones. Esto reduce el costo y el riesgo de actualización.',
  'La trazabilidad necesidad → requisito → caso de uso → componente → prueba demuestra que la monografía, la presentación, los diagramas y los anexos describen el mismo sistema.',
  'La distinción entre lo existente, lo parcial y lo propuesto evita presentar como resultado lo que todavía es diseño: las pruebas están especificadas, pero no ejecutadas.',
]));
c.push(H2('9.2 Recomendaciones'));
c.push(...numbered([
  'Obtener de Black Hawk la documentación técnica oficial de cada modelo antes de publicar especificaciones, empezando por los modelos de referencia de la Tabla 1.',
  'Implementar primero el registro de consultas (CU-09): es el cambio de menor costo y el que genera el dato que hoy no existe.',
  'Validar con el área comercial la lista inicial de distribuidores y su frecuencia de actualización antes de publicar el directorio.',
  'Medir el rendimiento con PageSpeed Insights en producción, no en el túnel temporal, y retirar el noindex del entorno de desarrollo al publicar.',
  'Evaluar la API de WhatsApp Business solo si el volumen de consultas justifica automatizar la respuesta; queda fuera del alcance actual.',
  'Reconstruir el modelo en Rational Rose siguiendo el Anexo F si el curso requiere el archivo nativo .mdl.',
]));

// ───────────────────────── REFERENCIAS
c.push(H1('Referencias'));
[...M.REFERENCIAS, ...M.FUENTES_CASO].sort((a, b) => a.localeCompare(b, 'es')).forEach((r) => c.push(new Paragraph({ children: L.runs(r), indent: { left: 720, hanging: 720 }, spacing: { after: 120, line: 300 } })));

// ───────────────────────── ANEXOS
c.push(H1('Anexos'));
c.push(H2('Anexo A. Catálogo de requisitos funcionales'));
c.push(...tab('Catálogo de requisitos funcionales', ['Código', 'Nombre y descripción', 'Prioridad', 'Actor / CU', 'Criterio de aceptación', 'Estado'], M.RF.map((r) => [r.id, `**${r.n}.** ${r.d}`, r.p, `${r.a}\n${r.cu}`, r.ac, E[r.e]]), [9, 31, 10, 14, 24, 12], SRC_OWN, { size: 15 }));
c.push(H2('Anexo B. Catálogo de requisitos no funcionales'));
c.push(...tab('Catálogo de requisitos no funcionales', ['Código', 'Característica', 'Nombre y descripción', 'Prioridad', 'Criterio de aceptación', 'Estado'], M.RNF.map((r) => [r.id, r.c, `**${r.n}.** ${r.d}`, r.p, r.ac, E[r.e]]), [9, 15, 30, 10, 24, 12], '_Nota._ Elaboración propia. Características de calidad según ISO/IEC 25010 (International Organization for Standardization, 2011).', { size: 15 }));
c.push(H2('Anexo C. Especificaciones de casos de uso'));
c.push(...tab('Inventario de casos de uso', ['Código', 'Caso de uso', 'Actor(es)', 'Relaciones', 'Estado'], M.CU.map((x) => [x.id, x.n, x.a, x.rel || '—', E[x.e]]), [9, 32, 28, 14, 17], SRC_OWN, { size: 15 }));
SPECS.forEach((s) => {
  c.push(H3(`${s.id} ${s.n}`));
  c.push(table(['Campo', 'Descripción'], [
    ['Actores', s.actores], ['Descripción', s.desc], ['Estado', s.estado], ['Precondiciones', s.pre.join('\n')],
    ['Flujo básico', s.flujo.map((f, i) => `${i + 1}. ${f}`).join('\n')], ['Flujos alternativos', s.alt.join('\n')],
    ['Postcondiciones', s.post.join('\n')], ['Reglas de negocio', s.reglas], ['Requisitos', s.req],
  ], [18, 82], { size: 16, firstColShade: true }));
});
c.push(H2('Anexo D. Casos de prueba'));
c.push(...tab('Casos de prueba diseñados', ['Código', 'Requisito', 'Tipo', 'Caso de prueba', 'Resultado esperado', 'Estado'], M.CP.map((x) => [x.id, x.rf, x.t, x.n, x.r, 'Diseñado, no ejecutado']), [9, 10, 11, 30, 26, 14], SRC_OWN, { size: 15 }));
c.push(H2('Anexo E. Diccionario de datos'));
Object.entries(M.DICCIONARIO).forEach(([t, cols]) => {
  c.push(H3(`Tabla ${t}`));
  c.push(table(['Columna', 'Tipo', 'Restricción', 'Descripción'], cols, [24, 16, 30, 30], { size: 15 }));
});
c.push(H2('Anexo F. Inventario de diagramas y guía para Rational Rose'));
c.push(...tab('Inventario de diagramas', ['Código', 'Archivo', 'Diagrama', 'Tipo UML', 'Relacionado con'], M.DIAGRAMAS, [8, 26, 30, 16, 20], '_Nota._ Cada diagrama se entrega en PNG, SVG y fuente PlantUML (.puml) en la carpeta DIAGRAMAS_UML.', { size: 15 }));
c.push(P('**Compatibilidad con Rational Rose.** No se entrega un archivo nativo .mdl, porque su compatibilidad no puede verificarse en el entorno de elaboración. Se entregan las fuentes PlantUML editables, los diagramas en SVG y PNG, una exportación XMI experimental de los diagramas de clases (sin compatibilidad verificada con Rose) y esta guía de reconstrucción:'));
c.push(...numbered([
  'Crear un modelo nuevo en Rational Rose (plantilla «rational unified process» si está disponible) y nombrarlo SGCD-BH.',
  'En la Use Case View: crear un paquete «Negocio» con los actores y casos de uso del negocio de D-01, usando los estereotipos business actor y business use case, y un paquete por módulo (Catálogo público, Comercial, Administración) con los 6 actores y 22 casos de uso de D-02 a D-06. Registrar las generalizaciones y las relaciones «include» y «extend» exactamente como en los diagramas.',
  'En la Logical View: crear los paquetes Catálogo, Comercial y Seguridad. Agregar las clases de D-09 y D-10 con sus atributos, tipos, visibilidad y operaciones, y las enumeraciones como clases con el estereotipo enumeration. Registrar las multiplicidades de cada asociación y las composiciones.',
  'En la Logical View: crear los diagramas de secuencia D-12 a D-15, arrastrando el actor y los objetos de las clases, y los mensajes en el orden numerado. Crear el diagrama de estados de ConsultaComercial (D-18) desde la clase.',
  'Los diagramas de actividades (D-16, D-17) se crean como Activity Diagram bajo el caso de uso correspondiente, con una swimlane por participante.',
  'En la Component View: crear los componentes de D-19 y sus dependencias. En la Deployment View: los nodos y conexiones de D-20.',
  'Documentar cada elemento en el campo Documentation con la descripción del catálogo de requisitos (Anexo A) y de la especificación de casos de uso (Anexo C).',
]));
c.push(H2('Anexo G. Glosario técnico'));
c.push(...tab('Glosario técnico', ['Término', 'Definición'], M.GLOSARIO, [24, 76], SRC_OWN));

// ───────────────────────── DOCUMENTO
const header = new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${M.SISTEMA.sigla} · Aplicación de RUP — Black Hawk Car Audio`, size: 16, color: L.MUTED })] })] });
const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: L.MUTED })] })] });
const page = { size: { width: 11906, height: 16838 }, margin: { top: 1418, bottom: 1418, left: 1418, right: 1418 } };
const doc = new Document({
  creator: 'Equipo del proyecto SGCD-BH', title: 'Monografía — Aplicación de RUP a Black Hawk Car Audio', description: M.SISTEMA.titulo,
  features: { updateFields: true },
  styles: L.baseStyles, numbering: L.numbering,
  sections: [
    { properties: { page }, children: cover },
    { properties: { page }, headers: { default: header }, footers: { default: footer }, children: prelim },
    { properties: { page }, headers: { default: header }, footers: { default: footer }, children: c },
  ],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync('../BLACK_HAWK_RUP_MONOGRAFIA.docx', b); console.log('ok'); });
