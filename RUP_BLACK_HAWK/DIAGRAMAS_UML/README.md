# Diagramas UML del SGCD-BH

Todos los diagramas describen el mismo sistema: el **Sistema de Gestión de Catálogo y Distribuidores Black Hawk (SGCD-BH)**. Usan los mismos actores, casos de uso, clases y códigos que la monografía, la presentación y los anexos.

| Carpeta | Contenido |
|---|---|
| `fuente_plantuml/` | Fuentes editables (`.puml`) y el estilo común `_estilo.iuml`. `G05_arbol_problemas.dot` es la fuente Graphviz del árbol de problemas. |
| `png/` | Diagramas renderizados a 160 ppp, más los gráficos de apoyo `G01`–`G05` y los prototipos `W01`–`W02`. |
| `svg/` | Los mismos diagramas en vectorial, para ampliar sin perder calidad. |
| `xmi/` | Exportación XMI 1.1 de los diagramas de clases (D-07, D-09, D-10) generada por PlantUML. **Experimental:** su importación en Rational Rose no está verificada. |

**Convención de color:** morado claro con el estereotipo «propuesto» indica una ampliación del proyecto académico; blanco indica algo existente en el rediseño o nativo de WordPress/WooCommerce.

## Inventario

| Código | Archivo | Diagrama | Tipo UML | Relacionado con |
|---|---|---|---|---|
| D-01 | `D01_cu_negocio` | Casos de uso del negocio | Casos de uso (negocio) | NB-01…NB-09 |
| D-02 | `D02_cu_general` | Casos de uso del sistema: vista general | Casos de uso | CU-01…CU-22 |
| D-03 | `D03_cu_catalogo` | CU del módulo de catálogo público | Casos de uso | CU-01…CU-06 |
| D-04 | `D04_cu_comercial` | CU de consultas y distribuidores | Casos de uso | CU-07…CU-10, CU-16, CU-18 |
| D-05 | `D05_cu_admin_catalogo` | CU de administración del catálogo | Casos de uso | CU-11…CU-17 |
| D-06 | `D06_cu_admin_sistema` | CU de administración del sistema | Casos de uso | CU-19…CU-22 |
| D-07 | `D07_dominio` | Modelo de dominio | Clases (conceptual) | Entidades |
| D-08 | `D08_analisis` | Modelo de análisis: clases de interfaz, control y entidad | Clases (análisis) | CU-05, CU-08, CU-09 |
| D-09 | `D09_clases_catalogo` | Clases de diseño: catálogo | Clases | RF-001…RF-009, RF-017…RF-020 |
| D-10 | `D10_clases_comercial` | Clases de diseño: comercial y seguridad | Clases | RF-011…RF-016, RF-021…RF-026 |
| D-11 | `D11_objetos` | Objetos: una consulta desde el comparador | Objetos | CU-05, CU-08 |
| D-12 | `D12_seq_consulta_producto` | Secuencia: consulta de producto | Secuencia | CU-02, CU-04 |
| D-13 | `D13_seq_comparacion` | Secuencia: comparación de productos | Secuencia | CU-05 |
| D-14 | `D14_seq_contacto` | Secuencia: contacto con el distribuidor por WhatsApp | Secuencia | CU-07, CU-08, CU-09 |
| D-15 | `D15_seq_admin_producto` | Secuencia: administración de producto | Secuencia | CU-12, CU-14, CU-21 |
| D-16 | `D16_act_proceso_comercial` | Actividades: proceso comercial | Actividades | CU-01…CU-09, CU-18 |
| D-17 | `D17_act_admin_catalogo` | Actividades: administración del catálogo | Actividades | CU-12…CU-15 |
| D-18 | `D18_estados_consulta` | Estados: ConsultaComercial | Máquina de estados | RF-014, RF-023 |
| D-19 | `D19_componentes` | Componentes | Componentes | COMP-01…COMP-10 |
| D-20 | `D20_despliegue` | Despliegue | Despliegue | RNF-003, RNF-004, RNF-006, RNF-010 |
| D-21 | `D21_entidad_relacion` | Modelo entidad-relación | ER (notación de patas de gallo) | Diccionario de datos |
| D-22 | `D22_arquitectura_capas` | Arquitectura lógica en capas | Paquetes | AD-01…AD-07 |

Apoyo: `G01_esfuerzo_rup` (esfuerzo por disciplina), `G02_gantt`, `G03_matriz_riesgos`, `G04_esfuerzo_fases`, `G05_arbol_problemas`, `EDT_wbs`, `W01_wireframe_directorio`, `W02_wireframe_consultas`.

## Editar y volver a renderizar

Con Java y PlantUML 1.2024.8 (el `.jar` se descarga desde las *releases* de PlantUML en GitHub):

```bash
java -jar plantuml.jar -tpng -Sdpi=160 -o ../png fuente_plantuml/*.puml
java -jar plantuml.jar -tsvg -o ../svg fuente_plantuml/*.puml
```

También se puede pegar cualquier `.puml` en un editor de PlantUML en línea o usar la extensión PlantUML de VS Code. Los diagramas incluyen `_estilo.iuml`, que debe estar en la misma carpeta.

## Rational Rose

No se entrega un archivo nativo `.mdl`: sin la herramienta no se puede verificar que un `.mdl` generado sea compatible, y un archivo que no abre es peor que ninguno. Para reconstruir el modelo en Rational Rose:

1. **Nuevo modelo.** Crear un modelo llamado `SGCD-BH` (plantilla *Rational Unified Process* si está disponible).
2. **Use Case View.**
   - Paquete `Negocio`: actores del negocio *Cliente final* y *Distribuidor / tienda* (estereotipo *business actor*) y los 5 casos de uso del negocio de D-01 (estereotipo *business use case*). «Derivar al punto de venta» «extend» «Atender consulta comercial».
   - Paquetes `Catálogo público y comercial` y `Administración`: 6 actores y 22 casos de uso de D-02. Generalizaciones: *Cliente interesado* → *Visitante* y *Administrador del sistema* → *Gestor del catálogo*. Relaciones: CU-03 «extend» CU-01 y CU-08 «include» CU-09.
   - Un diagrama por módulo (D-03 a D-06) reutilizando los mismos elementos: arrastrar desde el *browser*, no crear duplicados.
3. **Logical View.**
   - Paquetes `Catálogo`, `Comercial` y `Seguridad`. Clases, atributos (tipo y visibilidad) y operaciones de D-09 y D-10. Las enumeraciones se crean como clases con el estereotipo *enumeration*.
   - Asociaciones con las multiplicidades exactas del diagrama; composición (*By Value*) entre Producto y EspecificacionTecnica, y entre Producto e ImagenProducto.
   - D-07 (dominio) como *Class Diagram* independiente, sin operaciones.
   - D-08 (análisis) con los estereotipos *boundary*, *control* y *entity*.
   - Secuencias D-12 a D-15 como *Sequence Diagram*: arrastrar el actor y los objetos, y crear los mensajes en el orden numerado. Los fragmentos `opt`/`alt`/`loop` se documentan con notas (Rose 2003 no los dibuja).
   - D-18: *Statechart Diagram* asociado a la clase ConsultaComercial.
   - D-16 y D-17: *Activity Diagram* con una *swimlane* por participante.
   - D-11 (objetos): Rose no tiene un diagrama de objetos dedicado; se representa como un *Collaboration Diagram* con instancias.
4. **Component View:** los componentes y dependencias de D-19.
5. **Deployment View:** los nodos y conexiones de D-20.
6. **Documentación:** copiar en el campo *Documentation* de cada caso de uso su especificación (monografía, Anexo C) y en cada clase la descripción del diccionario de datos (Anexo E).

El modelo entidad-relación (D-21) no es un diagrama UML. En Rose puede representarse con el *Data Modeler* (si está instalado) o como un diagrama de clases con el estereotipo *table*.
