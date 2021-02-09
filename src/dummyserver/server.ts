
import {
	createConnection,
	ProposedFeatures,
	InitializeParams,
	HoverParams,
	InitializeResult
} from 'vscode-languageserver/node';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const connection = createConnection(ProposedFeatures.all);

connection.onInitialize((params: InitializeParams) => {

	const result: InitializeResult = {
		capabilities: {
			hoverProvider: true
		}
	};

	return result;
});

connection.onHover((hoverRequest: HoverParams) => {
	const fileContent = readFileSync(fileURLToPath(hoverRequest.textDocument.uri));
	const fileAsString = fileContent.toString('utf8');
	const fileLines = fileAsString.split('\n');
	const selectedLine = fileLines[hoverRequest.position.line];
	const tokens = selectedLine.split(/\s+/);
	return {
		contents: {
			kind: 'markdown',
			value: `Can't help with **${tokens[3]}**`,
		},
	};
});

// Listen on the connection
connection.listen();
