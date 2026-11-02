# Contributing to Meridian

Thanks for your interest in Meridian! Here's how to get started.

## Setup

1. Fork and clone the repository.
2. Install dependencies: `npm install`
3. Create a branch for your change: `git checkout -b feature/your-feature`

## Making changes

- Add new commands in `commands/` following the existing pattern:
  an `async (args) => void` function exported from its own file.
- Register the command in `src/index.js` (the `COMMANDS` map).
- Add tests in `tests/` and run `npm test`.

## Testing

```bash
npm test
```

## Submitting

Open a pull request against `main`. Describe what changed and why, and
include any relevant usage examples.

## Code style

- Use ES modules (`import`/`export`).
- Prefer the Node.js standard library over external dependencies.
- Keep functions small and focused.