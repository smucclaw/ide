import * as vscode from 'vscode';
import * as child_process from 'child_process';
import { splitIfPanelExists } from './extension';
import { promisify } from 'util';
const user_cwd = process.cwd();


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
      // Run only if a folder & a file are open
      if(vscode.workspace.workspaceFolders && vscode.window.activeTextEditor){
        // Get path to current folder open in workspace
        let folderPath = vscode.workspace.workspaceFolders[0].uri.path;

        // Get path to current file in active editor
        let filePath = vscode.window.activeTextEditor.document.fileName;

        return execPromise('l4 ' + filePath, {
          cwd: folderPath,
        });
      }
      // Throw error if no folder or file available
      return { stdout: 'No open folder | No open file', stderr: 'Err' }
    }
    return mkdwnOut;
  }
})();
