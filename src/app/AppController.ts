import type { AssessmentAnswers, Element, ElementWeights } from '../assessment/types';
import { calculateWeights } from '../assessment/scoring';
import { drawElement } from '../draw/weightedDraw';
import type { TonicScene } from '../scene/Scene';
import { runDrawAnimation } from '../scene/drawAnimation';
import { SessionState, type FlowStep } from '../state/SessionState';
import { AssessmentView } from '../ui/AssessmentView';
import { DrawView } from '../ui/DrawView';
import { ResultView } from '../ui/ResultView';

export class AppController {
  private step: FlowStep = 'hero';
  private answers?: AssessmentAnswers;
  private weights?: ElementWeights;
  private result?: Element;
  private state = new SessionState();

  constructor(
    private host: HTMLElement,
    private scene: TonicScene,
    private assessment: AssessmentView,
    private draw: DrawView,
    private resultView: ResultView,
  ) {
    host.addEventListener('assessment:submit', (event) => this.onAssessment((event as CustomEvent<AssessmentAnswers>).detail));
    host.addEventListener('draw:start', () => void this.performDraw());
    host.addEventListener('draw:again', () => { document.querySelector('#draw')?.scrollIntoView({ behavior: 'smooth' }); void this.performDraw(); });
    host.addEventListener('assessment:restart', () => this.restart());
  }

  restore() {
    const saved = this.state.load();
    if (!saved) return;
    this.answers = saved.answers;
    this.weights = saved.weights;
    this.result = saved.result;
    this.step = saved.step === 'drawing' ? 'ready' : saved.step;
    if (this.answers) this.assessment.restore(this.answers);
    if (this.weights) this.draw.setEnabled(true);
    if (this.result && this.step === 'result') {
      this.resultView.render(this.result);
      this.scene.setResultAccent(this.result);
    }
  }

  private onAssessment(answers: AssessmentAnswers) {
    this.answers = answers;
    this.weights = calculateWeights(answers);
    this.step = 'ready';
    this.draw.setEnabled(true);
    this.draw.setStatus('ASSESSMENT COMPLETE · READY TO DRAW');
    this.save();
    this.draw.element.scrollIntoView({ behavior: 'smooth' });
  }

  private async performDraw() {
    if (!this.weights || this.step === 'drawing') return;
    this.result = drawElement(this.weights);
    this.step = 'drawing';
    this.draw.setEnabled(false);
    this.draw.setStatus('THE FIVE ARE TURNING · RESULT LOCKED');
    this.save();
    try {
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) await runDrawAnimation(this.scene, this.result);
    } catch (error) {
      console.warn('3D draw animation unavailable; revealing locked result', error);
    }
    this.scene.setResultAccent(this.result);
    this.resultView.render(this.result);
    this.step = 'result';
    this.draw.setEnabled(true);
    this.draw.setStatus(`DRAWN · ${this.result.toUpperCase()}`);
    this.save();
    this.resultView.element.scrollIntoView({ behavior: 'smooth' });
  }

  private restart() {
    this.state.clear();
    this.answers = undefined;
    this.weights = undefined;
    this.result = undefined;
    this.step = 'assessment';
    this.draw.setEnabled(false);
    this.draw.setStatus('WAITING FOR ASSESSMENT');
    this.resultView.element.innerHTML = '';
    this.scene.resetAccent();
    this.assessment.element.scrollIntoView({ behavior: 'smooth' });
    window.setTimeout(() => this.assessment.focus(), 500);
  }

  private save() { this.state.save({ step: this.step, answers: this.answers, weights: this.weights, result: this.result }); }
}
