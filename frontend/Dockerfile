FROM node:20.18-slim

WORKDIR /frontend

COPY package.json package-lock.json ./

RUN npm install && npm list vite

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
