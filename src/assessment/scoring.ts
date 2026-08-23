import { ELEMENTS, type AssessmentAnswers, type Element, type ElementWeights } from './types';

export class AssessmentValidationError extends Error {}

const emptyWeights = (): ElementWeights => ({ metal: 0, wood: 0, water: 0, fire: 0, earth: 0 });

function seasonalElement(month: number): Element {
  if (month >= 3 && month <= 5) return 'wood';
  if (month >= 6 && month <= 8) return 'fire';
  if (month >= 9 && month <= 11) return 'metal';
  return 'water';
}

export function calculateWeights(answers: AssessmentAnswers): ElementWeights {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(answers.birthDate) || answers.stateAnswers.length !== 5) {
    throw new AssessmentValidationError('Complete your birth date and all five state questions.');
  }
  const [year, month, day] = answers.birthDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new AssessmentValidationError('Enter a valid birth date.');
  }
  if (!ELEMENTS.includes(answers.preference) || answers.stateAnswers.some((value) => !ELEMENTS.includes(value))) {
    throw new AssessmentValidationError('The assessment contains an invalid answer.');
  }

  const scores = emptyWeights();
  const season = seasonalElement(month);
  if (day >= 24) {
    scores[season] += 0.28;
    scores.earth += 0.07;
  } else {
    scores[season] += 0.35;
  }
  for (const element of answers.stateAnswers) scores[element] += 0.1;
  scores[answers.preference] += 0.15;

  const total = Object.values(scores).reduce((sum, value) => sum + value, 0);
  for (const element of ELEMENTS) scores[element] /= total;
  return scores;
}
