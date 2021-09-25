FROM nginx:1.21.3

# set work directory
WORKDIR /var/www/PokeRank

# change time zone
RUN ln -sf /usr/share/zoneinfo/ROC /etc/localtime

# copy config file
RUN rm -f /etc/nginx/conf.d/default.conf
COPY ./docker/dev/nginx/config/nginx.conf /etc/nginx/nginx.conf
RUN test ! -d /etc/nginx/templates && mkdir /etc/nginx/templates
COPY ./docker/dev/nginx/config/localhost.conf /etc/nginx/templates/localhost.conf.template

# start nginx
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]