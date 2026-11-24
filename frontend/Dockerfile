# --- Dependencias ---
FROM node:24-slim AS deps
WORKDIR /frontend
COPY package.json package-lock.json ./
RUN npm ci

# --- Desarrollo: servidor de Vite (lo usa docker-compose.yml) ---
FROM deps AS dev
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

# --- Build de producción ---
FROM deps AS build
COPY . .
# En producción nginx hace de proxy: la API queda en el mismo dominio bajo /api.
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# --- Producción: nginx sirve los archivos estáticos y reenvía /api al backend ---
FROM nginx:stable-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /frontend/dist /usr/share/nginx/html
EXPOSE 80
