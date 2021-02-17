import {
  createConnection,
  ProposedFeatures,
  InitializeParams,
  HoverParams,
  InitializeResult,
} from 'vscode-languageserver/node';

const connection = createConnection(ProposedFeatures.all);

connection.onInitialize((params: InitializeParams) => {
  const result: InitializeResult = {
    capabilities: {
      hoverProvider: true,
    },
  };
  console.log('Starting server');

  return result;
});

// function throwErr(): never {
//   throw new Error('Undefind');
// }

connection.onHover((q: HoverParams) => {
  connection.sendDiagnostics({
    uri: q.textDocument.uri,
    diagnostics: [{ range: { start: q.position, end: q.position }, message: 'Hello world' }],
  });
  return {
    contents: JSON.stringify(q),
  };
});

// Listen on the connection
connection.listen();
