# Portal Internado de Medicina Unison

Este proyecto es una plataforma en desarrollo para la gestión y administración de programas de internado médico de pregrado. Utiliza **FastAPI** para el backend, **React** para el frontend y **SQLite** como base de datos.


## Inicialización del Proyecto

### 1. Clonar el Repositorio

```bash
git clone https://github.com/ErickNavarroM/portal_medicina_unison.git
cd portal_medicina_unison
```

### 2. Configurar el Backend

1. Navega a la carpeta del backend:
   ```bash
   cd backend/
   ```

2. Crea un entorno virtual e instala las dependencias:
   ```bash
   python -m venv env
   source env/bin/activate  # En macOS/Linux
   .\env\Scripts\activate  # En Windows
   pip install -r requirements.txt
   ```

3. Crea un archivo `.env` en la carpeta `backend/` para configurar las variables de entorno 
   necesarias (por ejemplo, conexión a base de datos):

   ```env
   DATABASE_URL=sqlite:///./project.db
   SECRET_KEY=supersecretkey
```

4. Inicia el servidor de desarrollo:
   ```bash
   uvicorn app.main:app --reload
   ```

5. Accede a la API en:
   - Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
   - ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### 3. Configurar el Frontend

1. Navega a la carpeta del frontend:
   ```bash
   cd ../frontend/
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la carpeta `frontend/` para configurar la URL del backend:

   ```env
   REACT_APP_API_URL=http://127.0.0.1:8000
    ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Accede a la aplicación en: [http://localhost:3000](http://localhost:3000)

---

## Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más información.

