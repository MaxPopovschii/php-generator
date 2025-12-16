import * as vscode from 'vscode';
import { TemplateManager } from './templates/TemplateManager';
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
            vscode.window.showErrorMessage('🚫 Open a project folder before generating the structure.');
            return;
        }

        const projectRoot = folders[0].uri.fsPath;

        // Get all available templates with nice icons
        const templates = TemplateManager.getAllTemplates();
        const templateOptions = templates.map(([key, config]) => ({
            label: `${config.icon} ${config.name}`,
            description: config.description,
            detail: `✨ Features: ${config.features.join(', ')}`,
            value: key
        }));

        const selectedTemplate = await vscode.window.showQuickPick(templateOptions, {
            placeHolder: '🎨 Select the PHP architecture to generate',
            matchOnDescription: true,
            matchOnDetail: true
        });

        if (!selectedTemplate) {
            vscode.window.showInformationMessage('❌ No architecture selected.');
            return;
        }

        const type = selectedTemplate.value;

        const entityName = await vscode.window.showInputBox({
            placeHolder: '📝 Enter the main entity name (e.g., User, Product, Order)',
            prompt: 'Entity name will be used to generate files and classes',
            validateInput: (value) => {
                if (!value || !/^[A-Z][A-Za-z]*$/.test(value)) {
                    return '⚠️ Entity name must start with uppercase and contain only letters';
                }
                return null;
            }
        });

        if (!entityName) {
            vscode.window.showErrorMessage('❌ Invalid entity name.');
            return;
        }

        // Get template config
        const templateConfig = TemplateManager.getTemplate(type);
        if (!templateConfig) {
            vscode.window.showErrorMessage('❌ Template configuration not found.');
            return;
        }

        // Allow user to select components
        const selected = await vscode.window.showQuickPick(templateConfig.includes, {
            canPickMany: true,
            placeHolder: `📦 Select components to generate (${templateConfig.name})`,
            ignoreFocusOut: true
        });

        if (!selected || selected.length === 0) {
            vscode.window.showInformationMessage('❌ No components selected. Operation cancelled.');
            return;
        }

        // Additional options
        const includeDocker = await vscode.window.showQuickPick(['Yes', 'No'], {
            placeHolder: '🐳 Include Docker configuration?'
        });

        const includeTests = await vscode.window.showQuickPick(['Yes', 'No'], {
            placeHolder: '🧪 Include test files?'
        });

        const includeGitignore = await vscode.window.showQuickPick(['Yes', 'No'], {
            placeHolder: '📁 Include .gitignore?'
        });

        try {
            const options = {
                components: selected,
                includeDocker: includeDocker === 'Yes',
                includeTests: includeTests === 'Yes',
                includeGitignore: includeGitignore === 'Yes'
            };

            generatePhpStructure(projectRoot, type, entityName, options);
            
            vscode.window.showInformationMessage(
                `✅ ${templateConfig.icon} ${templateConfig.name} structure for "${entityName}" generated successfully! 🎉`,
                'Open Folder'
            ).then(selection => {
                if (selection === 'Open Folder') {
                    vscode.commands.executeCommand('revealInExplorer', vscode.Uri.file(projectRoot));
                }
            });
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            vscode.window.showErrorMessage(`❌ Error generating structure: ${msg}`);
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
