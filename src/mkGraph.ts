import * as vscode from 'vscode';
import * as path from 'path';
import { splitIfPanelExists } from './extension';

export function mkGraph(context: vscode.ExtensionContext) {
  const currentPanel = vscode.window.activeTextEditor
    ? vscode.window.activeTextEditor.viewColumn
    : undefined;

  // ensure new panel opens instead of new tab
  splitIfPanelExists(currentPanel);

  let panel = vscode.window.createWebviewPanel('mkGraph', 'L4 Graph', vscode.ViewColumn.Beside, {
    // Only allow the webview to access resources in our extension's media directory
    localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))],
  });

  // Get path to resource on disk
  const onDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'media', 'cabbage.png'));

  // And get the special URI to use with the webview
  const graphSrc = panel.webview.asWebviewUri(onDiskPath);

  panel.webview.html = getWebviewContent(graphSrc);
}

function getWebviewContent(graph: vscode.Uri) {
  return `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>L4 Graph</title>
          </head>
          <body>
              <img src="${graph}" width="500" />
          </body>
          </html>`;
}
