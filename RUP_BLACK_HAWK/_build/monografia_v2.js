// Genera BLACK_HAWK_RUP_MONOGRAFIA_V2.docx: versión resumida para la primera presentación.
const fs = require('fs');
const V = require('./v2data');
const M = V.M;
const L = require('./docxlib');
const { d, P, H1, H2, H3, bullets, numbered, caption, note, table, image } = L;
const { Document, Packer, Paragraph, TextRun, AlignmentType, Header, Footer, PageNumber, TableOfContents, ImageRun } = d;

const DG = '../DIAGRAMAS_UML/png/';
const fig = (file, title, src, w, h) => [caption('Figura', title), image(file, w, h), note(src)];
const tab = (title, head, rows, widths, src, opt) => [caption('Tabla', title), table(head, rows, widths, opt), note(src)];
const OWN = '_Nota._ Elaboración propia.';
const EV = `_Nota._ Elaboración propia a partir de la ${V.WEB} y del sitio oficial.`;
const c = [];

const cover = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400, after: 80 }, children: [new TextRun({ text: '[INSTITUCIÓN EDUCATIVA]', bold: true, size: 30 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'Carrera profesional de [CARRERA PROFESIONAL]', size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 500 }, children: [new TextRun({ text: 'Curso: Diseño de Sistemas de Información', size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new ImageRun({ type: 'png', data: fs.readFileSync('research/logo-b.png'), transformation: { width: 170, height: 91 }, altText: { title: 'Logotipo Black Hawk', description: 'Logotipo de Black Hawk tomado del sitio oficial', name: 'logo' } })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200, line: 360 }, children: [new TextRun({ text: 'APLICACIÓN DE LA METODOLOGÍA RUP EN EL DISEÑO DE UN SISTEMA DE INFORMACIÓN PARA BLACK HAWK', bold: true, size: 32 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 700 }, children: [new TextRun({ text: 'Propuesta: Sistema de Gestión de Catálogo y Distribuidores Black Hawk (SGCD-BH)', italics: true, size: 24, color: L.PURPLE })] }),
  ...['Integrantes: [Apellidos y nombres del integrante 1]', '[Apellidos y nombres del integrante 2]', '[Apellidos y nombres del integrante 3]', '[Apellidos y nombres del integrante 4]', '[Apellidos y nombres del integrante 5]'].map((t) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: t, size: 22 })] })),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 40 }, children: [new TextRun({ text: 'Docente: [Nombre del docente]', size: 22 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600, after: 40 }, children: [new TextRun({ text: '[Ciudad], Perú · 2026', size: 22 })] }),
];

const prelim = [
  H1('Resumen', false),
  P('El presente trabajo plantea el diseño de un sistema de información web para Black Hawk, marca peruana de audio automotriz, aplicando la metodología Rational Unified Process (RUP). La empresa ya dispone de una web que funciona como catálogo: no vende en línea, sino que orienta al comprador y lo conecta con su área comercial por WhatsApp. El análisis de esa web muestra que el catálogo y la consulta existen, pero faltan tres capacidades: mantener la información técnica de forma estructurada, llevar al comprador hasta un distribuidor y registrar las consultas para darles seguimiento.'),
  P('Se propone el Sistema de Gestión de Catálogo y Distribuidores Black Hawk (SGCD-BH), que extiende la plataforma existente (WordPress y WooCommerce) con un módulo propio. El documento describe la empresa, la situación problemática, los objetivos y el alcance, y explica cómo se aplican las cuatro fases de RUP: Inicio, Elaboración, Construcción y Transición. Presenta además los requisitos principales, los modelos UML más representativos, la arquitectura general y el plan de desarrollo. Esta entrega corresponde al análisis y diseño; la construcción y el despliegue quedan planificados.'),
  P('**Palabras clave:** RUP, UML, Rational Rose, sistema de información web, catálogo de productos, Black Hawk.'),
  H1('Índice', true),
  new TableOfContents('Índice', { hyperlink: true, headingStyleRange: '1-2' }),
  H1('Índice de figuras y tablas', true),
  new TableOfContents('Índice de figuras', { hyperlink: true, stylesWithLevels: [new d.StyleLevel('FigCaption', 1)] }),
  new Paragraph({ spacing: { before: 200 }, children: [] }),
  new TableOfContents('Índice de tablas', { hyperlink: true, stylesWithLevels: [new d.StyleLevel('TabCaption', 1)] }),
];

// 1. Introducción
c.push(H1('1. Introducción', true));
c.push(P('Un sistema de información no se justifica por la tecnología que usa, sino por el proceso de negocio que ordena. En Black Hawk ese proceso no es la venta en línea: es conseguir que una persona encuentre el producto correcto, entienda sus características y llegue a quien puede vendérselo. Hoy ese recorrido empieza en la web y termina en una conversación de WhatsApp.'));
c.push(P('Este trabajo toma ese recorrido como punto de partida y aplica RUP para convertirlo en un sistema especificado, modelado y planificado. El orden del documento sigue la lógica de una primera propuesta: primero se presenta la empresa y su necesidad; después, el sistema que se propone; y finalmente, cómo se aplicará RUP para desarrollarlo. En todo el texto se distingue lo que ya existe en la web de Black Hawk de lo que se propone como parte del proyecto académico.'));

// 2. Empresa
c.push(H1('2. Presentación de la empresa', false));
c.push(P('Black Hawk es una marca de audio automotriz orientada al mercado peruano. Su catálogo incluye amplificadores, subwoofers, medios, tweeters, drivers, procesadores, ecualizadores, componentes y cargadores. Según el sitemap de su web renovada, consultada el 29-09-2026, la marca publica 118 productos organizados en 12 categorías; el sitio oficial vigente lista 110. La marca se presenta como una empresa con alrededor de una década en el sector; esa afirmación proviene de su propio sitio y no se verificó de forma independiente.'));
c.push(P('Su público está formado por quienes equipan su vehículo y por los negocios que venden la marca: la web incluye una página para mayoristas donde tiendas y distribuidores pueden solicitar incorporarse a la red. El modelo comercial es el rasgo que más condiciona el diseño: la web no muestra precios ni tiene carrito de compras. Su función es mostrar el catálogo y orientar la consulta, y la venta se concreta después, con el área comercial o con un distribuidor.'));
c.push(...tab('Modelos de referencia del caso y su verificación', ['Modelo', 'Tipo', 'Dónde se verificó'], V.PRODUCTOS_V2, [22, 40, 38], `${EV} Los nombres se escriben como aparecen en la web. No se transcriben especificaciones técnicas.`));

// 3. Situación problemática
c.push(H1('3. Situación problemática', false));
c.push(H2('3.1 Cómo funciona actualmente'));
c.push(P('El cliente llega al catálogo, busca un modelo o explora una categoría, revisa la ficha técnica y, si lo necesita, compara hasta tres modelos. Cuando decide consultar, pulsa «Cotizar»: la web abre WhatsApp con un mensaje que ya incluye el modelo, por ejemplo «Hola Black Hawk, vengo de la web y quiero cotizar el modelo BH-FR1500.1». A partir de ahí, la conversación y la venta ocurren fuera de la web.'));
c.push(...fig('img/v2-ficha-fr1500.png', 'Ficha de producto de la web renovada con el botón «Cotizar»', `_Nota._ Captura de la ${V.WEB}, ficha BH-FR1500.1, 1440 × 900 px.`, 15, 9));
c.push(P('La tabla siguiente separa lo que ya existe en la web renovada de lo que se propone en este proyecto. Esta distinción se mantiene en todos los entregables.'));
c.push(...tab('Funcionalidades existentes frente a las propuestas', ['Ya existe en la web renovada', 'Se propone en el SGCD-BH'], V.EXISTE_HOY.map((e, i) => [e, V.PROPUESTO[i] || '']), [50, 50], EV));
c.push(H2('3.2 Problema y necesidades'));
c.push(P(`**Problema.** ${V.PROBLEMA}`));
c.push(P('El problema se descompone en tres necesidades. La tabla indica, para cada una, la causa, su consecuencia y si se basa en una observación de la web o en un supuesto académico. No se presentan como fallas de gestión de la empresa: son limitaciones de la plataforma frente al proceso comercial descrito.'));
c.push(...tab('Necesidades identificadas', ['Necesidad', 'Causa', 'Consecuencia', 'Base'], V.NECESIDADES_V2.map((n) => [n.t, n.causa, n.efecto, n.base]), [18, 40, 26, 16], EV));
c.push(P('Conviene precisar el alcance de la primera necesidad. La web renovada muestra especificaciones en sus 118 fichas, con la leyenda «Especificaciones técnicas verificadas por Black Hawk». La propuesta no corrige datos incorrectos, sino la forma de mantenerlos: hoy son texto dentro de cada ficha, y seis de ellas los presentan en párrafos y no en lista. Guardarlos como datos estructurados, con fuente y estado, facilita compararlos y actualizarlos.'));

// 4. Justificación
c.push(H1('4. Justificación', false));
c.push(P('**Justificación técnica.** La plataforma actual ya resuelve la publicación del catálogo. El proyecto no la reemplaza: agrega lo que falta en un módulo propio, de modo que las actualizaciones de WordPress, WooCommerce y el tema no borren las personalizaciones.'));
c.push(P('**Justificación operativa.** El área comercial ya atiende por WhatsApp. El sistema no le cambia el canal: le entrega la consulta con el producto identificado y un registro para darle seguimiento.'));
c.push(P('**Justificación económica.** Se reutilizan la plataforma y el contenido existentes, y las ampliaciones no requieren licencias nuevas obligatorias. El costo principal es el esfuerzo de desarrollo, estimado en los anexos con fines académicos.'));
c.push(P('**Justificación académica.** El caso permite aplicar RUP de forma completa con un alcance acotado: actores reales, un sistema externo (WhatsApp), reglas de negocio claras y decisiones de arquitectura que se pueden defender.'));

// 5. Objetivos
c.push(H1('5. Objetivos', false));
c.push(H2('5.1 Objetivo general'));
c.push(P(V.OBJ_GENERAL));
c.push(H2('5.2 Objetivos específicos'));
c.push(...numbered(V.OBJ_ESP));

// 6. Alcance
c.push(H1('6. Alcance', false));
c.push(P('El alcance se agrupa en cuatro áreas funcionales. Se incluye todo lo que sirve al recorrido «encontrar → evaluar → consultar» y a su administración; se excluye lo que supondría un proceso de venta en línea que la empresa no tiene.'));
c.push(...tab('Alcance funcional del SGCD-BH', ['Área', 'Qué incluye'], V.GRUPOS, [22, 78], OWN));
c.push(P(`**Exclusiones.** ${V.EXCLUSIONES.join('; ')}. Estas exclusiones se fijan al cerrar la fase de Inicio para evitar que el alcance crezca hacia un comercio electrónico o un ERP.`));
c.push(P('**Limitaciones.** No se dispone de datos de ventas, tráfico ni conversiones, por lo que no se proyectan resultados comerciales. La web renovada es una versión de prueba publicada en una dirección temporal. Las especificaciones técnicas de los productos no se verificaron con documentación del fabricante.'));

// 7. Sistema propuesto
c.push(H1('7. Sistema propuesto', false));
c.push(P('El SGCD-BH es un sistema web que ordena la información de los productos, lleva al comprador hasta un distribuidor y registra cada consulta para darle seguimiento. Se construye sobre la web actual: WordPress como gestor de contenidos, WooCommerce como motor de catálogo, YITH Catalog Mode para ocultar precio, carrito y pago, y un módulo propio para las funciones nuevas.'));
c.push(...tab('Usuarios del sistema', ['Usuario', 'Qué hará en el sistema'], V.USUARIOS, [28, 72], OWN));
c.push(P('El recorrido propuesto mantiene el flujo que el cliente ya conoce y agrega dos pasos invisibles para él: antes de abrir WhatsApp, el sistema registra la consulta; y después, el gestor actualiza su estado (atendida, derivada o cerrada). La figura siguiente muestra el recorrido como diagrama de actividades.'));
c.push(...fig(DG + 'S03_flujo_propuesto.png', 'Recorrido propuesto del cliente (diagrama de actividades simplificado)', `${OWN} Versión completa: diagrama D-16 de los anexos.`, 14, 11));

// 8. Marco conceptual de RUP
c.push(H1('8. Marco conceptual de RUP', false));
c.push(P('RUP es un proceso de ingeniería de software derivado del Proceso Unificado de Jacobson, Booch y Rumbaugh (1999). Define quién hace qué, cómo y cuándo, y organiza el trabajo en fases e iteraciones con entregables y puntos de control (Kruchten, 2004). Tres características lo distinguen:'));
c.push(...bullets(V.RUP_CARAC.map(([a, b]) => `**${a}.** ${b}`)));
c.push(P('El ciclo de vida se divide en cuatro fases, cada una cerrada por un hito de decisión: Inicio (LCO, objetivos del ciclo de vida), Elaboración (LCA, arquitectura del ciclo de vida), Construcción (IOC, capacidad operativa inicial) y Transición (PR, liberación del producto). En cada fase se trabajan varias disciplinas a la vez (modelado del negocio, requisitos, análisis y diseño, implementación, pruebas y despliegue, además de las de soporte), cambiando solo su intensidad. Por eso RUP no es una cascada: en Elaboración ya se programa un prototipo y en Construcción se siguen refinando requisitos (Kroll & Kruchten, 2003).'));
c.push(P('Conviene distinguir tres términos que suelen confundirse. **RUP es la metodología**: dice qué hacer y cuándo. **UML es el lenguaje de modelado**: un estándar del Object Management Group (2017) que define la notación de los diagramas. **Rational Rose es una herramienta**: un programa CASE que permite construir y documentar modelos UML (Quatrani, 2002). WordPress y WooCommerce son la base tecnológica del sistema, y WhatsApp es un canal externo de comunicación.'));

// 9. Aplicación de las cuatro fases
c.push(H1('9. Aplicación de las cuatro fases', false));
c.push(P('La tabla siguiente resume cómo se aplica cada fase al caso. Las semanas corresponden a una estimación académica de 14 semanas; cada fase contiene una o más iteraciones (una en Inicio, dos en Elaboración, tres en Construcción y una en Transición).'));
c.push(...tab('Fases de RUP aplicadas a Black Hawk', ['Fase', 'Qué se hará', 'Qué se entregará', 'En Black Hawk', 'Hito'], V.FASES_V2.map((f) => [`${f.n}\n${f.sem}`, f.haremos, f.entregas, f.bh, `${f.hito}: ${f.hitoN}`]), [15, 22, 25, 22, 16], `${OWN} Semanas estimadas con fines académicos.`));
c.push(H2('9.1 Inicio'));
c.push(P('El objetivo del Inicio es acordar qué problema se resuelve y si conviene hacerlo. En este proyecto se analizó el proceso comercial, se identificaron los actores y las necesidades, se fijaron el alcance y las exclusiones, y se evaluó la viabilidad técnica, operativa y económica. La fase se cierra con el hito LCO cuando los interesados aceptan la visión y el alcance.'));
c.push(H2('9.2 Elaboración'));
c.push(P('La Elaboración estabiliza los requisitos y valida la arquitectura antes de construir. Se especificaron los requisitos y los casos de uso, se elaboraron los modelos UML y se diseñó la arquitectura. Su rasgo distintivo es el prototipo arquitectónico: en lugar de solo dibujar, se prueba el flujo más riesgoso. En este caso, que el registro de la consulta no retrase la apertura de WhatsApp. El hito LCA exige la arquitectura probada y la mayoría de los casos de uso especificados.'));
c.push(H2('9.3 Construcción'));
c.push(P('La Construcción desarrolla el sistema por incrementos, ordenados por valor y riesgo: primero el catálogo y las fichas, después el comparador, la consulta y su registro, y al final los distribuidores, los reportes, los roles y la auditoría. Cada incremento se integra y se prueba antes de seguir. El hito IOC exige los casos de uso de prioridad alta implementados y ninguna incidencia crítica abierta.'));
c.push(H2('9.4 Transición'));
c.push(P('La Transición pone el sistema en manos de los usuarios: pruebas de aceptación, capacitación del gestor y del administrador, carga de los distribuidores validados, despliegue con respaldo previo y plan de reversión. El hito PR se alcanza con la conformidad de Black Hawk. Para que esa decisión no sea subjetiva, se fijan criterios de salida medibles, detallados en los anexos.'));
c.push(P('**Alcance de esta entrega.** Este trabajo desarrolla los artefactos de Inicio y Elaboración (análisis y diseño). La Construcción y la Transición se describen como plan: no se afirma que el sistema propuesto esté implementado ni probado.'));

// 10. Requisitos principales
c.push(H1('10. Requisitos principales', false));
c.push(P('Un requisito funcional describe lo que el sistema debe hacer; uno no funcional, cómo debe hacerlo (su calidad). El catálogo completo tiene 27 requisitos funcionales y 13 no funcionales, cada uno con prioridad, actor, caso de uso, criterio de aceptación y estado; aquí se presentan los más representativos.'));
c.push(...tab('Requisitos funcionales representativos', ['Requisito', 'Estado', 'Códigos en el catálogo'], V.REQ_F, [56, 16, 28], OWN));
c.push(...tab('Requisitos no funcionales representativos', ['Característica', 'Requisito', 'Código'], V.REQ_NF, [20, 62, 18], `${OWN} Características de calidad según ISO/IEC 25010 (International Organization for Standardization, 2011).`));
c.push(P('Cada requisito tiene un criterio de aceptación verificable. Por ejemplo, el registro de la consulta (RF-014) se acepta si cada clic en «Cotizar» crea un registro con estado REGISTRADA y WhatsApp se abre sin demora perceptible. Los requisitos se validan con el área comercial al cierre de cada iteración de Elaboración y mediante la trazabilidad: cada requisito debe tener un caso de uso y al menos un caso de prueba.'));

// 11. Modelado UML
c.push(H1('11. Modelado UML', false));
c.push(P('Los diagramas permiten ver el sistema antes de construirlo y comunicarlo sin ambigüedad. Del conjunto de 22 diagramas elaborados se presentan tres vistas simplificadas que responden a las preguntas esenciales: quién usa el sistema y qué puede hacer (casos de uso), cómo se relacionan sus datos (clases) y cómo funciona el proceso principal (actividades, en la sección 7). Los diagramas completos están en los anexos y se prepararon para reconstruirse en Rational Rose.'));
c.push(H2('11.1 Casos de uso'));
c.push(P('Un actor es un rol que interactúa con el sistema, no una persona concreta. El diagrama muestra cuatro actores: el cliente, el distribuidor, el gestor o administrador, y WhatsApp como sistema externo. La relación «include» indica que enviar una consulta incluye siempre registrarla. Los casos en morado son propuestos.'));
c.push(...fig(DG + 'S01_cu_simplificado.png', 'Casos de uso principales del SGCD-BH', `${OWN} Versión completa con 22 casos de uso: diagrama D-02.`, 12, 13));
c.push(H2('11.2 Clases'));
c.push(P('El diagrama de clases muestra la estructura de la información. Un producto pertenece a una o más categorías y se describe con especificaciones técnicas; la relación es de composición porque una especificación no existe sin su producto. Una consulta comercial puede referirse a un producto (hay consultas generales), ser atendida por un usuario y derivarse a un distribuidor.'));
c.push(...fig(DG + 'S02_clases_simplificado.png', 'Clases principales del SGCD-BH', `${OWN} Modelo de dominio completo (12 clases): D-07; clases de diseño: D-09 y D-10.`, 11, 8));

// 12. Arquitectura
c.push(H1('12. Arquitectura general', false));
c.push(P('La solución se organiza en capas. La interfaz web comprende el sitio público y el panel de administración. La lógica del sistema combina WooCommerce, que gestiona el catálogo; YITH Catalog Mode, que oculta precio, carrito y pago; y el módulo propio, que agrega las consultas, los distribuidores y los reportes. Los datos se guardan en una base MySQL o MariaDB, y WhatsApp actúa como canal externo: el sistema solo genera el enlace de clic para chatear (wa.me).'));
c.push(...fig(DG + 'S04_arquitectura_general.png', 'Arquitectura general del SGCD-BH', `${OWN} Arquitectura detallada: diagramas D-19, D-20 y D-22.`, 14, 9));
c.push(P('Tres decisiones sostienen esta arquitectura. Primero, se mantiene WordPress y WooCommerce en lugar de reescribir, porque el valor del proyecto no está en cambiar de tecnología. Segundo, todo lo nuevo se ubica en un módulo propio y en el tema hijo, para que las actualizaciones no lo borren. Tercero, la integración con WhatsApp usa enlaces públicos y no la API de pago: el sistema registra la consulta antes de abrir el chat, pero no lee la conversación, por lo que el seguimiento posterior es manual.'));

// 13. Planificación
c.push(H1('13. Planificación', false));
c.push(P('El plan de desarrollo se estima en 14 semanas académicas, con los hitos al cierre de cada fase: LCO en la semana 2, LCA en la 6, IOC en la 12 y PR en la 14. Las pruebas de integración se solapan con la construcción, porque en RUP la verificación es continua. La estimación de esfuerzo y el presupuesto referencial figuran en los anexos y se basan en supuestos académicos, no en costos reales de la empresa.'));
c.push(...fig(DG + 'G02_gantt.png', 'Cronograma general del proyecto', `${OWN} Estimación académica.`, 16, 8));
const top = [...M.RIESGOS].sort((a, b) => b.p * b.i - a.p * a.i).slice(0, 5);
c.push(P('Los riesgos se evaluaron por probabilidad e impacto. La tabla siguiente muestra los cinco de mayor exposición; el registro completo, con doce riesgos, está en los anexos.'));
c.push(...tab('Riesgos principales y su mitigación', ['Riesgo', 'P × I', 'Mitigación'], top.map((r) => [r.n, r.p * r.i, r.m]), [34, 10, 56], `${OWN} Probabilidad e impacto en escala de 1 a 5.`));

// 14. Resultados esperados
c.push(H1('14. Resultados esperados', false));
c.push(P('Se distinguen tres tipos de resultado para no presentar como logro lo que todavía es propuesta.'));
c.push(...tab('Resultados del proyecto', ['Ya realizado (análisis y diseño)', 'Se propone implementar', 'Se espera conseguir'], V.RESULTADOS.realizado.map((r, i) => [r, V.RESULTADOS.propuesto[i], V.RESULTADOS.esperado[i]]), [33, 33, 34], OWN));
c.push(P('Los beneficios esperados son hipótesis que el sistema permitiría medir después de implementarse, por ejemplo con el porcentaje de consultas registradas con el producto identificado o la cantidad de consultas por producto y por mes. No se proyectan ventas ni tráfico, porque la venta ocurre fuera del sistema y no se dispone de esos datos.'));

// 15. Conclusiones
c.push(H1('15. Conclusiones', false));
c.push(...numbered(V.CONCLUSIONES.map(([k, t]) => `**${k}.** ${t}`)));
c.push(P(V.CIERRE));

// Referencias
c.push(H1('Referencias'));
const REFS = M.REFERENCIAS.filter((r) => /Jacobson|Kruchten, P\. \(2004\)|Kroll|Object Management|Quatrani|Sommerville|Pressman|International Organization for Standardization. \(2011\)|Congreso|Booch/.test(r));
[...REFS, `Black Hawk Car Audio. (s. f.). Sitio web oficial [Sitio web]. Recuperado el ${V.FECHA}, de https://www.blackhawkcaraudio.com/`, `Black Hawk Car Audio. (2026). Web renovada, versión de prueba [Sitio web en entorno temporal]. Recuperado el ${V.FECHA}.`, 'YITH. (s. f.). YITH WooCommerce Catalog Mode [Plugin de WordPress]. Recuperado el 29 de septiembre de 2026, de https://wordpress.org/plugins/yith-woocommerce-catalog-mode/']
  .sort((a, b) => a.localeCompare(b, 'es')).forEach((r) => c.push(new Paragraph({ children: L.runs(r), indent: { left: 720, hanging: 720 }, spacing: { after: 120, line: 300 } })));

// Anexos
c.push(H1('Anexos'));
c.push(H2('Anexo A. Catálogo resumido de requisitos funcionales'));
c.push(...tab('Requisitos funcionales', ['Código', 'Requisito', 'Prioridad', 'Estado'], M.RF.map((r) => [r.id, r.n, r.p, M.ESTADOS[r.e].replace(' (alcance académico)', '').replace('Existente en la plataforma base', 'Nativo de la plataforma')]), [12, 54, 12, 22], `${OWN} Descripción y criterios de aceptación: BLACK_HAWK_RUP_ANEXOS_V2.xlsx, hoja «RF».`, { size: 16 }));
c.push(H2('Anexo B. Inventario de casos de uso'));
c.push(...tab('Casos de uso del SGCD-BH', ['Código', 'Caso de uso', 'Actor'], M.CU.map((x) => [x.id, x.n, x.a]), [12, 48, 40], `${OWN} Especificaciones detalladas: documentación técnica de respaldo.`, { size: 16 }));
c.push(H2('Anexo C. Documentación técnica de respaldo'));
c.push(P('La profundidad técnica del proyecto se conserva en los siguientes archivos, organizados para responder preguntas del docente y desarrollar las siguientes entregas:'));
c.push(...bullets([
  '**BLACK_HAWK_RUP_ANEXOS_V2.xlsx:** requisitos completos, casos de uso, trazabilidad, plan de pruebas, riesgos, cronograma, esfuerzo, diccionario de datos y glosario, con un índice por niveles.',
  '**BLACK_HAWK_RUP_MONOGRAFIA.docx (versión 1):** documentación técnica completa: especificaciones de casos de uso, arquitectura detallada, seguridad, modelo de datos y planificación por iteraciones.',
  '**DIAGRAMAS_UML/:** los 22 diagramas UML completos y las vistas simplificadas S-01 a S-04, en PNG, SVG y PlantUML editable, con la guía para reconstruirlos en Rational Rose.',
]));

const header = new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'SGCD-BH · Aplicación de RUP — Black Hawk', size: 16, color: L.MUTED })] })] });
const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: L.MUTED })] })] });
const page = { size: { width: 11906, height: 16838 }, margin: { top: 1418, bottom: 1418, left: 1418, right: 1418 } };
const doc = new Document({
  creator: 'Equipo del proyecto SGCD-BH', title: 'Monografía V2 — Aplicación de RUP a Black Hawk', features: { updateFields: true },
  styles: L.baseStyles, numbering: L.numbering,
  sections: [
    { properties: { page }, children: cover },
    { properties: { page }, headers: { default: header }, footers: { default: footer }, children: prelim },
    { properties: { page }, headers: { default: header }, footers: { default: footer }, children: c },
  ],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync('../BLACK_HAWK_RUP_MONOGRAFIA_V2.docx', b); console.log('ok'); });
