export const ELEMENTS = ['metal', 'wood', 'water', 'fire', 'earth'] as const;
export type Element = (typeof ELEMENTS)[number];
export type ElementWeights = Record<Element, number>;

export interface AssessmentAnswers {
  birthDate: string;
  stateAnswers: Element[];
  preference: Element;
}

