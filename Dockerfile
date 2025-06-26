# Step 1: Build Vue app
FROM node:18-alpine as build-stage
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Step 2: Serve with NGINX
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
