CRUD Generator for PHP — VS Code Extension
Overview

CRUD Generator for PHP is a Visual Studio Code extension that streamlines the creation of CRUD (Create, Read, Update, Delete) operations for PHP applications. Developed with Node.js and TypeScript, it allows you to automatically generate Controller, Model, and View files using three predefined structures: MVC, REST, and FUNCTIONAL.
Features

    ⚡ Automatic generation of Controller, Model, and View files.

    🧩 Choose between three generation modes:

        MVC (Model-View-Controller)

        REST (RESTful API structure)

        FUNCTIONAL (pure functional PHP structure)

    🔧 Fully written in TypeScript for performance and scalability.

    🖥️ Simple and intuitive interface integrated into Visual Studio Code.

    🚀 Boost productivity by eliminating repetitive coding tasks.

Installation

    Ensure you have Visual Studio Code and Node.js v20+ installed.

    Install the extension from the Visual Studio Marketplace, or manually:

    npm install -g @vscode/vsce
    vsce package
    code --install-extension crud-generator-php.vsix

Usage

    Open your PHP project in VS Code.

    Launch the Command Palette:

        Ctrl+Shift+P (Windows/Linux)

        Cmd+Shift+P (macOS)

    Search for and select Generate CRUD.

    Enter the table/model name.

    Choose the desired structure type: MVC, REST, or FUNCTIONAL.

    The extension will generate all necessary files automatically.

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

📬 For support, feedback, or feature requests, please open an issue on GitHub Issues.
