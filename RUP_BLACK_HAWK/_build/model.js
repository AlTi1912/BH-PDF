// Modelo conceptual único del proyecto SGCD-BH.
// Todos los entregables (monografía, presentación, guía, anexos) leen de aquí
// para mantener la misma terminología, códigos y relaciones.

const SISTEMA = {
  sigla: 'SGCD-BH',
  nombre: 'Sistema de Gestión de Catálogo y Distribuidores Black Hawk',
  titulo: 'Aplicación de la metodología RUP para el análisis, diseño y desarrollo de un sistema de información web para Black Hawk Car Audio',
  curso: 'Diseño de Sistemas de Información',
  fechaEvidencia: '23-09-2026',
  fechaConsulta: '29-09-2026',
};

// Estados de conocimiento usados en todo el proyecto (distinción A/B/C/D del enunciado)
const ESTADOS = {
  EXI: 'Existente (verificado)',          // observado en la evidencia archivada del rediseño o en el sitio oficial
  BASE: 'Existente en la plataforma base', // capacidad nativa de WordPress/WooCommerce, configuración no auditada
  PAR: 'Parcial',                          // existe, pero con una limitación documentada
  PEN: 'Pendiente de validación',          // contemplado en el proyecto web, sin evidencia suficiente
  PRO: 'Propuesto (alcance académico)',    // ampliación diseñada en este proyecto
};

const PRODUCTOS = [
  { modelo: 'BH-4.8DSP', tipo: 'Procesador digital de sonido', fuente: 'Sitemap del sitio oficial (/product/bh-4-8dsp-2/)' },
  { modelo: 'BH-SW12XZP', tipo: 'Subwoofer de 12 pulgadas', fuente: 'Catálogo del rediseño (evidencia 23-09-2026); no figura en el sitemap oficial' },
  { modelo: 'FR 1500.1', tipo: 'Amplificador', fuente: 'Home del rediseño (listado como «BH-FR1500.1»)' },
  { modelo: 'FR 2000.1', tipo: 'Amplificador', fuente: 'Sitemap oficial (/product/bh-fr2000-1-2/) y home del rediseño' },
  { modelo: 'FR 3000.1', tipo: 'Amplificador', fuente: 'Proporcionado por el equipo; pendiente de verificar en el catálogo' },
  { modelo: 'FR 15000.1', tipo: 'Amplificador', fuente: 'Proporcionado por el equipo; pendiente de verificar en el catálogo' },
  { modelo: 'FR 40000.1', tipo: 'Amplificador', fuente: 'Proporcionado por el equipo; pendiente de verificar en el catálogo' },
  { modelo: 'BH-70CHR', tipo: 'Cargador', fuente: 'Proporcionado por el equipo; la categoría «Cargadores» (2 productos) solo existe en el rediseño, pero el modelo no aparece en la evidencia archivada' },
  { modelo: 'BH-200CHR', tipo: 'Cargador', fuente: 'Proporcionado por el equipo; la categoría «Cargadores» (2 productos) solo existe en el rediseño, pero el modelo no aparece en la evidencia archivada' },
  { modelo: 'BH-605BN PRO', tipo: 'Componentes', fuente: 'Proporcionado por el equipo; pendiente de verificar en el catálogo' },
];

// Categorías observadas: productos por categoría en el sitio oficial y en el rediseño (evidencia 23-09-2026)
const CATEGORIAS = [
  ['Amplificadores', 26, 31], ['Medio rango', 25, 25], ['Tweeter', 24, 24], ['Subwoofer', 16, 17],
  ['Altavoces', 9, 9], ['Drivers', 8, 8], ['Ecualizador', 7, 7], ['Procesadores', 5, 5],
  ['Componentes', 5, 5], ['Subwoofer activo', 4, 4], ['Parlantes', 3, 3], ['Cargadores', null, 2],
];

// A. Características conocidas de la plataforma
const CONOCIDO = [
  ['Plataforma', 'WordPress + WooCommerce con tema personalizado (tema hijo) y YITH Catalog Mode.', 'Descripción del proyecto web'],
  ['Modelo comercial', 'Catálogo sin precios, carrito ni pago. En el sitio oficial, /cart/ y /checkout/ redirigen a la home.', 'Evidencia archivada 23-09-2026'],
  ['Catálogo', '110 productos en el sitemap oficial; 118 en el rediseño, organizados en 12 categorías.', 'Sitemaps y evidencia archivada'],
  ['Búsqueda', 'Buscador con sugerencias en vivo; en el rediseño muestra tipo y potencia.', 'Evidencia archivada'],
  ['Comparador', 'Rediseño: hasta 3 modelos, disponible desde tarjetas y fichas, con la selección guardada entre páginas.', 'Evidencia archivada (captura y vídeo)'],
  ['WhatsApp', 'Rediseño: botón «Cotizar» con mensaje prellenado que incluye el modelo. El sitio oficial solo enlaza WhatsApp en /ventas-al-mayor/.', 'Atributos href extraídos'],
  ['Dónde comprar', 'La página existe en el rediseño, pero no publica un directorio de distribuidores: dirige la consulta a WhatsApp.', 'Evidencia archivada'],
  ['Mayoristas', 'Formulario B2B con empresa, RUC, ciudad, WhatsApp, número de tiendas y consentimiento de privacidad.', 'Evidencia archivada (formulario no enviado)'],
];

// B. Problemas razonablemente identificados (caso de estudio)
const PROBLEMAS = [
  { id: 'P-01', t: 'Información técnica heterogénea', d: 'Algunas fichas no incluyen especificaciones (p. ej., BH-8.12DSP en el sitio oficial) y otras las presentan en párrafos y no en campos (BH-SW12LJD en el rediseño).', ev: 'Observado' },
  { id: 'P-02', t: 'Ruta incompleta hacia la compra', d: 'En el sitio oficial, las fichas no enlazan a WhatsApp, teléfono ni correo, y /shop/ no listaba productos el 23-09-2026.', ev: 'Observado' },
  { id: 'P-03', t: 'Sin directorio de puntos de venta', d: 'Ninguna versión publica un listado de distribuidores; la derivación depende de la atención manual por WhatsApp.', ev: 'Observado' },
  { id: 'P-04', t: 'Consultas sin trazabilidad', d: 'El clic en «Cotizar» abre WhatsApp fuera del sitio y no deja registro del producto consultado, del origen ni del resultado.', ev: 'Inferido del diseño (supuesto académico)' },
  { id: 'P-05', t: 'Administración sin control de calidad del dato', d: 'No hay evidencia de validaciones de campos obligatorios, de estados de verificación de especificaciones ni de auditoría de cambios.', ev: 'Supuesto académico' },
  { id: 'P-06', t: 'Mantenimiento dependiente de terceros', d: 'El sitio depende de plugins externos y de un entorno de prueba temporal (túnel), lo que exige respaldos y procedimientos de despliegue definidos.', ev: 'Observado (túnel inactivo el 23-09 y el 29-09-2026)' },
];

const NECESIDADES = [
  { id: 'NB-01', t: 'Centralizar y estructurar la información de productos' },
  { id: 'NB-02', t: 'Facilitar la consulta de especificaciones técnicas' },
  { id: 'NB-03', t: 'Encontrar productos con rapidez (búsqueda y clasificación)' },
  { id: 'NB-04', t: 'Comparar modelos con datos visibles' },
  { id: 'NB-05', t: 'Conectar compradores con distribuidores' },
  { id: 'NB-06', t: 'Dar trazabilidad a las consultas comerciales' },
  { id: 'NB-07', t: 'Actualizar el catálogo y los contenidos de forma autónoma y controlada' },
  { id: 'NB-08', t: 'Proteger, mantener y auditar la plataforma' },
  { id: 'NB-09', t: 'Captar y gestionar nuevos distribuidores' },
];

const ACTORES = [
  { id: 'AC-01', n: 'Visitante', tipo: 'Humano externo', d: 'Persona anónima que navega el catálogo, busca, filtra, consulta fichas y compara modelos.' },
  { id: 'AC-02', n: 'Cliente interesado', tipo: 'Humano externo (especializa a Visitante)', d: 'Visitante con intención de compra que inicia una consulta comercial o busca dónde comprar.' },
  { id: 'AC-03', n: 'Distribuidor', tipo: 'Humano externo', d: 'Tienda o negocio que solicita incorporarse a la red y recibe clientes derivados.' },
  { id: 'AC-04', n: 'Gestor del catálogo', tipo: 'Rol interno', d: 'Personal de Black Hawk que mantiene productos, categorías, fichas, imágenes, distribuidores, novedades y consultas.' },
  { id: 'AC-05', n: 'Administrador del sistema', tipo: 'Rol interno (especializa a Gestor)', d: 'Responsable de usuarios, roles, reportes, auditoría, respaldos y mantenimiento.' },
  { id: 'AC-06', n: 'Servicio externo de WhatsApp', tipo: 'Sistema externo', d: 'Plataforma de mensajería que recibe el enlace de clic para chatear (wa.me) con el mensaje prellenado.' },
];

const MODULOS = [
  { id: 'M01', n: 'Gestión de usuarios y roles' },
  { id: 'M02', n: 'Administración del catálogo' },
  { id: 'M03', n: 'Administración de categorías' },
  { id: 'M04', n: 'Gestión de fichas técnicas' },
  { id: 'M05', n: 'Búsqueda y filtrado' },
  { id: 'M06', n: 'Comparación de productos' },
  { id: 'M07', n: 'Gestión de distribuidores' },
  { id: 'M08', n: 'Consultas comerciales por WhatsApp' },
  { id: 'M09', n: 'Gestión de contenido y novedades' },
  { id: 'M10', n: 'Registro y seguimiento de consultas' },
  { id: 'M11', n: 'Reportes administrativos' },
  { id: 'M12', n: 'Seguridad, mantenimiento y auditoría' },
];

// Casos de uso del sistema
const CU = [
  { id: 'CU-01', n: 'Explorar catálogo por categoría', a: 'Visitante', m: 'M05', e: 'EXI' },
  { id: 'CU-02', n: 'Buscar producto', a: 'Visitante', m: 'M05', e: 'EXI' },
  { id: 'CU-03', n: 'Filtrar productos', a: 'Visitante', m: 'M05', e: 'EXI', rel: '«extend» de CU-01' },
  { id: 'CU-04', n: 'Consultar ficha técnica', a: 'Visitante', m: 'M04', e: 'PAR' },
  { id: 'CU-05', n: 'Comparar productos', a: 'Visitante', m: 'M06', e: 'EXI' },
  { id: 'CU-06', n: 'Consultar novedades', a: 'Visitante', m: 'M09', e: 'PEN' },
  { id: 'CU-07', n: 'Consultar dónde comprar', a: 'Cliente interesado', m: 'M07', e: 'PAR' },
  { id: 'CU-08', n: 'Enviar consulta por WhatsApp', a: 'Cliente interesado; Servicio externo de WhatsApp', m: 'M08', e: 'PAR', rel: '«include» CU-09' },
  { id: 'CU-09', n: 'Registrar consulta comercial', a: '(incluido por CU-08)', m: 'M10', e: 'PRO' },
  { id: 'CU-10', n: 'Solicitar incorporación como distribuidor', a: 'Distribuidor', m: 'M07', e: 'PAR' },
  { id: 'CU-11', n: 'Autenticarse', a: 'Gestor del catálogo', m: 'M01', e: 'BASE' },
  { id: 'CU-12', n: 'Gestionar productos', a: 'Gestor del catálogo', m: 'M02', e: 'BASE' },
  { id: 'CU-13', n: 'Gestionar categorías', a: 'Gestor del catálogo', m: 'M03', e: 'BASE' },
  { id: 'CU-14', n: 'Gestionar especificaciones técnicas', a: 'Gestor del catálogo', m: 'M04', e: 'PAR' },
  { id: 'CU-15', n: 'Gestionar imágenes de producto', a: 'Gestor del catálogo', m: 'M02', e: 'BASE' },
  { id: 'CU-16', n: 'Gestionar distribuidores', a: 'Gestor del catálogo', m: 'M07', e: 'PRO' },
  { id: 'CU-17', n: 'Gestionar contenido y novedades', a: 'Gestor del catálogo', m: 'M09', e: 'BASE' },
  { id: 'CU-18', n: 'Dar seguimiento a consultas', a: 'Gestor del catálogo', m: 'M10', e: 'PRO' },
  { id: 'CU-19', n: 'Gestionar usuarios y roles', a: 'Administrador del sistema', m: 'M01', e: 'BASE' },
  { id: 'CU-20', n: 'Generar reportes administrativos', a: 'Administrador del sistema', m: 'M11', e: 'PRO' },
  { id: 'CU-21', n: 'Consultar auditoría', a: 'Administrador del sistema', m: 'M12', e: 'PRO' },
  { id: 'CU-22', n: 'Gestionar respaldos y mantenimiento', a: 'Administrador del sistema', m: 'M12', e: 'PEN' },
];

// Requisitos funcionales. p: prioridad MoSCoW (Alta = Must, Media = Should, Baja = Could)
const RF = [
  { id: 'RF-001', n: 'Listar catálogo por categoría', d: 'El sistema muestra los productos publicados agrupados por categoría, con el número de productos de cada una.', p: 'Alta', a: 'Visitante', cu: 'CU-01', ac: 'Al abrir una categoría se listan solo sus productos publicados y el contador coincide con el total.', e: 'EXI' },
  { id: 'RF-002', n: 'Buscar por modelo o texto', d: 'Búsqueda por modelo exacto, familia o fragmento, con sugerencias en vivo que muestran tipo y potencia.', p: 'Alta', a: 'Visitante', cu: 'CU-02', ac: 'Al escribir «sw12» aparecen sugerencias de modelos SW12 en ≤ 1 s; un modelo exacto abre su ficha.', e: 'EXI' },
  { id: 'RF-003', n: 'Filtrar productos', d: 'Filtros por categoría y atributos, con una URL que se puede compartir y conserva el filtro aplicado.', p: 'Media', a: 'Visitante', cu: 'CU-03', ac: 'Al abrir la URL filtrada en otra sesión, se muestra el mismo resultado.', e: 'EXI' },
  { id: 'RF-004', n: 'Mostrar ficha técnica', d: 'La ficha presenta modelo, categoría, imágenes, especificaciones estructuradas y productos relacionados.', p: 'Alta', a: 'Visitante', cu: 'CU-04', ac: 'Toda ficha publicada muestra modelo, categoría, imagen principal y la sección de especificaciones.', e: 'PAR' },
  { id: 'RF-005', n: 'Señalar datos no verificados', d: 'Los atributos técnicos sin fuente verificada se muestran como «Pendiente de verificación» y nunca se estiman.', p: 'Alta', a: 'Gestor del catálogo', cu: 'CU-14', ac: 'Una especificación con estado PENDIENTE se muestra con esa etiqueta y sin valor inventado.', e: 'PRO' },
  { id: 'RF-006', n: 'Operar en modo catálogo', d: 'No se muestran precios, carrito ni checkout; la acción principal de la ficha es «Cotizar».', p: 'Alta', a: 'Visitante', cu: 'CU-04', ac: 'Ninguna página pública muestra precio ni botón «Añadir al carrito»; /cart/ y /checkout/ no forman parte del flujo.', e: 'EXI' },
  { id: 'RF-007', n: 'Agregar y quitar del comparador', d: 'El visitante agrega productos al comparador desde la tarjeta o la ficha, con un máximo de 3.', p: 'Alta', a: 'Visitante', cu: 'CU-05', ac: 'Al intentar agregar un cuarto producto, el sistema lo impide y lo informa.', e: 'EXI' },
  { id: 'RF-008', n: 'Mostrar tabla comparativa', d: 'Tabla de especificaciones alineadas por atributo, con «Cotizar por WhatsApp» y «Quitar» en cada columna.', p: 'Alta', a: 'Visitante', cu: 'CU-05', ac: 'Los atributos comunes aparecen en la misma fila; si un producto no tiene el dato, la celda indica «Pendiente de verificación».', e: 'EXI' },
  { id: 'RF-009', n: 'Conservar la selección', d: 'La selección del comparador se mantiene al navegar entre páginas durante la sesión.', p: 'Media', a: 'Visitante', cu: 'CU-05', ac: 'Tras cambiar de página, el comparador conserva los mismos productos.', e: 'EXI' },
  { id: 'RF-010', n: 'Publicar novedades', d: 'Listado y detalle de novedades (lanzamientos, eventos, contenido de marca).', p: 'Baja', a: 'Visitante', cu: 'CU-06', ac: 'Una novedad publicada aparece en el listado ordenada por fecha.', e: 'PEN' },
  { id: 'RF-011', n: 'Directorio de distribuidores', d: 'Listado de distribuidores activos, filtrable por región y ciudad, con enlace de contacto.', p: 'Alta', a: 'Cliente interesado', cu: 'CU-07', ac: 'Al filtrar por ciudad solo aparecen distribuidores activos de esa ciudad.', e: 'PRO' },
  { id: 'RF-012', n: 'Generar enlace de WhatsApp', d: 'Enlace de clic para chatear con un mensaje prellenado que incluye la intención (cotizar, dónde comprar, soporte) y el modelo.', p: 'Alta', a: 'Cliente interesado', cu: 'CU-08', ac: 'Desde la ficha de BH-SW12XXG, el mensaje contiene «cotizar el modelo BH-SW12XXG».', e: 'EXI' },
  { id: 'RF-013', n: 'Incluir la URL del producto', d: 'El mensaje de WhatsApp incluye la URL canónica de la ficha consultada.', p: 'Media', a: 'Cliente interesado', cu: 'CU-08', ac: 'El texto decodificado del enlace contiene la URL de la ficha de origen.', e: 'PRO' },
  { id: 'RF-014', n: 'Registrar consulta comercial', d: 'Antes de abrir WhatsApp se registran la fecha y hora, el producto, el origen, la intención y el destino, sin datos personales.', p: 'Alta', a: 'Cliente interesado', cu: 'CU-09', ac: 'Cada clic en «Cotizar» crea un registro con estado REGISTRADA, y el registro no retrasa la apertura de WhatsApp.', e: 'PRO' },
  { id: 'RF-015', n: 'Solicitar alta de distribuidor', d: 'Formulario con empresa, RUC, ciudad, WhatsApp, número de tiendas y consentimiento de privacidad.', p: 'Media', a: 'Distribuidor', cu: 'CU-10', ac: 'El formulario rechaza un RUC que no tenga 11 dígitos y no se puede enviar sin aceptar el consentimiento.', e: 'PAR' },
  { id: 'RF-016', n: 'Autenticar usuarios internos', d: 'Inicio de sesión con credenciales y cierre por inactividad; el acceso depende del rol.', p: 'Alta', a: 'Gestor del catálogo', cu: 'CU-11', ac: 'Un usuario sin rol interno no accede al panel de administración.', e: 'BASE' },
  { id: 'RF-017', n: 'Gestionar productos', d: 'Crear, editar, publicar, despublicar y descontinuar productos, con estados BORRADOR, PUBLICADO y DESCONTINUADO.', p: 'Alta', a: 'Gestor del catálogo', cu: 'CU-12', ac: 'No se puede publicar un producto sin modelo único, una categoría y una imagen principal.', e: 'BASE' },
  { id: 'RF-018', n: 'Gestionar categorías', d: 'Categorías jerárquicas (padre e hija) con nombre, slug y descripción.', p: 'Alta', a: 'Gestor del catálogo', cu: 'CU-13', ac: 'No se puede eliminar una categoría que tenga productos asignados sin reasignarlos antes.', e: 'BASE' },
  { id: 'RF-019', n: 'Gestionar especificaciones', d: 'Especificaciones como pares atributo-valor-unidad, con estado de verificación y fuente.', p: 'Alta', a: 'Gestor del catálogo', cu: 'CU-14', ac: 'Cada especificación registra atributo, valor o PENDIENTE, unidad y fuente.', e: 'PAR' },
  { id: 'RF-020', n: 'Gestionar imágenes', d: 'Carga de imágenes con texto alternativo obligatorio, orden y marca de imagen principal.', p: 'Media', a: 'Gestor del catálogo', cu: 'CU-15', ac: 'El sistema no guarda una imagen sin texto alternativo.', e: 'PRO' },
  { id: 'RF-021', n: 'Gestionar distribuidores', d: 'Alta, edición, aprobación, suspensión y baja de distribuidores; revisión de las solicitudes recibidas.', p: 'Alta', a: 'Gestor del catálogo', cu: 'CU-16', ac: 'Solo los distribuidores ACTIVOS aparecen en el directorio público.', e: 'PRO' },
  { id: 'RF-022', n: 'Gestionar contenido y novedades', d: 'Crear, programar y publicar novedades y páginas institucionales.', p: 'Media', a: 'Gestor del catálogo', cu: 'CU-17', ac: 'Una novedad programada se publica en la fecha indicada.', e: 'BASE' },
  { id: 'RF-023', n: 'Dar seguimiento a consultas', d: 'Listar consultas, cambiar su estado (atendida, derivada, cerrada o descartada), asignar distribuidor y registrar observaciones.', p: 'Alta', a: 'Gestor del catálogo', cu: 'CU-18', ac: 'Cada cambio de estado guarda el usuario y la hora; no se permite cerrar una consulta REGISTRADA sin atenderla.', e: 'PRO' },
  { id: 'RF-024', n: 'Gestionar usuarios y roles', d: 'Crear usuarios, asignar roles (Administrador, Gestor del catálogo), desactivar cuentas.', p: 'Alta', a: 'Administrador del sistema', cu: 'CU-19', ac: 'Solo el Administrador puede asignar roles; el Gestor no ve la opción.', e: 'BASE' },
  { id: 'RF-025', n: 'Generar reportes', d: 'Reportes de consultas por producto, categoría, origen y periodo, y de productos más comparados, con exportación a CSV.', p: 'Media', a: 'Administrador del sistema', cu: 'CU-20', ac: 'El total del reporte coincide con los registros del periodo, y el CSV se abre en una hoja de cálculo.', e: 'PRO' },
  { id: 'RF-026', n: 'Registrar auditoría', d: 'Toda creación, modificación o eliminación administrativa registra usuario, acción, entidad, fecha y dirección IP.', p: 'Alta', a: 'Administrador del sistema', cu: 'CU-21', ac: 'Editar un producto genera un registro de auditoría consultable por el Administrador.', e: 'PRO' },
  { id: 'RF-027', n: 'Respaldar y restaurar', d: 'Respaldos programados de la base de datos y los archivos, con procedimiento de restauración probado.', p: 'Alta', a: 'Administrador del sistema', cu: 'CU-22', ac: 'Existe un respaldo diario y la restauración de prueba en staging concluye sin errores.', e: 'PEN' },
];

const RNF = [
  { id: 'RNF-001', c: 'Usabilidad', n: 'Ruta corta a la consulta', d: 'Desde cualquier ficha, la consulta por WhatsApp se inicia en una sola interacción visible sin desplazarse.', p: 'Alta', ac: 'Prueba con 5 usuarios: ≥ 4 inician la consulta sin ayuda en < 30 s.', e: 'EXI' },
  { id: 'RNF-002', c: 'Portabilidad', n: 'Diseño adaptable', d: 'La interfaz se usa entre 360 y 1440 px de ancho sin desplazamiento horizontal.', p: 'Alta', ac: 'Sin scroll horizontal en 360, 390, 768, 1024 y 1440 px.', e: 'EXI' },
  { id: 'RNF-003', c: 'Eficiencia', n: 'Rendimiento de carga', d: 'Umbrales de Core Web Vitals en «bueno» en el percentil 75: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1.', p: 'Alta', ac: 'PageSpeed Insights (datos de campo, o de laboratorio si no hay de campo) en home, catálogo y ficha.', e: 'PEN' },
  { id: 'RNF-004', c: 'Seguridad', n: 'Acceso protegido', d: 'HTTPS obligatorio, privilegio mínimo por rol, segundo factor para cuentas administrativas y bloqueo tras intentos fallidos.', p: 'Alta', ac: 'La cuenta de Administrador exige segundo factor; 5 intentos fallidos bloquean el acceso durante 15 min.', e: 'PRO' },
  { id: 'RNF-005', c: 'Seguridad', n: 'Protección de datos personales', d: 'Tratamiento con consentimiento informado y finalidad declarada, conforme a la Ley N.° 29733.', p: 'Alta', ac: 'Los formularios enlazan la política de privacidad y no envían datos sin consentimiento.', e: 'PAR' },
  { id: 'RNF-006', c: 'Fiabilidad', n: 'Disponibilidad', d: 'Disponibilidad mensual objetivo ≥ 99,5 % del sitio público.', p: 'Media', ac: 'Monitor externo con verificación cada 5 min; informe mensual.', e: 'PRO' },
  { id: 'RNF-007', c: 'Compatibilidad', n: 'Navegadores', d: 'Soporte para las 2 últimas versiones de Chrome, Safari, Firefox y Edge.', p: 'Media', ac: 'Lista de verificación funcional en los 4 navegadores.', e: 'PEN' },
  { id: 'RNF-008', c: 'Usabilidad', n: 'Accesibilidad', d: 'Criterios WCAG 2.1 nivel AA en contraste, texto alternativo, foco visible y navegación por teclado.', p: 'Media', ac: 'Sin errores críticos en la auditoría automática y revisión manual con teclado.', e: 'PAR' },
  { id: 'RNF-009', c: 'Mantenibilidad', n: 'Extensión sin modificar el núcleo', d: 'Las personalizaciones residen en el tema hijo y en un plugin propio (bh-core), nunca en el núcleo ni en plugins de terceros.', p: 'Alta', ac: 'Actualizar WordPress, WooCommerce y el tema padre no borra ninguna personalización.', e: 'PAR' },
  { id: 'RNF-010', c: 'Fiabilidad', n: 'Recuperación', d: 'Objetivos de recuperación RPO ≤ 24 h y RTO ≤ 4 h.', p: 'Alta', ac: 'Simulacro de restauración documentado en staging.', e: 'PRO' },
  { id: 'RNF-011', c: 'Funcionalidad', n: 'Posicionamiento orgánico (SEO)', d: 'URL amigables, metadatos únicos, datos estructurados de producto, sitemap XML y canonical correcto en producción.', p: 'Media', ac: 'Cada ficha tiene title, meta description y canonical propios; el sitemap lista solo páginas indexables.', e: 'PAR' },
  { id: 'RNF-012', c: 'Usabilidad', n: 'Idioma consistente', d: 'Interfaz pública íntegramente en español.', p: 'Media', ac: 'No aparecen cadenas en inglés («Showing…», «Default sorting», «Quick View»).', e: 'EXI' },
  { id: 'RNF-013', c: 'Seguridad', n: 'Retención de auditoría', d: 'Los registros de auditoría se conservan 12 meses y no pueden editarse desde la interfaz.', p: 'Media', ac: 'No existe operación de edición sobre RegistroAuditoria.', e: 'PRO' },
];

const COMPONENTES = [
  { id: 'COMP-01', n: 'Tema hijo Black Hawk', d: 'Plantillas de catálogo, ficha, home y páginas; estilos y experiencia móvil.', e: 'EXI' },
  { id: 'COMP-02', n: 'WooCommerce', d: 'Productos, categorías (product_cat), atributos y galería.', e: 'EXI' },
  { id: 'COMP-03', n: 'YITH Catalog Mode', d: 'Oculta precio, carrito y checkout.', e: 'EXI' },
  { id: 'COMP-04', n: 'Módulo de búsqueda y filtros', d: 'Sugerencias en vivo y filtros compartibles.', e: 'EXI' },
  { id: 'COMP-05', n: 'Módulo comparador', d: 'Selección en el cliente (hasta 3) y tabla de especificaciones.', e: 'EXI' },
  { id: 'COMP-06', n: 'Módulo de consultas WhatsApp', d: 'Generador de enlaces wa.me y registro de la consulta (endpoint REST).', e: 'PAR' },
  { id: 'COMP-07', n: 'Módulo de distribuidores', d: 'Tipo de contenido Distribuidor, directorio y revisión de solicitudes.', e: 'PRO' },
  { id: 'COMP-08', n: 'Módulo de reportes y auditoría', d: 'Tablas propias, informes CSV y bitácora de cambios.', e: 'PRO' },
  { id: 'COMP-09', n: 'Núcleo WordPress', d: 'Usuarios, roles y capacidades, contenido, REST API y medios.', e: 'EXI' },
  { id: 'COMP-10', n: 'Base de datos MySQL/MariaDB', d: 'Tablas wp_* y tablas propias wp_bh_*.', e: 'EXI' },
];

// Casos de prueba (diseñados; ninguno ejecutado como parte de este proyecto académico)
const CP = [
  { id: 'CP-001', rf: 'RF-001', t: 'Funcional', n: 'Listado y contador de la categoría Subwoofer', r: 'Contador = n.º de tarjetas publicadas' },
  { id: 'CP-002', rf: 'RF-002', t: 'Funcional', n: 'Sugerencias en vivo para «sw12»', r: 'Solo modelos SW12, respuesta ≤ 1 s' },
  { id: 'CP-003', rf: 'RF-003', t: 'Funcional', n: 'URL filtrada abierta en una sesión nueva', r: 'Mismo conjunto de resultados' },
  { id: 'CP-004', rf: 'RF-004', t: 'Sistema', n: 'Campos mínimos en todas las fichas publicadas', r: '0 fichas sin modelo, categoría o imagen' },
  { id: 'CP-005', rf: 'RF-005', t: 'Unitaria', n: 'Presentador de especificación con estado PENDIENTE', r: 'Devuelve la etiqueta «Pendiente de verificación»' },
  { id: 'CP-006', rf: 'RF-006', t: 'Sistema', n: 'Ausencia de precio, carrito y checkout', r: 'Sin precio ni «Añadir al carrito» en 20 URL públicas' },
  { id: 'CP-007', rf: 'RF-007', t: 'Unitaria', n: 'Límite de 3 en el comparador', r: 'agregar(4.º) → rechazado con aviso' },
  { id: 'CP-008', rf: 'RF-008', t: 'Integración', n: 'Tabla comparativa desde REST', r: 'Filas alineadas por atributo; faltantes marcados' },
  { id: 'CP-009', rf: 'RF-009', t: 'Funcional', n: 'Persistencia entre páginas', r: 'Misma selección tras navegar' },
  { id: 'CP-010', rf: 'RF-010', t: 'Funcional', n: 'Orden del listado de novedades', r: 'Orden descendente por fecha' },
  { id: 'CP-011', rf: 'RF-011', t: 'Integración', n: 'Directorio filtrado por ciudad', r: 'Solo distribuidores ACTIVOS de la ciudad' },
  { id: 'CP-012', rf: 'RF-012', t: 'Unitaria', n: 'Construcción del mensaje wa.me', r: 'Texto codificado con intención y modelo' },
  { id: 'CP-013', rf: 'RF-013', t: 'Unitaria', n: 'URL canónica incluida en el mensaje', r: 'El texto decodificado contiene la URL' },
  { id: 'CP-014', rf: 'RF-014', t: 'Integración', n: 'Registro previo a la redirección', r: 'Registro REGISTRADA creado; WhatsApp abre sin demora perceptible' },
  { id: 'CP-015', rf: 'RF-015', t: 'Funcional', n: 'Validación de RUC y consentimiento', r: 'Rechazo si el RUC ≠ 11 dígitos o no hay consentimiento' },
  { id: 'CP-016', rf: 'RF-016', t: 'Sistema', n: 'Acceso al panel sin rol interno', r: 'Acceso denegado' },
  { id: 'CP-017', rf: 'RF-017', t: 'Funcional', n: 'Publicación con campos obligatorios', r: 'Publicación bloqueada si falta un campo' },
  { id: 'CP-018', rf: 'RF-018', t: 'Funcional', n: 'Eliminación de una categoría con productos', r: 'Bloqueada con mensaje de reasignación' },
  { id: 'CP-019', rf: 'RF-019', t: 'Unitaria', n: 'Especificación sin fuente', r: 'Estado PENDIENTE obligatorio' },
  { id: 'CP-020', rf: 'RF-020', t: 'Funcional', n: 'Imagen sin texto alternativo', r: 'Guardado rechazado' },
  { id: 'CP-021', rf: 'RF-021', t: 'Funcional', n: 'Aprobación de una solicitud de distribuidor', r: 'Estado ACTIVO y visible en el directorio' },
  { id: 'CP-022', rf: 'RF-022', t: 'Funcional', n: 'Novedad programada', r: 'Publicada en la fecha indicada' },
  { id: 'CP-023', rf: 'RF-023', t: 'Integración', n: 'Cambio de estado de una consulta', r: 'Transición válida y auditada' },
  { id: 'CP-024', rf: 'RF-024', t: 'Sistema', n: 'El Gestor intenta asignar un rol', r: 'Operación no disponible' },
  { id: 'CP-025', rf: 'RF-025', t: 'Integración', n: 'Totales del reporte frente a registros', r: 'Coincidencia exacta; CSV válido' },
  { id: 'CP-026', rf: 'RF-026', t: 'Integración', n: 'Auditoría al editar un producto', r: 'Registro con usuario, acción e IP' },
  { id: 'CP-027', rf: 'RF-027', t: 'Sistema', n: 'Restauración de respaldo en staging', r: 'Sitio operativo; RTO ≤ 4 h' },
  { id: 'CP-028', rf: 'RNF-002', t: 'Sistema', n: 'Diseño adaptable en 5 anchos', r: 'Sin scroll horizontal' },
  { id: 'CP-029', rf: 'RNF-003', t: 'Sistema', n: 'Core Web Vitals en home, catálogo y ficha', r: 'LCP ≤ 2,5 s; CLS ≤ 0,1' },
  { id: 'CP-030', rf: 'RNF-004', t: 'Sistema', n: 'Bloqueo tras 5 intentos fallidos', r: 'Cuenta bloqueada 15 min' },
  { id: 'CP-031', rf: 'RNF-001', t: 'Aceptación', n: 'Prueba de usabilidad con 5 usuarios', r: '≥ 4 de 5 inician la consulta sin ayuda' },
  { id: 'CP-032', rf: 'RNF-010', t: 'Aceptación', n: 'Simulacro de recuperación', r: 'RPO ≤ 24 h, RTO ≤ 4 h' },
];

// Trazabilidad: necesidad → requisitos → CU → componente → pruebas
const TRAZA = [
  { nb: 'NB-01', rf: ['RF-004', 'RF-017', 'RF-018'], cu: ['CU-04', 'CU-12', 'CU-13'], comp: ['COMP-02', 'COMP-01'], cp: ['CP-004', 'CP-017', 'CP-018'] },
  { nb: 'NB-02', rf: ['RF-004', 'RF-005', 'RF-019'], cu: ['CU-04', 'CU-14'], comp: ['COMP-01', 'COMP-02'], cp: ['CP-004', 'CP-005', 'CP-019'] },
  { nb: 'NB-03', rf: ['RF-001', 'RF-002', 'RF-003'], cu: ['CU-01', 'CU-02', 'CU-03'], comp: ['COMP-04'], cp: ['CP-001', 'CP-002', 'CP-003'] },
  { nb: 'NB-04', rf: ['RF-007', 'RF-008', 'RF-009'], cu: ['CU-05'], comp: ['COMP-05'], cp: ['CP-007', 'CP-008', 'CP-009'] },
  { nb: 'NB-05', rf: ['RF-006', 'RF-011', 'RF-012', 'RF-013'], cu: ['CU-07', 'CU-08'], comp: ['COMP-03', 'COMP-06', 'COMP-07'], cp: ['CP-006', 'CP-011', 'CP-012', 'CP-013'] },
  { nb: 'NB-06', rf: ['RF-014', 'RF-023', 'RF-025'], cu: ['CU-09', 'CU-18', 'CU-20'], comp: ['COMP-06', 'COMP-08'], cp: ['CP-014', 'CP-023', 'CP-025'] },
  { nb: 'NB-07', rf: ['RF-010', 'RF-017', 'RF-019', 'RF-020', 'RF-022'], cu: ['CU-06', 'CU-12', 'CU-14', 'CU-15', 'CU-17'], comp: ['COMP-02', 'COMP-09'], cp: ['CP-010', 'CP-017', 'CP-019', 'CP-020', 'CP-022'] },
  { nb: 'NB-08', rf: ['RF-016', 'RF-024', 'RF-026', 'RF-027'], cu: ['CU-11', 'CU-19', 'CU-21', 'CU-22'], comp: ['COMP-09', 'COMP-08', 'COMP-10'], cp: ['CP-016', 'CP-024', 'CP-026', 'CP-027'] },
  { nb: 'NB-09', rf: ['RF-015', 'RF-021'], cu: ['CU-10', 'CU-16'], comp: ['COMP-07'], cp: ['CP-015', 'CP-021'] },
];

// Componente principal por requisito, para el catálogo del anexo
const RF_COMP = {
  'RF-001': 'COMP-01', 'RF-002': 'COMP-04', 'RF-003': 'COMP-04', 'RF-004': 'COMP-01', 'RF-005': 'COMP-01',
  'RF-006': 'COMP-03', 'RF-007': 'COMP-05', 'RF-008': 'COMP-05', 'RF-009': 'COMP-05', 'RF-010': 'COMP-09',
  'RF-011': 'COMP-07', 'RF-012': 'COMP-06', 'RF-013': 'COMP-06', 'RF-014': 'COMP-06', 'RF-015': 'COMP-07',
  'RF-016': 'COMP-09', 'RF-017': 'COMP-02', 'RF-018': 'COMP-02', 'RF-019': 'COMP-02', 'RF-020': 'COMP-09',
  'RF-021': 'COMP-07', 'RF-022': 'COMP-09', 'RF-023': 'COMP-08', 'RF-024': 'COMP-09', 'RF-025': 'COMP-08',
  'RF-026': 'COMP-08', 'RF-027': 'COMP-10',
};

const REGLAS = [
  ['RN-01', 'El sitio no procesa pedidos ni pagos: la compra se concreta con el equipo comercial o el distribuidor, fuera del sistema.'],
  ['RN-02', 'Para publicar un producto se requieren un modelo único, al menos una categoría y una imagen principal con texto alternativo.'],
  ['RN-03', 'Una especificación sin fuente verificada se publica como «Pendiente de verificación»; nunca se estima su valor.'],
  ['RN-04', 'El comparador admite como máximo 3 productos a la vez.'],
  ['RN-05', 'Todo mensaje de WhatsApp generado por el sitio declara la intención y, cuando existe, el modelo consultado.'],
  ['RN-06', 'Solo los distribuidores en estado ACTIVO aparecen en el directorio público.'],
  ['RN-07', 'Los datos personales solo se recogen con consentimiento explícito y enlace a la política de privacidad.'],
  ['RN-08', 'Solo el Administrador del sistema crea usuarios y asigna roles.'],
  ['RN-09', 'Toda operación administrativa de creación, modificación o eliminación genera un registro de auditoría.'],
  ['RN-10', 'Los nombres de los modelos se publican exactamente como los define la marca.'],
];

const RESTRICCIONES = [
  'Se mantiene la plataforma existente: WordPress + WooCommerce, tema hijo y YITH Catalog Mode.',
  'No se incorpora checkout, pasarela de pagos, gestión de inventario ni facturación.',
  'WhatsApp se integra con enlaces de clic para chatear (wa.me); la API de WhatsApp Business queda fuera del alcance.',
  'Duración académica de 14 semanas y equipo de 5 integrantes.',
  'No se usan datos reales de ventas, tráfico ni conversiones: no se dispone de Analytics ni de Search Console.',
  'Las funcionalidades propuestas se diseñan y especifican; su implementación en producción requiere la validación de Black Hawk.',
];

const ALCANCE_IN = [
  'Catálogo público: categorías, búsqueda, filtros, fichas técnicas y modo catálogo.',
  'Comparador de hasta 3 productos.',
  'Consultas por WhatsApp con mensaje prellenado y registro previo (ampliación).',
  'Directorio de distribuidores y solicitudes de incorporación (ampliación).',
  'Administración de catálogo, categorías, especificaciones, imágenes y novedades.',
  'Seguimiento de consultas, reportes, roles, auditoría y respaldos (ampliación).',
];
const ALCANCE_OUT = [
  'Venta en línea: carrito, checkout, pagos y wishlist.',
  'Inventario, stock por distribuidor, precios y facturación (ERP).',
  'CRM completo y chatbot sobre la API de WhatsApp Business.',
  'Aplicación móvil nativa.',
  'Migración de hosting o cambio de CMS.',
];

const STAKEHOLDERS = [
  { n: 'Gerencia de Black Hawk', r: 'Patrocinador', i: 'Imagen de marca, canal comercial ordenado, decisiones de alcance.', inf: 'Alta', int: 'Alta' },
  { n: 'Área comercial', r: 'Usuario clave', i: 'Recibir consultas con el modelo identificado y derivar a puntos de venta.', inf: 'Alta', int: 'Alta' },
  { n: 'Gestor de contenidos / marketing', r: 'Usuario interno', i: 'Actualizar el catálogo sin depender del desarrollador.', inf: 'Media', int: 'Alta' },
  { n: 'Distribuidores y tiendas', r: 'Usuario externo', i: 'Recibir clientes derivados y figurar en el directorio.', inf: 'Media', int: 'Alta' },
  { n: 'Clientes finales', r: 'Usuario externo', i: 'Encontrar, comparar y consultar productos con información fiable.', inf: 'Baja', int: 'Alta' },
  { n: 'Equipo de desarrollo (proyecto)', r: 'Proveedor', i: 'Requisitos estables, acceso a staging, criterios de aceptación claros.', inf: 'Media', int: 'Alta' },
  { n: 'Proveedor de hosting', r: 'Soporte externo', i: 'Operación estable del servidor y respaldos.', inf: 'Baja', int: 'Baja' },
  { n: 'Docente del curso', r: 'Evaluador académico', i: 'Aplicación correcta de RUP y UML.', inf: 'Alta', int: 'Media' },
];

const EQUIPO = [
  { rol: 'Jefe de proyecto', resp: 'Plan de iteraciones, riesgos, hitos y comunicación' },
  { rol: 'Analista de negocio y requisitos', resp: 'Modelo del negocio, visión, requisitos y casos de uso' },
  { rol: 'Arquitecto de software', resp: 'Arquitectura, modelo de datos, decisiones técnicas' },
  { rol: 'Desarrollador WordPress/PHP', resp: 'Tema hijo, plugin bh-core, integraciones' },
  { rol: 'Analista de pruebas y despliegue', resp: 'Plan de pruebas, casos de prueba, despliegue y respaldo' },
];

// Fases e iteraciones (semanas académicas)
const FASES = [
  {
    n: 'Inicio', en: 'Inception', hito: 'LCO — Lifecycle Objectives', sem: [1, 2], it: ['I1'],
    obj: 'Acordar el problema, la visión, el alcance y la viabilidad del sistema.',
    act: ['Modelado del negocio (procesos y actores)', 'Visión y alcance', 'Requisitos preliminares y reglas de negocio', 'Lista inicial de riesgos', 'Caso de negocio y viabilidad'],
    resp: 'Jefe de proyecto, Analista de negocio',
    art: ['Documento de visión', 'Modelo de casos de uso del negocio', 'Glosario', 'Lista de riesgos', 'Caso de negocio', 'Plan de desarrollo de software'],
    riesgos: ['R-08', 'R-11'],
    crit: ['Los stakeholders aceptan la visión y el alcance', 'Casos de uso críticos identificados (≈ 20 %)', 'Riesgos principales con plan de respuesta', 'Viabilidad técnica, económica y operativa aprobada'],
  },
  {
    n: 'Elaboración', en: 'Elaboration', hito: 'LCA — Lifecycle Architecture', sem: [3, 6], it: ['E1', 'E2'],
    obj: 'Estabilizar los requisitos y validar una arquitectura ejecutable que elimine los riesgos técnicos principales.',
    act: ['Especificación de casos de uso', 'Modelo de dominio y de análisis', 'Arquitectura lógica, física y de datos', 'Prototipos de interfaz', 'Prototipo arquitectónico: registro de consulta y enlace de WhatsApp', 'Plan de pruebas'],
    resp: 'Arquitecto, Analista de negocio',
    art: ['Especificación de requisitos (SRS)', 'Especificaciones de casos de uso', 'Documento de arquitectura de software (SAD)', 'Modelo de diseño y de datos', 'Prototipo arquitectónico', 'Plan de pruebas'],
    riesgos: ['R-01', 'R-02', 'R-03', 'R-05'],
    crit: ['≥ 80 % de los casos de uso especificados', 'Arquitectura probada con el prototipo del flujo de consulta', 'Riesgos técnicos altos mitigados', 'Plan de construcción por iteraciones aprobado'],
  },
  {
    n: 'Construcción', en: 'Construction', hito: 'IOC — Initial Operational Capability', sem: [7, 12], it: ['C1', 'C2', 'C3'],
    obj: 'Completar el desarrollo por incrementos y alcanzar un producto estable para usuarios beta.',
    act: ['C1: catálogo, fichas, especificaciones y modo catálogo', 'C2: comparador, WhatsApp y registro de consultas', 'C3: distribuidores, reportes, roles, auditoría y seguridad', 'Pruebas unitarias, de integración, funcionales y de sistema', 'Gestión de incidencias y versiones'],
    resp: 'Desarrollador, Analista de pruebas',
    art: ['Código del tema hijo y del plugin bh-core', 'Build versionado (Git)', 'Informe de pruebas por iteración', 'Manual técnico', 'Registro de incidencias'],
    riesgos: ['R-02', 'R-06', 'R-07'],
    crit: ['Casos de uso de prioridad alta implementados', '0 incidencias críticas abiertas', 'Pruebas de integración y de sistema aprobadas', 'Manuales en borrador'],
  },
  {
    n: 'Transición', en: 'Transition', hito: 'PR — Product Release', sem: [13, 14], it: ['T1'],
    obj: 'Poner el sistema en manos de los usuarios con calidad aceptable, capacitación y soporte.',
    act: ['Pruebas de aceptación y de usabilidad', 'Capacitación del gestor y del administrador', 'Preparación del entorno productivo', 'Despliegue, respaldo y monitoreo', 'Corrección de incidencias y cierre'],
    resp: 'Jefe de proyecto, Analista de pruebas y despliegue',
    art: ['Acta de aceptación', 'Manual de usuario', 'Plan de despliegue y de reversión', 'Plan de respaldo', 'Informe de cierre y lecciones aprendidas'],
    riesgos: ['R-09', 'R-12', 'R-10'],
    crit: ['Pruebas de aceptación aprobadas', 'Usuarios capacitados', 'Respaldo y restauración verificados', 'Acta de conformidad firmada'],
  },
];

const ITERACIONES = [
  { id: 'I1', f: 'Inicio', s: [1, 2], obj: 'Visión, alcance, modelo del negocio, riesgos y caso de negocio.', ent: 'Visión aprobada (LCO)', cu: '—' },
  { id: 'E1', f: 'Elaboración', s: [3, 4], obj: 'Requisitos detallados, casos de uso y modelo de dominio.', ent: 'SRS y especificaciones de casos de uso', cu: 'CU-04, CU-05, CU-08' },
  { id: 'E2', f: 'Elaboración', s: [5, 6], obj: 'Arquitectura, modelo de datos, prototipos y prototipo arquitectónico del flujo de consulta.', ent: 'SAD y prototipo (LCA)', cu: 'CU-08, CU-09, CU-12' },
  { id: 'C1', f: 'Construcción', s: [7, 8], obj: 'Catálogo, categorías, fichas, especificaciones, imágenes y modo catálogo.', ent: 'Incremento 1', cu: 'CU-01…CU-04, CU-12…CU-15' },
  { id: 'C2', f: 'Construcción', s: [9, 10], obj: 'Comparador, WhatsApp, registro y seguimiento de consultas.', ent: 'Incremento 2', cu: 'CU-05, CU-08, CU-09, CU-18' },
  { id: 'C3', f: 'Construcción', s: [11, 12], obj: 'Distribuidores, novedades, roles, reportes, auditoría y seguridad.', ent: 'Incremento 3 (IOC)', cu: 'CU-06, CU-07, CU-10, CU-16, CU-17, CU-19…CU-22' },
  { id: 'T1', f: 'Transición', s: [13, 14], obj: 'Aceptación, capacitación, despliegue y cierre.', ent: 'Versión de producción (PR)', cu: 'Todos' },
];

// Esfuerzo estimado (supuesto académico): 5 integrantes × 14 semanas × 8 h
const ESFUERZO = [
  { f: 'Inicio', h: 40 }, { f: 'Elaboración', h: 140 }, { f: 'Construcción', h: 300 }, { f: 'Transición', h: 80 },
];
const TARIFA_REF = 30; // S/ por hora, valor hipotético con fines académicos

// Disciplinas × fases: intensidad 0-4
const DISCIPLINAS = [
  { n: 'Modelado del negocio', t: 'Ingeniería', v: [4, 2, 1, 0], d: 'Procesos comerciales de Black Hawk, actores y casos de uso del negocio.' },
  { n: 'Requisitos', t: 'Ingeniería', v: [3, 4, 1, 0], d: 'Visión, RF/RNF, casos de uso y validación con el área comercial.' },
  { n: 'Análisis y diseño', t: 'Ingeniería', v: [1, 4, 2, 0], d: 'Modelo de dominio, arquitectura, clases, secuencias y datos.' },
  { n: 'Implementación', t: 'Ingeniería', v: [0, 2, 4, 1], d: 'Tema hijo, plugin bh-core, configuración de WooCommerce.' },
  { n: 'Pruebas', t: 'Ingeniería', v: [0, 1, 4, 3], d: 'Unitarias, integración, funcionales, sistema y aceptación.' },
  { n: 'Despliegue', t: 'Ingeniería', v: [0, 0, 1, 4], d: 'Staging → producción, respaldo, capacitación, manuales.' },
  { n: 'Gestión de configuración y cambios', t: 'Soporte', v: [1, 2, 3, 3], d: 'Git, ramas, versiones, solicitudes de cambio.' },
  { n: 'Gestión del proyecto', t: 'Soporte', v: [3, 3, 2, 2], d: 'Iteraciones, riesgos, seguimiento e hitos.' },
  { n: 'Entorno', t: 'Soporte', v: [2, 2, 1, 1], d: 'Herramientas (Rational Rose/PlantUML, Git, staging) y guías.' },
];

// Riesgos: prob e impacto en escala 1-5
const RIESGOS = [
  { id: 'R-01', n: 'Especificaciones técnicas incompletas o no verificadas', cat: 'Requisitos', p: 4, i: 4, m: 'Estado de verificación por atributo; publicar «Pendiente de verificación»; validar con el área técnica de la marca.', resp: 'Analista de negocio' },
  { id: 'R-02', n: 'Actualización incompatible de plugins de terceros', cat: 'Técnico', p: 3, i: 4, m: 'Plugin propio desacoplado; staging previo a cada actualización; versiones fijadas y reversión.', resp: 'Arquitecto' },
  { id: 'R-03', n: 'Cambio en el formato de enlaces de WhatsApp', cat: 'Externo', p: 2, i: 4, m: 'Generador de enlaces centralizado en un único servicio; prueba automatizada del enlace.', resp: 'Desarrollador' },
  { id: 'R-04', n: 'Datos de distribuidores desactualizados', cat: 'Operativo', p: 4, i: 3, m: 'Fecha de última verificación y revisión trimestral; estado SUSPENDIDO.', resp: 'Gestor del catálogo' },
  { id: 'R-05', n: 'El registro de consultas no refleja el cierre real de la venta', cat: 'Negocio', p: 4, i: 3, m: 'Medir intención y no ventas; estados de seguimiento manuales; declarar la limitación en los reportes.', resp: 'Jefe de proyecto' },
  { id: 'R-06', n: 'Rendimiento degradado por imágenes y plugins', cat: 'Técnico', p: 3, i: 3, m: 'Formatos WebP/AVIF, tamaños responsivos, presupuesto de peso por página, auditoría con Lighthouse.', resp: 'Desarrollador' },
  { id: 'R-07', n: 'Vulnerabilidades de seguridad en WordPress', cat: 'Seguridad', p: 3, i: 5, m: 'Actualizaciones controladas, segundo factor, privilegio mínimo, WAF, auditoría y respaldos.', resp: 'Administrador' },
  { id: 'R-08', n: 'Baja disponibilidad del cliente para validar requisitos', cat: 'Proyecto', p: 3, i: 3, m: 'Sesiones de validación cortas al final de cada iteración; prototipos navegables.', resp: 'Jefe de proyecto' },
  { id: 'R-09', n: 'Inestabilidad del entorno temporal de staging', cat: 'Técnico', p: 5, i: 2, m: 'Staging con dominio estable; evidencia archivada; despliegue reproducible.', resp: 'Analista de pruebas' },
  { id: 'R-10', n: 'Tratamiento indebido de datos personales', cat: 'Legal', p: 2, i: 5, m: 'Consentimiento, minimización de datos (consultas anónimas), política de privacidad y control de acceso.', resp: 'Administrador' },
  { id: 'R-11', n: 'Crecimiento del alcance hacia e-commerce o ERP', cat: 'Proyecto', p: 3, i: 4, m: 'Alcance y exclusiones firmados en el LCO; control de cambios con análisis de impacto.', resp: 'Jefe de proyecto' },
  { id: 'R-12', n: 'Capacitación insuficiente del gestor', cat: 'Operativo', p: 3, i: 3, m: 'Manual con capturas, sesión práctica y período de acompañamiento.', resp: 'Analista de pruebas' },
];

// EDT/WBS
const EDT = [
  ['1', 'Proyecto SGCD-BH'],
  ['1.1', 'Gestión del proyecto'], ['1.1.1', 'Plan de desarrollo y de iteraciones'], ['1.1.2', 'Gestión de riesgos'], ['1.1.3', 'Seguimiento y control de hitos'],
  ['1.2', 'Inicio'], ['1.2.1', 'Modelo del negocio'], ['1.2.2', 'Visión y alcance'], ['1.2.3', 'Caso de negocio y viabilidad'],
  ['1.3', 'Elaboración'], ['1.3.1', 'Requisitos y casos de uso'], ['1.3.2', 'Arquitectura y modelo de datos'], ['1.3.3', 'Prototipos y prototipo arquitectónico'], ['1.3.4', 'Plan de pruebas'],
  ['1.4', 'Construcción'], ['1.4.1', 'C1 Catálogo y fichas'], ['1.4.2', 'C2 Comparador y consultas'], ['1.4.3', 'C3 Distribuidores, reportes y seguridad'], ['1.4.4', 'Pruebas e integración'],
  ['1.5', 'Transición'], ['1.5.1', 'Aceptación y usabilidad'], ['1.5.2', 'Capacitación y manuales'], ['1.5.3', 'Despliegue y respaldo'], ['1.5.4', 'Cierre'],
];

const GANTT = [
  { t: 'Modelo del negocio y visión', s: 1, e: 2, f: 'Inicio' },
  { t: 'Caso de negocio y riesgos', s: 2, e: 2, f: 'Inicio' },
  { t: 'Requisitos y casos de uso', s: 3, e: 4, f: 'Elaboración' },
  { t: 'Arquitectura y modelo de datos', s: 4, e: 6, f: 'Elaboración' },
  { t: 'Prototipos y prototipo arquitectónico', s: 5, e: 6, f: 'Elaboración' },
  { t: 'C1 Catálogo y fichas', s: 7, e: 8, f: 'Construcción' },
  { t: 'C2 Comparador y consultas', s: 9, e: 10, f: 'Construcción' },
  { t: 'C3 Distribuidores, reportes y seguridad', s: 11, e: 12, f: 'Construcción' },
  { t: 'Pruebas de integración y sistema', s: 8, e: 12, f: 'Construcción' },
  { t: 'Aceptación y capacitación', s: 13, e: 13, f: 'Transición' },
  { t: 'Despliegue y cierre', s: 14, e: 14, f: 'Transición' },
];
const HITOS = [{ n: 'LCO', s: 2 }, { n: 'LCA', s: 6 }, { n: 'IOC', s: 12 }, { n: 'PR', s: 14 }];

// Decisiones de arquitectura
const DECISIONES = [
  ['AD-01', 'Mantener WordPress + WooCommerce', 'Conserva los 118 productos, el contenido y el conocimiento del equipo; reescribir no aporta valor al problema.'],
  ['AD-02', 'Modo catálogo (YITH Catalog Mode)', 'El modelo comercial deriva la compra al distribuidor; un checkout sería una funcionalidad sin proceso de negocio detrás.'],
  ['AD-03', 'Tema hijo + plugin propio bh-core', 'Las actualizaciones del núcleo, del tema padre y de los plugins no sobrescriben las personalizaciones.'],
  ['AD-04', 'WhatsApp por clic para chatear (wa.me)', 'No requiere la API de pago ni la aprobación de plantillas; el registro se hace antes de redirigir, con navigator.sendBeacon.'],
  ['AD-05', 'Distribuidor como tipo de contenido personalizado', 'Reutiliza la edición, las revisiones y los permisos de WordPress; región y ciudad como taxonomía.'],
  ['AD-06', 'Tablas propias para consultas y auditoría', 'Son registros de alto volumen, se consultan por fecha y estado, y no son contenido editorial: no conviene guardarlos en wp_postmeta.'],
  ['AD-07', 'Comparador en el cliente + REST', 'La selección vive en localStorage (sin cuentas ni cookies de sesión); las especificaciones llegan por la REST API.'],
];

// Correspondencia entre las entidades lógicas y el almacenamiento físico en WordPress
const MAPEO = [
  ['Usuario', 'wp_users / wp_usermeta', 'BASE'],
  ['Rol, Permiso', 'wp_options (wp_user_roles) / capabilities', 'BASE'],
  ['Producto', 'wp_posts (post_type = product) / wp_postmeta', 'BASE'],
  ['Categoria', 'wp_terms / wp_term_taxonomy (product_cat)', 'BASE'],
  ['EspecificacionTecnica', 'Atributos de producto (pa_*) + metadatos de verificación', 'PAR'],
  ['ImagenProducto', 'wp_posts (attachment) / _product_image_gallery', 'BASE'],
  ['Novedad', 'wp_posts (post_type = post)', 'BASE'],
  ['Distribuidor', 'wp_posts (post_type = bh_distribuidor) / wp_postmeta', 'PRO'],
  ['ConsultaComercial', 'wp_bh_consulta (tabla propia)', 'PRO'],
  ['ComparacionProducto', 'wp_bh_comparacion / wp_bh_comparacion_producto', 'PRO'],
  ['RegistroAuditoria', 'wp_bh_auditoria (tabla propia)', 'PRO'],
];

// Diccionario de datos (modelo lógico)
const DICCIONARIO = {
  usuario: [['id_usuario', 'INT', 'PK', 'Identificador'], ['id_rol', 'INT', 'FK → rol', 'Rol asignado'], ['nombre', 'VARCHAR(120)', 'NOT NULL', 'Nombre completo'], ['email', 'VARCHAR(150)', 'UNIQUE', 'Correo de acceso'], ['password_hash', 'VARCHAR(255)', 'NOT NULL', 'Contraseña cifrada'], ['activo', 'BOOLEAN', 'DEFAULT 1', 'Cuenta habilitada'], ['ultimo_acceso', 'DATETIME', 'NULL', 'Último inicio de sesión']],
  rol: [['id_rol', 'INT', 'PK', 'Identificador'], ['nombre', 'VARCHAR(60)', 'UNIQUE', 'Administrador / Gestor del catálogo'], ['descripcion', 'VARCHAR(255)', 'NULL', 'Descripción']],
  permiso: [['id_permiso', 'INT', 'PK', 'Identificador'], ['clave', 'VARCHAR(80)', 'UNIQUE', 'Capacidad (p. ej., edit_products)'], ['descripcion', 'VARCHAR(255)', 'NULL', 'Descripción']],
  rol_permiso: [['id_rol', 'INT', 'PK, FK → rol', ''], ['id_permiso', 'INT', 'PK, FK → permiso', '']],
  categoria: [['id_categoria', 'INT', 'PK', 'Identificador'], ['id_padre', 'INT', 'FK → categoria, NULL', 'Categoría padre'], ['nombre', 'VARCHAR(80)', 'NOT NULL', 'Nombre visible'], ['slug', 'VARCHAR(80)', 'UNIQUE', 'Segmento de URL'], ['descripcion', 'TEXT', 'NULL', 'Descripción']],
  producto: [['id_producto', 'INT', 'PK', 'Identificador'], ['modelo', 'VARCHAR(40)', 'UNIQUE', 'Modelo exacto (p. ej., BH-4.8DSP)'], ['nombre', 'VARCHAR(150)', 'NOT NULL', 'Nombre comercial'], ['slug', 'VARCHAR(150)', 'UNIQUE', 'URL de la ficha'], ['descripcion', 'TEXT', 'NULL', 'Descripción'], ['estado', 'ENUM', 'BORRADOR | PUBLICADO | DESCONTINUADO', 'Estado de publicación'], ['destacado', 'BOOLEAN', 'DEFAULT 0', 'Destacado en la home'], ['fecha_publicacion', 'DATETIME', 'NULL', 'Fecha de publicación']],
  producto_categoria: [['id_producto', 'INT', 'PK, FK → producto', ''], ['id_categoria', 'INT', 'PK, FK → categoria', '']],
  especificacion_tecnica: [['id_especificacion', 'INT', 'PK', 'Identificador'], ['id_producto', 'INT', 'FK → producto', 'Producto'], ['atributo', 'VARCHAR(80)', 'NOT NULL', 'Nombre del atributo'], ['valor', 'VARCHAR(120)', 'NULL', 'Valor; NULL si está pendiente'], ['unidad', 'VARCHAR(20)', 'NULL', 'Unidad de medida'], ['estado_verificacion', 'ENUM', 'VERIFICADO | PENDIENTE', 'Estado del dato'], ['fuente', 'VARCHAR(255)', 'NULL', 'Documento de origen'], ['orden', 'SMALLINT', 'DEFAULT 0', 'Orden de presentación']],
  imagen_producto: [['id_imagen', 'INT', 'PK', 'Identificador'], ['id_producto', 'INT', 'FK → producto', 'Producto'], ['url', 'VARCHAR(255)', 'NOT NULL', 'Ruta del archivo'], ['texto_alternativo', 'VARCHAR(150)', 'NOT NULL', 'Texto alternativo'], ['orden', 'SMALLINT', 'DEFAULT 0', 'Orden en la galería'], ['es_principal', 'BOOLEAN', 'DEFAULT 0', 'Imagen principal']],
  distribuidor: [['id_distribuidor', 'INT', 'PK', 'Identificador'], ['razon_social', 'VARCHAR(150)', 'NOT NULL', 'Empresa'], ['ruc', 'CHAR(11)', 'UNIQUE', 'RUC (11 dígitos)'], ['region', 'VARCHAR(60)', 'NOT NULL', 'Región'], ['ciudad', 'VARCHAR(60)', 'NOT NULL', 'Ciudad'], ['direccion', 'VARCHAR(200)', 'NULL', 'Dirección del punto de venta'], ['whatsapp', 'VARCHAR(20)', 'NOT NULL', 'Número de contacto'], ['num_tiendas', 'SMALLINT', 'NULL', 'Número de tiendas'], ['estado', 'ENUM', 'SOLICITADO | ACTIVO | SUSPENDIDO | RECHAZADO', 'Estado'], ['consentimiento', 'BOOLEAN', 'NOT NULL', 'Aceptó la política de privacidad'], ['fecha_verificacion', 'DATE', 'NULL', 'Última verificación de datos']],
  consulta_comercial: [['id_consulta', 'BIGINT', 'PK', 'Identificador'], ['id_producto', 'INT', 'FK → producto, NULL', 'Producto consultado'], ['id_distribuidor', 'INT', 'FK → distribuidor, NULL', 'Distribuidor asignado'], ['id_usuario_atiende', 'INT', 'FK → usuario, NULL', 'Gestor que da seguimiento'], ['fecha_hora', 'DATETIME', 'NOT NULL', 'Momento del clic'], ['origen', 'ENUM', 'FICHA | COMPARADOR | VISTA_RAPIDA | DONDE_COMPRAR | SOPORTE | GENERAL', 'Página de origen'], ['intencion', 'ENUM', 'COTIZAR | DONDE_COMPRAR | SOPORTE', 'Intención declarada'], ['url_origen', 'VARCHAR(255)', 'NOT NULL', 'URL consultada'], ['mensaje', 'VARCHAR(500)', 'NOT NULL', 'Texto prellenado'], ['estado', 'ENUM', 'REGISTRADA | ATENDIDA | DERIVADA | CERRADA | DESCARTADA', 'Estado de seguimiento'], ['observacion', 'TEXT', 'NULL', 'Notas del gestor']],
  comparacion: [['id_comparacion', 'BIGINT', 'PK', 'Identificador'], ['fecha_hora', 'DATETIME', 'NOT NULL', 'Momento de la comparación'], ['id_sesion_anonima', 'CHAR(36)', 'NOT NULL', 'UUID aleatorio, sin datos personales']],
  comparacion_producto: [['id_comparacion', 'BIGINT', 'PK, FK → comparacion', ''], ['id_producto', 'INT', 'PK, FK → producto', ''], ['posicion', 'TINYINT', '1..3', 'Columna en la tabla']],
  novedad: [['id_novedad', 'INT', 'PK', 'Identificador'], ['id_autor', 'INT', 'FK → usuario', 'Autor'], ['titulo', 'VARCHAR(200)', 'NOT NULL', 'Título'], ['contenido', 'TEXT', 'NOT NULL', 'Cuerpo'], ['estado', 'ENUM', 'BORRADOR | PROGRAMADA | PUBLICADA', 'Estado'], ['fecha_publicacion', 'DATETIME', 'NULL', 'Fecha']],
  registro_auditoria: [['id_registro', 'BIGINT', 'PK', 'Identificador'], ['id_usuario', 'INT', 'FK → usuario', 'Autor de la acción'], ['fecha_hora', 'DATETIME', 'NOT NULL', 'Momento'], ['accion', 'ENUM', 'CREAR | MODIFICAR | ELIMINAR | ACCESO', 'Tipo de acción'], ['entidad', 'VARCHAR(40)', 'NOT NULL', 'Entidad afectada'], ['id_entidad', 'BIGINT', 'NOT NULL', 'Registro afectado'], ['ip', 'VARCHAR(45)', 'NOT NULL', 'Dirección IP (IPv4/IPv6)'], ['detalle', 'TEXT', 'NULL', 'Cambios (JSON)']],
};

const GLOSARIO = [
  ['Actor', 'Rol que desempeña una persona o sistema externo al interactuar con el sistema. No es una persona concreta.'],
  ['Artefacto', 'Producto de trabajo de RUP: documento, modelo, código o ejecutable.'],
  ['Caso de uso', 'Secuencia de acciones que el sistema realiza y que produce un resultado de valor para un actor.'],
  ['Checkout', 'Proceso de pago de una tienda en línea; excluido del SGCD-BH.'],
  ['Clic para chatear (wa.me)', 'Enlace público de WhatsApp que abre una conversación con un número y un texto prellenado.'],
  ['Core Web Vitals', 'Métricas de experiencia de Google: LCP, INP y CLS.'],
  ['Disciplina (RUP)', 'Conjunto de actividades relacionadas con un área del proyecto: requisitos, pruebas, etc.'],
  ['«extend»', 'Relación en la que un caso de uso añade comportamiento opcional a otro en un punto de extensión.'],
  ['Hito', 'Punto de control al final de una fase: LCO, LCA, IOC y PR.'],
  ['«include»', 'Relación en la que un caso de uso incorpora siempre el comportamiento de otro.'],
  ['Iteración', 'Mini proyecto con un plan y un incremento ejecutable como resultado.'],
  ['Modo catálogo', 'Configuración de WooCommerce que oculta precio, carrito y pago.'],
  ['Plugin', 'Extensión que agrega funciones a WordPress sin modificar el núcleo.'],
  ['Rational Rose', 'Herramienta CASE de IBM Rational para modelado visual con UML.'],
  ['REST API', 'Interfaz HTTP de WordPress para leer y escribir datos en formato JSON.'],
  ['RUP', 'Rational Unified Process: proceso iterativo e incremental, dirigido por casos de uso y centrado en la arquitectura.'],
  ['Staging', 'Entorno de prueba que replica la producción.'],
  ['Stakeholder', 'Persona u organización con interés en el resultado del proyecto.'],
  ['Tema hijo', 'Tema de WordPress que hereda de otro y conserva sus personalizaciones al actualizarlo.'],
  ['Trazabilidad', 'Relación verificable entre una necesidad, un requisito, un caso de uso, un componente y una prueba.'],
  ['UML', 'Unified Modeling Language: lenguaje estándar de modelado del OMG.'],
  ['WooCommerce', 'Plugin de comercio para WordPress; aquí se usa como motor de catálogo.'],
];

const REFERENCIAS = [
  'Bass, L., Clements, P., & Kazman, R. (2012). Software architecture in practice (3rd ed.). Addison-Wesley.',
  'Booch, G., Rumbaugh, J., & Jacobson, I. (2005). The Unified Modeling Language user guide (2nd ed.). Addison-Wesley.',
  'Congreso de la República del Perú. (2011). Ley N.° 29733, Ley de Protección de Datos Personales. Diario Oficial El Peruano.',
  'International Organization for Standardization. (2011). Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models (ISO/IEC 25010:2011).',
  'International Organization for Standardization. (2018). Systems and software engineering — Life cycle processes — Requirements engineering (ISO/IEC/IEEE 29148:2018).',
  'Jacobson, I., Booch, G., & Rumbaugh, J. (1999). The unified software development process. Addison-Wesley.',
  'Kendall, K. E., & Kendall, J. E. (2011). Análisis y diseño de sistemas (8.ª ed.). Pearson Educación.',
  'Kroll, P., & Kruchten, P. (2003). The Rational Unified Process made easy: A practitioner\'s guide to the RUP. Addison-Wesley.',
  'Kruchten, P. (1995). Architectural blueprints—The "4+1" view model of software architecture. IEEE Software, 12(6), 42–50. https://doi.org/10.1109/52.469759',
  'Kruchten, P. (2004). The Rational Unified Process: An introduction (3rd ed.). Addison-Wesley.',
  'Larman, C. (2004). Applying UML and patterns: An introduction to object-oriented analysis and design and iterative development (3rd ed.). Prentice Hall.',
  'Laudon, K. C., & Laudon, J. P. (2020). Management information systems: Managing the digital firm (16th ed.). Pearson.',
  'Object Management Group. (2017). OMG Unified Modeling Language (OMG UML), version 2.5.1. https://www.omg.org/spec/UML/2.5.1',
  'Pressman, R. S., & Maxim, B. R. (2015). Software engineering: A practitioner\'s approach (8th ed.). McGraw-Hill Education.',
  'Project Management Institute. (2017). A guide to the project management body of knowledge (PMBOK guide) (6th ed.).',
  'Quatrani, T. (2002). Visual modeling with Rational Rose 2002 and UML (3rd ed.). Addison-Wesley.',
  'Sommerville, I. (2016). Software engineering (10th ed.). Pearson.',
  'World Wide Web Consortium. (2018). Web Content Accessibility Guidelines (WCAG) 2.1. https://www.w3.org/TR/WCAG21/',
];
// Fuentes del caso (no académicas)
const FUENTES_CASO = [
  'Black Hawk Car Audio. (s. f.). Sitio web oficial [Sitio web]. Recuperado el 29 de septiembre de 2026, de https://www.blackhawkcaraudio.com/',
  'Equipo del proyecto. (2026). Black Hawk: evolución de la experiencia web [Informe técnico interno con evidencia archivada el 23-09-2026]. Repositorio BH-PDF.',
  'WordPress.org. (s. f.). Roles and capabilities. Recuperado el 29 de septiembre de 2026, de https://wordpress.org/documentation/article/roles-and-capabilities/',
  'YITH. (s. f.). YITH WooCommerce Catalog Mode [Plugin de WordPress]. Recuperado el 29 de septiembre de 2026, de https://wordpress.org/plugins/yith-woocommerce-catalog-mode/',
];

// Inventario de diagramas (id, archivo, título, tipo UML, CU/requisitos relacionados)
const DIAGRAMAS = [
  ['D-01', 'D01_cu_negocio', 'Casos de uso del negocio', 'Casos de uso (negocio)', 'NB-01…NB-09'],
  ['D-02', 'D02_cu_general', 'Casos de uso del sistema: vista general', 'Casos de uso', 'CU-01…CU-22'],
  ['D-03', 'D03_cu_catalogo', 'CU del módulo de catálogo público', 'Casos de uso', 'CU-01…CU-06'],
  ['D-04', 'D04_cu_comercial', 'CU de consultas y distribuidores', 'Casos de uso', 'CU-07…CU-10, CU-16, CU-18'],
  ['D-05', 'D05_cu_admin_catalogo', 'CU de administración del catálogo', 'Casos de uso', 'CU-11…CU-17'],
  ['D-06', 'D06_cu_admin_sistema', 'CU de administración del sistema', 'Casos de uso', 'CU-19…CU-22'],
  ['D-07', 'D07_dominio', 'Modelo de dominio', 'Clases (conceptual)', 'Entidades'],
  ['D-08', 'D08_analisis', 'Modelo de análisis: clases de interfaz, control y entidad', 'Clases (análisis)', 'CU-05, CU-08, CU-09'],
  ['D-09', 'D09_clases_catalogo', 'Clases de diseño: catálogo', 'Clases', 'RF-001…RF-009, RF-017…RF-020'],
  ['D-10', 'D10_clases_comercial', 'Clases de diseño: comercial y seguridad', 'Clases', 'RF-011…RF-016, RF-021…RF-026'],
  ['D-11', 'D11_objetos', 'Objetos: una consulta desde el comparador', 'Objetos', 'CU-05, CU-08'],
  ['D-12', 'D12_seq_consulta_producto', 'Secuencia: consulta de producto', 'Secuencia', 'CU-02, CU-04'],
  ['D-13', 'D13_seq_comparacion', 'Secuencia: comparación de productos', 'Secuencia', 'CU-05'],
  ['D-14', 'D14_seq_contacto', 'Secuencia: contacto con el distribuidor por WhatsApp', 'Secuencia', 'CU-07, CU-08, CU-09'],
  ['D-15', 'D15_seq_admin_producto', 'Secuencia: administración de producto', 'Secuencia', 'CU-12, CU-14, CU-21'],
  ['D-16', 'D16_act_proceso_comercial', 'Actividades: proceso comercial', 'Actividades', 'CU-01…CU-09, CU-18'],
  ['D-17', 'D17_act_admin_catalogo', 'Actividades: administración del catálogo', 'Actividades', 'CU-12…CU-15'],
  ['D-18', 'D18_estados_consulta', 'Estados: ConsultaComercial', 'Máquina de estados', 'RF-014, RF-023'],
  ['D-19', 'D19_componentes', 'Componentes', 'Componentes', 'COMP-01…COMP-10'],
  ['D-20', 'D20_despliegue', 'Despliegue', 'Despliegue', 'RNF-003, RNF-004, RNF-006, RNF-010'],
  ['D-21', 'D21_entidad_relacion', 'Modelo entidad-relación', 'ER (notación de patas de gallo)', 'Diccionario de datos'],
  ['D-22', 'D22_arquitectura_capas', 'Arquitectura lógica en capas', 'Paquetes', 'AD-01…AD-07'],
];

module.exports = {
  SISTEMA, ESTADOS, PRODUCTOS, CATEGORIAS, CONOCIDO, PROBLEMAS, NECESIDADES, ACTORES, MODULOS, CU, RF, RNF,
  COMPONENTES, CP, TRAZA, RF_COMP, REGLAS, RESTRICCIONES, ALCANCE_IN, ALCANCE_OUT, STAKEHOLDERS, EQUIPO,
  FASES, ITERACIONES, ESFUERZO, TARIFA_REF, DISCIPLINAS, RIESGOS, EDT, GANTT, HITOS, DECISIONES, MAPEO,
  DICCIONARIO, GLOSARIO, REFERENCIAS, FUENTES_CASO, DIAGRAMAS,
};
