# PHP Full-Stack Structure Generator - Quick Start Guide

## 🚀 5-Minute Getting Started

### Installation

1. Open VS Code
2. Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac)
3. Search "php-generator"
4. Click Install

### Your First Project

1. **Open/Create a project folder**
   ```bash
   mkdir my-php-app && cd my-php-app
   code .
   ```

2. **Generate Structure**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P`)
   - Type: "Generate PHP Structure"
   - Select architecture (e.g., MVC Advanced)
   - Enter entity name (e.g., "Product")
   - Choose components
   - Optional: Add Docker ✅

3. **Install Dependencies**
   ```bash
   composer install
   ```

4. **Setup Database**
   - Copy `.env.example` to `.env`
   - Configure database credentials
   - Run migration:
   ```bash
   php database/migrations/*_create_products_table.php
   ```

5. **Start Development Server**
   
   **Without Docker:**
   ```bash
   php -S localhost:8000 -t public
   ```
   
   **With Docker:**
   ```bash
   docker-compose up -d
   ```

6. **Open in Browser**
   - Visit: `http://localhost:8000`
   - API: `http://localhost:8000/api/products`

## 📖 Architecture Guides

### MVC Advanced - Best for Web Applications

**Use Case**: Traditional web apps, content management

**Generated Files**:
- ✅ Controllers with full CRUD
- ✅ Models with database access
- ✅ Views with Bootstrap templates
- ✅ Routing with middleware
- ✅ Service layer for business logic

**Routes**:
```
GET    /products        → List all
GET    /products/create → Show create form
POST   /products        → Store new
GET    /products/{id}   → Show details
GET    /products/{id}/edit → Show edit form
PUT    /products/{id}   → Update
DELETE /products/{id}   → Delete
```

### MVP - Best for Testable Applications

**Use Case**: TDD projects, complex business logic

**Key Benefits**:
- Presenter is 100% testable
- View is passive (no logic)
- Easy to mock dependencies

**Testing Example**:
```php
$presenter = new ProductPresenter($mockView, $mockRepo, $mockService);
$presenter->showList();
// Assert view methods were called correctly
```

### REST API - Best for Mobile/SPA Backends

**Use Case**: API-first applications, microservices

**Features**:
- OpenAPI 3.0 documentation
- JWT authentication
- Rate limiting
- CORS support
- JSON responses

**Example Response**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Product 1",
      "price": 99.99
    }
  ],
  "meta": {
    "total": 100,
    "page": 1
  }
}
```

## 🐳 Docker Quick Start

The generator creates a complete Docker environment:

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Run composer
docker-compose exec app composer install

# Run migrations
docker-compose exec app php database/migrations/run.php

# Stop services
docker-compose down
```

**Services**:
- `app`: PHP 8.2 with Apache
- `db`: MySQL 8.0
- Ports: App (8000), DB (3306)

## 🧪 Testing

Run tests with PHPUnit:

```bash
# Install PHPUnit
composer require --dev phpunit/phpunit

# Run tests
./vendor/bin/phpunit
```

## 🔒 Security Checklist

After generation:

- [ ] Change default DB password in `.env`
- [ ] Set `APP_DEBUG=false` in production
- [ ] Configure CORS in `CorsMiddleware.php`
- [ ] Enable HTTPS in production
- [ ] Set proper file permissions (755 for folders, 644 for files)
- [ ] Keep Composer dependencies updated

## 🎨 Customization

### Adding New Routes

Edit `config/routes.php`:
```php
$router->get('/custom', [CustomController::class, 'index']);
```

### Adding Middleware

1. Create in `app/Middleware/`
2. Register in `config/routes.php`

### Custom Validation Rules

Edit validator in `app/Validators/`:
```php
public function validate(array $data): array
{
    $errors = [];
    
    if ($data['price'] < 0) {
        $errors['price'] = 'Price must be positive';
    }
    
    return $errors;
}
```

## 📚 Common Tasks

### Add New Entity

1. Run generator again with new entity name
2. Update routes
3. Run migration

### Change Database

1. Update `config/database.php`
2. Update `.env`
3. Test connection

### Add Authentication

Use the included `AuthMiddleware.php`:
```php
$router->group(['middleware' => AuthMiddleware::class], function($router) {
    // Protected routes
});
```

## 💡 Tips & Tricks

### Performance

- Use `composer dump-autoload -o` for production
- Enable OPcache in `php.ini`
- Use database indexes

### Development

- Use `APP_DEBUG=true` for detailed errors
- Check logs in `storage/logs/`
- Use Xdebug for debugging

### IDE Support

- Install PHP Intelephense extension
- Enable PSR-4 autoloading awareness
- Configure code style (PSR-12)

## 🐛 Troubleshooting

### "Class not found"
```bash
composer dump-autoload
```

### "Database connection failed"
- Check `.env` credentials
- Ensure MySQL is running
- Test connection: `mysql -u root -p`

### "Permission denied"
```bash
chmod -R 755 storage/
chmod -R 755 cache/
```

### "Composer not found"
```bash
# Install Composer globally
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
```

## 📞 Need Help?

- 📖 [Full Documentation](README.md)
- 🐛 [Report Issues](https://github.com/MaxPopovschii/php-generator/issues)
- 💬 [Discussions](https://github.com/MaxPopovschii/php-generator/discussions)

---

**Happy Coding! 🚀**
