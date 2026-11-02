import { readNotes } from '../src/store.js';

/**
 * List all notes, optionally filtered by a tag.
 * Args: [], options: -t|--tag <tag>
 */
export async function listNotes(args) {
  const tagFilter = parseOption(args, '--tag', '-t');

  const notes = readNotes();
  const notesToShow = tagFilter
    ? notes.filter((n) => n.tags.includes(tagFilter))
    : notes;

  if (!notesToShow.length) {
    console.log(tagFilter
      ? `No notes found with tag "${tagFilter}".`
      : 'No notes yet. Add one with: meridian add "your note"');
    return;
  }

  const header = tagFilter ? `Notes tagged "${tagFilter}":` : 'Your notes:';
  console.log(header);
  console.log('─'.repeat(header.length));

  for (const note of notesToShow) {
    const tags = note.tags.length ? ` [${note.tags.join(', ')}]` : '';
    console.log(`#${note.id}${tags}  ${note.body}`);
  }
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
