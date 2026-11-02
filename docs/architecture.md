# Architecture

Meridian is intentionally small and dependency-free.

## Layers

1. **CLI entry (`src/index.js`)** — parses `process.argv`, dispatches to the
   matching command handler, and prints help/version.
2. **Commands (`commands/`)** — one file per verb (`add`, `list`, `read`,
   `remove`, `search`). Each exports an `async (args) => void` function that
   performs its action and prints to stdout/stderr.
3. **Store (`src/store.js`)** — a tiny JSON persistence layer that reads and
   writes `~/.meridian/notes.json`, assigns monotonic ids, and ensures the data
   directory exists.

## Data format

`~/.meridian/notes.json` contains an array of note objects:

```json
[
  {
    "id": 1,
    "body": "Buy groceries",
    "tags": ["shopping", "home"],
    "createdAt": "2026-11-02T02:00:00.000Z",
    "updatedAt": "2026-11-02T02:00:00.000Z"
  }
]
```

## Design principles

- **Zero runtime dependencies** — runs on plain Node.js.
- **Local-first** — all data lives on the user's machine.
- **Obvious CLI** — verbs and flags follow common Unix conventions.