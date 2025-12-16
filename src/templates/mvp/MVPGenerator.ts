import { StructureGenerator } from '../StructureGenerator';

export class MVPGenerator implements StructureGenerator {
    generate(rootPath: string, entityName: string, options: any): any {
        const structure: any = {};
        
        // Models directory
        structure['app'] = {
            'Models': {
                [`${entityName}Model.php`]: this.getModelTemplate(entityName),
                'BaseModel.php': this.getBaseModelTemplate(),
                [`${entityName}Repository.php`]: this.getRepositoryTemplate(entityName)
            },
            'Views': {
                [`${entityName}View.php`]: this.getViewTemplate(entityName),
                'BaseView.php': this.getBaseViewTemplate()
            },
            'Presenters': {
                [`${entityName}Presenter.php`]: this.getPresenterTemplate(entityName),
                'BasePresenter.php': this.getBasePresenterTemplate()
            },
            'Contracts': {
                [`${entityName}ViewInterface.php`]: this.getViewInterfaceTemplate(entityName),
                [`${entityName}PresenterInterface.php`]: this.getPresenterInterfaceTemplate(entityName)
            },
            'Services': {
                [`${entityName}Service.php`]: this.getServiceTemplate(entityName)
            },
            'Templates': {
                [entityName.toLowerCase()]: {
                    'list.phtml': this.getListTemplate(entityName),
                    'form.phtml': this.getFormTemplate(entityName),
                    'detail.phtml': this.getDetailTemplate(entityName)
                }
            }
        };

        structure['config'] = {
            'app.php': this.getAppConfigTemplate(),
            'database.php': this.getDatabaseConfigTemplate()
        };

        structure['public'] = {
            'index.php': this.getIndexTemplate(entityName)
        };

        structure['tests'] = {
            'Presenters': {
                [`${entityName}PresenterTest.php`]: this.getPresenterTestTemplate(entityName)
            },
            'Models': {
                [`${entityName}ModelTest.php`]: this.getModelTestTemplate(entityName)
            }
        };

        structure['composer.json'] = this.getComposerTemplate(entityName);
        structure['README.md'] = this.getReadmeTemplate(entityName);

        return structure;
    }

    private getModelTemplate(entityName: string): string {
        return `<?php

namespace App\\Models;

class ${entityName}Model extends BaseModel
{
    private int $id;
    private string $name;
    private string $email;
    private bool $status;
    private ?string $createdAt;
    private ?string $updatedAt;

    public function __construct(array $data = [])
    {
        $this->id = $data['id'] ?? 0;
        $this->name = $data['name'] ?? '';
        $this->email = $data['email'] ?? '';
        $this->status = $data['status'] ?? true;
        $this->createdAt = $data['created_at'] ?? null;
        $this->updatedAt = $data['updated_at'] ?? null;
    }

    // Getters
    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getStatus(): bool
    {
        return $this->status;
    }

    public function getCreatedAt(): ?string
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?string
    {
        return $this->updatedAt;
    }

    // Setters
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    public function setStatus(bool $status): void
    {
        $this->status = $status;
    }

    // Validation
    public function validate(): array
    {
        $errors = [];

        if (empty($this->name)) {
            $errors['name'] = 'Name is required';
        }

        if (empty($this->email)) {
            $errors['email'] = 'Email is required';
        } elseif (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Email must be valid';
        }

        return $errors;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'status' => $this->status,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt
        ];
    }
}
`;
    }

    private getBaseModelTemplate(): string {
        return `<?php

namespace App\\Models;

abstract class BaseModel
{
    abstract public function toArray(): array;
    abstract public function validate(): array;
}
`;
    }

    private getRepositoryTemplate(entityName: string): string {
        return `<?php

namespace App\\Models;

use PDO;

class ${entityName}Repository
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function findAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM ${entityName.toLowerCase()}s ORDER BY created_at DESC");
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return array_map(fn($row) => new ${entityName}Model($row), $results);
    }

    public function findById(int $id): ?${entityName}Model
    {
        $stmt = $this->db->prepare("SELECT * FROM ${entityName.toLowerCase()}s WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $row ? new ${entityName}Model($row) : null;
    }

    public function save(${entityName}Model $model): ${entityName}Model
    {
        if ($model->getId() > 0) {
            return $this->update($model);
        }
        return $this->create($model);
    }

    private function create(${entityName}Model $model): ${entityName}Model
    {
        $stmt = $this->db->prepare("
            INSERT INTO ${entityName.toLowerCase()}s (name, email, status, created_at, updated_at)
            VALUES (?, ?, ?, NOW(), NOW())
        ");
        
        $stmt->execute([
            $model->getName(),
            $model->getEmail(),
            $model->getStatus() ? 1 : 0
        ]);
        
        return $this->findById($this->db->lastInsertId());
    }

    private function update(${entityName}Model $model): ${entityName}Model
    {
        $stmt = $this->db->prepare("
            UPDATE ${entityName.toLowerCase()}s 
            SET name = ?, email = ?, status = ?, updated_at = NOW()
            WHERE id = ?
        ");
        
        $stmt->execute([
            $model->getName(),
            $model->getEmail(),
            $model->getStatus() ? 1 : 0,
            $model->getId()
        ]);
        
        return $this->findById($model->getId());
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM ${entityName.toLowerCase()}s WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
`;
    }

    private getViewTemplate(entityName: string): string {
        return `<?php

namespace App\\Views;

use App\\Contracts\\${entityName}ViewInterface;

class ${entityName}View extends BaseView implements ${entityName}ViewInterface
{
    public function showList(array $items): void
    {
        $this->render('${entityName.toLowerCase()}/list', ['items' => $items]);
    }

    public function showDetail(array $item): void
    {
        $this->render('${entityName.toLowerCase()}/detail', ['item' => $item]);
    }

    public function showForm(?array $item = null): void
    {
        $this->render('${entityName.toLowerCase()}/form', ['item' => $item]);
    }

    public function showErrors(array $errors): void
    {
        $this->render('errors', ['errors' => $errors]);
    }

    public function showSuccess(string $message): void
    {
        $this->render('success', ['message' => $message]);
    }
}
`;
    }

    private getBaseViewTemplate(): string {
        return `<?php

namespace App\\Views;

abstract class BaseView
{
    protected function render(string $template, array $data = []): void
    {
        extract($data);
        $templatePath = __DIR__ . '/../Templates/' . $template . '.phtml';
        
        if (!file_exists($templatePath)) {
            throw new \\Exception("Template not found: $template");
        }
        
        require $templatePath;
    }

    protected function escape(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }
}
`;
    }

    private getPresenterTemplate(entityName: string): string {
        return `<?php

namespace App\\Presenters;

use App\\Contracts\\${entityName}ViewInterface;
use App\\Contracts\\${entityName}PresenterInterface;
use App\\Models\\${entityName}Repository;
use App\\Services\\${entityName}Service;

class ${entityName}Presenter extends BasePresenter implements ${entityName}PresenterInterface
{
    private ${entityName}ViewInterface $view;
    private ${entityName}Repository $repository;
    private ${entityName}Service $service;

    public function __construct(
        ${entityName}ViewInterface $view,
        ${entityName}Repository $repository,
        ${entityName}Service $service
    ) {
        $this->view = $view;
        $this->repository = $repository;
        $this->service = $service;
    }

    public function showList(): void
    {
        try {
            $models = $this->repository->findAll();
            $items = array_map(fn($model) => $this->service->formatForDisplay($model), $models);
            $this->view->showList($items);
        } catch (\\Exception $e) {
            $this->view->showErrors(['system' => 'Unable to load data']);
        }
    }

    public function showDetail(int $id): void
    {
        try {
            $model = $this->repository->findById($id);
            
            if (!$model) {
                $this->view->showErrors(['notFound' => '${entityName} not found']);
                return;
            }
            
            $item = $this->service->formatForDisplay($model);
            $this->view->showDetail($item);
        } catch (\\Exception $e) {
            $this->view->showErrors(['system' => 'Unable to load data']);
        }
    }

    public function showCreateForm(): void
    {
        $this->view->showForm();
    }

    public function showEditForm(int $id): void
    {
        try {
            $model = $this->repository->findById($id);
            
            if (!$model) {
                $this->view->showErrors(['notFound' => '${entityName} not found']);
                return;
            }
            
            $this->view->showForm($model->toArray());
        } catch (\\Exception $e) {
            $this->view->showErrors(['system' => 'Unable to load data']);
        }
    }

    public function create(array $data): void
    {
        try {
            $result = $this->service->create($data);
            
            if (isset($result['errors'])) {
                $this->view->showErrors($result['errors']);
                $this->view->showForm($data);
                return;
            }
            
            $this->view->showSuccess('${entityName} created successfully');
            $this->showList();
        } catch (\\Exception $e) {
            $this->view->showErrors(['system' => 'Unable to create ${entityName.toLowerCase()}']);
        }
    }

    public function update(int $id, array $data): void
    {
        try {
            $result = $this->service->update($id, $data);
            
            if (isset($result['errors'])) {
                $this->view->showErrors($result['errors']);
                $this->view->showForm(array_merge(['id' => $id], $data));
                return;
            }
            
            $this->view->showSuccess('${entityName} updated successfully');
            $this->showDetail($id);
        } catch (\\Exception $e) {
            $this->view->showErrors(['system' => 'Unable to update ${entityName.toLowerCase()}']);
        }
    }

    public function delete(int $id): void
    {
        try {
            $result = $this->service->delete($id);
            
            if (!$result) {
                $this->view->showErrors(['notFound' => '${entityName} not found']);
                return;
            }
            
            $this->view->showSuccess('${entityName} deleted successfully');
            $this->showList();
        } catch (\\Exception $e) {
            $this->view->showErrors(['system' => 'Unable to delete ${entityName.toLowerCase()}']);
        }
    }
}
`;
    }

    private getBasePresenterTemplate(): string {
        return `<?php

namespace App\\Presenters;

abstract class BasePresenter
{
    // Common presenter functionality
}
`;
    }

    private getViewInterfaceTemplate(entityName: string): string {
        return `<?php

namespace App\\Contracts;

interface ${entityName}ViewInterface
{
    public function showList(array $items): void;
    public function showDetail(array $item): void;
    public function showForm(?array $item = null): void;
    public function showErrors(array $errors): void;
    public function showSuccess(string $message): void;
}
`;
    }

    private getPresenterInterfaceTemplate(entityName: string): string {
        return `<?php

namespace App\\Contracts;

interface ${entityName}PresenterInterface
{
    public function showList(): void;
    public function showDetail(int $id): void;
    public function showCreateForm(): void;
    public function showEditForm(int $id): void;
    public function create(array $data): void;
    public function update(int $id, array $data): void;
    public function delete(int $id): void;
}
`;
    }

    private getServiceTemplate(entityName: string): string {
        return `<?php

namespace App\\Services;

use App\\Models\\${entityName}Model;
use App\\Models\\${entityName}Repository;

class ${entityName}Service
{
    private ${entityName}Repository $repository;

    public function __construct(${entityName}Repository $repository)
    {
        $this->repository = $repository;
    }

    public function formatForDisplay(${entityName}Model $model): array
    {
        $data = $model->toArray();
        
        // Additional formatting for display
        $data['status_label'] = $model->getStatus() ? 'Active' : 'Inactive';
        $data['created_at_formatted'] = $data['created_at'] ? 
            date('M d, Y', strtotime($data['created_at'])) : 'N/A';
        
        return $data;
    }

    public function create(array $data): array
    {
        $model = new ${entityName}Model($data);
        $errors = $model->validate();
        
        if (!empty($errors)) {
            return ['errors' => $errors];
        }
        
        $saved = $this->repository->save($model);
        return ['model' => $saved];
    }

    public function update(int $id, array $data): array
    {
        $model = $this->repository->findById($id);
        
        if (!$model) {
            return ['errors' => ['notFound' => '${entityName} not found']];
        }
        
        $model->setName($data['name'] ?? $model->getName());
        $model->setEmail($data['email'] ?? $model->getEmail());
        $model->setStatus($data['status'] ?? $model->getStatus());
        
        $errors = $model->validate();
        
        if (!empty($errors)) {
            return ['errors' => $errors];
        }
        
        $saved = $this->repository->save($model);
        return ['model' => $saved];
    }

    public function delete(int $id): bool
    {
        return $this->repository->delete($id);
    }
}
`;
    }

    private getListTemplate(entityName: string): string {
        return `<!DOCTYPE html>
<html>
<head>
    <title><?= \\$this->escape('${entityName} List') ?></title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f5f5f5; }
        .actions a { margin-right: 10px; }
        .btn { padding: 8px 16px; text-decoration: none; background: #007bff; color: white; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>${entityName} List</h1>
    <a href="?action=create" class="btn">Create New ${entityName}</a>
    
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach (\\$items as \\$item): ?>
            <tr>
                <td><?= \\$this->escape(\\$item['id']) ?></td>
                <td><?= \\$this->escape(\\$item['name']) ?></td>
                <td><?= \\$this->escape(\\$item['email']) ?></td>
                <td><?= \\$this->escape(\\$item['status_label']) ?></td>
                <td><?= \\$this->escape(\\$item['created_at_formatted']) ?></td>
                <td class="actions">
                    <a href="?action=show&id=<?= \\$item['id'] ?>">View</a>
                    <a href="?action=edit&id=<?= \\$item['id'] ?>">Edit</a>
                    <a href="?action=delete&id=<?= \\$item['id'] ?>" onclick="return confirm('Are you sure?')">Delete</a>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</body>
</html>
`;
    }

    private getFormTemplate(entityName: string): string {
        return `<!DOCTYPE html>
<html>
<head>
    <title><?= \\$this->escape(isset(\\$item) ? 'Edit ${entityName}' : 'Create ${entityName}') ?></title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; max-width: 600px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input[type="text"], input[type="email"] { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        .btn { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .btn:hover { background: #0056b3; }
    </style>
</head>
<body>
    <h1><?= isset(\\$item) ? 'Edit ${entityName}' : 'Create ${entityName}' ?></h1>
    
    <form method="POST" action="?action=<?= isset(\\$item) ? 'update&id=' . \\$item['id'] : 'store' ?>">
        <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" value="<?= \\$this->escape(\\$item['name'] ?? '') ?>" required>
        </div>
        
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" value="<?= \\$this->escape(\\$item['email'] ?? '') ?>" required>
        </div>
        
        <div class="form-group">
            <label>
                <input type="checkbox" name="status" value="1" <?= (\\$item['status'] ?? true) ? 'checked' : '' ?>>
                Active
            </label>
        </div>
        
        <button type="submit" class="btn"><?= isset(\\$item) ? 'Update' : 'Create' ?></button>
        <a href="?action=list">Cancel</a>
    </form>
</body>
</html>
`;
    }

    private getDetailTemplate(entityName: string): string {
        return `<!DOCTYPE html>
<html>
<head>
    <title><?= \\$this->escape('${entityName} Details') ?></title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; max-width: 600px; }
        .detail-row { padding: 10px 0; border-bottom: 1px solid #ddd; }
        .detail-row strong { display: inline-block; width: 150px; }
        .actions { margin-top: 20px; }
        .btn { padding: 10px 20px; text-decoration: none; background: #007bff; color: white; border-radius: 4px; margin-right: 10px; }
    </style>
</head>
<body>
    <h1>${entityName} Details</h1>
    
    <div class="detail-row">
        <strong>ID:</strong>
        <?= \\$this->escape(\\$item['id']) ?>
    </div>
    <div class="detail-row">
        <strong>Name:</strong>
        <?= \\$this->escape(\\$item['name']) ?>
    </div>
    <div class="detail-row">
        <strong>Email:</strong>
        <?= \\$this->escape(\\$item['email']) ?>
    </div>
    <div class="detail-row">
        <strong>Status:</strong>
        <?= \\$this->escape(\\$item['status_label']) ?>
    </div>
    <div class="detail-row">
        <strong>Created:</strong>
        <?= \\$this->escape(\\$item['created_at_formatted']) ?>
    </div>
    
    <div class="actions">
        <a href="?action=edit&id=<?= \\$item['id'] ?>" class="btn">Edit</a>
        <a href="?action=list" class="btn">Back to List</a>
    </div>
</body>
</html>
`;
    }

    private getAppConfigTemplate(): string {
        return `<?php

return [
    'name' => 'PHP MVP Application',
    'debug' => true,
];
`;
    }

    private getDatabaseConfigTemplate(): string {
        return `<?php

return [
    'host' => 'localhost',
    'database' => 'app_db',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8mb4'
];
`;
    }

    private getIndexTemplate(entityName: string): string {
        return `<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\\Models\\${entityName}Repository;
use App\\Views\\${entityName}View;
use App\\Presenters\\${entityName}Presenter;
use App\\Services\\${entityName}Service;

// Database connection
$config = require __DIR__ . '/../config/database.php';
$dsn = "mysql:host={$config['host']};dbname={$config['database']};charset={$config['charset']}";
$pdo = new PDO($dsn, $config['username'], $config['password'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);

// Initialize MVP components
$repository = new ${entityName}Repository($pdo);
$view = new ${entityName}View();
$service = new ${entityName}Service($repository);
$presenter = new ${entityName}Presenter($view, $repository, $service);

// Handle requests
$action = $_GET['action'] ?? 'list';
$id = $_GET['id'] ?? null;

switch ($action) {
    case 'list':
        $presenter->showList();
        break;
    
    case 'show':
        $presenter->showDetail((int)$id);
        break;
    
    case 'create':
        $presenter->showCreateForm();
        break;
    
    case 'store':
        $presenter->create($_POST);
        break;
    
    case 'edit':
        $presenter->showEditForm((int)$id);
        break;
    
    case 'update':
        $presenter->update((int)$id, $_POST);
        break;
    
    case 'delete':
        $presenter->delete((int)$id);
        break;
    
    default:
        $presenter->showList();
}
`;
    }

    private getPresenterTestTemplate(entityName: string): string {
        return `<?php

use PHPUnit\\Framework\\TestCase;
use App\\Presenters\\${entityName}Presenter;

class ${entityName}PresenterTest extends TestCase
{
    public function testShowListCallsView()
    {
        // TODO: Implement test with mocks
        $this->assertTrue(true);
    }
}
`;
    }

    private getModelTestTemplate(entityName: string): string {
        return `<?php

use PHPUnit\\Framework\\TestCase;
use App\\Models\\${entityName}Model;

class ${entityName}ModelTest extends TestCase
{
    public function testValidationFailsWithEmptyName()
    {
        $model = new ${entityName}Model(['name' => '', 'email' => 'test@example.com']);
        $errors = $model->validate();
        
        $this->assertArrayHasKey('name', $errors);
    }

    public function testValidationFailsWithInvalidEmail()
    {
        $model = new ${entityName}Model(['name' => 'Test', 'email' => 'invalid']);
        $errors = $model->validate();
        
        $this->assertArrayHasKey('email', $errors);
    }
}
`;
    }

    private getComposerTemplate(entityName: string): string {
        return `{
    "name": "app/mvp-${entityName.toLowerCase()}",
    "description": "MVP Architecture for ${entityName}",
    "type": "project",
    "require": {
        "php": "^8.0"
    },
    "require-dev": {
        "phpunit/phpunit": "^9.0"
    },
    "autoload": {
        "psr-4": {
            "App\\\\": "app/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "Tests\\\\": "tests/"
        }
    }
}
`;
    }

    private getReadmeTemplate(entityName: string): string {
        return `# PHP MVP Application - ${entityName}

MVP (Model-View-Presenter) architecture implementation.

## Architecture

- **Model**: Pure data objects with validation and business rules
- **View**: Passive view that only displays data
- **Presenter**: Contains presentation logic, mediates between Model and View

## Features

- ✅ Testable presenters with dependency injection
- 🎯 Clear separation of concerns
- 📦 Repository pattern for data access
- 🔒 Type-safe contracts (interfaces)

## Installation

\`\`\`bash
composer install
\`\`\`

Configure database in \`config/database.php\`.

## Usage

Start development server:
\`\`\`bash
php -S localhost:8000 -t public
\`\`\`

## Testing

\`\`\`bash
composer test
\`\`\`

## MVP Pattern Benefits

1. **Testability**: Presenter can be unit tested without views
2. **Separation**: View is passive and knows nothing about Model
3. **Reusability**: Same presenter can work with different views
4. **Maintainability**: Clear responsibilities for each component

## Project Structure

\`\`\`
app/
├── Models/           # Data models and repositories
├── Views/            # View implementations
├── Presenters/       # Presentation logic
├── Contracts/        # Interfaces
├── Services/         # Business logic services
└── Templates/        # View templates
\`\`\`
`;
    }
}
