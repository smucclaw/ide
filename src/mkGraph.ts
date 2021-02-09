import * as vscode from 'vscode';
import { splitIfPanelExists, getFileFolderPaths } from './extension';
import { runProcess } from './runProcess';

export async function mkGraph() {
  const currentPanel = vscode.window.activeTextEditor
    ? vscode.window.activeTextEditor.viewColumn
    : undefined;

  // ensure new panel opens instead of new tab
  splitIfPanelExists(currentPanel);

  const panel = vscode.window.createWebviewPanel(
    'mkGraph',
    'L4 Graph',
    vscode.ViewColumn.Beside,
    {},
  );

  // Get paths for child_process
  const fileFolderPaths = getFileFolderPaths();

  const { stdout: dotOut, stderr: dotErr } = await produceDot(fileFolderPaths);
  const { stdout: svgOut, stderr: svgErr } = await produceSvg(dotOut);

  panel.webview.html = getWebviewContent(svgOut);
}

function produceSvg(lstdout: any) {
  const svgPromise = runProcess('dot -Tsvg');

  svgPromise.child.stdin?.write(lstdout);
  svgPromise.child.stdin?.end();
  return svgPromise;
}

function produceDot(paths: { currentFolderInWorkplace: string; fileInActiveEditor: string }) {
  if (paths) {
    return runProcess('l4 dot < ' + paths.fileInActiveEditor, {
      cwd: paths.currentFolderInWorkplace,
    });
  }
  // Throw error if no folder or file available
  return { stdout: 'No open folder | No open file', stderr: 'Err' };
}

function getWebviewContent(svg: string) {
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
