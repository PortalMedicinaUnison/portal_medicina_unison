#!/usr/bin/env bash
# Levanta el frontend (React + Vite) en modo desarrollo: http://localhost:5173
#
#   ./dev-frontend.sh
#   VITE_API_URL=http://localhost:9000 ./dev-frontend.sh   # si el backend usa otro puerto
#
# La primera vez (o cuando cambia package-lock.json) instala las dependencias con npm ci.
# Se detiene con Ctrl+C. El backend se levanta aparte con ./dev-backend.sh.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT/frontend"

for arg in "$@"; do
  case "$arg" in
    -h|--help) sed -n '2,8p' "$0"; exit 0 ;;
    *) echo "Opción desconocida: $arg (usa --help)"; exit 1 ;;
  esac
done

if ! command -v npm >/dev/null 2>&1; then
  echo "Se necesita Node.js 18 o superior (incluye npm): https://nodejs.org"
  exit 1
fi
if ! node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 18 ? 0 : 1)'; then
  echo "Se necesita Node.js 18 o superior (tienes $(node -v))."
  exit 1
fi

if [ ! -d node_modules ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
  echo "→ Instalando dependencias (npm ci)"
  npm ci --no-audit --no-fund
fi

echo
echo "Frontend en http://localhost:5173   ·   API: ${VITE_API_URL:-http://localhost:8000}"
echo "Ctrl+C para detener."
echo
exec npm run dev
