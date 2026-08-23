import { describe, expect, it } from 'vitest';
import { advanceLeaf, createLeafStates, getLeafCount } from '../src/scene/FallingLeaves';

describe('falling leaves', () => {
  it('uses a restrained standard count and a smaller reduced-motion count', () => {
    expect(getLeafCount(false)).toBe(16);
    expect(getLeafCount(true)).toBe(6);
  });

  it('generates deterministic states biased toward the outer thirds', () => {
    const first = createLeafStates(16, false, 2026);
    const second = createLeafStates(16, false, 2026);
    expect(first).toEqual(second);
    expect(first.filter((leaf) => Math.abs(leaf.x) >= 2.4).length).toBeGreaterThanOrEqual(12);
  });

  it('falls more slowly in reduced-motion mode', () => {
    const leaf = createLeafStates(1, false, 7)[0];
    const normal = advanceLeaf(leaf, 1, false);
    const reduced = advanceLeaf(leaf, 1, true);
    expect(normal.y).toBeLessThan(reduced.y);
  });

  it('wraps a leaf above the scene after it falls below view', () => {
    const leaf = { ...createLeafStates(1, false, 9)[0], y: -6.2 };
    expect(advanceLeaf(leaf, 0.1, false).y).toBeGreaterThan(5.5);
  });
});
