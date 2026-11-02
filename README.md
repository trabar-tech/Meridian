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
│   ├── list.js
│   ├── read.js
│   ├── remove.js
│   └── search.js
├── tests/
│   └── store.test.js
├── docs/
│   ├── contributing.md
│   └── architecture.md
├── .github/workflows/ci.yml
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

## License

MIT