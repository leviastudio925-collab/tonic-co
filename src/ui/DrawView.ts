export class DrawView {
  readonly element = document.createElement('section');
  private button!: HTMLButtonElement;
  constructor() {
    this.element.id = 'draw';
    this.element.className = 'content-section draw-section';
    this.element.innerHTML = `<div class="draw-copy"><p class="section-index">02 / DRAW</p><h2>TURN THE FIVE.<br>DRAW YOUR ANSWER.</h2><p>Your result follows the tendencies in your assessment while preserving the chance of a real draw.</p><button class="draw-button" type="button"><span>START THE DRAW</span><i>SPIN</i></button><p class="draw-status" aria-live="polite">WAITING TO BEGIN</p></div>`;
    this.button = this.element.querySelector('button')!;
    this.button.addEventListener('click', () => this.element.dispatchEvent(new CustomEvent('draw:start', { bubbles: true })));
  }
  setEnabled(enabled: boolean) { this.button.disabled = !enabled; }
  setStatus(text: string) { this.element.querySelector<HTMLElement>('.draw-status')!.textContent = text; }
}
