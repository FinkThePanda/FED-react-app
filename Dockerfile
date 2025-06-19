# Stage 1: Byg React-applikationen
FROM node:18-alpine AS build

# NYT: Deklarer et argument, der kan modtages under bygning
ARG VITE_API_URL

# NYT: Sæt argumentet som en miljøvariabel, så 'npm run build' kan se den
ENV VITE_API_URL=$VITE_API_URL

# Sæt arbejdsmappen inde i containeren
WORKDIR /app

# Kopier package.json og package-lock.json for at cache dependencies
COPY package*.json ./

# Installer alle dependencies
RUN npm install

# Kopier resten af kildekoden
COPY . .

# Byg applikationen til produktion. Vite vil nu erstatte
# import.meta.env.VITE_API_URL med den korrekte værdi.
RUN npm run build

# Stage 2: Servér de statiske filer med Nginx
FROM nginx:stable-alpine

# Kopier de byggede filer fra 'build'-stadiet til Nginx's web-mappe
COPY --from=build /app/dist /usr/share/nginx/html

# Erstat standard Nginx-konfiguration for at understøtte SPA-routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Eksponer port 80 (standard for Nginx)
EXPOSE 80

# Kommando til at starte Nginx-serveren
CMD ["nginx", "-g", "daemon off;"]
