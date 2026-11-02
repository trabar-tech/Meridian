# Meridian

A personal CLI knowledge & note manager. Capture, organize, and retrieve your notes straight from the terminal.

![Node CI](https://github.com/trabar-tech/Meridian/actions/workflows/ci.yml/badge.svg)

## Features

- **Add** notes with optional comma-separated tags
- **Edit** a note's body and/or tags by id
- **List** all notes, or filter by tag
- **Read** a single note by id (with creation/update timestamps)
- **Remove** notes by id
- **Search** notes by keyword (matches body and tags)
- Zero runtime dependencies — pure Node.js standard library
- Local JSON storage (`~/.meridian/notes.json`)

## Install

```bash
# Clone the repo
git clone https://github.com/trabar-tech/Meridian.git
cd Meridian

# Install dev dependencies (only needed to run tests)
npm install

# Run Meridian directly
node src/index.js add "Buy groceries" -t "shopping,home"
```

Or make it globally available on your PATH:

```bash
chmod +x src/index.js
npm link
# Now you can run: meridian add "Buy groceries"
```

## Usage

```
meridian add <note>        [-t,--tags <tags>]   Add a new note
meridian edit <id>         [<note>] [-t,--tags <tags>]  Edit a note's body and/or tags
meridian list              [-t,--tag <tag>]      List all notes
meridian read <id>                                   Read a note by its id
meridian remove <id>                                 Remove a note by its id
meridian search <query>                              Search notes by keyword
meridian --version, -v                                 Show version
meridian --help                                        Show help
```

### Examples

```bash
meridian add "Buy groceries" -t "shopping,home"
meridian add "Draft the project proposal" -t "work,writing"
meridian edit 1 "Buy groceries and milk"
meridian edit 1 -t "shopping,home,urgent"
meridian list
meridian list -t work
meridian read 1
meridian search groceries
meridian remove 1
```

## Data

Notes are stored locally as JSON in:

```
~/.meridian/notes.json
```

Each note has an `id`, `body`, `tags`, `createdAt`, and `updatedAt`.

## Project Structure

```
Meridian/
├── README.md
├── package.json
├── src/
│   ├── index.js       # CLI entry point
│   └── store.js       # JSON persistence layer
├── commands/
│   ├── add.js
│   ├── edit.js
│   ├── list.js
│   ├── read.js
│   ├── remove.js
│   └── search.js
├── tests/
│   ├── commands.test.js
│   └── store.test.js
├── docs/
│   ├── contributing.md
│   └── architecture.md
├── tools/
│   └── game-dev/
│       ├── level-companion/
│       │   ├── index.html   # room graph + item heatmaps + JSON export
│       │   └── README.md
│       ├── map-layer-simulator/
│       │   ├── index.html   # draw map layers, simulate [LOCATION] testimony from coordinates
│       │   └── README.md
│       ├── context-validator/
│       │   └── index.html   # validates map/NPC JSON for dangling context refs
│       ├── dialogue-builder/
│       │   └── index.html   # NPC quick-chat lines with [VARIABLE] injection
│       └── contract-tool/
│           └── index.html   # mission contracts validated against map locations
└── .gitignore
```

## Development

```bash
# Install dependencies
npm install

# Run the test suite
npm test

# Lint
npm run lint
```

## Contributing

See [docs/contributing.md](./docs/contributing.md) for how to contribute.

## Related: Game Dev Tools

Under `tools/game-dev/` you'll find a set of single-file, browser-based tools for solo game development. All run offline with zero build step — just open `index.html` in a browser:

- **Level Design Companion** (`level-companion/`) — room graph with tags, item heatmaps, JSON export. Build context-aware layouts instead of hard-coding every wall.
- **Map Layer & Testimony Simulator** (`map-layer-simulator/`) — draw map layers (medbay, security, ...) and simulate `[LOCATION]` testimony from coordinates: "I saw PURPLE at MEDBAY." Tool for you to design and test the coordinate→layer lookup before writing game code.
- **Context Validator** (`context-validator/`) — paste your map/NPC/item JSON; checks that every `[LOCATION]` bracket matches a real room tag, every NPC references an existing room, and factions/beings/agendas come from allowed lists.
- **Dialogue Builder** (`dialogue-builder/`) — build NPC quick-chat lines with injected variables (`[LOCATION]`, `[FACTION]`, `[ITEM]`, etc.) and validate that every bracket has a data source before it breaks in-game.
- **Contract Tool** (`contract-tool/`) — design missions/contracts and validate that every contract targets a real location with sane parameters.

See each tool's folder for details, or open `level-companion/README.md` for the fullest write-up.

## License

MIT