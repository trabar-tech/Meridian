import { readNotes, writeNotes } from '../src/store.js';

/**
 * Remove a note by id.
 * Args: [<id>]
 */
export async function removeNote(args) {
  const id = Number(args[0]);
  if (!id) {
    throw new Error('Please provide a note id: meridian remove 1');
  }

  const notes = readNotes();
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) {
    throw new Error(`No note found with id #${id}.`);
  }

  const [removed] = notes.splice(index, 1);
  writeNotes(notes);

  console.log(`Removed note #${id}: "${removed.body}"`);
}
