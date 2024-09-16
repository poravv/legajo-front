# Etapa 1: Construcción de la aplicación Angular
FROM node:20-alpine as build

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-dependencies
COPY . .
RUN ng build --prod

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copiar los archivos construidos a la imagen de Nginx
COPY --from=build /app/dist/legajo-front /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 4000
