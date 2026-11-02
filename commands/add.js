import { readNotes, writeNotes, nextId } from '../src/store.js';

/**
 * Add a new note.
 * Args: [<note text...], options: -t|--tags <comma-separated tags>
 */
export async function addNote(args) {
  const tagsFlag = parseOption(args, '--tags', '-t');

  // Everything remaining after option parsing is the note body.
  const body = args.join(' ').trim();
  if (!body) {
    throw new Error('Please provide a note: meridian add "Buy groceries"');
  }

  const tags = tagsFlag
    ? tagsFlag.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const notes = readNotes();
  const note = {
    id: nextId(notes),
    body,
    tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  notes.push(note);
  writeNotes(notes);

  console.log(`Added note #${note.id}${tags.length ? ` (tags: ${tags.join(', ')})` : ''}`);
}

function parseOption(args, flag, short) {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === flag || args[i] === short) {
      const value = args[i + 1];
      if (value !== undefined && !value.startsWith('-')) {
        args.splice(i, 2);
        return value;
      }
      args.splice(i, 1);
      return true;
    }
  }
  return undefined;
}
