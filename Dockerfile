# Etapa 1: Construcción de la aplicación Angular
FROM node:20-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g @angular/cli  # Instalar Angular CLI globalmente
RUN npm install --legacy-peer-dependencies
COPY . .
RUN ng build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine
WORKDIR /app
COPY --from=build /app/dist/legajo-front /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 4004
CMD ["nginx", "-g", "daemon off;"]

