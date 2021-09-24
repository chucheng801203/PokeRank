FROM php:7.4-fpm

# set work directory
WORKDIR /var/www/PokeRank/
# COPY . .
# RUN chown -R www-data:www-data  /var/www/PokeRank

# insatll php extensions
RUN docker-php-ext-install pdo_mysql

# copy php configs
COPY ./docker/phpfpm/config/php.ini-development $PHP_INI_DIR/php.ini
COPY ./docker/phpfpm/config/www.conf /usr/local/etc/php-fpm.d/www.conf

# change time zone
RUN ln -sf /usr/share/zoneinfo/ROC /etc/localtime

EXPOSE 9000
CMD ["php-fpm"]
