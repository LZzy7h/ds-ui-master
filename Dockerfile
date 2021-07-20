FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npx -p npm@6 npm i --legacy-peer-deps
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
#RUN npm install
COPY . .
RUN npm run build:prod

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
