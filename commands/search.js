import { readNotes } from '../src/store.js';

/**
 * Search notes by keyword (matches body or tags).
 * Args: [<query...>]
 */
export async function searchNotes(args) {
  const query = args.join(' ').trim().toLowerCase();
  if (!query) {
    throw new Error('Please provide a search query: meridian search groceries');
  }

  const notes = readNotes();
  const results = notes.filter((n) =>
    n.body.toLowerCase().includes(query) ||
    n.tags.some((t) => t.toLowerCase().includes(query))
  );

  if (!results.length) {
    console.log(`No notes matched "${query}".`);
    return;
  }

  console.log(`Notes matching "${query}":`);
  console.log('─'.repeat(`Notes matching "${query}":`.length));

  for (const note of results) {
    const tags = note.tags.length ? ` [${note.tags.join(', ')}]` : '';
    console.log(`#${note.id}${tags}  ${note.body}`);
  }
}
