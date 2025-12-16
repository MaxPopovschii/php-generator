# Contributing to PHP Full-Stack Structure Generator

Thank you for your interest in contributing! 🎉

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- VS Code
- Git
- TypeScript knowledge

### Setup Development Environment

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/php-generator.git
   cd php-generator
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Open in VS Code**
   ```bash
   code .
   ```

4. **Start Watch Mode**
   ```bash
   npm run watch
   ```

5. **Press F5** to open Extension Development Host

## 📁 Project Structure

```
src/
├── extension.ts              # Main extension entry
├── generators/
│   └── generator.ts          # Legacy generator logic
└── templates/
    ├── TemplateManager.ts    # Template registry
    ├── StructureGenerator.ts # Generator interface
    ├── mvc-advanced/
    │   └── MVCAdvancedGenerator.ts
    ├── mvp/
    │   └── MVPGenerator.ts
    └── [other architectures]/
```

## 🎯 How to Contribute

### Adding a New Architecture

1. **Create Directory**
   ```bash
   mkdir src/templates/my-architecture
   ```

2. **Create Generator**
   ```typescript
   // src/templates/my-architecture/MyArchitectureGenerator.ts
   import { StructureGenerator } from '../StructureGenerator';

   export class MyArchitectureGenerator implements StructureGenerator {
       generate(rootPath: string, entityName: string, options: any): any {
           const structure: any = {};
           
           // Define your file structure
           structure['app'] = {
               'Controllers': {
                   [`${entityName}Controller.php`]: this.getControllerTemplate(entityName)
               }
           };
           
           return structure;
       }

       private getControllerTemplate(entityName: string): string {
           return `<?php
   // Your template code
   `;
       }
   }
   ```

3. **Register in TemplateManager**
   ```typescript
   // src/templates/TemplateManager.ts
   private static templates: Map<string, TemplateConfig> = new Map([
       // ... existing templates
       ['my-architecture', {
           name: 'My Architecture',
           description: 'Description of your architecture',
           icon: '🎨',
           features: ['Feature 1', 'Feature 2'],
           includes: ['Controllers', 'Models', 'Views']
       }]
   ]);
   ```

4. **Update Generator Switch**
   ```typescript
   // src/generators/generator.ts
   case 'my-architecture':
       const MyArch = require('../templates/my-architecture/MyArchitectureGenerator');
       const myGen = new MyArch.MyArchitectureGenerator();
       structure = myGen.generate(rootPath, entityName, options);
       break;
   ```

5. **Test Your Architecture**
   - Press F5 to open Extension Development Host
   - Run "Generate PHP Structure"
   - Select your architecture
   - Verify generated files

### Improving Existing Generators

1. Find the generator in `src/templates/[architecture]/`
2. Modify template methods
3. Test changes
4. Submit PR

### Adding Features

**Example: Add Custom Middleware**

1. Create template method:
   ```typescript
   private getCustomMiddlewareTemplate(): string {
       return `<?php
   namespace App\\Middleware;
   
   class CustomMiddleware {
       // Implementation
   }
   `;
   }
   ```

2. Add to structure:
   ```typescript
   structure['app']['Middleware']['CustomMiddleware.php'] = 
       this.getCustomMiddlewareTemplate();
   ```

### Bug Fixes

1. Create an issue describing the bug
2. Fork and create a branch: `fix/issue-number-description`
3. Fix the bug with tests
4. Submit PR referencing the issue

## 📝 Coding Standards

### TypeScript Style

```typescript
// ✅ Good
export class ProductGenerator implements StructureGenerator {
    private getControllerTemplate(entityName: string): string {
        return `<?php
namespace App\\Controllers;

class ${entityName}Controller {
    // Implementation
}
`;
    }
}

// ❌ Bad
export class ProductGenerator {
    getControllerTemplate(entityName) {
        return "<?php class " + entityName + "Controller {}";
    }
}
```

### PHP Template Style

```typescript
// ✅ Good - Use template literals with proper formatting
private getTemplate(): string {
    return `<?php

namespace App\\Controllers;

use App\\Models\\Product;

class ProductController
{
    public function index(): array
    {
        return Product::all();
    }
}
`;
}

// ❌ Bad - Avoid string concatenation
private getTemplate(): string {
    return '<?php' + 
           'class ProductController {' +
           '}';
}
```

### File Naming

- TypeScript: `PascalCase.ts`
- Interfaces: `IInterface.ts` or `Interface.ts`
- Constants: `UPPER_SNAKE_CASE`

## 🧪 Testing

### Manual Testing

1. Press F5 to launch Extension Development Host
2. Open a test project
3. Run "Generate PHP Structure"
4. Verify all files are created correctly
5. Check for TypeScript/PHP errors

### Automated Testing (Coming Soon)

```bash
npm test
```

## 📖 Documentation

When adding features, update:

- `README.md` - Main documentation
- `QUICKSTART.md` - Quick start guide
- `CHANGELOG.md` - Version changes
- Code comments - Explain complex logic

## 🔄 Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make Changes**
   - Write clean code
   - Follow style guide
   - Add comments
   - Test thoroughly

3. **Commit**
   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```
   
   **Commit Message Format**:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation
   - `style:` Formatting
   - `refactor:` Code restructuring
   - `test:` Tests
   - `chore:` Maintenance

4. **Push**
   ```bash
   git push origin feature/my-feature
   ```

5. **Create PR**
   - Go to GitHub
   - Click "New Pull Request"
   - Fill in template
   - Link related issues

### PR Checklist

- [ ] Code follows style guide
- [ ] Tested manually
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] No console.log() statements
- [ ] No TypeScript errors
- [ ] Git history is clean

## 🎨 Architecture Guidelines

### Generator Best Practices

1. **Keep Templates Modular**
   ```typescript
   // ✅ Good
   private getController() { /* ... */ }
   private getModel() { /* ... */ }
   private getView() { /* ... */ }
   
   // ❌ Bad
   private getAllFiles() { 
       return `controller + model + view...`;
   }
   ```

2. **Use Entity Name Consistently**
   ```typescript
   // ✅ Good
   `${entityName}Controller.php`
   `${entityName.toLowerCase()}s`  // for tables
   
   // ❌ Bad
   `controller.php`
   `${entity}Controller.php`  // undefined variable
   ```

3. **Add Comments for Complex Logic**
   ```typescript
   // Convert entity name to table name (Products -> products)
   const tableName = `${entityName.toLowerCase()}s`;
   ```

4. **Provide README per Architecture**
   - Explain use cases
   - Show file structure
   - Include examples

## 🐛 Debugging

### VS Code Debug

1. Set breakpoints in TypeScript code
2. Press F5
3. Use Debug Console

### Log Output

```typescript
console.log('Debug info:', variable);
vscode.window.showInformationMessage('Status update');
```

### Common Issues

**Extension not loading**:
- Check `package.json` activationEvents
- Verify webpack compilation
- Restart Extension Development Host

**Files not generating**:
- Check file structure object
- Verify directory creation
- Check file write permissions

## 💡 Tips

- **Use TypeScript features**: Types, interfaces, generics
- **Test edge cases**: Empty strings, special characters
- **Think about users**: Clear error messages, helpful prompts
- **Performance**: Avoid unnecessary file operations
- **Security**: Don't expose sensitive data in templates

## 📞 Need Help?

- 💬 [GitHub Discussions](https://github.com/MaxPopovschii/php-generator/discussions)
- 🐛 [Issues](https://github.com/MaxPopovschii/php-generator/issues)
- 📧 Contact maintainers

## 🎉 Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Part of an awesome open-source project!

Thank you for making PHP development better! 🚀
