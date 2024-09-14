# Etapa 1: Construcción de la aplicación Angular
FROM node:20-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g @angular/cli  # Instalar Angular CLI globalmente
RUN npm install --legacy-peer-dependencies
COPY . .
RUN ng build

# Etapa 2: Servir la aplicación con Nginx
FROM node:14-alpine
WORKDIR /app
COPY --from=build /app/dist/legajo-front /usr/share/nginx/html
COPY --from=build /app/dist/legajo-front /app
RUN npm install -g http-server
EXPOSE 4004
CMD ["http-server", "/app", "-p", "4000"]
