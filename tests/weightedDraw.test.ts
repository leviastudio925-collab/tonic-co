import { describe, expect, it } from 'vitest';
import { drawElement, withMinimumProbability } from '../src/draw/weightedDraw';
import type { ElementWeights } from '../src/assessment/types';

const weights: ElementWeights = { metal: 0.5, wood: 0.2, water: 0.15, fire: 0.1, earth: 0.05 };

describe('drawElement', () => {
  it('selects the first cumulative bucket at zero', () => {
    expect(drawElement(weights, () => 0)).toBe('metal');
  });

  it('selects the final bucket near one', () => {
    expect(drawElement(weights, () => 0.999999)).toBe('earth');
  });

  it('does not mutate input weights', () => {
    const copy = { ...weights };
    drawElement(weights, () => 0.2);
    expect(weights).toEqual(copy);
  });

  it('gives every element at least five percent probability', () => {
    const normalized = withMinimumProbability({ metal: 1, wood: 0, water: 0, fire: 0, earth: 0 });
    expect(Object.values(normalized).every((value) => value >= 0.05)).toBe(true);
    expect(Object.values(normalized).reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 10);
  });
});
