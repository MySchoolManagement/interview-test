FROM php:8.4-fpm-alpine3.19

# Install system dependencies
# linux-headers is REQUIRED for Xdebug installation on Alpine
RUN apk add --no-cache \
    icu-dev \
    postgresql-dev \
    git \
    zip \
    libzip-dev \
    linux-headers \
    $PHPIZE_DEPS

# Install PHP extensions
RUN docker-php-ext-install \
    intl \
    pdo \
    pdo_pgsql \
    zip \
    opcache

# Install & Enable Xdebug
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
