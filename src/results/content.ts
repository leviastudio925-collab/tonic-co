import type { Element } from '../assessment/types';

export interface ResultContent {
  label: string;
  english: string;
  keywords: [string, string, string];
  explanation: string;
  suggestions: [string, string, string];
  accent: string;
  card: string;
}

export const RESULT_CONTENT: Record<Element, ResultContent> = {
  metal: { label: 'M', english: 'METAL', keywords: ['CLARITY', 'BOUNDARIES', 'DECISION'], explanation: 'You are looking for a clearer order. Metal asks you to remove noise and turn judgment into boundaries you can act on.', suggestions: ['Keep only three priorities for this week', 'Complete one decision you have delayed', 'Set clear hours for work and rest'], accent: '#e8edf2', card: '/images/cards/metal.jpg' },
  wood: { label: 'W', english: 'WOOD', keywords: ['GROWTH', 'KINDNESS', 'DIRECTION'], explanation: 'You do not need more speed. You need a direction that can keep growing. Wood invites you to begin with one small, steady action.', suggestions: ['Choose one thing to cultivate for three months', 'Give it twenty focused minutes every day', 'Connect with someone who offers a new perspective'], accent: '#4da86b', card: '/images/cards/wood.jpg' },
  water: { label: 'W', english: 'WATER', keywords: ['FLOW', 'FEELING', 'RECOVERY'], explanation: 'Water asks you to recover your sensitivity before choosing a direction. Letting emotion move may reveal more than forcing progress.', suggestions: ['Protect a period of uninterrupted solitude', 'Notice recurring emotions and physical signals', 'Pause one decision that is not truly urgent'], accent: '#315d9d', card: '/images/cards/water.svg' },
  fire: { label: 'F', english: 'FIRE', keywords: ['PASSION', 'EXPRESSION', 'BREAKTHROUGH'], explanation: 'Fire brings action and visibility. You have gathered enough energy; one clear expression can now ignite change.', suggestions: ['Take the first action within forty-eight hours', 'Express one honest idea in public', 'Reserve your highest-energy hours for the main goal'], accent: '#ff3828', card: '/images/cards/fire.svg' },
  earth: { label: 'E', english: 'EARTH', keywords: ['STABILITY', 'SUPPORT', 'BALANCE'], explanation: 'Earth brings you back to the foundation. Strengthening what supports daily life will keep the next change from throwing you off balance.', suggestions: ['Organize one space you use every day', 'Review weak points in sleep, food, and finances', 'Reduce a long-term goal to its next possible step'], accent: '#c78b43', card: '/images/cards/earth.svg' },
};
