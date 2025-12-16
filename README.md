# 🚀 PHP Full-Stack Structure Generator

## 🌟 Overview

**PHP Full-Stack Structure Generator** is a powerful VS Code extension that supercharges your PHP development workflow by automatically generating complete, production-ready project structures. Built with TypeScript and Node.js, it supports multiple modern architectural patterns for building robust fullstack PHP applications.

## ✨ Features

- 🏗️ **Multiple Architectures** - Choose from 6 different architectural patterns
- 🎯 **Smart Generation** - Automatic CRUD operations with best practices
- 🐳 **Docker Ready** - Optional Docker configuration for instant deployment
- 🧪 **Test Included** - Generate test files with PHPUnit support
- 📦 **PSR-4 Compliant** - Modern PHP standards and autoloading
- 🔒 **Security First** - CSRF protection, validation, and secure coding practices
- 🎨 **Beautiful UI** - Intuitive interface with icons and descriptions
- ⚡ **Rapid Development** - Save hours of boilerplate code writing

## 🎯 Supported Architectures

### 🏗️ MVC Advanced
Modern Model-View-Controller with advanced features:
- **Routing System** - Powerful router with middleware support
- **Dependency Injection** - Service container for loose coupling
- **Database Layer** - PDO-based with migrations and seeders
- **Middleware Pipeline** - Authentication, CORS, validation
- **View Templates** - Clean separation with layouts
- **Best for**: Traditional web applications, content management systems

### 🎯 MVP (Model-View-Presenter)
Testable architecture with passive views:
- **Presenter Logic** - Business logic separated from views
- **Interface-Driven** - Type-safe contracts
- **Repository Pattern** - Clean data access layer
- **Highly Testable** - Easy unit testing
- **Best for**: Applications requiring extensive testing, complex business logic

### 🎂 Layered Architecture (DDD)
Domain-Driven Design with clean separation:
- **Domain Layer** - Pure business logic
- **Application Layer** - Use cases and orchestration
- **Infrastructure Layer** - External services, database
- **Presentation Layer** - Controllers and views
- **Best for**: Enterprise applications, complex domains

### 🌐 REST API
Modern RESTful API with OpenAPI documentation:
- **OpenAPI 3.0** - Auto-generated API documentation
- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - API throttling
- **CORS Support** - Cross-origin requests
- **API Versioning** - Multiple API versions support
- **Best for**: API-first applications, mobile backends

### 🔬 Microservices
Distributed architecture for scalability:
- **Service Isolation** - Independent deployable services
- **API Gateway** - Single entry point
- **Event Bus** - Service communication
- **Service Discovery** - Dynamic service registration
- **Best for**: Large-scale applications, distributed teams

### ⚡ Functional PHP
Pure functional programming approach:
- **Pure Functions** - No side effects
- **Immutability** - Predictable data flow
- **Function Composition** - Reusable logic
- **Type Safety** - Strong typing
- **Best for**: Data processing, API integrations

## 📦 Installation

### From VS Code Marketplace

1. Open VS Code
2. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS)
3. Search for "php-generator"
4. Click Install

### Manual Installation

1. Ensure you have **VS Code** and **Node.js v20+** installed
2. Clone or download this repository
3. Install dependencies:
```bash
npm install -g @vscode/vsce
vsce package
code --install-extension php-generator-structure-web-*.vsix
```

## 🚀 Usage

### Quick Start

1. **Open your PHP project** in VS Code
2. **Launch Command Palette**:
   - Windows/Linux: `Ctrl+Shift+P`
   - macOS: `Cmd+Shift+P`
3. **Type and select**: `Generate PHP Structure`
4. **Follow the prompts**:
   - 🎨 Select architecture (MVC Advanced, MVP, Layered, etc.)
   - 📝 Enter entity name (e.g., User, Product, Order)
   - 📦 Choose components to generate
   - 🐳 Optional: Include Docker configuration
   - 🧪 Optional: Include test files
   - 📁 Optional: Include .gitignore

### Using the Sidebar

1. Click the **PHP Structure Generator** icon in the Activity Bar
2. Click **Generate WEB Application Structure**
3. Follow the same prompts as above

## 📚 What Gets Generated?

### MVC Advanced Example (for "Product" entity)

```
your-project/
├── app/
│   ├── Controllers/
│   │   ├── ProductController.php      # Full CRUD controller
│   │   └── BaseController.php         # Base controller
│   ├── Models/
│   │   ├── Product.php                # Product model
│   │   └── BaseModel.php              # Base model with DB methods
│   ├── Views/
│   │   ├── product/
│   │   │   ├── index.php              # List view
│   │   │   ├── create.php             # Create form
│   │   │   ├── edit.php               # Edit form
│   │   │   └── show.php               # Detail view
│   │   └── layouts/
│   │       └── app.php                # Main layout
│   ├── Middleware/
│   │   ├── AuthMiddleware.php         # Authentication
│   │   ├── CorsMiddleware.php         # CORS handling
│   │   └── ValidateMiddleware.php     # CSRF validation
│   ├── Services/
│   │   ├── ProductService.php         # Business logic
│   │   └── Container.php              # DI container
│   └── Validators/
│       └── ProductValidator.php       # Input validation
├── config/
│   ├── app.php                        # App configuration
│   ├── database.php                   # Database config
│   └── routes.php                     # Route definitions
├── core/
│   ├── Router.php                     # Routing system
│   ├── Request.php                    # HTTP request
│   ├── Response.php                   # HTTP response
│   └── Database.php                   # Database connection
├── database/
│   ├── migrations/
│   │   └── *_create_products_table.php
│   └── seeders/
│       └── ProductSeeder.php
├── public/
│   ├── index.php                      # Front controller
│   └── assets/
│       ├── css/app.css
│       └── js/app.js
├── tests/
│   └── ProductControllerTest.php
├── docker-compose.yml                 # Optional
├── Dockerfile                         # Optional
├── .gitignore                         # Optional
├── .env.example
├── .htaccess
├── composer.json
└── README.md
```

## 🎯 Architecture Comparison

| Feature | MVC Advanced | MVP | Layered | REST API | Microservices | Functional |
|---------|-------------|-----|---------|----------|---------------|-----------|
| Web Views | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| API Support | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Testability | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Complexity | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Scalability | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Best For | Web Apps | Testing | Enterprise | APIs | Distributed | Data Processing |

## 🛠️ Development

### Prerequisites
- Node.js 20+
- VS Code
- TypeScript knowledge

### Building

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode
npm run watch

# Run tests
npm test

# Package extension
vsce package
```

### Project Structure

```
src/
├── extension.ts              # Main extension logic
├── generators/
│   └── generator.ts          # Legacy generator
└── templates/
    ├── TemplateManager.ts    # Template registry
    ├── StructureGenerator.ts # Generator interface
    ├── mvc-advanced/
    │   └── MVCAdvancedGenerator.ts
    ├── mvp/
    │   └── MVPGenerator.ts
    ├── layered/
    ├── rest-api/
    ├── microservices/
    └── functional/
```

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Adding New Architectures

1. Create a new folder in `src/templates/your-architecture/`
2. Implement `StructureGenerator` interface
3. Add to `TemplateManager.ts`
4. Update documentation

## 📝 Examples

### Generate MVC Advanced Structure

```typescript
// Command Palette: Generate PHP Structure
// 1. Select: 🏗️ MVC Advanced
// 2. Enter: Product
// 3. Select: All components
// 4. Docker: Yes
// Result: Complete MVC structure with Docker
```

### Generate MVP for Testing

```typescript
// Perfect for test-driven development
// 1. Select: 🎯 MVP (Model-View-Presenter)
// 2. Enter: User
// 3. Include: Tests
// Result: Highly testable MVP structure
```

## 🐛 Troubleshooting

### Extension Not Showing

1. Reload VS Code: `Ctrl+Shift+P` → `Developer: Reload Window`
2. Check extension is enabled
3. Verify workspace folder is open

### Generation Errors

1. Ensure you have write permissions
2. Check entity name uses only letters
3. Verify PHP syntax in generated files

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Built with ❤️ using TypeScript and VS Code Extension API
- Inspired by modern PHP frameworks (Laravel, Symfony)
- Community feedback and contributions

## 📞 Support

- 🐛 [Report Issues](https://github.com/MaxPopovschii/php-generator/issues)
- 💡 [Feature Requests](https://github.com/MaxPopovschii/php-generator/issues/new)
- 📧 Contact: [GitHub](https://github.com/MaxPopovschii)

## 🗺️ Roadmap

- [ ] GraphQL API architecture
- [ ] Hexagonal Architecture
- [ ] CQRS + Event Sourcing
- [ ] Symfony/Laravel adapters
- [ ] Custom template editor
- [ ] Live preview
- [ ] Multi-language support

## ⭐ Show Your Support

If this extension helped you, please:
- ⭐ Star the repository
- 📢 Share with other developers
- ✍️ Write a review on VS Code Marketplace

---

**Made with 🚀 by developers, for developers**

Structure Types
Type	Description
MVC	Generates traditional Model, View, and Controller files.
REST	Creates RESTful endpoints with Models and Controllers.
FUNCTIONAL	Generates standalone functional PHP scripts.
Requirements

    Visual Studio Code (latest version recommended)

    Node.js v20+

    PHP 7.4+

Contributing

Contributions are welcome!
To contribute:

    Fork this repository.

    Create a new branch (feature/my-feature).

    Commit your changes.

    Open a pull request.

License

This project is licensed under the MIT License.

📬 For support, feedback, or feature requests, please open an issue on  [GitHub Issues]([https://github.com/php-generator/issues](https://github.com/MaxPopovschii/php-generator/issues)).
