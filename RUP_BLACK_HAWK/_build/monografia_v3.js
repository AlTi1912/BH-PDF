// Genera BLACK_HAWK_RUP_MONOGRAFIA_V3.docx: evolución del sitio original a la web renovada, aplicando RUP.
const fs = require('fs');
const V = require('./v3data');
const M = V.M;
const L = require('./docxlib');
const { d, P, H1, H2, H3, bullets, numbered, caption, note, table, image } = L;
const { Document, Packer, Paragraph, TextRun, AlignmentType, Header, Footer, PageNumber, TableOfContents, ImageRun } = d;

const DG = '../DIAGRAMAS_UML/png/';
const fig = (file, title, src, w, h) => [caption('Figura', title), image(file, w, h), note(src)];
const tab = (title, head, rows, widths, src, opt) => [caption('Tabla', title), table(head, rows, widths, opt), note(src)];
const OWN = '_Nota._ Elaboración propia.';
const CAP = `_Nota._ Capturas reales del sitio original y de la web renovada, mismas vistas, ${V.FECHA}. Sin retoques; solo escalado.`;
const c = [];
const h1 = (t) => c.push(H1(t, false));

const cover = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400, after: 80 }, children: [new TextRun({ text: '[INSTITUCIÓN EDUCATIVA]', bold: true, size: 30 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'Carrera profesional de [CARRERA PROFESIONAL]', size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 500 }, children: [new TextRun({ text: 'Curso: Diseño de Sistemas de Información', size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new ImageRun({ type: 'png', data: fs.readFileSync('research/logo-b.png'), transformation: { width: 170, height: 91 }, altText: { title: 'Logotipo Black Hawk', description: 'Logotipo de Black Hawk tomado del sitio oficial', name: 'logo' } })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200, line: 360 }, children: [new TextRun({ text: 'APLICACIÓN DE LA METODOLOGÍA RUP EN EL ANÁLISIS, DISEÑO Y DESARROLLO DE LA WEB RENOVADA DE BLACK HAWK', bold: true, size: 32 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 700 }, children: [new TextRun({ text: 'Del sitio original a una plataforma que guía al cliente hasta la consulta comercial', italics: true, size: 24, color: L.PURPLE })] }),
  ...['Integrantes: [Apellidos y nombres del integrante 1]', '[Apellidos y nombres del integrante 2]', '[Apellidos y nombres del integrante 3]', '[Apellidos y nombres del integrante 4]', '[Apellidos y nombres del integrante 5]'].map((t) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: t, size: 22 })] })),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 40 }, children: [new TextRun({ text: 'Docente: [Nombre del docente]', size: 22 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600, after: 40 }, children: [new TextRun({ text: '[Ciudad], Perú · 2026', size: 22 })] }),
];

const prelim = [
  H1('Resumen', false),
  P('Black Hawk es una marca peruana de audio automotriz que usa su sitio web como catálogo: no vende en línea, sino que orienta al comprador hacia su área comercial y sus distribuidores. Su plataforma original, construida con WordPress y WooCommerce, ya publica el catálogo, pero no guía al usuario desde el interés en un producto hasta el contacto comercial: el enlace «Productos» abre una tienda vacía, las fichas no tienen un paso de consulta y el canal mayorista está oculto.'),
  P('Este trabajo aplica la metodología Rational Unified Process (RUP) para analizar esa plataforma y diseñar y desarrollar una versión renovada del sitio. La web renovada, construida como tema hijo sobre la misma plataforma, moderniza la identidad visual, ordena el catálogo de 118 productos, incorpora un comparador de hasta tres modelos y lleva cada ficha a una consulta por WhatsApp con el modelo ya escrito. Se distinguen tres elementos: el sitio original (punto de partida), la web renovada (la solución desarrollada, hoy en un entorno de prueba) y las ampliaciones propuestas (registro de consultas, directorio de distribuidores, reportes). Las fases de Inicio y Elaboración están realizadas, la Construcción está avanzada y la Transición, planificada.'),
  P('**Palabras clave:** RUP, UML, Rational Rose, rediseño web, experiencia de usuario, catálogo de productos, WooCommerce, Black Hawk.'),
  H1('Índice', true),
  new TableOfContents('Índice', { hyperlink: true, headingStyleRange: '1-2' }),
  H1('Índice de figuras y tablas', true),
  new TableOfContents('Índice de figuras', { hyperlink: true, stylesWithLevels: [new d.StyleLevel('FigCaption', 1)] }),
  new Paragraph({ spacing: { before: 200 }, children: [] }),
  new TableOfContents('Índice de tablas', { hyperlink: true, stylesWithLevels: [new d.StyleLevel('TabCaption', 1)] }),
];

// 1
c.push(H1('1. Introducción', true));
c.push(P('Black Hawk ya tiene un sistema de información web: un sitio con catálogo, categorías, buscador y fichas de producto. El proyecto no parte de cero ni pretende reemplazarlo. Su propósito es transformar esa plataforma informativa en una herramienta que oriente al usuario hacia una acción comercial concreta: consultar por un producto y llegar a quien puede vendérselo.'));
c.push(P('Para ordenar ese trabajo se aplica RUP. El documento sigue la historia del proyecto: primero la empresa y su plataforma original; luego el análisis de sus oportunidades de mejora y la necesidad que se desprende; después, la web renovada que se desarrolla como solución, comparada pantalla a pantalla con la versión anterior; y finalmente, cómo se aplicaron las fases de RUP y cómo se modela el sistema con UML. En todo el texto se distinguen tres elementos que no deben confundirse:'));
c.push(...tab('Tres elementos del proyecto', ['Elemento', 'Qué es', 'Estado'], V.TRES.map((t) => [`${t.k}. ${t.n}`, t.d, t.estado]), [22, 60, 18], OWN));

// 2
h1('2. La empresa');
c.push(P('Black Hawk es una marca de audio automotriz orientada al mercado peruano. Su catálogo incluye amplificadores, subwoofers, medios, tweeters, drivers, procesadores, ecualizadores y componentes. Su público está formado por quienes equipan su vehículo y por los negocios que venden la marca. El modelo comercial es el rasgo que más condiciona el diseño: la web no muestra precios ni tiene carrito; su función es mostrar el catálogo y orientar la consulta, y la venta se concreta después, con el área comercial o un distribuidor.'));

// 3
h1('3. La plataforma original');
c.push(H2('3.1 Qué tiene el sitio original'));
c.push(P(`El sitio original (blackhawkcaraudio.com) funciona sobre WordPress y WooCommerce, con un tema propio y el plugin YITH Catalog Mode, que oculta precio y carrito. Según su sitemap, consultado el ${V.FECHA}, publica 110 productos en 11 categorías. Ya dispone de las siguientes funciones:`));
c.push(...bullets(V.ORIGINAL_TIENE));
c.push(H2('3.2 Análisis: qué se observa'));
c.push(P('El análisis se hizo sobre capturas del sitio original tomadas el 23 y el 29 de septiembre de 2026 y sobre sus enlaces. Cada hallazgo se clasifica según su naturaleza, para no afirmar que falta una función que en realidad existe: **inexistente** (la función no está), **existe, pero es poco visible** (está, pero el usuario difícilmente la encuentra) y **recorrido mejorable** (la función está, pero no cumple bien su propósito).'));
c.push(...tab('Hallazgos observables en el sitio original', ['N.º', 'Hallazgo', 'Detalle', 'Tipo', 'Evidencia'], [...V.HALLAZGOS.map((h) => [h.n, h.t, h.d, V.TIPOS[h.tipo], h.ev]), ...V.HALLAZGOS_EXTRA.map(([t, k, e], i) => [7 + i, t, '—', V.TIPOS[k], e])], [6, 24, 36, 16, 18], OWN, { size: 16 }));
c.push(...fig('img/v3-A-shop.png', 'Sitio original: el enlace «Productos» abre una tienda sin productos', `_Nota._ Captura del sitio original, /shop/, 1440 × 900 px, ${V.FECHA}.`, 14, 9));
c.push(P('Estos hallazgos no describen una plataforma rota: el catálogo existe y se puede recorrer entrando por las categorías. Describen un recorrido que se interrumpe. El visitante puede llegar a la ficha del producto que le interesa, pero ahí no encuentra una forma de consultar; y si busca cómo comprar o cómo distribuir la marca, el menú no lo lleva a ninguna parte.'));

// 4
h1('4. Problema y necesidad empresarial');
c.push(P(`**Problema.** ${V.PROBLEMA}`));
c.push(P('La necesidad central es transformar una plataforma informativa en una herramienta digital que oriente al usuario hacia una acción comercial concreta. Se desagrega en tres necesidades, cada una vinculada a los hallazgos que la originan:'));
c.push(...tab('Necesidades identificadas', ['Necesidad', 'Qué requiere', 'Hallazgos'], V.NECESIDADES.map((n) => [n.t, n.d, n.h.join(', ')]), [30, 55, 15], OWN));

// 5
h1('5. Justificación');
c.push(P('**Técnica.** La plataforma ya resuelve la publicación del catálogo. Rediseñarla sobre la misma base, con un tema hijo, conserva los productos y el contenido existentes y evita que las actualizaciones de WordPress o WooCommerce borren los cambios.'));
c.push(P('**Comercial.** El canal de venta de Black Hawk ya es WhatsApp y sus distribuidores. El rediseño no cambia ese canal: hace que el usuario llegue a él desde cualquier producto y con el modelo ya identificado.'));
c.push(P('**Económica.** Se reutilizan la plataforma, el hosting y el contenido. No se requieren licencias nuevas obligatorias.'));
c.push(P('**Académica.** El caso permite aplicar RUP sobre un desarrollo real, con un antes y un después verificables, y modelar con UML un sistema que efectivamente se construye.'));

// 6
h1('6. Objetivos');
c.push(H2('6.1 Objetivo general'));
c.push(P(V.OBJ_GENERAL));
c.push(H2('6.2 Objetivos específicos'));
c.push(...numbered(V.OBJ_ESP));

// 7
h1('7. Alcance');
c.push(P('El alcance se organiza en cinco grupos. Los cuatro primeros forman la web renovada; el quinto reúne las mejoras complementarias que se proponen para una etapa posterior.'));
c.push(...tab('Alcance del proyecto', ['Grupo', 'Funciones', 'Estado'], V.FUNCIONES.map((f) => [`${f.k}. ${f.n}`, f.items.join('; '), f.e]), [24, 58, 18], OWN));
c.push(P(`**Exclusiones:** ${V.EXCLUSIONES.join('; ')}. Registrar el inicio de una consulta no equivale a registrar una venta, una cotización aceptada ni una conversación completada: la conversación ocurre en WhatsApp, fuera del sistema. Hacer seguimiento de su resultado requeriría un mecanismo adicional, que no se asume.`));
c.push(P('**Limitaciones.** La web renovada funciona en un entorno de prueba con una dirección temporal y aún no se ha publicado. No se dispone de datos de tráfico ni de ventas, por lo que no se proyectan resultados comerciales.'));

// 8
h1('8. La web renovada');
c.push(H2('8.1 Qué se entrega'));
c.push(P('La web renovada es el sistema que se desarrolla y se entrega a Black Hawk. Está construida como tema hijo (rozer-child) sobre WordPress y WooCommerce, y mantiene YITH Catalog Mode para que la web siga siendo un catálogo sin carrito ni pago. Rediseña la identidad visual y la navegación, ordena el catálogo y las fichas, e incorpora un recorrido comercial completo: «Cotizar» en el encabezado y en cada ficha, WhatsApp con el modelo en el mensaje y las páginas Dónde comprar, Mayoristas y Soporte. Su catálogo publica 118 productos en 12 categorías.'));
c.push(H2('8.2 Antes y después'));
c.push(P('Cada comparación usa capturas auténticas de la vista equivalente en ambas versiones, tomadas el mismo día y con el mismo tamaño de pantalla. Para cada una se indica qué tenía la versión anterior, qué necesidad se identificó, qué modificación se realizó y qué beneficio se espera.'));
c.push(...tab('Antes y después: necesidad, modificación y beneficio esperado', ['Vista', 'Antes', 'Necesidad', 'Modificación', 'Beneficio esperado'], V.ANTES_DESPUES.map((p) => [p.n, p.a, p.nec, p.sol, p.ben]), [13, 22, 21, 24, 20], OWN, { size: 16 }));
c.push(...fig('img/v3-par-home.png', 'Antes y después: home', CAP, 16, 6));
c.push(...fig('img/v3-par-catalogo.png', 'Antes y después: catálogo', CAP, 16, 6));
c.push(...fig('img/v3-par-ficha.png', 'Antes y después: ficha del producto BH-SW12XXG', CAP, 16, 6));
c.push(...fig('img/v3-par-movil.png', 'Antes y después: ficha en el celular', `${CAP} La versión renovada muestra una barra «Cotizar» fija en la parte inferior.`, 9, 10));
c.push(H2('8.3 Flujo comercial y funcionalidades'));
c.push(P('El recorrido propuesto es: cliente → catálogo → producto → comparación → «Cotizar» → Dónde comprar o WhatsApp → atención comercial. Todos esos pasos funcionan en la web renovada. El mensaje que se genera desde la ficha del BH-SW12XXG es «Hola Black Hawk, vengo de la web y quiero cotizar el modelo BH-SW12XXG». Sobre ese recorrido se proponen tres ampliaciones: registrar el inicio de cada consulta, estructurar un directorio de distribuidores y, si se incorpora un mecanismo para ello, dar seguimiento al resultado y generar reportes.'));

// 9
h1('9. Marco conceptual de RUP');
c.push(P('RUP es un proceso de ingeniería de software derivado del Proceso Unificado (Jacobson et al., 1999). Organiza el trabajo en cuatro fases (Inicio, Elaboración, Construcción y Transición), cada una cerrada por un hito, y en nueve disciplinas que se ejecutan con distinta intensidad a lo largo de las fases (Kruchten, 2004). Tres características lo definen:'));
c.push(...bullets(['**Iterativo e incremental:** el sistema se construye en iteraciones que entregan partes funcionales.', '**Dirigido por casos de uso:** los casos de uso guían el diseño, la implementación y las pruebas.', '**Centrado en la arquitectura:** la estructura del sistema se valida antes de la construcción completa.']));
c.push(P('Los hitos se entienden de forma sencilla: **LCO** (Lifecycle Objectives) indica que los objetivos y el alcance están acordados; **LCA** (Lifecycle Architecture), que la arquitectura está validada; **IOC** (Initial Operational Capability), que hay una versión operativa; y **PR** (Product Release), que el producto se publica. No deben confundirse fases y disciplinas: una fase es un periodo con un objetivo; una disciplina, un tipo de trabajo (requisitos, pruebas…) que ocurre en varias fases.'));
c.push(P('Tampoco deben confundirse los instrumentos: **RUP** es la metodología; **UML**, el lenguaje de modelado estandarizado por el Object Management Group (2017); y **Rational Rose**, una herramienta CASE para construir modelos UML (Quatrani, 2002). WordPress y WooCommerce son la base tecnológica, y WhatsApp es un canal externo de comunicación.'));

// 10
h1('10. Aplicación de RUP al proyecto');
c.push(P('Cada fase se describe con su objetivo, actividades, aplicación a Black Hawk, artefactos e hito. Se indica su estado real: qué se realizó y qué está planificado. La distribución en semanas es una estimación académica.'));
V.FASES.forEach((f, i) => {
  c.push(H2(`10.${i + 1} ${f.n} · ${f.estado}`));
  c.push(P(`**Objetivo.** ${f.obj}`));
  c.push(P('**Actividades principales:**'));
  c.push(...bullets(f.act));
  c.push(P(`**Aplicación a Black Hawk.** ${f.bh}`));
  if (f.extra) c.push(P(`**Stakeholders:** ${f.extra.stake.join(', ')}. **Viabilidad:** ${f.extra.viab.map(([k, v]) => `${k.toLowerCase()} (${v.toLowerCase()})`).join('; ')}.`));
  if (f.pruebas) c.push(P(`**Pruebas.** ${f.pruebas}`));
  c.push(P(`**Artefactos:** ${f.art.join(', ')}. **Hito:** ${f.hito}, ${f.hitoN.toLowerCase()}.`));
});
c.push(H2('10.5 Disciplinas, iteraciones y entregables'));
c.push(P('La tabla siguiente muestra el entregable principal de cada disciplina en cada iteración y su estado. Se aprecia el carácter iterativo: los requisitos y el diseño aparecen en varias iteraciones, y la implementación empieza con un prototipo en Elaboración.'));
c.push(...tab('Disciplinas por iteración', ['Disciplina', ...V.ITER.map((x) => x.id)], [...V.MATRIZ.map(([dd, cells]) => [dd, ...cells.map((x) => x || '—')]), ['Estado', ...V.ITER.map((x) => x.e)]], [18, 12, 12, 12, 12, 12, 12, 10], `${OWN} Semanas estimadas: I1 S1–2; E1–E2 S3–6; C1–C3 S7–12; T1 S13–14.`, { size: 15, firstColShade: true }));

// 11
h1('11. Requisitos principales');
c.push(P('El catálogo completo tiene 27 requisitos funcionales y 13 no funcionales, cada uno con prioridad, criterio de aceptación y estado (véanse los anexos). Los representativos son:'));
c.push(...tab('Requisitos funcionales representativos', ['Requisito', 'Estado', 'Código'], V.REQ_F, [58, 18, 24], OWN));
c.push(...tab('Requisitos no funcionales representativos', ['Característica', 'Requisito', 'Código'], V.REQ_NF, [20, 62, 18], `${OWN} Características de calidad según ISO/IEC 25010 (International Organization for Standardization, 2011).`));

// 12
h1('12. Modelado UML');
c.push(P('Los diagramas siguientes son adaptaciones de los modelos completos del proyecto, que se conservan en los anexos y pueden reconstruirse en Rational Rose. Los elementos en morado son ampliaciones propuestas.'));
c.push(H2('12.1 Casos de uso'));
c.push(P('Muestra qué puede hacer cada actor. El cliente interesado hereda las acciones del visitante; el gestor administra el catálogo y los contenidos; WhatsApp es un sistema externo. «Cotizar por WhatsApp» incluiría el registro del inicio de la consulta, que es una ampliación.'));
c.push(...fig(DG + 'V3_01_casos_de_uso.png', 'Casos de uso de la web renovada', `${OWN} Adaptado de D-02.`, 16, 13));
c.push(H2('12.2 Actividades'));
c.push(P('Representa el recorrido comercial con tres calles: el cliente, la web renovada y el área comercial o distribuidor. El sistema termina al abrir WhatsApp; la atención ocurre fuera de la web.'));
c.push(...fig(DG + 'V3_02_actividades.png', 'Recorrido comercial en la web renovada', `${OWN} Adaptado de D-16.`, 13, 14));
c.push(H2('12.3 Secuencia'));
c.push(P('Detalla la interacción entre objetos cuando el cliente consulta un producto: la ficha obtiene el producto de WooCommerce, arma el mensaje con el modelo y abre WhatsApp. El fragmento morado es la ampliación: registrar el inicio de la consulta sin demorar la apertura.'));
c.push(...fig(DG + 'V3_03_secuencia.png', 'Consulta de un producto por WhatsApp', `${OWN} Adaptado de D-14.`, 16, 10));
c.push(H2('12.4 Clases'));
c.push(P('Estructura la información. El producto pertenece a una o más categorías y se compone de especificaciones e imágenes (composición: no existen sin él). EventoConsulta registra que se inició una consulta desde la web; no representa una venta ni una conversación completada.'));
c.push(...fig(DG + 'V3_04_clases.png', 'Clases del dominio', `${OWN} Adaptado de D-07.`, 15, 9));

// 13
h1('13. Arquitectura y componentes');
c.push(P('El rediseño vive en el tema hijo: plantillas de home, catálogo y ficha; páginas de dónde comprar, mayoristas y soporte; scripts del buscador y del comparador; y los botones de WhatsApp con mensaje contextual. WooCommerce gestiona productos y categorías, YITH Catalog Mode mantiene el modo catálogo y todo se ejecuta sobre WordPress y MySQL. Las ampliaciones se ubicarían en un módulo propio, para no mezclar la lógica nueva con la presentación.'));
c.push(...fig(DG + 'V3_05_componentes.png', 'Componentes de la web renovada', `${OWN} Adaptado de D-19. Despliegue: diagrama D-20.`, 16, 10));

// 14
h1('14. Resultados');
c.push(H2('14.1 Resultados documentados'));
c.push(P('La comparación de pantallas equivalentes (sección 8.2) documenta los cambios. Además, se midieron con Lighthouse el peso transferido y el número de peticiones de ambas versiones, en las mismas páginas y condiciones. Estos dos indicadores son comparables; los tiempos de carga no, porque las versiones se sirven desde servidores distintos.'));
c.push(...tab('Mediciones comparables', ['Indicador', 'Sitio original', 'Web renovada'], V.MEDICIONES, [50, 25, 25], '_Nota._ Lighthouse 12.8.2, mediana de 3 mediciones, 23-09-2026.'));
c.push(H2('14.2 Resultados esperados'));
c.push(P('Se espera que la web renovada reduzca la fricción entre el interés en un producto y el contacto comercial, que las consultas lleguen con el modelo identificado y que la marca se perciba coherente en cualquier dispositivo. Son beneficios esperados: se podrán medir cuando la web se publique en el dominio oficial. No se afirman incrementos de ventas ni de tráfico.'));

// 15
h1('15. Conclusiones y próximos pasos');
c.push(...numbered(V.CONCLUSIONES.map(([k, t]) => `**${k}.** ${t}`)));
c.push(P('**Próximos pasos:** ' + V.PROXIMOS.map((p, i) => `(${i + 1}) ${p.toLowerCase()}`).join('; ') + '.'));

// Referencias
c.push(H1('Referencias'));
const REFS = M.REFERENCIAS.filter((r) => /Jacobson|Kruchten, P\. \(2004\)|Kroll|Object Management|Quatrani|Sommerville|Pressman|International Organization for Standardization. \(2011\)|Booch|Larman/.test(r));
[...REFS, `Black Hawk Car Audio. (s. f.). Sitio web oficial [Sitio web]. Recuperado el ${V.FECHA}, de https://www.blackhawkcaraudio.com/`, `Black Hawk Car Audio. (2026). Web renovada, versión de prueba [Sitio web en entorno temporal]. Recuperado el ${V.FECHA}.`, 'YITH. (s. f.). YITH WooCommerce Catalog Mode [Plugin de WordPress]. Recuperado el 29 de septiembre de 2026, de https://wordpress.org/plugins/yith-woocommerce-catalog-mode/']
  .sort((a, b) => a.localeCompare(b, 'es')).forEach((r) => c.push(new Paragraph({ children: L.runs(r), indent: { left: 720, hanging: 720 }, spacing: { after: 120, line: 300 } })));

// Anexos
c.push(H1('Anexos'));
c.push(H2('Anexo A. Requisitos funcionales: sitio original frente a web renovada'));
const ORIG = require('./v3orig');
c.push(...tab('Estado de cada requisito funcional', ['Código', 'Requisito', 'Sitio original', 'Web renovada / proyecto'], M.RF.map((r) => [r.id, r.n, ORIG[r.id] || '—', { EXI: 'Desarrollado', BASE: 'Base WordPress/WooCommerce', PAR: 'Parcial', PEN: 'Pendiente de validación', PRO: 'Ampliación propuesta' }[r.e]]), [10, 36, 30, 24], `${OWN} Descripción y criterios de aceptación: BLACK_HAWK_RUP_ANEXOS_V3.xlsx.`, { size: 15 }));
c.push(H2('Anexo B. Documentación técnica de respaldo'));
c.push(...bullets([
  '**BLACK_HAWK_RUP_ANEXOS_V3.xlsx:** requisitos, casos de uso, trazabilidad, pruebas, riesgos, cronograma, diccionario de datos y la hoja «Sitio original» con los hallazgos.',
  '**BLACK_HAWK_RUP_MONOGRAFIA.docx (versión 1):** especificaciones de casos de uso, arquitectura detallada, seguridad, modelo de datos y planificación por iteraciones.',
  '**DIAGRAMAS_UML/:** los 22 diagramas completos, las adaptaciones V3-01 a V3-05 y la guía para reconstruirlos en Rational Rose.',
  '**evidence/:** capturas originales del sitio anterior y del rediseño, con sus metadatos y los informes de Lighthouse.',
]));

const header = new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Web renovada de Black Hawk · Aplicación de RUP', size: 16, color: L.MUTED })] })] });
const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: L.MUTED })] })] });
const page = { size: { width: 11906, height: 16838 }, margin: { top: 1418, bottom: 1418, left: 1418, right: 1418 } };
const doc = new Document({
  creator: 'Equipo del proyecto SGCD-BH', title: 'Monografía V3 — Web renovada de Black Hawk con RUP', features: { updateFields: true },
  styles: L.baseStyles, numbering: L.numbering,
  sections: [
    { properties: { page }, children: cover },
    { properties: { page }, headers: { default: header }, footers: { default: footer }, children: prelim },
    { properties: { page }, headers: { default: header }, footers: { default: footer }, children: c },
  ],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync('../BLACK_HAWK_RUP_MONOGRAFIA_V3.docx', b); console.log('ok'); });
