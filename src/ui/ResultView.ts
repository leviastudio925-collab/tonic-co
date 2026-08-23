import type { Element } from '../assessment/types';
import { RESULT_CONTENT } from '../results/content';

export class ResultView {
  readonly element = document.createElement('section');
  constructor() {
    this.element.id = 'result';
    this.element.className = 'content-section result-section';
  }
  render(element: Element) {
    const content = RESULT_CONTENT[element];
    this.element.style.setProperty('--result-accent', content.accent);
    this.element.innerHTML = `<div class="result-card"><p class="section-index">03 / YOUR ELEMENT</p><div class="result-title"><span>${content.label}</span><div><h2>${content.english}</h2><p>${content.keywords.join(' · ')}</p></div></div><p class="result-explanation">${content.explanation}</p><ol>${content.suggestions.map((item) => `<li>${item}</li>`).join('')}</ol><div class="result-actions"><button data-action="again">DRAW AGAIN</button><button data-action="restart">RESTART ASSESSMENT</button></div></div><figure class="result-visual"><img src="${content.card}" alt="${content.english} result card"><figcaption>${content.english} / TONIC.CO</figcaption></figure><figure class="advice-art"><img src="/images/cards/advice-placeholder.svg" alt="Temporary five-elements advice artwork"><figcaption>ADVICE ARTWORK IN PROGRESS / TEMPORARY IMAGE</figcaption></figure><p class="disclaimer">This result is an artistic interaction and lifestyle prompt. It is not metaphysical, medical, psychological, or financial advice.</p>`;
    this.element.querySelector('[data-action="again"]')?.addEventListener('click', () => this.element.dispatchEvent(new CustomEvent('draw:again', { bubbles: true })));
    this.element.querySelector('[data-action="restart"]')?.addEventListener('click', () => this.element.dispatchEvent(new CustomEvent('assessment:restart', { bubbles: true })));
  }
}
