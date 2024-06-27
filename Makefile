build:
	npm run build
test:
	php artisan test
install: 
	composer install --prefer-dist --no-progress --no-interaction && npm ci
lint:
	vendor/bin/duster lint
lint-fix:
	vendor/bin/duster fix