import * as fs from 'fs';
import * as path from 'path';

export interface TemplateConfig {
    name: string;
    description: string;
    icon: string;
    features: string[];
    includes: string[];
}

export class TemplateManager {
    private static templates: Map<string, TemplateConfig> = new Map([
        ['mvc-advanced', {
            name: 'MVC Advanced',
            description: 'Modern MVC with Routing, Middleware, Dependency Injection',
            icon: '🏗️',
            features: ['PSR-4 Autoloading', 'Route Management', 'Middleware Pipeline', 'Service Container'],
            includes: ['Controllers', 'Models', 'Views', 'Routes', 'Middleware', 'Services', 'Config', 'Database']
        }],
        ['mvp', {
            name: 'MVP (Model-View-Presenter)',
            description: 'Separation of presentation logic from business logic',
            icon: '🎯',
            features: ['Passive View', 'Testable Presenters', 'Model Independence'],
            includes: ['Models', 'Views', 'Presenters', 'Contracts', 'Services', 'Config']
        }],
        ['layered', {
            name: 'Layered Architecture',
            description: 'Domain-Driven Design with clean separation',
            icon: '🎂',
            features: ['Domain Layer', 'Application Layer', 'Infrastructure Layer', 'Clean Architecture'],
            includes: ['Domain', 'Application', 'Infrastructure', 'Presentation', 'Tests']
        }],
        ['rest-api', {
            name: 'REST API',
            description: 'Modern RESTful API with OpenAPI documentation',
            icon: '🌐',
            features: ['OpenAPI 3.0', 'JWT Authentication', 'Rate Limiting', 'CORS', 'API Versioning'],
            includes: ['Controllers', 'Models', 'Middleware', 'Routes', 'Documentation', 'Tests']
        }],
        ['microservices', {
            name: 'Microservices',
            description: 'Microservices architecture with service discovery',
            icon: '🔬',
            features: ['Service Isolation', 'API Gateway', 'Event Bus', 'Service Registry'],
            includes: ['Services', 'Gateway', 'Events', 'Config', 'Docker', 'Tests']
        }],
        ['functional', {
            name: 'Functional PHP',
            description: 'Pure functional programming approach',
            icon: '⚡',
            features: ['Pure Functions', 'Immutability', 'Composition', 'No Side Effects'],
            includes: ['Functions', 'Types', 'Utils', 'Config', 'Tests']
        }]
    ]);

    static getTemplate(name: string): TemplateConfig | undefined {
        return this.templates.get(name);
    }

    static getAllTemplates(): Array<[string, TemplateConfig]> {
        return Array.from(this.templates.entries());
    }

    static getTemplateNames(): string[] {
        return Array.from(this.templates.keys());
    }
}
