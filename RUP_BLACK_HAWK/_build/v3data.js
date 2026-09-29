// Contenido común de la versión 3: sitio original → web renovada (desarrollada) → ampliaciones (propuestas).
const M = require('./model');

const FECHA = '29-09-2026';
const ORIGINAL = 'sitio original (blackhawkcaraudio.com)';
const RENOVADA = 'web renovada (entorno de prueba)';

// Tres elementos que no deben confundirse
const TRES = [
  { k: 'A', n: 'Sitio original', d: 'La plataforma actual de Black Hawk: el punto de partida que se busca mejorar.', estado: 'Existente' },
  { k: 'B', n: 'Web renovada', d: 'El sistema que desarrollo: rediseño visual, catálogo, consulta y recorrido comercial.', estado: 'Desarrollado' },
  { k: 'C', n: 'Ampliaciones', d: 'Funciones que complementan el sistema y que se proponen como parte del proyecto académico.', estado: 'Propuesto' },
];

// Lo que el sitio original ya tiene (no partimos de cero)
const ORIGINAL_TIENE = [
  'WordPress + WooCommerce con tema propio y modo catálogo (sin carrito ni pago)',
  '110 productos en 11 categorías, con menú «Productos»',
  'Buscador con sugerencias en escritorio',
  'Fichas con imagen, breadcrumb y productos relacionados',
  'Galería de fotos y enlaces a redes sociales',
];

// Hallazgos observables en el sitio original (evidencia: capturas del 23-09 y 29-09-2026)
const TIPOS = { INEX: 'Inexistente', POCO: 'Existe, poco visible', MEJ: 'Recorrido mejorable', OK: 'Existente' };
const HALLAZGOS = [
  { n: 1, t: '«Productos» abre una tienda sin productos', d: 'La página /shop/ muestra el título «Tienda» y la lista vacía; los productos solo se ven entrando por categoría.', tipo: 'MEJ', ev: 'Captura del 29-09-2026' },
  { n: 2, t: 'La ficha no tiene un paso de consulta', d: 'Muestra el modelo y las especificaciones, pero ningún botón de consulta, WhatsApp, teléfono ni correo.', tipo: 'INEX', ev: 'Ficha BH-SW12XXG, 29-09-2026' },
  { n: 3, t: 'El menú no lleva a contacto ni a dónde comprar', d: 'El menú ofrece Inicio, Productos y Galería de fotos.', tipo: 'POCO', ev: 'Encabezado del sitio original' },
  { n: 4, t: 'El canal mayorista está oculto', d: 'WhatsApp y el formulario mayorista solo están en «Ventas al mayor», sin enlace en el menú y con textos a nombre de «Estilo Car Audio».', tipo: 'POCO', ev: 'Página /ventas-al-mayor/' },
  { n: 5, t: 'Catálogo poco informativo', d: 'Las tarjetas muestran solo categoría y modelo, se ven 12 por página y hay textos en inglés («Showing 1–12 of 16 results», «Default sorting»).', tipo: 'MEJ', ev: 'Categoría Subwoofer' },
  { n: 6, t: 'Sin comparador ni «Dónde comprar»', d: 'No hay forma de comparar modelos ni una página que oriente al punto de venta.', tipo: 'INEX', ev: 'Mapa del sitio y navegación' },
];
// Otros hallazgos (monografía y guía)
const HALLAZGOS_EXTRA = [
  ['Algunas fichas sin especificaciones (por ejemplo, BH-8.12DSP)', 'MEJ', 'Ficha BH-8.12DSP, 23-09-2026'],
  ['En móvil, buscar «sw12» no mostró sugerencias tras 7 s', 'MEJ', 'Interacción móvil, 23-09-2026'],
  ['Páginas de demostración del tema publicadas (/home-page-01/, /home-page-03/)', 'MEJ', 'Sitemap, 23-09-2026'],
];

const PROBLEMA = 'La plataforma original muestra el catálogo, pero no guía al usuario desde el interés en un producto hasta el contacto comercial.';
const NECESIDADES = [
  { t: 'Guiar del interés al contacto', d: 'Llamadas a la acción visibles y una consulta que ya incluya el modelo.', h: [2, 3, 4] },
  { t: 'Un catálogo claro y comparable', d: 'Catálogo que se pueda recorrer, tarjetas con información útil y comparación entre modelos.', h: [1, 5, 6] },
  { t: 'Una marca moderna, también en el celular', d: 'Identidad coherente, jerarquía visual y acceso claro para compradores y distribuidores.', h: [3, 4] },
];

const OBJ_GENERAL = 'Analizar, diseñar y desarrollar, aplicando la metodología RUP, una versión renovada del sitio web de Black Hawk que modernice la presentación de la marca, facilite la consulta del catálogo y guíe al usuario hasta el contacto con el área comercial o un distribuidor.';
const OBJ_ESP = [
  'Analizar la plataforma original e identificar sus oportunidades de mejora.',
  'Especificar los requisitos y modelar el sistema con UML.',
  'Desarrollar el rediseño: identidad visual, catálogo, fichas, comparador y recorrido de consulta.',
  'Validar la solución y planificar su publicación y las ampliaciones.',
];

// Alcance por grupos (A-D desarrollado, E propuesto)
const FUNCIONES = [
  { k: 'A', n: 'Rediseño visual', e: 'Desarrollado', items: ['Identidad Black Hawk y jerarquía visual', 'Productos destacados en la home', 'Diseño adaptable al celular'] },
  { k: 'B', n: 'Catálogo y consulta', e: 'Desarrollado', items: ['Categorías con contador y filtros', 'Fichas con especificaciones en lista', 'Búsqueda con tipo y potencia', 'Comparador de hasta 3 modelos'] },
  { k: 'C', n: 'Recorrido comercial', e: 'Desarrollado', items: ['«Cotizar» visible en encabezado y ficha', 'WhatsApp con el modelo en el mensaje', 'Páginas Dónde comprar, Mayoristas y Soporte'] },
  { k: 'D', n: 'Administración', e: 'Base WordPress', items: ['Productos y categorías en WooCommerce', 'Contenidos y páginas en WordPress', 'Sin programar un panel nuevo'] },
  { k: 'E', n: 'Mejoras complementarias', e: 'Propuesto', items: ['Registro del inicio de cada consulta', 'Directorio estructurado de distribuidores', 'Reportes y auditoría de cambios', 'Seguimiento comercial, si se añade un mecanismo'] },
];
const EXCLUSIONES = ['Venta en línea (carrito, pagos)', 'ERP e inventario', 'CRM o API de WhatsApp Business', 'Aplicación móvil'];

// Antes y después (evidencia auténtica de cada versión)
const ANTES_DESPUES = [
  { n: 'Home y marca', antes: 'img/v3-A-home.png', despues: 'img/v3-N-home.png',
    a: 'Banner y categorías; el menú no ofrece contacto ni consulta.', nec: 'Presentar la marca y dar un camino claro desde la primera pantalla.',
    sol: 'Nueva identidad y jerarquía, con «Buscar» y «Cotizar» fijos en el encabezado.', ben: 'Tres caminos visibles: explorar, buscar o consultar.' },
  { n: 'Catálogo', antes: 'img/v3-A-shop.png', despues: 'img/v3-N-shop.png',
    a: '«Productos» abre una tienda vacía; en las categorías, tarjetas con solo el modelo.', nec: 'Un catálogo que se pueda recorrer y comparar.',
    sol: '118 productos, pestañas con contador, filtros y tarjetas con tipo y potencia.', ben: 'Encontrar el modelo con menos pasos.' },
  { n: 'Ficha de producto', antes: 'img/v3-A-ficha.png', despues: 'img/v3-N-ficha.png',
    a: 'Especificaciones visibles, pero sin botón de consulta ni contacto.', nec: 'Pasar del interés en un producto al contacto comercial.',
    sol: 'Potencia destacada, «Cotizar» junto al modelo, «Comparar» y especificaciones en lista.', ben: 'Consultas con el modelo correcto y sin fricción.' },
  { n: 'Recorrido en el celular', antes: 'img/v3-A-ficha-m.png', despues: 'img/v3-N-ficha-m.png',
    a: 'Ficha móvil sin acción comercial; WhatsApp solo en «Ventas al mayor».', nec: 'Consultar desde cualquier punto del recorrido.',
    sol: 'WhatsApp en el encabezado, barra «Cotizar» fija y páginas Dónde comprar y Mayoristas.', ben: 'La consulta está siempre a un toque.' },
];

// Mediciones archivadas (Lighthouse 12.8.2, mediana de 3, 23-09-2026). Peso y peticiones son comparables; los tiempos no.
const MEDICIONES = [
  ['Peso de la ficha BH-SW12XXG (escritorio)', '5,28 MB', '0,38 MB'],
  ['Peticiones de la ficha (escritorio)', '61', '35'],
  ['Peso de la home (escritorio)', '2,53 MB', '1,15 MB'],
];

// RUP: fases con estado real
const FASES = [
  { n: 'Inicio', hito: 'LCO', hitoN: 'Objetivos y alcance acordados', estado: 'Realizado',
    obj: 'Entender el negocio y acordar qué se va a construir.',
    act: ['Análisis del sitio original con capturas y recorridos', 'Stakeholders, problema y necesidades', 'Alcance, exclusiones y viabilidad'],
    bh: 'Se documentaron la tienda vacía, la ficha sin consulta y el canal mayorista oculto.',
    art: ['Visión', 'Análisis del sitio original', 'Modelo del negocio', 'Riesgos iniciales'],
    extra: { stake: ['Gerencia', 'Área comercial', 'Gestor de contenidos', 'Distribuidores', 'Clientes'], viab: [['Técnica', 'WordPress y WooCommerce ya existen'], ['Operativa', 'WhatsApp ya es el canal de venta'], ['Económica', 'Se reutilizan la plataforma y el contenido']] } },
  { n: 'Elaboración', hito: 'LCA', hitoN: 'Arquitectura validada', estado: 'Realizado',
    obj: 'Definir los requisitos y validar la arquitectura antes de construir.',
    act: ['Requisitos funcionales y no funcionales', 'Casos de uso y modelos UML', 'Arquitectura: tema hijo sobre WooCommerce', 'Diseño de pantallas: home, catálogo, ficha y comparador'],
    bh: 'Se decidió rediseñar sobre la misma plataforma, con un tema hijo, en lugar de reemplazarla.',
    art: ['Especificación de requisitos', 'Casos de uso', 'Diagramas UML', 'Documento de arquitectura', 'Diseño de pantallas'] },
  { n: 'Construcción', hito: 'IOC', hitoN: 'Versión operativa', estado: 'En curso',
    obj: 'Desarrollar e integrar el sistema por incrementos.',
    act: ['C1 · Rediseño visual y home', 'C2 · Catálogo, fichas, búsqueda y comparador', 'C3 · Recorrido de cotización: WhatsApp, Dónde comprar, Mayoristas y Soporte'],
    bh: 'La web renovada ya funciona en un entorno de prueba. Las ampliaciones (registro, directorio, reportes) están planificadas.',
    art: ['Tema hijo rozer-child', 'Incrementos integrados', 'Verificación funcional'],
    pruebas: 'Verificación funcional documentada con capturas: búsqueda, límite de 3 en el comparador, persistencia de la selección, menú y ficha en móvil. Pruebas unitarias y de aceptación formales: planificadas.' },
  { n: 'Transición', hito: 'PR', hitoN: 'Publicación del producto', estado: 'Planificado',
    obj: 'Entregar el sistema a Black Hawk y ponerlo en producción.',
    act: ['Validación con Black Hawk y pruebas de aceptación', 'Publicación en el dominio oficial con respaldo previo', 'Capacitación del gestor de contenidos', 'Mantenimiento y mejora continua'],
    bh: 'Pasar del entorno de prueba a blackhawkcaraudio.com y medir con datos reales.',
    art: ['Acta de aceptación', 'Manual del gestor', 'Plan de despliegue y reversión'] },
];

// Matriz iteración × disciplina (entregable principal por celda)
const ITER = [
  { id: 'I1', f: 'Inicio', e: 'Realizado' }, { id: 'E1', f: 'Elaboración', e: 'Realizado' }, { id: 'E2', f: 'Elaboración', e: 'Realizado' },
  { id: 'C1', f: 'Construcción', e: 'Realizado' }, { id: 'C2', f: 'Construcción', e: 'Realizado' }, { id: 'C3', f: 'Construcción', e: 'En curso' }, { id: 'T1', f: 'Transición', e: 'Planificado' },
];
const MATRIZ = [
  ['Modelado del negocio', ['Análisis del sitio original', 'Modelo del negocio', '', '', '', '', '']],
  ['Requisitos', ['Necesidades', 'Requisitos y casos de uso', 'Validación', 'Ajustes', 'Ajustes', '', '']],
  ['Análisis y diseño', ['', 'Modelo de dominio', 'Arquitectura y prototipos', 'Diseño de pantallas', 'Diseño de pantallas', 'Diseño de ampliaciones', '']],
  ['Implementación', ['', '', 'Prototipo', 'Rediseño y home', 'Catálogo, ficha y comparador', 'Cotizar, WhatsApp y páginas', 'Ajustes']],
  ['Pruebas', ['', '', '', 'Verificación', 'Verificación', 'Verificación', 'Aceptación']],
  ['Despliegue', ['', '', '', '', '', '', 'Publicación y capacitación']],
];

// Requisitos representativos (con código del catálogo)
const REQ_F = [
  ['Explorar el catálogo por categorías, con contador y filtros', 'Desarrollado', 'RF-001, RF-003'],
  ['Buscar productos con sugerencias', 'Desarrollado', 'RF-002'],
  ['Ver la ficha con especificaciones en lista', 'Desarrollado', 'RF-004'],
  ['Comparar hasta 3 modelos', 'Desarrollado', 'RF-007, RF-008'],
  ['Cotizar por WhatsApp con el modelo en el mensaje', 'Desarrollado', 'RF-012'],
  ['Consultar dónde comprar y solicitar ser distribuidor', 'Desarrollado', 'RF-015'],
  ['Registrar el inicio de consulta, directorio y reportes', 'Propuesto', 'RF-014, RF-011, RF-025'],
];
const REQ_NF = [
  ['Adaptabilidad', 'Usable entre 360 y 1440 px de ancho', 'RNF-002'],
  ['Usabilidad', '«Cotizar» visible desde cualquier ficha', 'RNF-001'],
  ['Eficiencia', 'Páginas livianas (ficha: 5,28 MB → 0,38 MB)', 'RNF-003'],
  ['Idioma', 'Interfaz pública íntegramente en español', 'RNF-012'],
  ['Protección de datos', 'Formularios con consentimiento y política de privacidad', 'RNF-005'],
];

const CONCLUSIONES = [
  ['El punto de partida', 'Black Hawk ya tenía una plataforma con catálogo; su limitación era que no guiaba al usuario hacia una acción comercial.'],
  ['La solución', 'La web renovada rediseña la marca, ordena el catálogo y lleva cada producto a una consulta con el modelo identificado, sobre la misma base tecnológica.'],
  ['La metodología', 'RUP organizó el trabajo: Inicio y Elaboración realizados, Construcción avanzada y Transición planificada, con modelos UML que sustentan cada decisión.'],
];
const PROXIMOS = ['Validar la web renovada con Black Hawk', 'Publicarla en el dominio oficial y medir con datos reales', 'Implementar el registro de consultas y el directorio', 'Capacitar al gestor de contenidos'];

module.exports = { M, FECHA, ORIGINAL, RENOVADA, TRES, ORIGINAL_TIENE, TIPOS, HALLAZGOS, HALLAZGOS_EXTRA, PROBLEMA, NECESIDADES, OBJ_GENERAL, OBJ_ESP, FUNCIONES, EXCLUSIONES, ANTES_DESPUES, MEDICIONES, FASES, ITER, MATRIZ, REQ_F, REQ_NF, CONCLUSIONES, PROXIMOS };
