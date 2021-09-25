FROM node:16.10.0 AS jsBuilder
WORKDIR /PokeRank
COPY . .
RUN cd resources/reactjs && npm install && npm run build && rm -rf node_modules

FROM composer:2.1.8 AS composerInstall
COPY --from=jsBuilder /PokeRank /PokeRank
WORKDIR /PokeRank
RUN composer install --optimize-autoloader --no-dev

FROM php:7.4-fpm

# set work directory
WORKDIR /var/www/PokeRank

COPY --from=composerInstall /PokeRank /PokeRank

# insatll php extensions
RUN docker-php-ext-install pdo_mysql

# copy php configs
COPY ./docker/prod/phpfpm/config/php.ini-production $PHP_INI_DIR/php.ini
COPY ./docker/prod/phpfpm/config/www.conf /usr/local/etc/php-fpm.d/www.conf

# change time zone
RUN ln -sf /usr/share/zoneinfo/ROC /etc/localtime

EXPOSE 9000
CMD ["php-fpm"]
