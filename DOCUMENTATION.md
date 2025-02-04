### /utils/authentication.py

- Propósito: Contener funciones auxiliares reutilizables relacionadas con autenticación.
- Uso: Funciones genéricas y repetibles que pueden ser usadas en varias partes del proyecto, pero no están directamente ligadas a las configuraciones del proyecto o a dependencias de FastAPI.

### /core/auth.py

- Propósito: Manejar la configuración central y lógica más avanzada relacionada con la autenticación (p. ej., lógica de OAuth2, manejo de esquemas).
- Uso: Definir las configuraciones principales y dependencias críticas que el proyecto requiere para autenticación.

### /core/dependencies.py

- Propósito: Contener dependencias globales que serán inyectadas en varias rutas/controladores. Estas son funciones que FastAPI usa como Depends.
- Uso: Definir dependencias comunes como el acceso a la base de datos, autenticaciones particulares o lógica compartida.

### /core/settings.py

- Propósito: Centralizar todas las configuraciones importantes del proyecto, especialmente las que dependen de variables de entorno.
- Uso: Define parámetros como claves secretas, URLs de bases de datos, y configuraciones de tiempo de expiración.

### .env
- Propósito: Contener valores sensibles o configuraciones específicas de tu entorno, como claves secretas, credenciales de bases de datos, etc.
- Uso: Es leído por core/settings.py para cargar estas configuraciones de manera segura y centralizada.

### /utils/validation.py
- Proposito: Contener funciones genéricas y reutilizables para validar datos que llegan a tu aplicación desde usuarios, clientes, o APIs externas. 
- Uso: Define funciones que no dependen del contexto global de la aplicación ni de autenticación, sino de verificar la integridad y coherencia de los datos proporcionados.