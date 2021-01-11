import * as vscode from 'vscode';
import * as path from 'path';
import { splitIfPanelExists } from './extension';
import * as fs from 'fs';

export async function mkMarkdown(context: vscode.ExtensionContext) {
  const currentPanel = vscode.window.activeTextEditor
    ? vscode.window.activeTextEditor.viewColumn
    : undefined;
  const uri = vscode.Uri.file(path.join(context.extensionPath, 'media', 'markdownText'));
  const doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider

  // ensure new panel opens instead of new tab
  splitIfPanelExists(currentPanel);

  await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
}

// Register virtual doc provider
export const markdownProvider = new (class implements vscode.TextDocumentContentProvider {
  // use filesync
  provideTextDocumentContent(uri: vscode.Uri): string {
    const input = fs.readFileSync(uri.path).toString();
    return input;
  }
})();
