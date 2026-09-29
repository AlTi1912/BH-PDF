// Contenido común de la versión 2 (primera presentación de estructura y propuesta).
// Presentación, monografía y guía V2 leen de aquí para decir lo mismo con las mismas palabras.
const M = require('./model');

const FECHA = '29-09-2026';
const WEB = 'web renovada de Black Hawk (versión de prueba, consultada el 29-09-2026)';

// Datos verificados. Solo se usan cifras que sirven para explicar la propuesta.
const HECHOS = {
  productos: 118,           // sitemap de productos de la web renovada
  categorias: 12,           // sitemap de categorías de la web renovada
  productosOficial: 110,    // sitemap del sitio oficial
  fichasTextoLibre: 6,      // 6 de 118 fichas con especificaciones en párrafo
  maxComparar: 3,           // navigation.js: slice(0, 3)
  horasComparador: 24,      // navigation.js: la selección caduca a las 24 h
};

const PRODUCTOS_V2 = [
  ['BH-4.8DSP', 'Procesador de sonido (DSP); la web lo ubica en «Ecualizador»', 'Sitio oficial y web renovada'],
  ['BH-SW12XZP', 'Subwoofer de 12"', 'Web renovada'],
  ['BH-FR1500.1', 'Amplificador', 'Web renovada'],
  ['BH-FR2000.1', 'Amplificador', 'Sitio oficial y web renovada'],
  ['BH-FR3000.1', 'Amplificador', 'Web renovada'],
  ['BH-FR15000.1', 'Amplificador', 'Web renovada (marcado «Próximamente»)'],
  ['BH-FR40000.1', 'Amplificador', 'Web renovada (marcado «Próximamente»)'],
  ['BH-70CHR', 'Cargador', 'Web renovada'],
  ['BH-200CHR', 'Cargador', 'Web renovada'],
  ['BH-605BN PRO', 'Componentes', 'No encontrado en ninguna de las dos webs; pendiente de verificar'],
];

const PROBLEMA = 'Black Hawk ya muestra su catálogo en la web, pero le falta una forma ordenada de mantener la información técnica, de llevar al comprador hasta un distribuidor y de saber qué se consulta.';

const NECESIDADES_V2 = [
  { t: 'Información técnica ordenada', causa: 'Las 118 fichas muestran especificaciones, pero se cargan como texto: 6 están en párrafos y no se registra la fuente de cada dato.', efecto: 'Mantener y comparar los datos depende de la revisión manual.', base: 'Observado + supuesto académico' },
  { t: 'Llegar al punto de venta', causa: '«Dónde comprar» no tiene un directorio: toda consulta pasa por un único WhatsApp.', efecto: 'La derivación depende de la atención manual.', base: 'Observado' },
  { t: 'Saber qué se consulta', causa: 'El botón «Cotizar» abre WhatsApp fuera de la web y no deja registro.', efecto: 'No se sabe qué productos generan interés.', base: 'Supuesto académico' },
];

const EXISTE_HOY = [
  'Catálogo de 118 productos en 12 categorías, con búsqueda y filtros',
  'Ficha técnica por producto',
  'Comparador de hasta 3 modelos',
  'Botón «Cotizar»: abre WhatsApp con el modelo ya escrito',
  'Páginas de dónde comprar, soporte y mayoristas',
];

const PROPUESTO = [
  'Especificaciones como datos estructurados, con fuente y estado',
  'Registro de cada consulta antes de abrir WhatsApp',
  'Enlace del producto dentro del mensaje',
  'Directorio de distribuidores por ciudad',
  'Seguimiento de consultas, reportes y control de accesos',
];

const USUARIOS = [
  ['Cliente', 'Busca, compara y consulta productos.'],
  ['Gestor del catálogo', 'Mantiene productos, distribuidores y consultas.'],
  ['Administrador', 'Gestiona usuarios, reportes, seguridad y respaldos.'],
  ['Distribuidor', 'Solicita unirse a la red y recibe clientes derivados.'],
];

const OBJ_GENERAL = 'Diseñar, aplicando la metodología RUP, un sistema de información web que centralice el catálogo de Black Hawk, facilite consultar y comparar productos, conecte a los compradores con los distribuidores y permita dar seguimiento a las consultas comerciales.';
const OBJ_ESP = [
  'Analizar el proceso comercial de Black Hawk e identificar sus necesidades de información.',
  'Definir los requisitos y los casos de uso del sistema.',
  'Modelar el sistema con UML y diseñar su arquitectura general.',
  'Planificar su desarrollo en las cuatro fases de RUP.',
];

const GRUPOS = [
  ['Catálogo', 'Categorías, búsqueda, filtros, fichas técnicas y comparador.'],
  ['Consultas', 'WhatsApp con el modelo y el enlace, registro y seguimiento.'],
  ['Distribuidores', 'Directorio por ciudad y solicitudes de incorporación.'],
  ['Administración', 'Usuarios y roles, contenidos, reportes, seguridad y respaldos.'],
];
const EXCLUSIONES = ['Venta en línea: carrito, pagos y checkout', 'Inventario, precios y facturación (ERP)', 'Chatbot o API de WhatsApp Business', 'Aplicación móvil'];

const RUP_CARAC = [
  ['Iterativo e incremental', 'El sistema crece por partes: primero el catálogo, luego las consultas y al final la administración. Cada parte se prueba antes de seguir.'],
  ['Dirigido por casos de uso', '«Enviar consulta por WhatsApp» guía qué se diseña, qué se construye y qué se prueba.'],
  ['Centrado en la arquitectura', 'Antes de construir se valida la estructura: extender WordPress y WooCommerce con un módulo propio, sin modificar su núcleo.'],
];

// Fases: semanas = estimación académica de 14 semanas
const FASES_V2 = [
  { n: 'Inicio', sem: 'S1–S2', hito: 'LCO', hitoN: 'Objetivos acordados', haremos: 'Entender el negocio, definir el problema y el alcance.', entregas: 'Visión, modelo del negocio, riesgos iniciales.', bh: 'Por qué la web deriva a WhatsApp y no vende.' },
  { n: 'Elaboración', sem: 'S3–S6', hito: 'LCA', hitoN: 'Arquitectura validada', haremos: 'Analizar los requisitos y diseñar el sistema.', entregas: 'Requisitos, casos de uso, modelos UML, arquitectura, prototipo.', bh: 'Probar que registrar la consulta no retrasa WhatsApp.' },
  { n: 'Construcción', sem: 'S7–S12', hito: 'IOC', hitoN: 'Versión operativa', haremos: 'Desarrollar e integrar por incrementos.', entregas: 'Módulos integrados y probados.', bh: 'Catálogo → consultas → administración.' },
  { n: 'Transición', sem: 'S13–S14', hito: 'PR', hitoN: 'Entrega del producto', haremos: 'Validar con usuarios, capacitar y desplegar.', entregas: 'Pruebas de aceptación, manual, puesta en producción.', bh: 'Gestor capacitado y distribuidores validados.' },
];

const REQ_F = [
  ['Buscar, filtrar y ver la ficha técnica', 'Existe', 'RF-002, RF-003, RF-004'],
  ['Comparar hasta 3 productos', 'Existe', 'RF-007, RF-008'],
  ['Consultar por WhatsApp con modelo y enlace, y registrar la consulta', 'Propuesto', 'RF-012, RF-013, RF-014'],
  ['Administrar productos, distribuidores y el seguimiento de consultas', 'Propuesto', 'RF-017, RF-021, RF-023'],
];
const REQ_NF = [
  ['Usabilidad', 'Iniciar la consulta desde la ficha con un solo clic.', 'RNF-001'],
  ['Adaptabilidad', 'Funcionar en celular y computadora sin desplazamiento horizontal.', 'RNF-002'],
  ['Rendimiento', 'Cargar la página principal en 2,5 s o menos (LCP).', 'RNF-003'],
  ['Seguridad', 'Roles, HTTPS y consentimiento para datos personales (Ley N.° 29733).', 'RNF-004, RNF-005'],
];

const RESULTADOS = {
  realizado: ['Problema y alcance definidos', 'Requisitos priorizados', 'Casos de uso y modelos UML', 'Arquitectura y plan de desarrollo'],
  propuesto: ['Registro y seguimiento de consultas', 'Directorio de distribuidores', 'Especificaciones verificadas', 'Reportes y control de accesos'],
  esperado: ['Consultas con el producto identificado', 'Información técnica más confiable', 'Saber qué productos generan interés', 'Derivación más ágil al punto de venta'],
};

const CONCLUSIONES = [
  ['La necesidad', 'Black Hawk no necesita una tienda en línea: necesita información confiable y una ruta clara del producto al distribuidor.'],
  ['La solución', 'El SGCD-BH se apoya en la plataforma que ya existe y agrega lo que falta: verificar datos, registrar consultas y organizar distribuidores.'],
  ['La metodología', 'RUP permitió definir el alcance, modelar el sistema y planificarlo por fases, validando la arquitectura antes de construir.'],
];
const CIERRE = 'Diseñar bien antes de construir: ese es el valor de aplicar RUP a Black Hawk.';

module.exports = { M, FECHA, WEB, HECHOS, PRODUCTOS_V2, PROBLEMA, NECESIDADES_V2, EXISTE_HOY, PROPUESTO, USUARIOS, OBJ_GENERAL, OBJ_ESP, GRUPOS, EXCLUSIONES, RUP_CARAC, FASES_V2, REQ_F, REQ_NF, RESULTADOS, CONCLUSIONES, CIERRE };
