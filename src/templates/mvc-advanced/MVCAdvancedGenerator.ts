import { StructureGenerator } from '../StructureGenerator';

export class MVCAdvancedGenerator implements StructureGenerator {
    generate(rootPath: string, entityName: string, options: any): any {
        const structure: any = {};
        
        // App directory
        structure['app'] = {
            'Controllers': {
                [`${entityName}Controller.php`]: this.getControllerTemplate(entityName),
                'BaseController.php': this.getBaseControllerTemplate()
            },
            'Models': {
                [`${entityName}.php`]: this.getModelTemplate(entityName),
                'BaseModel.php': this.getBaseModelTemplate()
            },
            'Views': {
                [entityName.toLowerCase()]: {
                    'index.php': this.getIndexViewTemplate(entityName),
                    'create.php': this.getCreateViewTemplate(entityName),
                    'edit.php': this.getEditViewTemplate(entityName),
                    'show.php': this.getShowViewTemplate(entityName)
                },
                'layouts': {
                    'app.php': this.getLayoutTemplate()
                }
            },
            'Middleware': {
                'AuthMiddleware.php': this.getAuthMiddlewareTemplate(),
                'CorsMiddleware.php': this.getCorsMiddlewareTemplate(),
                'ValidateMiddleware.php': this.getValidateMiddlewareTemplate()
            },
            'Services': {
                [`${entityName}Service.php`]: this.getServiceTemplate(entityName),
                'Container.php': this.getContainerTemplate()
            },
            'Validators': {
                [`${entityName}Validator.php`]: this.getValidatorTemplate(entityName)
            }
        };

        // Config directory
        structure['config'] = {
            'app.php': this.getAppConfigTemplate(),
            'database.php': this.getDatabaseConfigTemplate(),
            'routes.php': this.getRoutesTemplate(entityName)
        };

        // Database directory
        structure['database'] = {
            'migrations': {
                [`${Date.now()}_create_${entityName.toLowerCase()}s_table.php`]: this.getMigrationTemplate(entityName)
            },
            'seeders': {
                [`${entityName}Seeder.php`]: this.getSeederTemplate(entityName)
            }
        };

        // Public directory
        structure['public'] = {
            'index.php': this.getPublicIndexTemplate(),
            'assets': {
                'css': {
                    'app.css': this.getCssTemplate()
                },
                'js': {
                    'app.js': this.getJsTemplate()
                }
            }
        };

        // Core directory
        structure['core'] = {
            'Router.php': this.getRouterTemplate(),
            'Request.php': this.getRequestTemplate(),
            'Response.php': this.getResponseTemplate(),
            'Database.php': this.getDatabaseTemplate()
        };

        // Tests directory
        structure['tests'] = {
            [`${entityName}ControllerTest.php`]: this.getControllerTestTemplate(entityName)
        };

        // Root files
        structure['composer.json'] = this.getComposerTemplate(entityName);
        structure['.env.example'] = this.getEnvTemplate();
        structure['.htaccess'] = this.getHtaccessTemplate();
        structure['README.md'] = this.getReadmeTemplate(entityName);

        return structure;
    }

    private getControllerTemplate(entityName: string): string {
        return `<?php

namespace App\\Controllers;

use App\\Models\\${entityName};
use App\\Services\\${entityName}Service;
use App\\Validators\\${entityName}Validator;
use Core\\Request;
use Core\\Response;

class ${entityName}Controller extends BaseController
{
    private ${entityName}Service $service;
    private ${entityName}Validator $validator;

    public function __construct(${entityName}Service $service, ${entityName}Validator $validator)
    {
        $this->service = $service;
        $this->validator = $validator;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $${entityName.toLowerCase()}s = $this->service->getAll($request->query());
        
        if ($request->expectsJson()) {
            return $this->json($${entityName.toLowerCase()}s);
        }
        
        return $this->view('${entityName.toLowerCase()}/index', [
            '${entityName.toLowerCase()}s' => $${entityName.toLowerCase()}s
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return $this->view('${entityName.toLowerCase()}/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): Response
    {
        $data = $request->all();
        
        $errors = $this->validator->validate($data);
        if ($errors) {
            return $this->json(['errors' => $errors], 422);
        }

        $${entityName.toLowerCase()} = $this->service->create($data);
        
        if ($request->expectsJson()) {
            return $this->json($${entityName.toLowerCase()}, 201);
        }
        
        return $this->redirect('/${entityName.toLowerCase()}s');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, int $id): Response
    {
        $${entityName.toLowerCase()} = $this->service->findById($id);
        
        if (!$${entityName.toLowerCase()}) {
            return $this->json(['error' => '${entityName} not found'], 404);
        }
        
        if ($request->expectsJson()) {
            return $this->json($${entityName.toLowerCase()});
        }
        
        return $this->view('${entityName.toLowerCase()}/show', [
            '${entityName.toLowerCase()}' => $${entityName.toLowerCase()}
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id): Response
    {
        $${entityName.toLowerCase()} = $this->service->findById($id);
        
        if (!$${entityName.toLowerCase()}) {
            return $this->redirect('/${entityName.toLowerCase()}s');
        }
        
        return $this->view('${entityName.toLowerCase()}/edit', [
            '${entityName.toLowerCase()}' => $${entityName.toLowerCase()}
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): Response
    {
        $data = $request->all();
        
        $errors = $this->validator->validate($data, $id);
        if ($errors) {
            return $this->json(['errors' => $errors], 422);
        }

        $${entityName.toLowerCase()} = $this->service->update($id, $data);
        
        if (!$${entityName.toLowerCase()}) {
            return $this->json(['error' => '${entityName} not found'], 404);
        }
        
        if ($request->expectsJson()) {
            return $this->json($${entityName.toLowerCase()});
        }
        
        return $this->redirect('/${entityName.toLowerCase()}s');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, int $id): Response
    {
        $deleted = $this->service->delete($id);
        
        if (!$deleted) {
            return $this->json(['error' => '${entityName} not found'], 404);
        }
        
        if ($request->expectsJson()) {
            return $this->json(['message' => '${entityName} deleted successfully']);
        }
        
        return $this->redirect('/${entityName.toLowerCase()}s');
    }
}
`;
    }

    private getBaseControllerTemplate(): string {
        return `<?php

namespace App\\Controllers;

use Core\\Response;

abstract class BaseController
{
    protected function view(string $view, array $data = []): Response
    {
        extract($data);
        ob_start();
        require __DIR__ . '/../Views/' . str_replace('.', '/', $view) . '.php';
        $content = ob_get_clean();
        
        return new Response($content);
    }

    protected function json($data, int $statusCode = 200): Response
    {
        return new Response(
            json_encode($data),
            $statusCode,
            ['Content-Type' => 'application/json']
        );
    }

    protected function redirect(string $url, int $statusCode = 302): Response
    {
        return new Response('', $statusCode, ['Location' => $url]);
    }
}
`;
    }

    private getModelTemplate(entityName: string): string {
        return `<?php

namespace App\\Models;

class ${entityName} extends BaseModel
{
    protected string $table = '${entityName.toLowerCase()}s';
    
    protected array $fillable = [
        'name',
        'email',
        'status'
    ];

    protected array $casts = [
        'id' => 'int',
        'status' => 'bool',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relationships
    
    // Scopes
    
    // Accessors & Mutators
}
`;
    }

    private getBaseModelTemplate(): string {
        return `<?php

namespace App\\Models;

use Core\\Database;
use PDO;

abstract class BaseModel
{
    protected string $table;
    protected array $fillable = [];
    protected array $casts = [];
    protected Database $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function all(): array
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table}");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_CLASS, static::class);
    }

    public function find(int $id): ?self
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetchObject(static::class);
        return $result ?: null;
    }

    public function create(array $data): self
    {
        $data = $this->filterFillable($data);
        $columns = implode(', ', array_keys($data));
        $placeholders = implode(', ', array_fill(0, count($data), '?'));
        
        $sql = "INSERT INTO {$this->table} ($columns) VALUES ($placeholders)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array_values($data));
        
        return $this->find($this->db->lastInsertId());
    }

    public function update(int $id, array $data): bool
    {
        $data = $this->filterFillable($data);
        $set = implode(', ', array_map(fn($col) => "$col = ?", array_keys($data)));
        
        $sql = "UPDATE {$this->table} SET $set WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([...array_values($data), $id]);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE id = ?");
        return $stmt->execute([$id]);
    }

    protected function filterFillable(array $data): array
    {
        return array_filter(
            $data,
            fn($key) => in_array($key, $this->fillable),
            ARRAY_FILTER_USE_KEY
        );
    }
}
`;
    }

    private getServiceTemplate(entityName: string): string {
        return `<?php

namespace App\\Services;

use App\\Models\\${entityName};

class ${entityName}Service
{
    private ${entityName} $model;

    public function __construct(${entityName} $model)
    {
        $this->model = $model;
    }

    public function getAll(array $filters = []): array
    {
        // Apply filters, pagination, sorting
        return $this->model->all();
    }

    public function findById(int $id): ?${entityName}
    {
        return $this->model->find($id);
    }

    public function create(array $data): ${entityName}
    {
        // Business logic before creating
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?${entityName}
    {
        $${entityName.toLowerCase()} = $this->findById($id);
        if (!$${entityName.toLowerCase()}) {
            return null;
        }

        $this->model->update($id, $data);
        return $this->findById($id);
    }

    public function delete(int $id): bool
    {
        return $this->model->delete($id);
    }
}
`;
    }

    private getValidatorTemplate(entityName: string): string {
        return `<?php

namespace App\\Validators;

class ${entityName}Validator
{
    public function validate(array $data, ?int $id = null): array
    {
        $errors = [];

        // Name validation
        if (empty($data['name'])) {
            $errors['name'] = 'Name is required';
        } elseif (strlen($data['name']) < 3) {
            $errors['name'] = 'Name must be at least 3 characters';
        }

        // Email validation
        if (empty($data['email'])) {
            $errors['email'] = 'Email is required';
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Email must be valid';
        }

        return $errors;
    }
}
`;
    }

    private getAuthMiddlewareTemplate(): string {
        return `<?php

namespace App\\Middleware;

use Core\\Request;
use Core\\Response;

class AuthMiddleware
{
    public function handle(Request $request, callable $next): Response
    {
        // Check if user is authenticated
        if (!isset($_SESSION['user_id'])) {
            if ($request->expectsJson()) {
                return new Response(
                    json_encode(['error' => 'Unauthorized']),
                    401,
                    ['Content-Type' => 'application/json']
                );
            }
            return new Response('', 302, ['Location' => '/login']);
        }

        return $next($request);
    }
}
`;
    }

    private getCorsMiddlewareTemplate(): string {
        return `<?php

namespace App\\Middleware;

use Core\\Request;
use Core\\Response;

class CorsMiddleware
{
    public function handle(Request $request, callable $next): Response
    {
        $response = $next($request);
        
        $response->headers['Access-Control-Allow-Origin'] = '*';
        $response->headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        $response->headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

        return $response;
    }
}
`;
    }

    private getValidateMiddlewareTemplate(): string {
        return `<?php

namespace App\\Middleware;

use Core\\Request;
use Core\\Response;

class ValidateMiddleware
{
    public function handle(Request $request, callable $next): Response
    {
        // CSRF token validation
        if (in_array($request->method(), ['POST', 'PUT', 'DELETE'])) {
            $token = $request->input('csrf_token') ?? $request->header('X-CSRF-TOKEN');
            if (!$this->validateCsrfToken($token)) {
                return new Response(
                    json_encode(['error' => 'Invalid CSRF token']),
                    403,
                    ['Content-Type' => 'application/json']
                );
            }
        }

        return $next($request);
    }

    private function validateCsrfToken(?string $token): bool
    {
        return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token ?? '');
    }
}
`;
    }

    private getContainerTemplate(): string {
        return `<?php

namespace App\\Services;

class Container
{
    private array $bindings = [];
    private array $instances = [];

    public function bind(string $abstract, callable $concrete): void
    {
        $this->bindings[$abstract] = $concrete;
    }

    public function singleton(string $abstract, callable $concrete): void
    {
        $this->bind($abstract, $concrete);
        $this->instances[$abstract] = null;
    }

    public function make(string $abstract)
    {
        if (isset($this->instances[$abstract]) && $this->instances[$abstract] !== null) {
            return $this->instances[$abstract];
        }

        if (isset($this->bindings[$abstract])) {
            $instance = $this->bindings[$abstract]($this);
            
            if (array_key_exists($abstract, $this->instances)) {
                $this->instances[$abstract] = $instance;
            }
            
            return $instance;
        }

        return new $abstract();
    }
}
`;
    }

    private getIndexViewTemplate(entityName: string): string {
        const lower = entityName.toLowerCase();
        return `<?php include __DIR__ . '/../layouts/app.php'; ?>

<div class="container">
    <div class="header">
        <h1>${entityName} List</h1>
        <a href="/${lower}s/create" class="btn btn-primary">Create New ${entityName}</a>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($${lower}s as $${lower}): ?>
            <tr>
                <td><?= htmlspecialchars($${lower}->id) ?></td>
                <td><?= htmlspecialchars($${lower}->name) ?></td>
                <td><?= htmlspecialchars($${lower}->email) ?></td>
                <td><?= $${lower}->status ? 'Active' : 'Inactive' ?></td>
                <td>
                    <a href="/${lower}s/<?= $${lower}->id ?>" class="btn btn-sm">View</a>
                    <a href="/${lower}s/<?= $${lower}->id ?>/edit" class="btn btn-sm">Edit</a>
                    <form method="POST" action="/${lower}s/<?= $${lower}->id ?>" style="display:inline;">
                        <input type="hidden" name="_method" value="DELETE">
                        <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure?')">Delete</button>
                    </form>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
`;
    }

    private getCreateViewTemplate(entityName: string): string {
        const lower = entityName.toLowerCase();
        return `<?php include __DIR__ . '/../layouts/app.php'; ?>

<div class="container">
    <h1>Create ${entityName}</h1>

    <form method="POST" action="/${lower}s" class="form">
        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
        </div>

        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
        </div>

        <div class="form-group">
            <label for="status">
                <input type="checkbox" id="status" name="status" value="1">
                Active
            </label>
        </div>

        <div class="form-actions">
            <button type="submit" class="btn btn-primary">Create</button>
            <a href="/${lower}s" class="btn">Cancel</a>
        </div>
    </form>
</div>
`;
    }

    private getEditViewTemplate(entityName: string): string {
        const lower = entityName.toLowerCase();
        return `<?php include __DIR__ . '/../layouts/app.php'; ?>

<div class="container">
    <h1>Edit ${entityName}</h1>

    <form method="POST" action="/${lower}s/<?= $${lower}->id ?>" class="form">
        <input type="hidden" name="_method" value="PUT">
        
        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" value="<?= htmlspecialchars($${lower}->name) ?>" required>
        </div>

        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" value="<?= htmlspecialchars($${lower}->email) ?>" required>
        </div>

        <div class="form-group">
            <label for="status">
                <input type="checkbox" id="status" name="status" value="1" <?= $${lower}->status ? 'checked' : '' ?>>
                Active
            </label>
        </div>

        <div class="form-actions">
            <button type="submit" class="btn btn-primary">Update</button>
            <a href="/${lower}s" class="btn">Cancel</a>
        </div>
    </form>
</div>
`;
    }

    private getShowViewTemplate(entityName: string): string {
        const lower = entityName.toLowerCase();
        return `<?php include __DIR__ . '/../layouts/app.php'; ?>

<div class="container">
    <h1>${entityName} Details</h1>

    <div class="card">
        <div class="card-row">
            <strong>ID:</strong>
            <span><?= htmlspecialchars($${lower}->id) ?></span>
        </div>
        <div class="card-row">
            <strong>Name:</strong>
            <span><?= htmlspecialchars($${lower}->name) ?></span>
        </div>
        <div class="card-row">
            <strong>Email:</strong>
            <span><?= htmlspecialchars($${lower}->email) ?></span>
        </div>
        <div class="card-row">
            <strong>Status:</strong>
            <span><?= $${lower}->status ? 'Active' : 'Inactive' ?></span>
        </div>
        <div class="card-row">
            <strong>Created:</strong>
            <span><?= htmlspecialchars($${lower}->created_at) ?></span>
        </div>
    </div>

    <div class="form-actions">
        <a href="/${lower}s/<?= $${lower}->id ?>/edit" class="btn btn-primary">Edit</a>
        <a href="/${lower}s" class="btn">Back to List</a>
    </div>
</div>
`;
    }

    private getLayoutTemplate(): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP MVC Application</title>
    <link rel="stylesheet" href="/assets/css/app.css">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <a href="/" class="navbar-brand">PHP MVC App</a>
            <ul class="navbar-nav">
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
            </ul>
        </div>
    </nav>

    <main>
        <?php echo $content ?? ''; ?>
    </main>

    <footer>
        <div class="container">
            <p>&copy; <?= date('Y') ?> PHP MVC Application. All rights reserved.</p>
        </div>
    </footer>

    <script src="/assets/js/app.js"></script>
</body>
</html>
`;
    }

    private getAppConfigTemplate(): string {
        return `<?php

return [
    'name' => getenv('APP_NAME') ?: 'PHP MVC App',
    'env' => getenv('APP_ENV') ?: 'development',
    'debug' => getenv('APP_DEBUG') === 'true',
    'url' => getenv('APP_URL') ?: 'http://localhost',
    'timezone' => 'UTC',
];
`;
    }

    private getDatabaseConfigTemplate(): string {
        return `<?php

return [
    'default' => getenv('DB_CONNECTION') ?: 'mysql',
    
    'connections' => [
        'mysql' => [
            'driver' => 'mysql',
            'host' => getenv('DB_HOST') ?: 'localhost',
            'port' => getenv('DB_PORT') ?: '3306',
            'database' => getenv('DB_DATABASE') ?: 'app_db',
            'username' => getenv('DB_USERNAME') ?: 'root',
            'password' => getenv('DB_PASSWORD') ?: '',
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
        ],
    ],
];
`;
    }

    private getRoutesTemplate(entityName: string): string {
        const lower = entityName.toLowerCase();
        return `<?php

use Core\\Router;
use App\\Controllers\\${entityName}Controller;
use App\\Middleware\\AuthMiddleware;
use App\\Middleware\\CorsMiddleware;

$router = new Router();

// Apply global middleware
$router->middleware(new CorsMiddleware());

// ${entityName} routes
$router->get('/${lower}s', [${entityName}Controller::class, 'index']);
$router->get('/${lower}s/create', [${entityName}Controller::class, 'create']);
$router->post('/${lower}s', [${entityName}Controller::class, 'store']);
$router->get('/${lower}s/{id}', [${entityName}Controller::class, 'show']);
$router->get('/${lower}s/{id}/edit', [${entityName}Controller::class, 'edit']);
$router->put('/${lower}s/{id}', [${entityName}Controller::class, 'update']);
$router->delete('/${lower}s/{id}', [${entityName}Controller::class, 'destroy']);

// API routes with authentication
$router->group(['prefix' => 'api', 'middleware' => AuthMiddleware::class], function($router) {
    $router->get('/${lower}s', [${entityName}Controller::class, 'index']);
    $router->post('/${lower}s', [${entityName}Controller::class, 'store']);
    $router->get('/${lower}s/{id}', [${entityName}Controller::class, 'show']);
    $router->put('/${lower}s/{id}', [${entityName}Controller::class, 'update']);
    $router->delete('/${lower}s/{id}', [${entityName}Controller::class, 'destroy']);
});

return $router;
`;
    }

    private getMigrationTemplate(entityName: string): string {
        const table = `${entityName.toLowerCase()}s`;
        return `<?php

use Core\\Database;

class Create${entityName}sTable
{
    public function up(): void
    {
        $db = Database::getInstance();
        $sql = "
            CREATE TABLE IF NOT EXISTS ${table} (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                status BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ";
        $db->exec($sql);
    }

    public function down(): void
    {
        $db = Database::getInstance();
        $db->exec("DROP TABLE IF EXISTS ${table}");
    }
}

// Run migration
$migration = new Create${entityName}sTable();
$migration->up();
echo "${entityName}s table created successfully!\\n";
`;
    }

    private getSeederTemplate(entityName: string): string {
        return `<?php

use App\\Models\\${entityName};

class ${entityName}Seeder
{
    public function run(): void
    {
        $model = new ${entityName}();
        
        $data = [
            ['name' => 'John Doe', 'email' => 'john@example.com', 'status' => true],
            ['name' => 'Jane Smith', 'email' => 'jane@example.com', 'status' => true],
            ['name' => 'Bob Wilson', 'email' => 'bob@example.com', 'status' => false],
        ];

        foreach ($data as $item) {
            $model->create($item);
        }
        
        echo "${entityName} seeded successfully!\\n";
    }
}

// Run seeder
$seeder = new ${entityName}Seeder();
$seeder->run();
`;
    }

    private getPublicIndexTemplate(): string {
        return `<?php

session_start();

require_once __DIR__ . '/../vendor/autoload.php';

// Load environment variables
if (file_exists(__DIR__ . '/../.env')) {
    $lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        putenv(sprintf('%s=%s', trim($name), trim($value)));
    }
}

// Load configuration
$appConfig = require __DIR__ . '/../config/app.php';

// Error reporting
if ($appConfig['debug']) {
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
} else {
    error_reporting(0);
    ini_set('display_errors', '0');
}

// Initialize router
$router = require __DIR__ . '/../config/routes.php';

// Dispatch request
use Core\\Request;

$request = Request::createFromGlobals();
$response = $router->dispatch($request);
$response->send();
`;
    }

    private getCssTemplate(): string {
        return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #f5f5f5;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.navbar {
    background: #2c3e50;
    color: white;
    padding: 1rem 0;
    margin-bottom: 2rem;
}

.navbar-brand {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    text-decoration: none;
}

.navbar-nav {
    list-style: none;
    display: flex;
    gap: 1rem;
}

.navbar-nav a {
    color: white;
    text-decoration: none;
}

.btn {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    border: none;
    cursor: pointer;
}

.btn-primary {
    background: #2ecc71;
}

.btn-danger {
    background: #e74c3c;
}

.table {
    width: 100%;
    background: white;
    border-collapse: collapse;
    margin: 1rem 0;
}

.table th,
.table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.table th {
    background: #f8f9fa;
    font-weight: bold;
}

.form {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 600px;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input[type="text"],
.form-group input[type="email"] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.form-actions {
    margin-top: 1.5rem;
    display: flex;
    gap: 0.5rem;
}

.card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin: 1rem 0;
}

.card-row {
    display: flex;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f0f0f0;
}

.card-row strong {
    width: 150px;
}

footer {
    background: #2c3e50;
    color: white;
    text-align: center;
    padding: 2rem 0;
    margin-top: 3rem;
}
`;
    }

    private getJsTemplate(): string {
        return `// Confirmation dialogs
document.querySelectorAll('form[data-confirm]').forEach(form => {
    form.addEventListener('submit', (e) => {
        if (!confirm(form.dataset.confirm)) {
            e.preventDefault();
        }
    });
});

// Flash messages auto-hide
setTimeout(() => {
    document.querySelectorAll('.flash-message').forEach(msg => {
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 300);
    });
}, 5000);

// AJAX form submissions
document.querySelectorAll('form[data-ajax]').forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        const data = await response.json();
        console.log('Response:', data);
    });
});
`;
    }

    private getRouterTemplate(): string {
        return `<?php

namespace Core;

class Router
{
    private array $routes = [];
    private array $middleware = [];
    private array $groupOptions = [];

    public function middleware($middleware): self
    {
        $this->middleware[] = $middleware;
        return $this;
    }

    public function group(array $options, callable $callback): void
    {
        $previousGroup = $this->groupOptions;
        $this->groupOptions = array_merge($this->groupOptions, $options);
        
        $callback($this);
        
        $this->groupOptions = $previousGroup;
    }

    public function get(string $uri, $action): void
    {
        $this->addRoute('GET', $uri, $action);
    }

    public function post(string $uri, $action): void
    {
        $this->addRoute('POST', $uri, $action);
    }

    public function put(string $uri, $action): void
    {
        $this->addRoute('PUT', $uri, $action);
    }

    public function delete(string $uri, $action): void
    {
        $this->addRoute('DELETE', $uri, $action);
    }

    private function addRoute(string $method, string $uri, $action): void
    {
        $prefix = $this->groupOptions['prefix'] ?? '';
        $middleware = $this->groupOptions['middleware'] ?? null;
        
        $uri = '/' . trim($prefix . '/' . trim($uri, '/'), '/');
        
        $this->routes[] = [
            'method' => $method,
            'uri' => $uri,
            'action' => $action,
            'middleware' => $middleware
        ];
    }

    public function dispatch(Request $request): Response
    {
        $method = $request->method();
        $uri = parse_url($request->uri(), PHP_URL_PATH);

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }

            $pattern = preg_replace('/\\{([a-zA-Z]+)\\}/', '(?P<$1>[^/]+)', $route['uri']);
            $pattern = '#^' . $pattern . '$#';

            if (preg_match($pattern, $uri, $matches)) {
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                
                $handler = function($request) use ($route, $params) {
                    return $this->callAction($route['action'], $request, $params);
                };

                // Apply route-specific middleware
                if ($route['middleware']) {
                    $middleware = new $route['middleware']();
                    $handler = fn($req) => $middleware->handle($req, fn($r) => $this->callAction($route['action'], $r, $params));
                }

                // Apply global middleware
                foreach (array_reverse($this->middleware) as $mw) {
                    $prevHandler = $handler;
                    $handler = fn($req) => $mw->handle($req, $prevHandler);
                }

                return $handler($request);
            }
        }

        return new Response('Not Found', 404);
    }

    private function callAction($action, Request $request, array $params): Response
    {
        if (is_array($action)) {
            [$controller, $method] = $action;
            $instance = new $controller();
            return $instance->$method($request, ...array_values($params));
        }

        if (is_callable($action)) {
            return $action($request, ...array_values($params));
        }

        return new Response('Invalid action', 500);
    }
}
`;
    }

    private getRequestTemplate(): string {
        return `<?php

namespace Core;

class Request
{
    private string $method;
    private string $uri;
    private array $query;
    private array $post;
    private array $files;
    private array $server;
    private array $headers;

    public function __construct(
        string $method,
        string $uri,
        array $query = [],
        array $post = [],
        array $files = [],
        array $server = [],
        array $headers = []
    ) {
        $this->method = strtoupper($method);
        $this->uri = $uri;
        $this->query = $query;
        $this->post = $post;
        $this->files = $files;
        $this->server = $server;
        $this->headers = $headers;
    }

    public static function createFromGlobals(): self
    {
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (strpos($key, 'HTTP_') === 0) {
                $headers[str_replace('HTTP_', '', $key)] = $value;
            }
        }

        return new self(
            $_SERVER['REQUEST_METHOD'] ?? 'GET',
            $_SERVER['REQUEST_URI'] ?? '/',
            $_GET,
            $_POST,
            $_FILES,
            $_SERVER,
            $headers
        );
    }

    public function method(): string
    {
        return $this->post['_method'] ?? $this->method;
    }

    public function uri(): string
    {
        return $this->uri;
    }

    public function query(?string $key = null, $default = null)
    {
        if ($key === null) {
            return $this->query;
        }
        return $this->query[$key] ?? $default;
    }

    public function input(?string $key = null, $default = null)
    {
        if ($key === null) {
            return array_merge($this->query, $this->post);
        }
        return $this->post[$key] ?? $this->query[$key] ?? $default;
    }

    public function all(): array
    {
        return array_merge($this->query, $this->post);
    }

    public function header(string $key, $default = null)
    {
        return $this->headers[strtoupper(str_replace('-', '_', $key))] ?? $default;
    }

    public function expectsJson(): bool
    {
        return strpos($this->header('Accept', ''), 'application/json') !== false ||
               strpos($this->header('Content-Type', ''), 'application/json') !== false;
    }
}
`;
    }

    private getResponseTemplate(): string {
        return `<?php

namespace Core;

class Response
{
    public string $content;
    public int $statusCode;
    public array $headers;

    public function __construct(string $content = '', int $statusCode = 200, array $headers = [])
    {
        $this->content = $content;
        $this->statusCode = $statusCode;
        $this->headers = $headers;
    }

    public function send(): void
    {
        http_response_code($this->statusCode);
        
        foreach ($this->headers as $name => $value) {
            header("$name: $value");
        }
        
        echo $this->content;
    }
}
`;
    }

    private getDatabaseTemplate(): string {
        return `<?php

namespace Core;

use PDO;
use PDOException;

class Database extends PDO
{
    private static ?Database $instance = null;

    private function __construct()
    {
        $config = require __DIR__ . '/../config/database.php';
        $connection = $config['connections'][$config['default']];

        $dsn = sprintf(
            '%s:host=%s;port=%s;dbname=%s;charset=%s',
            $connection['driver'],
            $connection['host'],
            $connection['port'],
            $connection['database'],
            $connection['charset']
        );

        try {
            parent::__construct(
                $dsn,
                $connection['username'],
                $connection['password'],
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch (PDOException $e) {
            die('Database connection failed: ' . $e->getMessage());
        }
    }

    public static function getInstance(): Database
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __clone() {}
    public function __wakeup() {}
}
`;
    }

    private getControllerTestTemplate(entityName: string): string {
        return `<?php

use PHPUnit\\Framework\\TestCase;
use App\\Controllers\\${entityName}Controller;

class ${entityName}ControllerTest extends TestCase
{
    public function testIndex()
    {
        // TODO: Implement test
        $this->assertTrue(true);
    }

    public function testStore()
    {
        // TODO: Implement test
        $this->assertTrue(true);
    }
}
`;
    }

    private getComposerTemplate(entityName: string): string {
        return `{
    "name": "app/mvc-advanced",
    "description": "Modern PHP MVC Application for ${entityName}",
    "type": "project",
    "require": {
        "php": "^8.0"
    },
    "require-dev": {
        "phpunit/phpunit": "^9.0"
    },
    "autoload": {
        "psr-4": {
            "App\\\\": "app/",
            "Core\\\\": "core/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "Tests\\\\": "tests/"
        }
    },
    "scripts": {
        "test": "phpunit",
        "migrate": "php database/migrate.php",
        "seed": "php database/seed.php"
    }
}
`;
    }

    private getEnvTemplate(): string {
        return `APP_NAME="PHP MVC App"
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=app_db
DB_USERNAME=root
DB_PASSWORD=

SESSION_LIFETIME=120
SESSION_DRIVER=file
`;
    }

    private getHtaccessTemplate(): string {
        return `<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # Redirect to public directory
    RewriteCond %{REQUEST_URI} !^/public/
    RewriteRule ^(.*)$ /public/$1 [L]
    
    # Handle front controller
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ /public/index.php [QSA,L]
</IfModule>

# Disable directory browsing
Options -Indexes

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
`;
    }

    private getReadmeTemplate(entityName: string): string {
        return `# PHP MVC Advanced Application

Modern PHP MVC application with ${entityName} CRUD functionality.

## Features

- 🏗️ **MVC Architecture** - Clean separation of concerns
- 🛣️ **Routing** - Powerful routing with middleware support
- 💉 **Dependency Injection** - Service container for loose coupling
- 🗃️ **Database** - PDO-based database layer with migrations
- ✅ **Validation** - Input validation system
- 🎨 **Views** - Template system with layouts
- 🔒 **Security** - CSRF protection, password hashing
- 📦 **PSR-4 Autoloading** - Composer autoloading

## Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   composer install
   \`\`\`

3. Copy environment file:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. Configure your database in \`.env\`

5. Run migrations:
   \`\`\`bash
   composer migrate
   \`\`\`

6. Seed database (optional):
   \`\`\`bash
   composer seed
   \`\`\`

7. Start development server:
   \`\`\`bash
   php -S localhost:8000 -t public
   \`\`\`

## Usage

Visit \`http://localhost:8000\` in your browser.

### API Endpoints

- \`GET /${entityName.toLowerCase()}s\` - List all ${entityName.toLowerCase()}s
- \`GET /${entityName.toLowerCase()}s/{id}\` - Get single ${entityName.toLowerCase()}
- \`POST /${entityName.toLowerCase()}s\` - Create new ${entityName.toLowerCase()}
- \`PUT /${entityName.toLowerCase()}s/{id}\` - Update ${entityName.toLowerCase()}
- \`DELETE /${entityName.toLowerCase()}s/{id}\` - Delete ${entityName.toLowerCase()}

## Project Structure

\`\`\`
app/
├── Controllers/       # Application controllers
├── Models/           # Data models
├── Views/            # View templates
├── Middleware/       # HTTP middleware
├── Services/         # Business logic
└── Validators/       # Input validation

config/               # Configuration files
core/                 # Core framework files
database/             
├── migrations/       # Database migrations
└── seeders/          # Database seeders
public/               # Public web root
tests/                # Unit tests
\`\`\`

## Testing

Run tests with:
\`\`\`bash
composer test
\`\`\`

## License

MIT License
`;
    }
}
