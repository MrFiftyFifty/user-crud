# Use the official PHP image as the base image
FROM php:8.3-apache

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    curl \
    sqlite3 \
    libsqlite3-dev \
    libxml2-dev \
    git \
    zip \
    unzip \
    && docker-php-ext-install pdo_sqlite

# Install Node.js via nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash \
    && export NVM_DIR="$HOME/.nvm" \
    && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
    && nvm install 18 \
    && nvm use 18 \
    && nvm alias default 18 \
    && npm install -g npm

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create project directory
RUN mkdir -p /home/ty9991peterson/user-crud

# Copy application files
COPY . /home/ty9991peterson/user-crud

# Set working directory
WORKDIR /home/ty9991peterson/user-crud

# Install application dependencies
RUN export NVM_DIR="$HOME/.nvm" \
    && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
    && npm install \
    && npm ci \
    && composer install

# Set permissions
RUN chown -R www-data:www-data /home/ty9991peterson/user-crud \
    && chmod -R 777 /home/ty9991peterson/user-crud

# Set up environment and generate application key
RUN cp .env.example .env \
    && mkdir -p database \
    && touch /home/ty9991peterson/user-crud/database/database.sqlite \
    && echo 'DB_DATABASE=/home/ty9991peterson/user-crud/database/database.sqlite' >> .env \
    && chown -R www-data:www-data /home/ty9991peterson/user-crud/database \
    && chmod -R 777 /home/ty9991peterson/user-crud/database \
    && php artisan key:generate

# Create storage symbolic link
RUN php artisan storage:link

# Run migrations
RUN php artisan migrate

# Build frontend assets
RUN export NVM_DIR="$HOME/.nvm" \
    && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
    && npm run build

# Configure Apache
RUN echo '<VirtualHost *:80>\n\
    ServerName 158.160.150.83\n\
    DocumentRoot /home/ty9991peterson/user-crud/public\n\
    <Directory /home/ty9991peterson/user-crud/public>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
    </Directory>\n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
    </VirtualHost>' > /etc/apache2/sites-available/hexletJob.conf \
    && a2ensite hexletJob \
    && a2enmod rewrite \
    && service apache2 restart

EXPOSE 80
CMD ["apache2-foreground"]
