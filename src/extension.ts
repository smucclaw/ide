import { mkGraph } from './mkGraph';
import { mkMarkdown } from './mkMarkdown';
import * as path from 'path';
import { workspace, commands, window, ViewColumn, ExtensionContext } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;


export function activate(context: ExtensionContext) {
	// The server is implemented in node

	console.log(path.join('out', 'dummyserver', 'server.js'));
	const serverModule = context.asAbsolutePath(
		path.join('out', 'dummyserver', 'server.js')
	);
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'l4' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'languageServerExample',
		'Language Server Example',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();

	context.subscriptions.push(
		// Generate graph
		commands.registerCommand('ide-prototype.mkGraph', () => mkGraph()),
		// Generate markdown
		commands.registerCommand('ide-prototype.mkMarkdown', () => mkMarkdown()),
	);
}

export function splitIfPanelExists(panel: ViewColumn | undefined) {
	// split if there is more than one view column
	if (panel != ViewColumn.One) {
		commands.executeCommand('vscode.setEditorLayout', {
			groups: [
				{
					orientation: 0,
					groups: [{}, { orientation: 1, groups: [{}, {}], size: 0.5 }],
					size: 0.5,
				},
			],
		});
	}
}

export function getFileFolderPaths() {
	if (workspace.workspaceFolders && window.activeTextEditor) {
		// Get path to current folder open in workspace
		const currentFolderInWorkplace = workspace.workspaceFolders[0].uri.path;

		// Get path to current file in active editor
		const fileInActiveEditor = window.activeTextEditor.document.fileName;

		return { currentFolderInWorkplace, fileInActiveEditor };
	}
	return { currentFolderInWorkplace: 'No folder found', fileInActiveEditor: 'No file found' };
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}