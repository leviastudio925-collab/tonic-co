import { describe, expect, it } from 'vitest';
import { calculateWeights, AssessmentValidationError } from '../src/assessment/scoring';
import type { AssessmentAnswers, Element } from '../src/assessment/types';

function answers(birthDate: string, state: Element = 'earth', preference: Element = 'earth'): AssessmentAnswers {
  return { birthDate, stateAnswers: Array<Element>(5).fill(state), preference };
}

describe('calculateWeights', () => {
  it.each([
    ['2000-03-12', 'wood'], ['2000-07-12', 'fire'], ['2000-10-12', 'metal'], ['2000-01-12', 'water'],
  ] as const)('maps %s to a %s seasonal contribution', (date, element) => {
    const weights = calculateWeights(answers(date));
    expect(weights[element]).toBeGreaterThan(0);
  });

  it('adds an earth transition contribution after day 23', () => {
    const early = calculateWeights(answers('2000-04-10', 'water', 'water'));
    const late = calculateWeights(answers('2000-04-26', 'water', 'water'));
    expect(late.earth).toBeGreaterThan(early.earth);
  });

  it('uses 50 percent state and 15 percent preference contributions', () => {
    const weights = calculateWeights({
      birthDate: '2000-03-10',
      stateAnswers: Array<Element>(5).fill('metal'),
      preference: 'water',
    });
    expect(weights.metal).toBeCloseTo(0.5, 8);
    expect(weights.water).toBeCloseTo(0.15, 8);
    expect(weights.wood).toBeCloseTo(0.35, 8);
  });

  it('returns normalized weights', () => {
    const weights = calculateWeights(answers('2000-08-28', 'fire', 'metal'));
    expect(Object.values(weights).reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 10);
  });

  it('rejects malformed dates and incomplete state answers', () => {
    expect(() => calculateWeights({ birthDate: 'bad', stateAnswers: ['wood'], preference: 'metal' }))
      .toThrow(AssessmentValidationError);
  });
});

