# Используем официальный образ PHP
FROM php:8.3-apache

# Устанавливаем необходимые зависимости
RUN apt-get update && apt-get install -y \
    curl \
    sqlite3 \
    libsqlite3-dev \
    libxml2-dev \
    && docker-php-ext-install pdo_sqlite

# Устанавливаем Node.js через nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash \
    && . ~/.nvm/nvm.sh \
    && nvm install 18 \
    && nvm use 18

# Устанавливаем Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Копируем файлы проекта в контейнер
COPY . /var/www/html

# Устанавливаем права на папку проекта
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 777 /var/www/html

# Устанавливаем зависимости проекта
WORKDIR /var/www/html
RUN npm ci \
    && composer install \
    && npm install

# Копируем .env.example в .env и генерируем ключ приложения
RUN cp .env.example .env \
    && mkdir -p database \
    && echo 'DB_DATABASE=database/database.sqlite' >> .env \
    && touch database/database.sqlite \
    && php artisan key:generate

# Выполняем миграции
RUN php artisan migrate

# Настраиваем Apache
RUN echo '<VirtualHost *:80>\n\
    ServerName 158.160.150.83\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html/public>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
    </Directory>\n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
    </VirtualHost>' > /etc/apache2/sites-available/hexletJob.conf \
    && a2ensite hexletJob \
    && a2enmod rewrite \
    && systemctl restart apache2

EXPOSE 80
CMD ["apache2-foreground"]
