import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(
    // Generate graph
    vscode.commands.registerCommand('ide-prototype.mkGraph', () => {
      const currentPanel = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

        // ensure new panel opens instead of new tab
        splitIfPanelExists(currentPanel);

        let panel = vscode.window.createWebviewPanel(
          'mkGraph',
          'L4 Graph',
          vscode.ViewColumn.Beside,
          {
            // Only allow the webview to access resources in our extension's media directory
            localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))],
          }
        );
  
        // Get path to resource on disk
        const onDiskPath = vscode.Uri.file(
          path.join(context.extensionPath, 'media', 'cabbage.png')
        );
  
        // And get the special URI to use with the webview
        const graphSrc = panel.webview.asWebviewUri(onDiskPath);
  
        panel.webview.html = getWebviewContent(graphSrc);
    
    }))
  
  // Register virtual doc provider
  const myScheme = 'markdown';
	const myProvider = new class implements vscode.TextDocumentContentProvider {

		provideTextDocumentContent(uri: vscode.Uri): string {
      let displayText = 'The Sale of Cabbages is Restricted. Everybody may sell the item, when the item is a cabbage and sale is onLegalDate or (unlikely) the seller has Exemption.';
      return displayText;
		}
  };
  
  context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(myScheme, myProvider));
  
  // Generate text panel
	context.subscriptions.push(vscode.commands.registerCommand('markdown.show', async () => {
      const currentPanel = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
			const uri = vscode.Uri.parse('markdown:' + 'L4'); // 'name of tab itself 
      const doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider

      // ensure new panel opens instead of new tab
      splitIfPanelExists(currentPanel);
     
			await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
	}));
}


function splitIfPanelExists(panel: vscode.ViewColumn | undefined) {
  // split if there is more than one view column
  if (panel != vscode.ViewColumn.One) {
    vscode.commands.executeCommand('vscode.setEditorLayout', { groups: [{ orientation: 0, groups: [{}, { orientation: 1, groups: [{}, {}], size: 0.5 }], size: 0.5 }] });
  }
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

