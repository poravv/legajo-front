# Etapa 1: Construcción de la aplicación Angular
FROM node:20-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g @angular/cli
RUN npm install --legacy-peer-dependencies
COPY . .
RUN ng build

# Etapa 2: Servir la aplicación con serve
FROM node:14-alpine
WORKDIR /app
COPY --from=build /app/dist/legajo-front /app
RUN npm install -g serve
EXPOSE 4000
CMD ["serve", "-s", "/app", "-l", "4000"]
