import { Position, Range } from 'vscode-languageserver-textdocument';
import {
  createConnection,
  ProposedFeatures,
  InitializeParams,
  HoverParams,
  InitializeResult,
  integer,
} from 'vscode-languageserver/node';

const connection = createConnection(ProposedFeatures.all);

class TextBlock implements Range {
  start: Position;
  end: Position;
  constructor(startLine: integer, startChar: integer, endLine: integer, endChar: integer) {
    this.start = { character: startChar, line: startLine };
    this.end = { character: endChar, line: endLine };
  }
}

class LangToken extends TextBlock {
  text: string;
  helpContext: TextBlock;
  constructor(
    text: string,
    startLine: integer,
    startChar: integer,
    endLine: integer,
    endChar: integer,
    helpContext: TextBlock,
  ) {
    super(startLine, startChar, endLine, endChar);
    this.text = text;
    this.helpContext = helpContext;
  }
}

connection.onInitialize((params: InitializeParams) => {
  const result: InitializeResult = {
    capabilities: {
      hoverProvider: true,
    },
  };

  return result;
});

const ruleHelpContext = new TextBlock(0, 0, 2, 46);
const partyHelpContext = new TextBlock(3, 2, 3, 24);

const ruleToken = new LangToken('RULE', 0, 0, 0, 3, ruleHelpContext);
const nobodyToken = new LangToken('NOBODY', 3, 8, 3, 13, partyHelpContext);

const line0Map = new Map<integer, LangToken>();
line0Map.set(0, ruleToken);
line0Map.set(1, ruleToken);
line0Map.set(2, ruleToken);
line0Map.set(3, ruleToken);

const line3Map = new Map<integer, LangToken>();
line3Map.set(8, nobodyToken);
line3Map.set(9, nobodyToken);
line3Map.set(10, nobodyToken);
line3Map.set(11, nobodyToken);
line3Map.set(12, nobodyToken);
line3Map.set(13, nobodyToken);

const tokenMap = new Map<integer, Map<integer, LangToken>>();
tokenMap.set(0, line0Map);
tokenMap.set(3, line3Map);

connection.onHover((hoverRequest: HoverParams) => {
  const token = getTokenForPosition(hoverRequest.position);
  return {
    contents: {
      kind: 'markdown',
      value: `Can't help with **${token?.text}** at postion [${hoverRequest.position.line},${hoverRequest.position.character}]`,
    },
    range: token?.helpContext,
  };
});

// Listen on the connection
connection.listen();

function getTokenForPosition(position: { line: integer; character: integer }) {
  return tokenMap.get(position.line)?.get(position.character);
}
