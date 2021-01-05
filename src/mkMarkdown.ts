import * as vscode from 'vscode';
import { splitIfPanelExists } from './extension';

export function mkMarkdown(): (...args: any[]) => any {
  return async () => {
    const currentPanel = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
    const uri = vscode.Uri.parse('markdown:' + 'L4'); // 'name of tab itself 
    const doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider

    // ensure new panel opens instead of new tab
    splitIfPanelExists(currentPanel);

    await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
  };
}

 // Register virtual doc provider
 export const myScheme = 'markdown';
 export const myProvider = new class implements vscode.TextDocumentContentProvider {

   provideTextDocumentContent(uri: vscode.Uri): string {
     let displayText = 'The Sale of Cabbages is Restricted. Everybody may sell the item, when the item is a cabbage and sale is onLegalDate or (unlikely) the seller has Exemption.';
     return displayText;
   }
 };
