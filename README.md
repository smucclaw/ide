# L4 Language Support for VS Code

Provides L4 support for VS Code.

## Preview

![First preview screenshot](./media/preview.png)

## Features

- Syntax highlighting (currently regex-based)
- Generate natural language output from L4 
- Generate graph from L4 (WIP)

## Installation & Prerequisites

- Follow installation instructions over at the [baby-l4](https://github.com/smucclaw/baby-l4) repository to install L4
- Clone this repository 
- Open this repository in VS Code, then press F5. This will compile and run the extension in a new Extension Development Host window.
- Open any `.bl4` file in the Extension Development Host window
- This codebase is evolving quickly and in tandem with the other repositories like baby-l4, so you need to be familiar with those tracks of development. The best way to come up to speed is an in-person tutorial with the IDE developers; anything else risks this documentation going out of date. When the codebase matures and stabilizes we will add more developer-facing documentation.

## Commands 
Accessed by opening the command palette (`Ctrl+Shift+P` on Linux/Windows and `Cmd+Shift+P` on Mac), and entering the command name:

- `Generate markdown` (natural language output)
- `Generate graph` (via dot file) (WIP)

## Release Notes

### 0.0.1

Basic syntax highlighting.

## Troubleshooting

Please open an issue if you encounter any problems while using the extension. 
