import './styles.css';
import { AppController } from './app/AppController';
import { TonicScene } from './scene/Scene';
import { ScrollController } from './scene/ScrollController';
import { AssessmentView } from './ui/AssessmentView';
import { DrawView } from './ui/DrawView';
import { ResultView } from './ui/ResultView';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Missing #app mount point');

app.innerHTML = `<div class="loader"><div class="loader-ring"><strong><span id="load-progress">0</span>%</strong><small>LOADING THE STATION</small></div></div><div class="page-shell"><header class="topbar"><a class="brand" href="#top">TONIC.CO</a><span>ONLINE FORTUNE STATION · 2026</span><a href="#assessment">BEGIN</a></header><section class="hero" id="top"><div class="hero-copy"><div><p class="section-index">DIGITAL TONIC / FIVE ELEMENTS STATION</p><h1>TONIC.CO</h1></div><div class="hero-meta"><p>ASSESS · DRAW · TRANSFORM<br>FIND THE FORCE YOU NEED NOW</p><span class="scroll-cue">SCROLL TO ENTER</span></div></div></section></div>`;

const shell = app.querySelector<HTMLElement>('.page-shell')!;
const assessment = new AssessmentView();
const draw = new DrawView();
const result = new ResultView();
shell.append(assessment.element, draw.element, result.element);
draw.setEnabled(false);

let scene: TonicScene;
try {
  scene = new TonicScene(app);
} catch (error) {
  console.error('WebGL initialization failed', error);
  const fallback = document.createElement('img');
  fallback.className = 'scene-fallback';
  fallback.src = '/images/cover.png';
  fallback.alt = 'TONIC.CO architectural render';
  app.prepend(fallback);
  scene = { model: { rotateTo: async () => {} }, setResultAccent: () => {}, resetAccent: () => {}, addEventListener: () => {}, start: async () => {}, camera: { position: {} } } as unknown as TonicScene;
}

const loader = app.querySelector<HTMLElement>('.loader')!;
const progress = app.querySelector<HTMLElement>('#load-progress')!;
scene.addEventListener('progress', (event) => { progress.textContent = String((event as CustomEvent<number>).detail); });
scene.addEventListener('ready', () => { loader.classList.add('is-hidden'); new ScrollController(scene).start(); });
scene.addEventListener('fallback', () => loader.classList.add('is-hidden'));
const controller = new AppController(shell, scene, assessment, draw, result);
controller.restore();
void scene.start().finally(() => window.setTimeout(() => loader.classList.add('is-hidden'), 5000));
