import type { Element } from './types';

export interface AssessmentQuestion {
  prompt: string;
  answers: { label: string; element: Element }[];
}

const labels = (...values: [string, string, string, string, string]): AssessmentQuestion['answers'] =>
  values.map((label, index) => ({ label, element: (['wood', 'fire', 'metal', 'water', 'earth'] as const)[index] }));

export const QUESTIONS: AssessmentQuestion[] = [
  { prompt: 'What do you most want to improve?', answers: labels('Direction & Growth', 'Drive', 'Order & Decision', 'Emotional Flow', 'Stability & Safety') },
  { prompt: 'Which state feels closest to you lately?', answers: labels('Stagnant', 'Restless', 'Disordered', 'Suppressed', 'Unbalanced') },
  { prompt: 'How do you usually respond to change?', answers: labels('Explore', 'Act Now', 'Analyze', 'Observe & Adapt', 'Prepare Carefully') },
  { prompt: 'What are you missing most right now?', answers: labels('Room to Grow', 'Courage & Passion', 'Boundaries & Rules', 'Rest & Feeling', 'A Stable Base') },
  { prompt: 'What do you hope to gain next?', answers: labels('New Opportunity', 'Breakthrough', 'A Clear Answer', 'Recovery & Connection', 'Lasting Stability') },
];
