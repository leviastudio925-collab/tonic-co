import { QUESTIONS } from '../assessment/questions';
import { ELEMENTS, type AssessmentAnswers, type Element } from '../assessment/types';

const LABELS: Record<Element, string> = { metal: 'METAL', wood: 'WOOD', water: 'WATER', fire: 'FIRE', earth: 'EARTH' };

export class AssessmentView {
  readonly element = document.createElement('section');
  private form!: HTMLFormElement;

  constructor() {
    this.element.id = 'assessment';
    this.element.className = 'content-section assessment-section';
    this.element.innerHTML = `<div class="section-copy"><p class="section-index">01 / ASSESSMENT</p><h2>WHICH FORCE<br>ARE YOU MISSING<br>RIGHT NOW?</h2><p>Your birth date is used only as a seasonal tendency. This is an interactive artwork, not professional or metaphysical advice.</p></div><form class="assessment-form" novalidate><label class="date-field">01 / DATE OF BIRTH<input name="birthDate" type="date" required></label>${QUESTIONS.map((q, i) => `<fieldset><legend>${String(i + 2).padStart(2, '0')} / ${q.prompt}</legend><div class="choice-grid">${q.answers.map((a) => `<label><input type="radio" name="state-${i}" value="${a.element}" required><span>${a.label}</span></label>`).join('')}</div></fieldset>`).join('')}<fieldset><legend>07 / WHICH ELEMENT DRAWS YOU FIRST?</legend><div class="element-grid">${ELEMENTS.map((e) => `<label><input type="radio" name="preference" value="${e}" required><span>${LABELS[e]}<small>${e.toUpperCase()}</small></span></label>`).join('')}</div></fieldset><p class="form-error" role="alert"></p><button class="primary-button" type="submit">COMPLETE ASSESSMENT <span>→</span></button></form>`;
    this.form = this.element.querySelector('form')!;
    this.form.addEventListener('submit', (event) => this.submit(event));
  }

  private submit(event: SubmitEvent) {
    event.preventDefault();
    const error = this.element.querySelector<HTMLElement>('.form-error')!;
    if (!this.form.checkValidity()) {
      error.textContent = 'Complete your birth date, all five state questions, and your instinctive element choice.';
      this.form.querySelector<HTMLElement>(':invalid')?.focus();
      return;
    }
    const data = new FormData(this.form);
    const answers: AssessmentAnswers = {
      birthDate: String(data.get('birthDate')),
      stateAnswers: QUESTIONS.map((_, i) => String(data.get(`state-${i}`)) as Element),
      preference: String(data.get('preference')) as Element,
    };
    error.textContent = '';
    this.element.dispatchEvent(new CustomEvent('assessment:submit', { bubbles: true, detail: answers }));
  }

  restore(answers: AssessmentAnswers) {
    (this.form.elements.namedItem('birthDate') as HTMLInputElement).value = answers.birthDate;
    answers.stateAnswers.forEach((value, i) => ((this.form.querySelector(`[name="state-${i}"][value="${value}"]`) as HTMLInputElement | null)?.click()));
    (this.form.querySelector(`[name="preference"][value="${answers.preference}"]`) as HTMLInputElement | null)?.click();
  }

  focus() { (this.form.elements.namedItem('birthDate') as HTMLInputElement).focus(); }
}
