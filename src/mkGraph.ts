import * as vscode from 'vscode';
import * as path from 'path';
import * as child_process from 'child_process';
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

  child_process.exec("l4 $HOME/code/dsl/bnfc/l4/deon_bike_meng.l4",
    { cwd: "$HOME/code/dsl/bnfc" },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.error(`l4 stderr: ${stderr}`);

      const capt = child_process.exec("dot -Tsvg",(error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`dot stdout:${getWebviewContent2(stdout)}`);
        console.error(`dot stderr: ${stderr}`);
        panel.webview.html = getWebviewContent2(stdout);
      });
      capt.stdin?.write(stdout);
      capt.stdin?.end();
    });
}

function getWebviewContent2(svg: string) {
  return `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>L4 Graph</title>
          </head>
          <body>
              ${svg}
          </body>
          </html>`;
}