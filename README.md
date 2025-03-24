# Generatore di CRUD per PHP - Estensione VS Code

## Descrizione
**Generatore di CRUD per PHP** è un'estensione per Visual Studio Code che semplifica la creazione di operazioni CRUD (Create, Read, Update, Delete) in PHP. Utilizza **Node.js**, **TypeScript** e **Mustache.js** per generare automaticamente Controller, Model e View per la tua applicazione PHP.

## Caratteristiche
- Generazione automatica di file **Controller, Model e View**.
- Supporto per la personalizzazione dei template tramite **Mustache.js**.
- Compatibilità con diversi framework PHP.
- Interfaccia semplice e veloce direttamente da VS Code.

## Installazione
1. Assicurati di avere installato **VS Code** e **Node.js 20+**.
2. Installa l'estensione da **Visual Studio Marketplace** oppure manualmente:
   ```sh
   npm install -g @vscode/vsce
   vsce package
   code --install-extension generatore-crud-php.vsix
   ```

## Utilizzo
1. Apri un progetto PHP in **VS Code**.
2. Apri la **palette dei comandi** con `Ctrl+Shift+P` (Windows/Linux) o `Cmd+Shift+P` (Mac).
3. Cerca e seleziona `Genera CRUD`.
4. Inserisci il nome della tabella o del modello.
5. L'estensione creerà automaticamente i file necessari.

## Configurazione
Puoi personalizzare i template modificando i file Mustache all'interno della cartella `templates` dell'estensione.

## Requisiti
- **VS Code** (ultima versione consigliata)
- **Node.js 20+**
- **PHP 7.4+**

## Contributi
Contribuire è semplice! Forka il repository, crea una nuova branch, apporta le modifiche e invia una pull request.

## Licenza
Questa estensione è rilasciata sotto licenza **MIT**.

---
📧 Per supporto o feedback, contattaci su [GitHub Issues](https://github.com/php-generator/issues).

