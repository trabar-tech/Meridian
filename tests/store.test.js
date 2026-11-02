import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { nextId } from '../src/store.js';

describe('nextId', () => {
  it('returns 1 for an empty list', () => {
    assert.strictEqual(nextId([]), 1);
  });

  it('returns max id + 1', () => {
    assert.strictEqual(nextId([{ id: 3 }, { id: 1 }, { id: 2 }]), 4);
  });
});

describe('note shape', () => {
  it('a note has the required fields', () => {
    const note = {
      id: 1,
      body: 'hello',
      tags: ['a', 'b'],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };
    assert.strictEqual(typeof note.id, 'number');
    assert.strictEqual(typeof note.body, 'string');
    assert.ok(Array.isArray(note.tags));
    assert.ok(note.createdAt);
    assert.ok(note.updatedAt);
  });
});
