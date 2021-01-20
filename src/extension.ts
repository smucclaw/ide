import * as vscode from 'vscode';
import { mkGraph } from './mkGraph';
import { mkMarkdown, markdownProvider } from './mkMarkdown';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    // Generate graph
    vscode.commands.registerCommand('ide-prototype.mkGraph', () => mkGraph(context)),
    vscode.workspace.registerTextDocumentContentProvider('markdown', markdownProvider),
    // Generate markdown
    vscode.commands.registerCommand('ide-prototype.mkMarkdown', () => mkMarkdown()),
  );
}

export function splitIfPanelExists(panel: vscode.ViewColumn | undefined) {
  // split if there is more than one view column
  if (panel != vscode.ViewColumn.One) {
    vscode.commands.executeCommand('vscode.setEditorLayout', {
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
