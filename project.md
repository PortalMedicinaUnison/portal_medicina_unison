# Backend

```
portal_medicina_unison/
│
├── README.md                    # Documentación general del proyecto.
├── default_picture.jpg          # Archivo por defecto para imágenes (e.g., perfiles).
├── docker-compose.yml           # Configuración de servicios con Docker Compose.
├── package.json                 # Dependencias del frontend (si es necesario).
├── frontend/                    # Código fuente del frontend (React, Angular, etc.).
│   ├── public/                  # Recursos estáticos (favicon, imágenes, etc.).
│   ├── src/                     # Código fuente del frontend.
│   │   ├── components/          # Componentes reutilizables.
│   │   ├── pages/               # Páginas del sitio.
│   │   ├── services/            # Servicios para consumir la API.
│   │   ├── App.js               # Componente principal.
│   │   └── index.js             # Punto de entrada.
│   └── package.json             # Configuración específica del frontend.
│
├── backend/                     # Código fuente del backend.
│   ├── Dockerfile               # Configuración para Docker del backend.
│   ├── .env                     # Variables de entorno (no subir al repositorio).
│   ├── requirements.txt         # Dependencias del backend.
│   ├── database.db              # Archivo SQLite para la base de datos.
│   ├── app/                     # Carpeta principal del backend.
│   │   ├── __init__.py
│   │   ├── main.py              # Punto de entrada de FastAPI.
│   │   │
│   │   ├── routers/             # Para manejar las rutas HTTP de la API.
│   │   │   ├── __init__.py
│   │   │   ├── user_router.py   # Rutas relacionadas con usuarios.
│   │   │   └── other_router.py  # Otras rutas HTTP.
│   │   │
│   │   ├── controllers/         # Para la lógica de negocio de cada endpoint.
│   │   │   ├── __init__.py
│   │   │   ├── user_controller.py # Lógica para manejar usuarios.
│   │   │   └── other_controller.py  # Otra lógica del negocio.
│   │   │
│   │   ├── models/              # Para definir las estructuras y clases relacionadas con la base de datos.
│   │   │   ├── __init__.py
│   │   │   ├── user.py          # Modelo de usuario.
│   │   │   └── other_model.py   # Otros modelos.
│   │   │
│   │   ├── repos/               # Para las consultas a la base de datos.
│   │   │   ├── __init__.py
│   │   │   ├── user_repository.py # Acceso a datos de usuarios.
│   │   │   └── other_repository.py  # Otros repositorios.
│   │   │
│   │   ├── schemas/             # Para los modelos de entrada y salida de datos (Pydantic).
│   │   │   ├── __init__.py
│   │   │   ├── user_schema.py   # Esquemas de usuario.
│   │   │   └── other_schema.py  # Otros esquemas.
│   │   │
│   │   ├── db/                  # Para la configuración y migraciones de la base de datos.
│   │   │   ├── __init__.py
│   │   │   ├── connection.py    # Conexión a SQLite.
│   │   │   └── migrations/      # Scripts de migración de la base de datos.
│   │   │
│   │   ├── core/                # Configuración central del proyecto.
│   │   │   ├── __init__.py
│   │   │   ├── config.py        # Para la configuración global (e.g., variables de entorno).
│   │   │   ├── logger.py        # Configuración del logger.
│   │   │   └── middleware.py    # Middlewares personalizados.
│   │   │
│   │   ├── utils/               # Para funciones auxiliares y utilidades.
│   │   │   ├── __init__.py
│   │   │   ├── error_handlers.py # Manejo global de errores.
│   │   │   ├── helpers.py       # Funciones auxiliares reutilizables.
│   │   │   └── validators.py    # Validaciones personalizadas.
│   │
│   └── tests/                   # Pruebas unitarias y de integración.
│       ├── __init__.py
│       ├── test_routers.py      # Pruebas para las rutas de la API.
│       ├── test_controllers.py  # Pruebas para la lógica del negocio.
│       ├── test_repos.py        # Pruebas para los repositorios.
│       └── other_tests.py       # Otras pruebas.
│
└── .gitignore                   # Archivos y carpetas ignorados por Git.
```