import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Point the store at a temp directory BEFORE importing anything that reads it.
// Static imports are hoisted, so we use dynamic imports after setting the env.
const tmpDir = mkdtempSync(join(tmpdir(), 'meridian-test-'));
process.env.MERIDIAN_DATA_DIR = tmpDir;

let store, addCmd, editCmd, listCmd, readCmd, removeCmd, searchCmd;

describe('commands', async () => {
  beforeEach(async () => {
    process.env.MERIDIAN_DATA_DIR = tmpDir;
    store = await import('../src/store.js');
    addCmd = await import('../commands/add.js');
    editCmd = await import('../commands/edit.js');
    listCmd = await import('../commands/list.js');
    readCmd = await import('../commands/read.js');
    removeCmd = await import('../commands/remove.js');
    searchCmd = await import('../commands/search.js');

    await store.writeNotes([]);
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
    delete process.env.MERIDIAN_DATA_DIR;
  });

  let logs = [];
  const origLog = console.log;
  function captureLogs(fn) {
    logs = [];
    console.log = (...args) => logs.push(args.join(' '));
    try {
      return fn();
    } finally {
      console.log = origLog;
    }
  }

  describe('add', () => {
    it('adds a note with no tags', async () => {
      await captureLogs(() => addCmd.addNote(['Buy groceries']));
      const notes = store.readNotes();
      assert.strictEqual(notes.length, 1);
      assert.strictEqual(notes[0].body, 'Buy groceries');
      assert.deepStrictEqual(notes[0].tags, []);
      assert.strictEqual(logs[0], 'Added note #1');
    });

    it('adds a note with tags', async () => {
      await captureLogs(() => addCmd.addNote(['Buy groceries', '-t', 'shopping,home']));
      const notes = store.readNotes();
      assert.strictEqual(notes.length, 1);
      assert.deepStrictEqual(notes[0].tags, ['shopping', 'home']);
      assert.ok(logs[0].includes('tags: shopping, home'));
    });

    it('throws when no body is given', async () => {
      let threw = false;
      try {
        await captureLogs(() => addCmd.addNote([]));
      } catch (err) {
        threw = true;
        assert.ok(err.message.includes('Please provide a note'));
      }
      assert.ok(threw, 'expected add to throw with no body');
    });
  });

  describe('list', () => {
    it('lists all notes', async () => {
      await store.writeNotes([{ id: 1, body: 'First', tags: ['a'], createdAt: 'x', updatedAt: 'x' }]);
      await captureLogs(() => listCmd.listNotes([]));
      assert.ok(logs.some((l) => l.includes('#1') && l.includes('First')));
    });

    it('reports empty when no notes', async () => {
      await captureLogs(() => listCmd.listNotes([]));
      assert.ok(logs.some((l) => l.includes('No notes yet')));
    });

    it('filters by tag', async () => {
      await store.writeNotes([
        { id: 1, body: 'Work task', tags: ['work'], createdAt: 'x', updatedAt: 'x' },
        { id: 2, body: 'Home task', tags: ['home'], createdAt: 'x', updatedAt: 'x' },
      ]);
      await captureLogs(() => listCmd.listNotes(['-t', 'work']));
      const output = logs.join('\n');
      assert.ok(output.includes('Work task'));
      assert.ok(!output.includes('Home task'));
    });
  });

  describe('read', () => {
    it('reads a note by id', async () => {
      await store.writeNotes([{ id: 1, body: 'Hello', tags: ['t'], createdAt: 'x', updatedAt: 'y' }]);
      await captureLogs(() => readCmd.readNote(['1']));
      const output = logs.join('\n');
      assert.ok(output.includes('Note #1'));
      assert.ok(output.includes('Hello'));
      assert.ok(output.includes('Tags: t'));
    });

    it('throws for a missing id', async () => {
      let threw = false;
      try {
        await captureLogs(() => readCmd.readNote(['999']));
      } catch (err) {
        threw = true;
        assert.ok(err.message.includes('No note found with id #999'));
      }
      assert.ok(threw);
    });
  });

  describe('edit', () => {
    it('updates a note body', async () => {
      await store.writeNotes([{ id: 1, body: 'Old', tags: [], createdAt: 'x', updatedAt: 'x' }]);
      await captureLogs(() => editCmd.editNote(['1', 'New body']));
      const notes = store.readNotes();
      assert.strictEqual(notes[0].body, 'New body');
      assert.notStrictEqual(notes[0].updatedAt, 'x');
      assert.ok(logs[0].includes('Updated note #1'));
    });

    it('updates a note tags only', async () => {
      await store.writeNotes([{ id: 1, body: 'Keep body', tags: ['old'], createdAt: 'x', updatedAt: 'x' }]);
      await captureLogs(() => editCmd.editNote(['1', '-t', 'new,tag']));
      const notes = store.readNotes();
      assert.strictEqual(notes[0].body, 'Keep body');
      assert.deepStrictEqual(notes[0].tags, ['new', 'tag']);
    });

    it('throws when nothing to update', async () => {
      let threw = false;
      try {
        await captureLogs(() => editCmd.editNote(['1']));
      } catch (err) {
        threw = true;
        assert.ok(err.message.includes('Please provide new text and/or tags'));
      }
      assert.ok(threw);
    });
  });

  describe('remove', () => {
    it('removes a note by id', async () => {
      await store.writeNotes([
        { id: 1, body: 'A', tags: [], createdAt: 'x', updatedAt: 'x' },
        { id: 2, body: 'B', tags: [], createdAt: 'x', updatedAt: 'x' },
      ]);
      await captureLogs(() => removeCmd.removeNote(['1']));
      const notes = store.readNotes();
      assert.strictEqual(notes.length, 1);
      assert.strictEqual(notes[0].id, 2);
    });

    it('throws for a missing id', async () => {
      let threw = false;
      try {
        await captureLogs(() => removeCmd.removeNote(['999']));
      } catch (err) {
        threw = true;
        assert.ok(err.message.includes('No note found with id #999'));
      }
      assert.ok(threw);
    });
  });

  describe('search', () => {
    it('matches body text', async () => {
      await store.writeNotes([{ id: 1, body: 'Buy groceries', tags: [], createdAt: 'x', updatedAt: 'x' }]);
      await captureLogs(() => searchCmd.searchNotes(['groceries']));
      assert.ok(logs.some((l) => l.includes('Buy groceries')));
    });

    it('matches tags', async () => {
      await store.writeNotes([{ id: 1, body: 'Something', tags: ['work'], createdAt: 'x', updatedAt: 'x' }]);
      await captureLogs(() => searchCmd.searchNotes(['work']));
      assert.ok(logs.some((l) => l.includes('Something')));
    });

    it('reports no matches', async () => {
      await store.writeNotes([{ id: 1, body: 'Apple', tags: [], createdAt: 'x', updatedAt: 'x' }]);
      await captureLogs(() => searchCmd.searchNotes(['banana']));
      assert.ok(logs.some((l) => l.includes('No notes matched')));
    });
  });
});
