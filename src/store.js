import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

function dataDir() {
  return process.env.MERIDIAN_DATA_DIR || join(homedir(), '.meridian');
}

function dataFile() {
  return join(dataDir(), 'notes.json');
}

export function ensureStore() {
  const dir = dataDir();
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const file = dataFile();
  if (!existsSync(file)) {
    writeFileSync(file, JSON.stringify([], null, 2), 'utf8');
  }
}

export function readNotes() {
  ensureStore();
  const raw = readFileSync(dataFile(), 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function writeNotes(notes) {
  ensureStore();
  writeFileSync(dataFile(), JSON.stringify(notes, null, 2), 'utf8');
}

export function nextId(notes) {
  if (!notes.length) return 1;
  return Math.max(...notes.map((n) => n.id)) + 1;
}

export { dataDir, dataFile };
