FROM php:7.3.0-apache
RUN apt-get update && apt-get install -y \
	graphicsmagick \
	&& rm -rf /var/lib/apt/lists/*
COPY ./src /var/www/html
RUN mkdir -p /var/www/html/uploads \
	&& chown www-data:www-data /var/www/html/uploads
