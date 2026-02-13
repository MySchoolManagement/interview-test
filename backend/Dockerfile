FROM php:8.4-fpm-alpine3.19

# Install system dependencies
RUN apk add --no-cache \
    icu-dev \
    postgresql-dev \
    git \
    zip \
    libzip-dev \
    linux-headers

# Install PHP extensions
# intl and opcache are critical for Symfony 8 performance
RUN docker-php-ext-install \
    intl \
    pdo \
    pdo_pgsql \
    zip \
    opcache

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html