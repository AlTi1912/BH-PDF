// Genera BLACK_HAWK_RUP_GUIA_EXPOSICION.docx a partir de slides_meta.json (diapositivas definitivas).
const fs = require('fs');
const M = require('./model');
const L = require('./docxlib');
const S = require('./slides_meta.json');
const { d, P, H1, H2, H3, bullets, numbered, table, caption, note } = L;
const { Document, Packer, Paragraph, TextRun, AlignmentType, Header, Footer, PageNumber, TableOfContents } = d;

const fmt = (sec) => (sec >= 60 ? `${Math.floor(sec / 60)} min ${sec % 60 ? (sec % 60) + ' s' : ''}`.trim() : `${sec} s`);
const total = S.reduce((a, b) => a + b.t, 0);
const CORTAS = { 10: 20, 13: 30, 15: 30, 17: 35, 23: 30, 27: 30, 34: 30, 35: 30, 36: 30, 37: 35, 41: 35, 43: 25, 44: 10 };
const totalCorto = S.reduce((a, b) => a + (CORTAS[b.n] ?? Math.round(b.t * 0.8)), 0);
const c = [];

// Portada
c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1800, after: 200 }, children: [new TextRun({ text: 'GUÍA DE EXPOSICIÓN', bold: true, size: 40 })] }));
c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: M.SISTEMA.titulo, size: 26 })] }));
c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 1200 }, children: [new TextRun({ text: `${M.SISTEMA.sigla} · Curso: ${M.SISTEMA.curso}`, italics: true, size: 22, color: L.PURPLE })] }));
c.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Corresponde a BLACK_HAWK_RUP_PRESENTACION.pptx (${S.length} diapositivas)`, size: 20, color: L.MUTED })] }));
c.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 }, children: [new TextRun({ text: 'Equipo: [integrantes] · Docente: [nombre] · 2026', size: 20, color: L.MUTED })] }));
c.push(H1('Contenido'));
c.push(new TableOfContents('Contenido', { hyperlink: true, headingStyleRange: '1-1' }));

// 1
c.push(H1('1. Introducción a la exposición'));
c.push(P('Esta guía no es la monografía resumida. Sirve para que cualquier integrante entienda el proyecto y pueda defenderlo oralmente. Úsala en tres pasadas: primero lee el guion completo con la presentación abierta; después practica en voz alta con el cronómetro; y al final repasa las preguntas de defensa sin mirar las respuestas.'));
c.push(P(`**Duración.** La versión completa dura unos ${Math.round(total / 60)} minutos (${S.length} diapositivas). Si el docente da entre 25 y 30 minutos, usa la versión corta (unos ${Math.round(totalCorto / 60)} minutos): la sección 3 indica el tiempo de cada diapositiva en ambas versiones. En la versión corta no se omite ninguna diapositiva, pero las de apoyo se presentan en una o dos frases.`));
c.push(P('**Reparto sugerido para 5 integrantes** (un bloque por persona, así cada uno domina un tema):'));
c.push(table(['Integrante', 'Bloque', 'Diapositivas'], [
  ['Integrante 1', '01 · El caso Black Hawk', '1–8'], ['Integrante 2', '02 · Metodología RUP', '9–13'], ['Integrante 3', '03 · Aplicación: Inicio y Elaboración', '14–21'],
  ['Integrante 4', '03 · Aplicación: Construcción y Transición', '22–27'], ['Integrante 5', '04 · Modelado UML', '28–37'], ['Integrante 1 o 2', '05 · Gestión y resultados', '38–45'],
], [25, 50, 25]));
c.push(P('**Regla de oro.** Cuando algo sea una propuesta, dilo: «esto lo proponemos nosotros». Cuando algo exista, di de dónde lo sabes: «lo vimos en la evidencia del rediseño». Esa distinción es la que más protege al equipo frente a las preguntas.', { before: 200 }));

// 2
c.push(H1('2. Discurso de apertura'));
c.push(P('_(Unos 40 segundos, en tono natural, mirando al docente y no a la pantalla.)_'));
c.push(P('«Buenos días. Somos [nombres] y vamos a presentar cómo aplicamos la metodología RUP a un caso real: Black Hawk Car Audio, una marca peruana de audio para autos. Black Hawk tiene una web que funciona como catálogo: no vende en línea, conecta al comprador con el área comercial o un distribuidor por WhatsApp. Nuestro trabajo fue analizar ese proceso, identificar qué le falta y diseñar un sistema, el SGCD-BH, siguiendo las cuatro fases de RUP y modelándolo en UML. Vamos a mostrar el caso, la metodología, cómo la aplicamos fase por fase, los diagramas y, al final, la planificación y nuestras conclusiones. Algo que vamos a repetir varias veces: separamos lo que ya existe de lo que proponemos.»'));

// 3
c.push(H1('3. Guion por diapositiva'));
c.push(P('Cada ficha indica el objetivo de la diapositiva, qué decir (explicación oral, redactada para decirla y no para leerla), los conceptos clave, el tiempo en la versión completa y en la corta, y la frase de transición. El mismo texto está en las notas del orador del PowerPoint.'));
S.forEach((s) => {
  c.push(H2(`Diapositiva ${s.n}. ${s.title}`));
  c.push(table(['Campo', 'Contenido'], [
    ['Título en pantalla', s.visible || s.title],
    ['Objetivo', s.obj],
    ['Explicación oral', s.oral],
    ['Conceptos clave', s.conceptos.length ? s.conceptos.join(' · ') : '—'],
    ['Tiempo', `${fmt(s.t)} (versión corta: ${fmt(CORTAS[s.n] ?? Math.round(s.t * 0.8))})`],
    ['Transición', s.trans],
  ], [20, 80], { size: 18, firstColShade: true }));
});

// 4
c.push(H1('4. Conceptos que deben memorizarse'));
c.push(P('Estos conceptos se dicen con precisión. Si te equivocas en uno, el docente lo notará.'));
c.push(table(['Concepto', 'Definición exacta'], [
  ['RUP', 'Proceso de ingeniería de software iterativo e incremental, dirigido por casos de uso y centrado en la arquitectura.'],
  ['Las 4 fases', 'Inicio, Elaboración, Construcción y Transición.'],
  ['Los 4 hitos', 'LCO (Lifecycle Objectives), LCA (Lifecycle Architecture), IOC (Initial Operational Capability) y PR (Product Release).'],
  ['Las 9 disciplinas', 'Ingeniería: modelado del negocio, requisitos, análisis y diseño, implementación, pruebas, despliegue. Soporte: gestión de configuración y cambios, gestión del proyecto, entorno.'],
  ['Las 6 buenas prácticas', 'Desarrollo iterativo, gestión de requisitos, arquitectura de componentes, modelado visual, verificación continua de la calidad y control de cambios.'],
  ['UML frente a Rational Rose', 'UML es el lenguaje (estándar del OMG); Rational Rose es una herramienta CASE que lo implementa.'],
  ['Actor', 'Rol que desempeña una persona o sistema externo frente al sistema. No es una persona concreta.'],
  ['«include» / «extend»', '«include»: siempre ocurre (CU-08 incluye CU-09). «extend»: opcional, bajo una condición (CU-03 extiende CU-01).'],
  ['Artefacto', 'Producto de trabajo: documento, modelo, código o ejecutable.'],
  ['Iteración', 'Mini proyecto con plan propio que termina en un incremento ejecutable.'],
  ['Cifras del proyecto', `${M.RF.length} RF, ${M.RNF.length} RNF, ${M.CU.length} CU, 6 actores, ${M.DIAGRAMAS.length} diagramas UML, ${Object.keys(M.DICCIONARIO).length} tablas, ${M.CP.length} casos de prueba, ${M.RIESGOS.length} riesgos, 7 iteraciones, 14 semanas.`],
], [25, 75]));

// 5
c.push(H1('5. Qué puede explicarse con palabras propias'));
c.push(...bullets([
  'El contexto de Black Hawk y por qué la web es un catálogo y no una tienda.',
  'El problema: puedes usar un ejemplo propio («si un cliente pregunta por WhatsApp sin decir el modelo…»).',
  'Por qué ordenamos los incrementos C1, C2 y C3 así (primero la base del catálogo, luego el flujo comercial y al final la administración).',
  'Los beneficios esperados, siempre como hipótesis y con su indicador.',
  'La lectura de un diagrama: no memorices, recorre el diagrama con el dedo o el puntero en el orden de la sección 6.',
]));
c.push(P('Lo que **no** debe improvisarse: cifras, nombres de modelos (se dicen exactamente: «BH-4.8DSP», «FR 1500.1»), siglas de hitos y la distinción entre lo existente y lo propuesto.'));

// 6
c.push(H1('6. Cómo explicar cada diagrama UML'));
c.push(P('Usa siempre el mismo orden: (1) qué tipo de diagrama es y qué muestra, (2) dónde empezar a leer, (3) el detalle que demuestra que es de Black Hawk y no genérico.'));
c.push(table(['Diagrama', 'Qué muestra', 'Cómo leerlo en voz alta', 'Detalle «Black Hawk»'], [
  ['D-01 CU del negocio', 'Procesos de la organización que dan valor a los actores del negocio.', 'Empieza por los dos actores; luego recorre los cinco procesos.', 'La venta ocurre fuera de la web; «Derivar» extiende «Atender consulta».'],
  ['D-02 CU general', 'Todo lo que el sistema hace, por actor.', 'Izquierda: actores externos. Derecha: roles internos. Luego las dos relaciones entre CU.', 'CU-08 «include» CU-09: cada clic en «Cotizar» se registra.'],
  ['D-07 Dominio', 'Conceptos del negocio y sus relaciones.', 'Empieza por Producto; sigue las multiplicidades en voz alta.', 'Comparación 2..3 productos (regla del comparador).'],
  ['D-09 / D-10 Clases de diseño', 'Clases con tipos, visibilidad, operaciones y enumeraciones.', 'Paquete por paquete; menciona una operación clave.', 'ConsultaComercial: atender(), derivar(), cerrar().'],
  ['D-11 Objetos', 'Una foto del sistema en un instante.', 'Recorre de la comparación a la consulta.', 'FR 1500.1 frente a FR 2000.1; «Potencia RMS» PENDIENTE (no se inventa).'],
  ['D-12 a D-15 Secuencia', 'Mensajes entre objetos en el tiempo.', 'De arriba abajo, por número de mensaje; explica cada fragmento opt/alt/loop.', 'Mensaje 12 de D-14 asíncrono: WhatsApp no espera al registro.'],
  ['D-16 / D-17 Actividades', 'Flujo de trabajo con decisiones y calles.', 'Sigue el flujo desde el punto negro; nombra cada calle.', 'El sistema interviene solo al registrar, generar el mensaje y cerrar.'],
  ['D-18 Estados', 'Ciclo de vida de ConsultaComercial.', 'Del estado inicial a los finales; menciona la regla y el evento after.', 'No se cierra sin atender; descarte a los 30 días.'],
  ['D-19 Componentes', 'Piezas de software y dependencias.', 'Primero lo existente; luego bh-core en morado.', 'YITH oculta precio, carrito y checkout.'],
  ['D-20 Despliegue', 'Nodos físicos y protocolos.', 'Del dispositivo del visitante al servidor y a los respaldos.', 'LiteSpeed observado en el sitio oficial; versión de PHP por confirmar.'],
  ['D-21 Entidad-relación', 'Tablas, claves y cardinalidades.', 'Empieza por producto; muestra una tabla intermedia.', 'Solo 3 tablas propias: consulta, comparación y auditoría.'],
  ['D-22 Capas', 'Arquitectura lógica.', 'De arriba abajo: presentación, servicios, datos, infraestructura.', 'La presentación nunca accede directamente a la base de datos.'],
], [16, 24, 32, 28], { size: 16 }));

// 7
c.push(H1('7. Cómo explicar las cuatro fases de RUP'));
c.push(P('Fórmula para cada fase: **objetivo → qué produjimos → cuándo termina (hito)**. No digas «primero analizamos, luego diseñamos, luego programamos»: eso es cascada. Di «en cada fase cambia el énfasis».'));
M.FASES.forEach((f) => c.push(P(`**${f.n}** (S${f.sem[0]}–S${f.sem[1]}, ${f.it.join(', ')}). ${f.obj} Produjimos: ${f.art.slice(0, 4).join(', ').toLowerCase()}. Termina en el hito **${f.hito.split(' — ')[0]}** cuando: ${f.crit[0].toLowerCase()}.`)));
c.push(P('**Frase clave:** «En Elaboración ya programamos algo: el prototipo arquitectónico. Y en Construcción seguimos refinando requisitos. Por eso RUP es iterativo y no una cascada.»'));

// 8
c.push(H1('8. Cómo relacionar el proyecto con Black Hawk'));
c.push(...bullets([
  'Cita siempre un modelo real al explicar una regla: «si un gestor carga el BH-4.8DSP y no tiene la fuente de un dato, se publica como pendiente».',
  'El comparador existe en el rediseño con un límite de 3; nuestro diseño respeta esa regla (RN-04) y no la inventa.',
  'El botón «Cotizar» ya abre WhatsApp con el modelo; lo nuevo es la URL y el registro.',
  '«Dónde comprar» existe, pero hoy deriva a WhatsApp; el directorio es propuesta.',
  'La categoría Cargadores (2 productos) existe en el rediseño y no en el sitio oficial. BH-70CHR y BH-200CHR se citan como cargadores, pero su ficha no figura en la evidencia: dilo así si preguntan.',
]));

// 9
c.push(H1('9. Cómo justificar las decisiones de arquitectura'));
c.push(table(['Decisión', 'Justificación para decir en voz alta'], M.DECISIONES.map(([id, dd, j]) => [`${id} ${dd}`, j]), [30, 70]));
c.push(P('Si preguntan «¿por qué no una aplicación a medida en Laravel, Django o Node?»: «Porque el problema no es técnico. La plataforma ya publica 118 productos y el equipo sabe usarla. Reescribir costaría más, tomaría más tiempo y no resolvería el dato ni la trazabilidad, que son el problema real.»', { before: 160 }));

// 10
c.push(H1('10. Cómo explicar la trazabilidad'));
c.push(P('Usa siempre la misma cadena como ejemplo y dila de izquierda a derecha:'));
c.push(P('**NB-06** (trazabilidad de consultas) → **RF-014** (registrar consulta) → **CU-09** (registrar consulta comercial) → **COMP-06** (consultas WhatsApp) → **CP-014** (registro previo a la redirección).'));
c.push(P('Luego explica para qué sirve: «si el cliente cambia RF-014, por ejemplo, porque quiere guardar también la ciudad, la matriz nos dice qué caso de uso, qué componente y qué prueba revisar. Eso es análisis de impacto».'));

// 11
c.push(H1('11. Cómo explicar el cronograma'));
c.push(...bullets([
  '14 semanas, 7 iteraciones de 2 semanas.',
  'Cada hito cae al final de una fase: LCO en S2, LCA en S6, IOC en S12 y PR en S14.',
  'Las pruebas de integración empiezan en S8 y se solapan con la construcción: las pruebas son continuas.',
  `Esfuerzo: ${M.ESFUERZO.reduce((a, b) => a + b.h, 0)} horas-persona (5 personas × 14 semanas × 8 h). El presupuesto usa una tarifa hipotética de S/ ${M.TARIFA_REF} por hora: es un ejercicio académico, no un costo real.`,
  'Distribución: Inicio 7 %, Elaboración 25 %, Construcción 54 %, Transición 14 %. Es similar a la distribución típica de RUP, con una Transición algo mayor por la capacitación y la aceptación.',
]));

// 12
c.push(H1('12. Cómo defender el alcance'));
c.push(P('El ataque más común será «¿por qué no agregaron carrito y pagos?» o «esto es muy simple». Respuesta: «Porque el modelo de negocio de Black Hawk no vende en línea: deriva a distribuidores. Agregar checkout sería construir una función sin proceso de negocio detrás, y además competiría con sus propios distribuidores. Lo difícil del caso no es vender, es que el dato sea confiable y que la derivación sea medible. Por eso el alcance incluye la verificación de especificaciones, el registro de consultas y la auditoría».'));
c.push(P('Si dicen que es muy grande para un curso: «Por eso distinguimos lo que existe de lo que proponemos. No afirmamos haber implementado todo: entregamos el análisis, el diseño y la planificación completos, que es lo que pide RUP hasta el hito LCA, más el plan de construcción y transición».'));

// 13
c.push(H1('13. Conclusión oral'));
c.push(P('_(Unos 45 segundos. Es lo último que recordará el docente.)_'));
c.push(P('«Para cerrar: RUP nos obligó a hacernos las preguntas correctas antes de programar. Descubrimos que el problema de Black Hawk no es tener una web, sino que el dato del producto sea confiable y que la consulta que llega por WhatsApp sea medible. Con 22 casos de uso, una arquitectura que extiende lo que ya existe y una matriz de trazabilidad que une todos los entregables, dejamos un sistema listo para construirse por incrementos. Y fuimos honestos: lo que proponemos está diseñado y especificado, no implementado. Muchas gracias.»'));

// 14–15
c.push(H1('14. Preguntas del profesor y respuestas'));
c.push(P('Respuesta breve: lo que dices primero, en 10 a 15 segundos. Respuesta ampliada: si el docente repregunta o si la pregunta es clave (marcadas con ★).'));
const Q = [
  ['★ ¿Por qué eligieron RUP?', 'Porque el curso exige artefactos formales de análisis y diseño, y porque el riesgo del caso (qué dato se publica y cómo se mide la consulta) se reduce con una Elaboración centrada en la arquitectura antes de construir.', 'Comparamos con cascada y Scrum. Cascada detecta los problemas tarde, al integrar. Scrum es iterativo, pero con poco modelado formal y sin una fase dedicada a la arquitectura. RUP combina iteraciones con artefactos UML y hitos de decisión, y además se adapta: usamos 7 iteraciones y especificamos en detalle solo los 6 casos de uso significativos.'],
  ['★ ¿Qué diferencia hay entre RUP y UML?', 'RUP es un proceso: dice qué hacer, quién y cuándo. UML es un lenguaje de modelado: dice cómo dibujarlo. RUP usa UML, pero UML se puede usar con cualquier proceso.', ''],
  ['★ ¿Qué función cumple Rational Rose?', 'Es una herramienta CASE que implementa UML. Organiza el modelo en cuatro vistas (casos de uso, lógica, componentes y despliegue), documenta cada elemento y puede generar código esqueleto.', 'No entregamos un .mdl porque no podíamos verificar su compatibilidad sin la herramienta. Entregamos las fuentes PlantUML, SVG, PNG y una guía para reconstruir el modelo en Rose vista por vista (Anexo F de la monografía).'],
  ['★ ¿Por qué RUP es iterativo?', 'Porque el sistema se construye en iteraciones que recorren varias disciplinas y entregan un incremento. En nuestro caso, 7 iteraciones; en E2 ya hay código (el prototipo) y en C1–C3 el sistema crece por partes.', 'La ventaja es atacar los riesgos temprano: el riesgo de que el registro retrase WhatsApp se probó en E2, no al final.'],
  ['★ ¿Cuál es el problema que resuelve el sistema?', 'Que la información de productos y la derivación de compradores a distribuidores no están estructuradas ni son trazables.', 'Causas: especificaciones incompletas, ausencia de directorio y consultas que salen a WhatsApp sin registro. Efectos: el cliente no siempre encuentra datos fiables y la empresa no sabe qué productos generan interés.'],
  ['¿Qué diferencia hay entre actor y usuario?', 'El usuario es una persona concreta; el actor es un rol. Una misma persona del área comercial puede actuar como Gestor del catálogo y como Administrador. Y un actor puede ser un sistema, como WhatsApp.', ''],
  ['¿Por qué eligieron esos casos de uso?', 'Salen del proceso de negocio: descubrir (CU-01 a CU-03), evaluar (CU-04, CU-05), consultar (CU-07 a CU-09) y administrar (CU-11 a CU-22). Los 6 especificados en detalle son los que ejercitan la arquitectura y los riesgos principales.', ''],
  ['★ ¿Qué representa el diagrama de clases?', 'La estructura estática: clases, atributos, operaciones y relaciones con sus multiplicidades. El de dominio fija el vocabulario; los de diseño agregan tipos, visibilidad, servicios y enumeraciones.', 'Ejemplo: Producto–EspecificacionTecnica es una composición, porque la especificación no existe sin el producto; ComparacionProducto tiene de 2 a 3 productos por la regla RN-04.'],
  ['¿Qué diferencia hay entre análisis y diseño?', 'El análisis describe qué debe hacer el sistema, sin tecnología (clases de interfaz, control y entidad). El diseño decide cómo, con tecnología concreta (WordPress, REST, tablas, tipos de datos).', ''],
  ['★ ¿Cómo se validan los requisitos?', 'Con tres técnicas: revisión con el área comercial al cierre de E1, recorrido de prototipos por caso de uso en E2 y verificación de trazabilidad (cada RF tiene un CU y al menos una prueba). Además, cada requisito tiene un criterio de aceptación verificable.', ''],
  ['¿Cuándo termina cada fase?', 'Cuando se cumplen los criterios de su hito: LCO (visión y alcance aceptados, viabilidad), LCA (arquitectura probada, ≥ 80 % de los CU especificados), IOC (CU de prioridad alta implementados, 0 incidencias críticas) y PR (aceptación firmada).', ''],
  ['★ ¿Qué ocurre si cambia un requisito?', 'Se registra como solicitud de cambio, se analiza el impacto con la matriz de trazabilidad (qué CU, componentes y pruebas afecta) y, si se aprueba, se planifica en la siguiente iteración. Git versiona el cambio.', 'Es la disciplina de gestión de configuración y cambios. RUP acepta el cambio, pero lo controla; por eso el alcance está firmado en el LCO.'],
  ['★ ¿Cómo se integra WhatsApp?', 'Con enlaces de clic para chatear: wa.me/número?text=mensaje. El sistema arma el mensaje con la intención, el modelo y la URL, registra la consulta de forma asíncrona y abre WhatsApp.', 'No usamos la API de WhatsApp Business porque exige aprobación, plantillas y costo por conversación, y el volumen no lo justifica todavía. Consecuencia asumida: el sistema no lee la conversación; el seguimiento lo hace el gestor.'],
  ['★ ¿Por qué Black Hawk usa un catálogo y no un checkout tradicional?', 'Porque su modelo comercial vende a través de distribuidores y del área comercial. La web orienta la compra, no la cobra. En el sitio oficial, /cart/ y /checkout/ redirigen a la home.', 'Un checkout necesitaría precios, stock, pagos y logística que la empresa no gestiona en la web, y competiría con sus distribuidores.'],
  ['¿Cómo se protege la información?', 'HTTPS, roles de privilegio mínimo, segundo factor para el administrador, bloqueo tras intentos fallidos, nonces contra CSRF, consultas preparadas contra inyección SQL, auditoría y respaldos cifrados. Las consultas no guardan datos personales.', ''],
  ['¿Qué entregables produce cada fase?', 'Inicio: visión, casos de uso del negocio, riesgos y caso de negocio. Elaboración: SRS, casos de uso, SAD, modelos y prototipo. Construcción: código, builds, informes de pruebas y manual técnico. Transición: acta de aceptación, manual de usuario y plan de despliegue.', ''],
  ['¿Cómo se relacionan los diagramas con los requisitos?', 'Cada requisito tiene un caso de uso; los casos de uso se detallan en secuencias y actividades; las clases y el modelo de datos salen de los sustantivos de esos casos de uso. La matriz de trazabilidad lo documenta.', ''],
  ['★ ¿Cómo se prueba el sistema?', `Con ${M.CP.length} casos de prueba en cinco niveles: unitarias, de integración, funcionales, de sistema y de aceptación, cada uno ligado a un requisito. Por ejemplo, CP-007 verifica que el comparador rechace un cuarto producto.`, 'Están diseñados, no ejecutados. Para ejecutarlos hay que implementar las ampliaciones en staging. Los criterios de salida a producción son objetivos: 100 % de las pruebas de prioridad alta aprobadas y 0 incidencias críticas.'],
  ['★ ¿Qué partes son reales y cuáles son propuestas?', 'Real (verificado en la evidencia): catálogo, búsqueda, comparador de 3, «Cotizar» con el modelo, páginas de dónde comprar, soporte y mayoristas. Propuesto: registro y seguimiento de consultas, directorio, verificación de especificaciones, reportes, auditoría y seguridad reforzada.', 'Cada requisito tiene una etiqueta de estado: existente, nativo de la plataforma, parcial, pendiente o propuesto.'],
  ['★ ¿Cómo se determina si el sistema cumple sus objetivos?', 'Con los criterios de aceptación de cada requisito y con indicadores medibles tras el despliegue: % de fichas con datos verificados, % de consultas con producto identificado, consultas por producto y % de consultas derivadas o cerradas en 7 días.', 'No medimos ventas porque la venta ocurre fuera del sistema; sería una métrica que no podemos calcular con honestidad.'],
  ['¿Por qué ConsultaComercial tiene un diagrama de estados?', 'Porque lo que se puede hacer con ella depende de su estado: no se puede cerrar sin atender y se descarta sola a los 30 días.', ''],
  ['¿La base de datos es un actor?', 'No. Es parte del sistema. Los actores son externos. En las secuencias aparece como participante, no como actor.', ''],
  ['¿De dónde salen los datos del caso?', 'Del sitio oficial (consultado el 29-09-2026) y de la evidencia archivada del rediseño (23-09-2026): capturas, enlaces y sitemaps. No inventamos especificaciones: cuando un dato no está documentado, figura como pendiente de verificación.', ''],
  ['¿Cuánto costaría?', `Estimamos ${M.ESFUERZO.reduce((a, b) => a + b.h, 0)} horas-persona. Con una tarifa hipotética de S/ ${M.TARIFA_REF} por hora serían unos S/ ${(M.ESFUERZO.reduce((a, b) => a + b.h, 0) * M.TARIFA_REF).toLocaleString('es-PE')}. Es un ejercicio académico, no una cotización ni un costo real.`, ''],
];
Q.forEach(([q, b, a], i) => {
  c.push(H3(`P${i + 1}. ${q}`));
  c.push(P(`**Respuesta breve:** ${b}`));
  if (a) c.push(P(`**Respuesta ampliada:** ${a}`));
});
c.push(H1('15. Lista de verificación antes de exponer'));
c.push(...bullets([
  'El PowerPoint abre en el equipo del aula y las notas del orador se ven en la vista del presentador.',
  'Cada integrante sabe sus diapositivas y la transición hacia el siguiente.',
  'Todos saben decir de memoria: 4 fases, 4 hitos, 9 disciplinas, UML frente a Rose.',
  'Se completaron los campos editables de la portada (integrantes, docente, institución).',
  'Se ensayó con cronómetro al menos una vez la versión que se va a usar (completa o corta).',
  'Se tiene a mano la monografía por si el docente pide un anexo (requisitos, casos de prueba, diccionario de datos).',
]));

const header = new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Guía de exposición · SGCD-BH', size: 16, color: L.MUTED })] })] });
const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: L.MUTED })] })] });
const page = { size: { width: 11906, height: 16838 }, margin: { top: 1418, bottom: 1418, left: 1418, right: 1418 } };
const doc = new Document({
  creator: 'Equipo del proyecto SGCD-BH', title: 'Guía de exposición — SGCD-BH', features: { updateFields: true },
  styles: L.baseStyles, numbering: L.numbering,
  sections: [{ properties: { page }, headers: { default: header }, footers: { default: footer }, children: c }],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync('../BLACK_HAWK_RUP_GUIA_EXPOSICION.docx', b); console.log('ok', S.length, 'diapositivas', Q.length, 'preguntas', Math.round(total / 60), 'min', Math.round(totalCorto / 60), 'min corto'); });
