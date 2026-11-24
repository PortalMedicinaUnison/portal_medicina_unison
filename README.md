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

El estudiante primero **acredita el internado** y después hace el **servicio social**. Ambos siguen el mismo flujo
(*Internado* o *Servicio social* en el menú de la coordinación):

1. La coordinación **pre-registra** los expedientes (uno por uno o importando un CSV) y el estudiante **crea su cuenta**
   con el suyo.
2. **Sedes:** cada sede indica si ofrece cupos para el internado, el servicio social o ambos.
3. **Promoción:** basta la fecha de inicio (se propone el próximo inicio habitual libre: internado, 1 de enero o 1 de
   julio; servicio social, 1 de febrero o 1 de agosto) y el término se propone a doce meses. Los **cupos** de todas las
   sedes del programa se capturan en una sola tabla y se pueden copiar de otra promoción para revisarlos antes de guardar.
4. **Inscripciones:** la coordinación asigna a varios alumnos a la vez, eligiéndolos de la lista de candidatos o pegando
   sus expedientes con su promedio (p. ej. copiados de Excel). El alumno sube sus **documentos de inscripción** (PDF) y,
   con todos los obligatorios subidos, **acepta** su asignación (o la **declina**).
5. La coordinación **revisa** cada documento (aprobado o con observaciones). En **Resultados del acto** captura, en orden
   de promedio, la sede (plaza, en servicio social) que eligió cada alumno en el acto público; se respeta el cupo y solo
   eligen quienes tienen aprobados sus documentos de inscripción.
6. Durante el programa el estudiante sube los documentos de las etapas *durante* y *término* (en servicio social,
   *liberación*). Con los obligatorios aprobados, la coordinación marca el internado como **finalizado** (acreditado) o el
   servicio social como **liberado**.
7. **Renuncia o baja:** la coordinación las registra con su fecha y motivo. Liberan el lugar en la sede (queda vacante),
   cierran los documentos del alumno y le permiten asignarse a una promoción posterior; en servicio social, la lista de
   candidatos avisa si aún no se cumple el año que pide el artículo 55 de los *Lineamientos* tras una renuncia. Si se
   registró por error, se puede regresar a *activo* mientras haya lugar.
8. El estudiante levanta **reportes** de incidentes y consulta **avisos** y **encuestas**.

Solo se puede asignar servicio social a quien ya tiene el internado finalizado (acreditado), y nadie puede tener dos
internados (ni dos servicios sociales) en curso a la vez.

## Documentos requeridos

- **Catálogo** (*Internado y servicio social → Documentos requeridos*): la coordinación define qué se pide en cada
  programa y etapa (inscripción, durante, término/liberación), si es obligatorio, si admite varios archivos, su antigüedad
  máxima y un **formato descargable** (PDF, Word, Excel u OpenDocument). Retirar un documento ya no lo pide, pero conserva
  los archivos que ya se subieron.
- El catálogo inicial es el de Hermosillo: internado según el *Manual del Internado de Pregrado* (2022); servicio social
  según la convocatoria de 2026 (los documentos extra del artículo 21 de los *Lineamientos* quedan como opcionales) y la
  liberación según el artículo 60. En **Reportes trimestrales** el alumno sube por ahora el acuse de la plataforma de servicio
  social de la Unison; si después se piden los reportes, basta con cambiar las indicaciones de ese mismo documento.
- **Quién lo sube.** Cada documento lo sube *el alumno* o *la coordinación*. Los del alumno quedan **en revisión** hasta
  que la coordinación los **aprueba** o les pone **observaciones** (el alumno las ve y sube el corregido); la coordinación no
  los sube ni los borra. Los de la coordinación (de inicio, la constancia de culminación y las calificaciones por rotación
  del internado, que emite la sede) solo los sube ella y quedan aprobados. Fuera de eso, la coordinación solo sube los
  formatos descargables del catálogo.
- El alumno no puede cambiar documentos aprobados ni modificar los de una asignación declinada, una promoción terminada o
  un programa finalizado/liberado o terminado por renuncia o baja.

## Contraseñas y aviso de privacidad

- **Recuperar contraseña (sin costo).** Siempre disponible: en *Alumnos → Usuarios → (usuario) → Restablecer contraseña*
  la coordinación genera un enlace de un solo uso (vigencia: `PASSWORD_RESET_HOURS`) y lo copia o lo envía desde su propio
  correo. Opcional: si se configura `SMTP_*`, el usuario pide el enlace él mismo en *¿Olvidaste tu contraseña?* y le llega
  por correo. Sirve una cuenta de Gmail o Google Workspace con
  [contraseña de aplicación](https://support.google.com/accounts/answer/185833) (`SMTP_HOST=smtp.gmail.com`,
  `SMTP_PORT=587`) o el servidor SMTP de la universidad, si lo hay. La respuesta no revela si un correo está registrado y
  cada cuenta recibe como máximo un correo cada 5 minutos.
- Al cambiar o restablecer la contraseña se cierran las demás sesiones abiertas de la cuenta.
- **Aviso de privacidad** en `/privacy` (público). El registro exige aceptarlo, y las cuentas que aún no lo han aceptado
  (p. ej. administradores creados por consola) lo aceptan al entrar. Para pedirlo de nuevo a todos tras un cambio
  relevante, cambia `PRIVACY_NOTICE_VERSION`. El texto está en
  `frontend/src/features/privacy/PrivacyNoticeContent.jsx`: es un **borrador** y los datos resaltados entre corchetes debe
  validarlos la Unidad de Transparencia de la Unison antes de publicar el portal.

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
| `PASSWORD_RESET_HOURS` | no | `24` | Vigencia de los enlaces que genera la coordinación. |
| `PRIVACY_NOTICE_VERSION` | no | `2026-11` | Versión vigente del aviso de privacidad; al cambiarla, todos deben aceptarlo de nuevo. |
| `SMTP_HOST` | no | — | Servidor de correo saliente. Sin él (o sin `SMTP_FROM`) la recuperación por correo queda desactivada. |
| `SMTP_PORT` | no | `587` | Puerto SMTP. |
| `SMTP_USER` / `SMTP_PASSWORD` | no | — | Credenciales SMTP (en Gmail, una contraseña de aplicación). |
| `SMTP_FROM` | no | — | Remitente, p. ej. `Portal Medicina <cuenta@gmail.com>`. |
| `SMTP_STARTTLS` / `SMTP_SSL` | no | `true` / `false` | STARTTLS (puerto 587) o SSL directo (puerto 465). |
| `PASSWORD_RESET_EMAIL_MINUTES` | no | `60` | Vigencia de los enlaces enviados por correo. |
| `FRONTEND_URL` | con correo | `http://localhost:5173` | Dirección pública del portal para los enlaces de los correos. En producción con correo activado es obligatoria. |

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
   # Opcional: recuperación de contraseña por correo
   # FRONTEND_URL=https://<dirección del portal>
   # SMTP_HOST=smtp.gmail.com
   # SMTP_USER=<cuenta>
   # SMTP_PASSWORD=<contraseña de aplicación>
   # SMTP_FROM=Portal Medicina <cuenta>
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

- Todas las rutas requieren sesión excepto `POST /auth/login`, `POST /auth/register`, `GET /health` y las de
  restablecimiento de contraseña (`/auth/password-reset/*`).
- Un administrador solo puede generar enlaces de restablecimiento para estudiantes; para otros administradores, solo un `super_admin`.
- Las rutas de administración responden 403 a estudiantes; los estudiantes solo ven y modifican sus propios datos.
- Los reportes anónimos no muestran al estudiante a la coordinación.
- Solo un `super_admin` puede cambiar roles.

## Pendiente

- Historia clínica (opcional): hay un prototipo del formulario en el frontend sin persistencia ni rutas.

## Licencia

MIT.
