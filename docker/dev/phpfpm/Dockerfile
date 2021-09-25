FROM php:7.4-fpm

# set work directory
WORKDIR /var/www/PokeRank

# insatll php extensions
RUN apt-get update && apt-get install -y \
        libzip-dev \
        zip \
    && docker-php-ext-install -j$(nproc) pdo_mysql zip

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php -r "if (hash_file('sha384', 'composer-setup.php') === '756890a4488ce9024fc62c56153228907f1545c228516cbf63f885e036d37e9a59d27d63f46af1d4d07ee0f76181c7d3') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" && \
    php composer-setup.php && \
    php -r "unlink('composer-setup.php');" && \
    mv composer.phar /usr/local/bin/composer

# copy php configs
COPY ./docker/dev/phpfpm/config/php.ini-development $PHP_INI_DIR/php.ini
COPY ./docker/dev/phpfpm/config/www.conf /usr/local/etc/php-fpm.d/www.conf

# change time zone
RUN ln -sf /usr/share/zoneinfo/ROC /etc/localtime

EXPOSE 9000
CMD ["php-fpm"]
