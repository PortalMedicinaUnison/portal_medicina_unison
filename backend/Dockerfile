FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /backend

RUN useradd --create-home --uid 1000 appuser

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Carpetas de datos (BD SQLite y archivos subidos); en producción se montan como volúmenes.
RUN mkdir -p /backend/data /backend/uploads && chown -R appuser:appuser /backend/data /backend/uploads

USER appuser
EXPOSE 8000

# Aplica las migraciones pendientes y arranca la API (sin recarga automática).
# WEB_WORKERS controla el número de procesos (2 por defecto).
CMD ["sh", "-c", "alembic upgrade head && cd app && exec uvicorn main:app --host 0.0.0.0 --port 8000 --workers ${WEB_WORKERS:-2} --proxy-headers --forwarded-allow-ips='*'"]
