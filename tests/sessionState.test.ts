import { describe, expect, it } from 'vitest';
import { SessionState, type AppSnapshot } from '../src/state/SessionState';

class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length() { return this.data.size; }
  clear() { this.data.clear(); }
  getItem(key: string) { return this.data.get(key) ?? null; }
  key(index: number) { return [...this.data.keys()][index] ?? null; }
  removeItem(key: string) { this.data.delete(key); }
  setItem(key: string, value: string) { this.data.set(key, value); }
}

const snapshot: AppSnapshot = {
  step: 'result',
  answers: { birthDate: '2000-03-10', stateAnswers: ['wood', 'fire', 'metal', 'water', 'earth'], preference: 'wood' },
  weights: { metal: 0.2, wood: 0.3, water: 0.15, fire: 0.2, earth: 0.15 },
  result: 'wood',
};

describe('SessionState', () => {
  it('round trips a versioned snapshot', () => {
    const state = new SessionState(new MemoryStorage());
    state.save(snapshot);
    expect(state.load()).toEqual(snapshot);
  });

  it('returns null for malformed JSON and schema mismatches', () => {
    const storage = new MemoryStorage();
    storage.setItem('tonic-five-elements:v1', '{bad');
    expect(new SessionState(storage).load()).toBeNull();
    storage.setItem('tonic-five-elements:v1', JSON.stringify({ version: 2, snapshot }));
    expect(new SessionState(storage).load()).toBeNull();
  });

  it('falls back to memory when storage throws', () => {
    const broken = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); }, removeItem: () => { throw new Error('blocked'); } } as unknown as Storage;
    const state = new SessionState(broken);
    state.save(snapshot);
    expect(state.load()).toEqual(snapshot);
    state.clear();
    expect(state.load()).toBeNull();
  });
});
