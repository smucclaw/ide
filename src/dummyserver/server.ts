
import {
	createConnection,
	ProposedFeatures,
	InitializeParams,
	HoverParams,
	InitializeResult
} from 'vscode-languageserver/node';

const connection = createConnection(ProposedFeatures.all);

connection.onInitialize((params: InitializeParams) => {

	const result: InitializeResult = {
		capabilities: {
			hoverProvider: true
		}
	};

	return result;
});

connection.onHover((q: HoverParams) => {
	return {
		contents: JSON.stringify(q)
	};
});

// Listen on the connection
connection.listen();
