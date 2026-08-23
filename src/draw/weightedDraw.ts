import { ELEMENTS, type Element, type ElementWeights } from '../assessment/types';

export function withMinimumProbability(weights: ElementWeights): ElementWeights {
  const positive = Object.fromEntries(ELEMENTS.map((element) => [element, Math.max(0, weights[element])])) as ElementWeights;
  const total = Object.values(positive).reduce((sum, value) => sum + value, 0);
  const minimum = 0.05;
  const distributable = 1 - minimum * ELEMENTS.length;
  const normalized = {} as ElementWeights;
  for (const element of ELEMENTS) {
    normalized[element] = minimum + distributable * (total > 0 ? positive[element] / total : 1 / ELEMENTS.length);
  }
  return normalized;
}

export function drawElement(weights: ElementWeights, random: () => number = Math.random): Element {
  const normalized = withMinimumProbability({ ...weights });
  const value = Math.min(Math.max(random(), 0), 1 - Number.EPSILON);
  let cumulative = 0;
  for (const element of ELEMENTS) {
    cumulative += normalized[element];
    if (value < cumulative) return element;
  }
  return 'earth';
}
