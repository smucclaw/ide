import * as vscode from 'vscode';
import { mkGraph } from './mkGraph';
import { mkMarkdown } from './mkMarkdown';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    // Generate graph
    vscode.commands.registerCommand('ide-prototype.mkGraph', () => mkGraph()),
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

export function getFileFolderPaths() {
  if (vscode.workspace.workspaceFolders && vscode.window.activeTextEditor) {
    // Get path to current folder open in workspace
    const currentFolderInWorkplace = vscode.workspace.workspaceFolders[0].uri.path;

    // Get path to current file in active editor
    const fileInActiveEditor = vscode.window.activeTextEditor.document.fileName;

    return { currentFolderInWorkplace, fileInActiveEditor };
  }
  return { currentFolderInWorkplace: 'No folder found', fileInActiveEditor: 'No file found' };
}
