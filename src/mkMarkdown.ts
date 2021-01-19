import * as vscode from 'vscode';
import * as child_process from 'child_process';
import { splitIfPanelExists } from './extension';
import { promisify } from 'util';

const execPromise = promisify(child_process.exec);

export async function mkMarkdown() {
  const currentPanel = vscode.window.activeTextEditor
    ? vscode.window.activeTextEditor.viewColumn
    : undefined;
  const uri = vscode.Uri.parse('markdown:' + 'L4'); // 'name of tab itself 
  const doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider

  // ensure new panel opens instead of new tab
  splitIfPanelExists(currentPanel);

  await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
}

// Register virtual doc provider
export const markdownProvider = new (class implements vscode.TextDocumentContentProvider {

  async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
    const { stdout: mkdwnOut, stderr: mkdwnErr } = await produceMarkdown();

    function produceMarkdown() {
      return execPromise('l4 /Users/aseykoh/smu/dsl/bnfc/l4/mkdown.l4', {
        cwd: '/Users/aseykoh/smu/dsl/bnfc',
      });
    }
    return mkdwnOut;
  }
})();
