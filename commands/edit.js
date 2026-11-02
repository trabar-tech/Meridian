import { readNotes, writeNotes } from '../src/store.js';

/**
 * Edit an existing note by id.
 * Args: [<id>] [<note text...], options: -t|--tags <comma-separated tags>
 *
 * At least one of the note body or --tags must be provided.
 */
export async function editNote(args) {
  const tagsFlag = parseOption(args, '--tags', '-t');

  const id = Number(args.shift());
  if (!id) {
    throw new Error('Please provide a note id: meridian edit 1 "new text"');
  }

  const body = args.join(' ').trim() || undefined;

  if (body === undefined && tagsFlag === undefined) {
    throw new Error(
      'Please provide new text and/or tags: meridian edit 1 "new text" [-t "tag1,tag2"]'
    );
  }

  const notes = readNotes();
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) {
    throw new Error(`No note found with id #${id}.`);
  }

  const note = notes[index];
  if (body !== undefined) note.body = body;
  if (tagsFlag !== undefined) {
    note.tags = tagsFlag.split(',').map((t) => t.trim()).filter(Boolean);
  }
  note.updatedAt = new Date().toISOString();

  notes[index] = note;
  writeNotes(notes);

  const changed = [];
  if (body !== undefined) changed.push('body');
  if (tagsFlag !== undefined) changed.push(`tags: ${note.tags.join(', ') || '(none)'}`);
  console.log(`Updated note #${id}${changed.length ? ` (${changed.join(', ')})` : ''}`);
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
