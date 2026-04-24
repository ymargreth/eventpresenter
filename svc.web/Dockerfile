FROM nginx:alpine

# stable config baked in
COPY svc.web/nginx.conf /etc/nginx/conf.d/default.conf

# static site
COPY html /usr/share/nginx/html