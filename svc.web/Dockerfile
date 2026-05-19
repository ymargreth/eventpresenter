FROM nginx:alpine

# stable config baked in
COPY nginx.conf /etc/nginx/conf.d/default.conf

# add admin user
RUN apk add --no-cache apache2-utils && \
    htpasswd -cb /etc/nginx/.htpasswd admin pass

# static site
COPY html /usr/share/nginx/html