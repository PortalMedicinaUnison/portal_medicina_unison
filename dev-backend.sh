#!/usr/bin/env bash
# Levanta el backend (FastAPI) en modo desarrollo: http://localhost:8000 (docs en /docs).
#
#   ./dev-backend.sh            # prepara lo necesario, aplica migraciones y arranca
#   ./dev-backend.sh --seed     # además carga datos de ejemplo (usuarios demo)
#   PORT=9000 ./dev-backend.sh  # usa otro puerto
#
# La primera vez crea el entorno virtual (backend/env), instala las dependencias y,
# si no existe backend/.env, lo crea con una SECRET_KEY aleatoria y una BD SQLite local.
# Se detiene con Ctrl+C.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ROOT/backend"
PORT="${PORT:-8000}"
SEED=false

for arg in "$@"; do
  case "$arg" in
    --seed) SEED=true ;;
    -h|--help) sed -n '2,10p' "$0"; exit 0 ;;
    *) echo "Opción desconocida: $arg (usa --help)"; exit 1 ;;
  esac
done

cd "$BACKEND"

# 1. Entorno virtual con Python 3.11 o superior
find_python() {
  for cmd in python3.13 python3.12 python3.11 python3 python py; do
    if command -v "$cmd" >/dev/null 2>&1 \
      && "$cmd" -c 'import sys; sys.exit(0 if sys.version_info >= (3, 11) else 1)' 2>/dev/null; then
      echo "$cmd"
      return 0
    fi
  done
  return 1
}

if [ ! -d env ]; then
  PYTHON="$(find_python)" || { echo "Se necesita Python 3.11 o superior."; exit 1; }
  echo "→ Creando el entorno virtual backend/env ($PYTHON)"
  "$PYTHON" -m venv env
fi
if [ -x env/bin/python ]; then PY="$BACKEND/env/bin/python"; else PY="$BACKEND/env/Scripts/python"; fi  # Scripts: Windows (Git Bash)

# 2. Dependencias: solo cuando cambian los requirements
MARKER=env/.requirements-installed
if [ ! -f "$MARKER" ] || [ requirements.txt -nt "$MARKER" ] || [ requirements-dev.txt -nt "$MARKER" ]; then
  echo "→ Instalando dependencias"
  "$PY" -m pip install --quiet --upgrade pip
  "$PY" -m pip install --quiet -r requirements-dev.txt
  touch "$MARKER"
fi

# 3. Configuración local (backend/.env no se sube a git)
if [ ! -f .env ]; then
  echo "→ Creando backend/.env con una SECRET_KEY aleatoria"
  SECRET="$("$PY" -c 'import secrets; print(secrets.token_urlsafe(48))')"
  printf 'SECRET_KEY=%s\nDATABASE_URL=sqlite:///data/portal.db\n' "$SECRET" > .env
fi

# 4. Base de datos: no tocar una BD de la versión anterior (creada sin migraciones)
"$PY" - <<'EOF'
import sys
sys.path.insert(0, "app")
from sqlalchemy import inspect
from db.database import engine

tables = set(inspect(engine).get_table_names())
if tables and "alembic_version" not in tables:
    sys.exit(
        "\nLa base de datos de DATABASE_URL es de una versión anterior del portal (sin migraciones).\n"
        "Respáldala y bórrala, o apunta DATABASE_URL a un archivo nuevo, y vuelve a ejecutar este script.\n"
    )
EOF

echo "→ Aplicando migraciones"
"$PY" -m alembic upgrade head

if [ "$SEED" = true ]; then
  echo "→ Cargando datos de ejemplo"
  (cd app && "$PY" cli.py seed-demo)
fi

echo
echo "Backend en http://localhost:$PORT   ·   documentación: http://localhost:$PORT/docs"
echo "Primer administrador: cd backend/app && ../env/bin/python cli.py create-admin --email ... --first-name ... --last-name ... --super"
echo "Ctrl+C para detener."
echo
cd app
exec "$PY" -m uvicorn main:app --reload --port "$PORT"
