# Portal Internado de Medicina Unison

Plataforma para gestionar el internado médico de pregrado y el servicio social de los
estudiantes de Medicina de la Universidad de Sonora: pre-registro, promociones y cupos por
sede, asignación y aceptación, documentos, reportes de incidentes, avisos y encuestas.

- **Backend:** FastAPI + SQLAlchemy 2 + Alembic, SQLite (Python 3.11+).
- **Frontend:** React 18 + Vite 8 + Tailwind CSS (Node.js 20.19+ o 22.12+).
- **Autenticación:** JWT (`Authorization: Bearer <token>`), roles `student`, `admin` y `super_admin`.

```
backend/
  app/            # API: routers (rutas) → controllers (reglas) → repos (consultas) → models
  alembic/        # migraciones de la base de datos
  requirements*.txt
frontend/
  src/admin/      # panel de coordinación (/admin)
  src/user/       # área del estudiante
  src/features/   # autenticación y perfil (compartidos)
  src/services/   # llamadas a la API
```

## Flujo principal

El estudiante primero **acredita el internado** y después hace el **servicio social**. Ambos siguen el mismo flujo:

1. La coordinación **pre-registra** los expedientes (uno por uno o importando un CSV).
2. El estudiante **crea su cuenta** con su expediente pre-registrado.
3. La coordinación crea la **promoción** del programa (internado o servicio social, con año y periodo) y define el **cupo de cada sede**.
4. La coordinación **asigna** al estudiante a la promoción; el estudiante **acepta** (se crea su internado o servicio social) o **declina**.
5. La coordinación **asigna la sede** (plaza, en servicio social) respetando el cupo, y al terminar marca el internado como **finalizado** (acreditado) o el servicio social como **liberado**.
6. El estudiante sube sus **documentos** (PDF), levanta **reportes** de incidentes y consulta **avisos** y **encuestas**.

Solo se puede asignar servicio social a quien ya tiene el internado finalizado (acreditado).

## Variables de entorno (backend)

Se leen de variables de entorno o del archivo `backend/.env` (no se versiona). Ejemplo de `backend/.env` para desarrollo:

```env
SECRET_KEY=cambia-esto-por-una-cadena-larga-y-aleatoria
DATABASE_URL=sqlite:///data/portal.db
```

| Variable | Obligatoria | Valor por defecto | Descripción |
|---|---|---|---|
| `SECRET_KEY` | sí | — | Clave para firmar los JWT. En producción, 32+ caracteres aleatorios (`python -c "import secrets; print(secrets.token_urlsafe(48))"`). |
| `DATABASE_URL` | sí | — | URL de SQLAlchemy. Las rutas SQLite relativas se resuelven desde `backend/` (p. ej. `sqlite:///data/portal.db` → `backend/data/portal.db`); también acepta rutas absolutas (`sqlite:////ruta/portal.db`). |
| `ENVIRONMENT` | no | `dev` | `prod` desactiva `/docs` y exige una `SECRET_KEY` larga. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | no | `480` | Duración de la sesión. |
| `TIMEZONE` | no | `America/Hermosillo` | Zona horaria para "hoy" (fechas de reportes, vencimiento de encuestas, año de promociones), independiente de la del servidor. |
| `UPLOAD_DIR` | no | `backend/uploads` | Carpeta de los documentos subidos. |
| `MAX_UPLOAD_MB` | no | `10` | Tamaño máximo de cada PDF. |
| `MAX_PHOTO_MB` | no | `2` | Tamaño máximo de la foto de perfil (JPEG, PNG o WebP). |
| `ORIGINS` | no | `["http://localhost:5173","http://127.0.0.1:5173"]` | Orígenes permitidos por CORS (JSON). |

Frontend: `VITE_API_URL` (por defecto `http://localhost:8000`); se puede definir en `frontend/.env.local`.

## Desarrollo local

### Forma rápida (macOS / Linux / Git Bash)

En dos terminales, desde la raíz del repositorio:

```bash
./dev-backend.sh          # API en http://localhost:8000 (docs en /docs)
./dev-frontend.sh         # app en http://localhost:5173
```

- `dev-backend.sh` crea el entorno virtual e instala dependencias la primera vez (y cuando cambian los requirements), crea `backend/.env` con una `SECRET_KEY` aleatoria si no existe, aplica las migraciones y arranca con recarga automática. `./dev-backend.sh --seed` carga además los datos de ejemplo; `PORT=9000 ./dev-backend.sh` cambia el puerto.
- Si `DATABASE_URL` apunta a una base de datos de la versión anterior (sin migraciones), el script se detiene sin tocarla: respáldala y bórrala, o usa otro archivo.
- `dev-frontend.sh` instala dependencias con `npm ci` cuando hace falta y arranca Vite. Si el backend usa otro puerto: `VITE_API_URL=http://localhost:9000 ./dev-frontend.sh`.

Paso a paso, sin los scripts:

### Backend

```bash
cd backend
python3 -m venv env
source env/bin/activate            # Windows: .\env\Scripts\activate
pip install -r requirements-dev.txt
# crea backend/.env (ver arriba)
alembic upgrade head               # crea/actualiza la base de datos
cd app
python cli.py seed-demo            # opcional: datos de ejemplo
uvicorn main:app --reload
```

- Documentación interactiva: <http://127.0.0.1:8000/docs>
- `seed-demo` crea sedes y centros de salud, promociones de internado y de servicio social con cupos, y tres cuentas: `admin@demo.unison.mx / Admin1234`, `alumno@demo.unison.mx / Alumno1234` (asignación de internado pendiente) y `egresado@demo.unison.mx / Alumno1234` (internado acreditado y asignación de servicio social pendiente).
- Primer administrador real: `python cli.py create-admin --email coordinacion@unison.mx --first-name Nombre --last-name Apellido --super` (pide la contraseña).

### Frontend

```bash
cd frontend
npm ci
npm run dev        # http://localhost:5173
```

### Con Docker

```bash
docker compose up --build    # backend con recarga en :8000 y Vite en :5173
```

## Pruebas y calidad

```bash
cd backend && pytest                       # pruebas de integración de toda la API (incluye la matriz de permisos)
cd backend && alembic check                # los modelos y las migraciones coinciden
cd frontend && npm run lint && npm run build
```

La integración continua (`.github/workflows/ci.yml`) ejecuta lo mismo en cada push a `main`/`dev` y en cada pull request.

### Cambios en la base de datos

1. Modifica los modelos en `backend/app/models/`.
2. `cd backend && alembic revision --autogenerate -m "descripción"` y revisa el archivo generado en `alembic/versions/`.
3. `alembic upgrade head`.

## Despliegue en el servidor de la universidad

Requisitos: Linux con Docker y Docker Compose.

1. Clona el repositorio en el servidor y crea `backend/.env` solo ahí:
   ```env
   SECRET_KEY=<cadena aleatoria de 32+ caracteres>
   ENVIRONMENT=prod
   ```
2. Levanta los servicios:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   docker compose -f docker-compose.prod.yml exec backend python app/cli.py create-admin \
       --email coordinacion@unison.mx --first-name Nombre --last-name Apellido --super
   ```
3. La app queda en el puerto 80: nginx sirve el frontend y reenvía `/api` al backend (mismo dominio, sin CORS).
   **Ponla detrás de HTTPS** (proxy o certificado de la universidad): las contraseñas y los tokens viajan en las peticiones.
4. Actualizar: `git pull && docker compose -f docker-compose.prod.yml up -d --build` (las migraciones se aplican al arrancar).

### Respaldos

La base de datos y los documentos viven en los volúmenes `portal_data` y `portal_uploads`. Respaldo en caliente de la BD:

```bash
docker compose -f docker-compose.prod.yml exec backend python -c \
  "import sqlite3; src = sqlite3.connect('/backend/data/portal.db'); dst = sqlite3.connect('/backend/data/respaldo.db'); src.backup(dst)"
docker compose -f docker-compose.prod.yml cp backend:/backend/data/respaldo.db ./respaldo-$(date +%F).db
docker compose -f docker-compose.prod.yml cp backend:/backend/uploads ./uploads-$(date +%F)
```

## Permisos

- Todas las rutas requieren sesión excepto `POST /auth/login`, `POST /auth/register` y `GET /health`.
- Las rutas de administración responden 403 a estudiantes; los estudiantes solo ven y modifican sus propios datos.
- Los reportes anónimos no muestran al estudiante a la coordinación.
- Solo un `super_admin` puede cambiar roles.

## Pendiente

- Historia clínica (opcional): hay un prototipo del formulario en el frontend sin persistencia ni rutas.

## Licencia

MIT.
