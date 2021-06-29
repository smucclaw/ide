import * as vscode from 'vscode';
import { splitIfPanelExists, getFileFolderPaths } from './extension';
import { runProcess } from './runProcess';

export async function mkMarkdown() {
  const currentPanel = vscode.window.activeTextEditor
    ? vscode.window.activeTextEditor.viewColumn
    : undefined;

  // ensure new panel opens instead of new tab
  splitIfPanelExists(currentPanel);

  const panel = vscode.window.createWebviewPanel(
    'mkMarkdown',
    'L4 Natural Language',
    vscode.ViewColumn.Two,
    {},
  );

  // Get paths for child_process
  const fileFolderPaths = getFileFolderPaths();

  // Get l4 nat-lang output
  const { stdout: mkdwnOut, stderr: mkdwnErr } = await produceNatLang(fileFolderPaths);

  // Display nat-lang output
  panel.webview.html = getWebviewContent(mkdwnOut);
}

function produceNatLang(paths: { currentFolderInWorkplace: string; fileInActiveEditor: string }) {

  if (paths) {
    return runProcess('l4 gf en ' + paths.fileInActiveEditor, {
      cwd: paths.currentFolderInWorkplace,
    });
  }
  // Throw error if no folder or file available
  return { stdout: 'No open folder | No open file', stderr: 'Err' };
}

function getWebviewContent(plaintext: string) {
  return `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>L4 Graph</title>
          </head>
          <body>
              ${plaintext}
          </body>
          </html>`;
}
