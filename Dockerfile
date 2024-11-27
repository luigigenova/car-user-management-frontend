# Etapa 1: Build do Angular
FROM node:18 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration production

# Etapa 2: Servir com Nginx
FROM nginx:1.25
COPY --from=build-stage /app/dist/car-user-management-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
