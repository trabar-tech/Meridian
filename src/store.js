import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const DATA_DIR = join(homedir(), '.meridian');
const DATA_FILE = join(DATA_DIR, 'notes.json');

export function ensureStore() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

export function readNotes() {
  ensureStore();
  const raw = readFileSync(DATA_FILE, 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function writeNotes(notes) {
  ensureStore();
  writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2), 'utf8');
}

export function nextId(notes) {
  if (!notes.length) return 1;
  return Math.max(...notes.map((n) => n.id)) + 1;
}

export { DATA_FILE };
