import * as vscode from 'vscode';
const generatePhpStructure = require("./generators/generator");

export function activate(context: vscode.ExtensionContext) {
    const viewId = 'phpStructureView';

    const view = vscode.window.createTreeView(viewId, {
        treeDataProvider: new PhpStructureProvider(),
        showCollapseAll: true
    });

    let disposable = vscode.commands.registerCommand('extension.generatePhpStructure', async () => {
        const folders = vscode.workspace.workspaceFolders;
        if (!folders) {
            vscode.window.showErrorMessage('Open a project folder before generating the structure.');
            return;
        }

        const projectRoot = folders[0].uri.fsPath;

        const type = await vscode.window.showQuickPick(['MVC', 'REST', 'Functional'], {
            placeHolder: 'Select the type of PHP structure to generate'
        });

        if (!type) {
            vscode.window.showInformationMessage('No option selected.');
            return;
        }

        const entityName = await vscode.window.showInputBox({
            placeHolder: 'Enter the main entity name (e.g., User, Product, Order)'
        });

        if (!entityName || !/^[A-Za-z]+$/.test(entityName)) {
            vscode.window.showErrorMessage('Invalid entity name. Use only letters.');
            return;
        }

        // Definisci le opzioni base per ogni tipo
        let options: string[] = [];
        if (type === 'MVC') {
            options = ['Controller', 'Model', 'View', 'Routes', 'Config', 'Composer'];
        } else if (type === 'REST') {
            options = ['Controller', 'Model', 'Middleware', 'Routes', 'Config', 'Composer'];
        } else if (type === 'Functional') {
            options = ['Controller', 'Model', 'Public', 'Config', 'Composer'];
        }

        const selected = await vscode.window.showQuickPick(options, {
            canPickMany: true,
            placeHolder: 'Seleziona i componenti da generare'
        });

        if (!selected || selected.length === 0) {
            vscode.window.showInformationMessage('Nessun componente selezionato. Operazione annullata.');
            return;
        }

        // Chiedi se usare template personalizzati
        const useCustomTemplates = await vscode.window.showQuickPick([
            'No',
            'Sì, scegli una cartella di template personalizzati...'
        ], {
            placeHolder: 'Vuoi usare template personalizzati?'
        });

        let templateDir: string | undefined = undefined;
        if (useCustomTemplates === 'Sì, scegli una cartella di template personalizzati...') {
            const folderUris = await vscode.window.showOpenDialog({
                canSelectFolders: true,
                canSelectFiles: false,
                canSelectMany: false,
                openLabel: 'Seleziona la cartella dei template'
            });
            if (folderUris && folderUris.length > 0) {
                templateDir = folderUris[0].fsPath;
            } else {
                vscode.window.showInformationMessage('Nessuna cartella selezionata. Verranno usati i template di default.');
            }
        }

        try {
            generatePhpStructure(projectRoot, type, entityName, selected, templateDir);
            vscode.window.showInformationMessage(`PHP ${type} structure for ${entityName} generata con successo!`);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            vscode.window.showErrorMessage(`Errore durante la generazione della struttura: ${msg}`);
        }
    });

    const generateButton = vscode.commands.registerCommand('phpStructure.generate', () => {
        vscode.commands.executeCommand('extension.generatePhpStructure');
    });

    context.subscriptions.push(view);
    context.subscriptions.push(disposable);
    context.subscriptions.push(generateButton);
}

export function deactivate() {}

class PhpStructureProvider implements vscode.TreeDataProvider<PhpStructureItem> {
    private readonly _onDidChangeTreeData: vscode.EventEmitter<PhpStructureItem | undefined | null | void> = new vscode.EventEmitter<PhpStructureItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<PhpStructureItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: PhpStructureItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: PhpStructureItem): Thenable<PhpStructureItem[]> {
        if (element) {
            return Promise.resolve([]);
        } else {
            return Promise.resolve([
                new PhpStructureItem(
                    'Generate WEB Application Structure',
                    'Generate WEB Application Structure',
                    vscode.TreeItemCollapsibleState.None,
                    {
                        command: 'extension.generatePhpStructure',
                        title: 'Generate WEB Structure',
                        arguments: []
                    }
                ),
            ]);
        }
    }
}

class PhpStructureItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly tooltip: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
        this.tooltip = tooltip;
    }
}
