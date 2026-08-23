import type { AssessmentAnswers, Element, ElementWeights } from '../assessment/types';

export type FlowStep = 'hero' | 'assessment' | 'ready' | 'drawing' | 'result';
export interface AppSnapshot {
  step: FlowStep;
  answers?: AssessmentAnswers;
  weights?: ElementWeights;
  result?: Element;
}

const KEY = 'tonic-five-elements:v1';

export class SessionState {
  private memory: AppSnapshot | null = null;
  constructor(private readonly storage: Storage = sessionStorage) {}

  save(snapshot: AppSnapshot) {
    this.memory = structuredClone(snapshot);
    try { this.storage.setItem(KEY, JSON.stringify({ version: 1, snapshot })); } catch { /* memory fallback */ }
  }

  load(): AppSnapshot | null {
    try {
      const raw = this.storage.getItem(KEY);
      if (raw) {
        const payload = JSON.parse(raw) as { version?: number; snapshot?: AppSnapshot };
        if (payload.version === 1 && payload.snapshot) return payload.snapshot;
        return null;
      }
    } catch { /* memory fallback */ }
    return this.memory ? structuredClone(this.memory) : null;
  }

  clear() {
    this.memory = null;
    try { this.storage.removeItem(KEY); } catch { /* memory fallback */ }
  }
}

