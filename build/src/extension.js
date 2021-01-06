"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.activate = void 0;
var vscode = require("vscode");
var path = require("path");
function activate(context) {
    var _this = this;
    context.subscriptions.push(
    // Generate graph
    vscode.commands.registerCommand('ide-prototype.mkGraph', function () {
        var currentPanel = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        // ensure new panel opens instead of new tab
        splitIfPanelExists(currentPanel);
        var panel = vscode.window.createWebviewPanel('mkGraph', 'L4 Graph', vscode.ViewColumn.Beside, {
            // Only allow the webview to access resources in our extension's media directory
            localResourceRoots: [
                vscode.Uri.file(path.join(context.extensionPath, 'media')),
            ]
        });
        // Get path to resource on disk
        var onDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'media', 'cabbage.png'));
        // And get the special URI to use with the webview
        var graphSrc = panel.webview.asWebviewUri(onDiskPath);
        panel.webview.html = getWebviewContent(graphSrc);
    }));
    // Register virtual doc provider
    var myScheme = 'markdown';
    var myProvider = new (/** @class */ (function () {
        function class_1() {
        }
        class_1.prototype.provideTextDocumentContent = function (uri) {
            var displayText = 'The Sale of Cabbages is Restricted. Everybody may sell the item, when the item is a cabbage and sale is onLegalDate or (unlikely) the seller has Exemption.';
            return displayText;
        };
        return class_1;
    }()))();
    context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(myScheme, myProvider));
    // Generate text panel
    context.subscriptions.push(vscode.commands.registerCommand('ide-prototype.mkMarkdown', function () { return __awaiter(_this, void 0, void 0, function () {
        var currentPanel, uri, doc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentPanel = vscode.window.activeTextEditor
                        ? vscode.window.activeTextEditor.viewColumn
                        : undefined;
                    uri = vscode.Uri.parse('markdown:' + 'L4');
                    return [4 /*yield*/, vscode.workspace.openTextDocument(uri)];
                case 1:
                    doc = _a.sent();
                    // ensure new panel opens instead of new tab
                    splitIfPanelExists(currentPanel);
                    return [4 /*yield*/, vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }));
}
exports.activate = activate;
function splitIfPanelExists(panel) {
    // split if there is more than one view column
    if (panel != vscode.ViewColumn.One) {
        vscode.commands.executeCommand('vscode.setEditorLayout', {
            groups: [
                {
                    orientation: 0,
                    groups: [{}, { orientation: 1, groups: [{}, {}], size: 0.5 }],
                    size: 0.5
                },
            ]
        });
    }
}
function getWebviewContent(graph) {
    return "<!DOCTYPE html>\n          <html lang=\"en\">\n          <head>\n              <meta charset=\"UTF-8\">\n              <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n              <title>L4 Graph</title>\n          </head>\n          <body>\n              <img src=\"" + graph + "\" width=\"500\" />\n          </body>\n          </html>";
}
