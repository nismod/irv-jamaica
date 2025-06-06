# multistage build of nginx image

# stage 1 of 2
FROM node:22-alpine AS builder
WORKDIR /app

# install npm packages -- do this before copying everything else
# to enable more efficient caching by docker (we don't reinstall packages when
# we've only changed application code)
COPY package.json package-lock.json ./
RUN npm ci
COPY public public
COPY src src
COPY tsconfig.json tsconfig.vite.json eslint.config.js vite.config.ts index.html ./
COPY .storybook .storybook
# build to static site
RUN npm run build

# stage 2 of 2
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
# remove default nginx static assets
RUN rm -rf ./*
# copy in static assets from builder stage
COPY --from=builder /app/build .
# and copy in the nginx config...
# delete conf.d as it will contain default.conf which will conflict
RUN rm -rf /etc/nginx/conf.d
COPY nginx /etc/nginx
# SSL Certs mounted externally

# containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
