import * as fs from 'fs';
import * as path from 'path';

function generatePhpStructure(rootPath: string, type: string, entityName: string, selectedComponents?: string[]) {
    const structure: { [key: string]: any } = {};
    const sel = (name: string) => !selectedComponents || selectedComponents.includes(name);

    if (type === 'MVC') {
        structure['app'] = {};
        if (sel('Controller')) {
            structure['app']['Controllers'] = {
                [`${entityName}Controller.php`]: `<?php
namespace App\\Controllers;
use App\\Models\\${entityName};

class ${entityName}Controller {
    public function index() {
        echo json_encode(${entityName}::all());
    }
    public function show($id) {
        echo json_encode(${entityName}::find($id));
    }
    public function store($data) {
        $entity = new ${entityName}($data);
        $entity->save();
    }
}
?>`
            };
        }
        if (sel('Model')) {
            structure['app']['Models'] = {
                [`${entityName}.php`]: `<?php
namespace App\\Models;
class ${entityName} {
    public $id;
    public $created_at;
    public function __construct($data = []) {
        foreach ($data as $key => $value) {
            $this->$key = $value;
        }
    }
    public static function all() {
        return []; // Simulazione di una query
    }
    public static function find($id) {
        return new self(['id' => $id]);
    }
    public function save() {
        echo "Salvataggio dell'oggetto";
    }
}
?>`
            };
        }
        if (sel('View')) {
            structure['app']['Views'] = {
                [`${entityName}.php`]: `<!DOCTYPE html>
<html>
<head>
    <title>${entityName} View</title>
</head>
<body>
    <h1>Vista per ${entityName}</h1>
</body>
</html>`
            };
        }
        if (sel('Routes')) {
            structure['routes'] = {
                'web.php': `<?php
require '../app/Controllers/${entityName}Controller.php';
$controller = new ${entityName}Controller();
$controller->index();
?>`
            };
        }
    } else if (type === 'REST') {
        structure['app'] = {
            'Controllers': {
                [`${entityName}Controller.php`]: `<?php
namespace App\\Controllers;
use App\\Models\\${entityName};

class ${entityName}Controller {
    public function index() {
        echo json_encode(${entityName}::all());
    }
}
?>`
            },
            'Models': {
                [`${entityName}.php`]: `<?php
namespace App\\Models;
class ${entityName} {
    public static function all() {
        return []; // Simulazione di una query
    }
}
?>`
            },
            'Middlewares': {
                'AuthMiddleware.php': `<?php
namespace App\\Middlewares;
class AuthMiddleware {
    public function handle() {
        echo "Middleware di autenticazione";
    }
}
?>`
            }
        };
        structure['routes'] = {
            'api.php': `<?php
require '../app/Controllers/${entityName}Controller.php';
header('Content-Type: application/json');
$controller = new ${entityName}Controller();
$controller->index();
?>`
        };
    } else if (type === 'Functional') {
        const entityLower = entityName.toLowerCase();
        structure['src'] = {
            [`${entityLower}_controller.php`]: `<?php
require_once '${entityLower}_model.php';

function get_all_${entityLower}s() {
    \$data = ${entityLower}_all();
    echo json_encode(\$data);
}

function create_${entityLower}(\$data) {
    ${entityLower}_save(\$data);
    echo "Nuovo ${entityName} salvato!";
}
?>`,
            [`${entityLower}_model.php`]: `<?php
function ${entityLower}_all() {
    return []; // Simulazione di una query
}

function ${entityLower}_save(\$data) {
    // Simulazione di salvataggio
    file_put_contents('data.txt', json_encode(\$data) . PHP_EOL, FILE_APPEND);
}
?>`
        };
        structure['public'] = {
            'index.php': `<?php
require_once '../src/${entityLower}_controller.php';
if (\$_SERVER['REQUEST_METHOD'] === 'POST') {
    create_${entityLower}(\$_POST);
} else {
    get_all_${entityLower}s();
}
?>`,
            [`create_${entityLower}.html`]: `<!DOCTYPE html>
<html>
<head>
    <title>Crea ${entityName}</title>
</head>
<body>
    <h1>Crea un nuovo ${entityName}</h1>
    <form method="POST" action="index.php">
        <label for="name">Nome:</label>
        <input type="text" id="name" name="name" required>
        <br>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <br>
        <button type="submit">Invia</button>
    </form>
</body>
</html>`,
            [`list_${entityLower}s.html`]: `<!DOCTYPE html>
<html>
<head>
    <title>Lista ${entityName}s</title>
</head>
<body>
    <h1>Elenco di ${entityName}s</h1>
    <ul id="list"></ul>

    <script>
        fetch('index.php')
            .then(response => response.json())
            .then(data => {
                const list = document.getElementById('list');
                data.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = JSON.stringify(item);
                    list.appendChild(li);
                });
            });
    </script>
</body>
</html>`
        };
    }

    structure['config'] = {
        'config.php': `<?php
return [
    'db' => [
        'host' => 'localhost',
        'database' => 'app_db',
        'user' => 'root',
        'password' => ''
    ]
];
?>`
    };

    structure['composer.json'] = `{
    "autoload": {
        "psr-4": {
            "App\\\\": "app/"
        }
    }
}`;

    createStructure(rootPath, structure);
}

// Funzione placeholder per la richiesta di conferma sovrascrittura (da gestire lato extension)
function askOverwriteSync(targetPath: string): boolean {
    // Node.js non ha prompt sincrono, quindi per VS Code si dovrebbe gestire lato UI.
    // Qui ritorniamo sempre true per compatibilità, ma il controllo reale va fatto lato extension.ts
    return true;
}

function createStructure(basePath: string, structure: any, askOverwrite: (targetPath: string) => boolean = askOverwriteSync) {
    for (const name in structure) {
        const fullPath = path.join(basePath, name);
        try {
            if (typeof structure[name] === 'object') {
                if (fs.existsSync(fullPath) && !fs.lstatSync(fullPath).isDirectory()) {
                    if (!askOverwrite(fullPath)) continue;
                }
                fs.mkdirSync(fullPath, { recursive: true });
                createStructure(fullPath, structure[name], askOverwrite);
            } else {
                if (fs.existsSync(fullPath)) {
                    if (!askOverwrite(fullPath)) continue;
                }
                fs.writeFileSync(fullPath, structure[name]);
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Errore nella creazione di ${fullPath}:`, err);
            throw new Error(`Errore nella creazione di ${fullPath}: ${err instanceof Error ? err.message : String(err)}`);
        }
    }
}

module.exports = generatePhpStructure;
