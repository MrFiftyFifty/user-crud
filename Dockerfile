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
COPY . /home/mrfiftyfifty/user-crud

# Устанавливаем права на папку проекта
RUN chown -R www-data:www-data /home/mrfiftyfifty/user-crud \
    && chmod -R 777 /home/mrfiftyfifty/user-crud

# Устанавливаем зависимости проекта
WORKDIR /home/mrfiftyfifty/user-crud
RUN npm ci \
    && composer install \
    && npm install

# Копируем .env.example в .env и генерируем ключ приложения
RUN cp .env.example .env \
    && echo 'DB_DATABASE=/home/mrfiftyfifty/user-crud/database/database.sqlite' >> .env \
    && php artisan key:generate

# Выполняем миграции
RUN php artisan migrate

# Настраиваем Apache
RUN echo '<VirtualHost *:80>\n\
    ServerName 158.160.150.83\n\
    DocumentRoot /home/mrfiftyfifty/user-crud/public\n\
    <Directory /home/mrfiftyfifty/user-crud/public>\n\
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
