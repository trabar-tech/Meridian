import { readNotes } from '../src/store.js';

/**
 * Read a single note by id.
 * Args: [<id>]
 */
export async function readNote(args) {
  const id = Number(args[0]);
  if (!id) {
    throw new Error('Please provide a note id: meridian read 1');
  }

  const notes = readNotes();
  const note = notes.find((n) => n.id === id);
  if (!note) {
    throw new Error(`No note found with id #${id}.`);
  }

  const tags = note.tags.length ? `Tags: ${note.tags.join(', ')}\n` : '';
  console.log(`Note #${note.id}`);
  console.log('─'.repeat(`Note #${note.id}`.length));
  console.log(tags);
  console.log(note.body);
  console.log('');
  console.log(`Created: ${formatDate(note.createdAt)}`);
  console.log(`Updated: ${formatDate(note.updatedAt)}`);
}

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
