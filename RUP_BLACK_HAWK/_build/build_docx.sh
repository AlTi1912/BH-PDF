#!/bin/sh
# Genera un .docx, calcula la paginación con LibreOffice y rellena los índices.
# Uso: build_docx.sh monografia.js ../BLACK_HAWK_RUP_MONOGRAFIA.docx qa/mono.pdf
set -e
cd "$(dirname "$0")"
node "$1"
/usr/bin/python3 lo_update.py "$2" "$3" 2>&1 | grep -v javaldx
python3 fill_toc.py "$2" "$3"
/usr/bin/python3 lo_update.py "$2" "$3" 2>&1 | grep -v javaldx
