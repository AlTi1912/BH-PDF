#!/bin/sh
# Renderiza todos los diagramas PlantUML a PNG (160 dpi) y SVG.
set -e
cd "$(dirname "$0")/../DIAGRAMAS_UML"
java -jar ../_build/plantuml.jar -tpng -Sdpi=160 -o ../png fuente_plantuml/*.puml
java -jar ../_build/plantuml.jar -tsvg -o ../svg fuente_plantuml/*.puml
