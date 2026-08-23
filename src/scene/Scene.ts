import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';
import type { Element } from '../assessment/types';
import { RESULT_CONTENT } from '../results/content';
import { ModelController } from './ModelController';
import { FallingLeaves } from './FallingLeaves';
import { DRAW_SPOTLIGHT } from './drawAnimation';
import { configureDrawSpotlight } from './selectiveDrawLight';

export class TonicScene extends EventTarget {
  readonly canvas = document.createElement('canvas');
  readonly camera = new THREE.PerspectiveCamera(34, innerWidth / innerHeight, 0.1, 100);
  readonly model: ModelController;
  private leaves = new FallingLeaves();
  private scene = new THREE.Scene();
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  private clock = new THREE.Clock();
  private frame = 0;
  private redLight = new THREE.PointLight('#ef301c', 102, 30, 1.7);
  private accentLight = new THREE.PointLight('#f5d8cb', 32, 22, 1.4);
  private drawSpotlight = new THREE.SpotLight('#ffe2cf', 0, 18, Math.PI / 10, 0.65, 2);
  private drawSpotlightTarget = new THREE.Object3D();

  constructor(private host: HTMLElement) {
    super();
    this.canvas.className = 'scene-canvas';
    host.prepend(this.canvas);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.22;
    this.scene.background = new THREE.Color('#050303');
    this.scene.fog = new THREE.FogExp2('#160403', 0.045);
    this.scene.add(new THREE.HemisphereLight('#a74436', '#080303', 1.75));
    this.redLight.position.set(5, 1, -5);
    this.accentLight.position.set(-5, 3, -4);
    this.drawSpotlight.position.set(5.8, 2.6, -8);
    this.drawSpotlightTarget.position.set(0, -0.15, 0);
    this.drawSpotlight.target = this.drawSpotlightTarget;
    configureDrawSpotlight(this.drawSpotlight);
    this.scene.add(this.redLight, this.accentLight, this.drawSpotlight, this.drawSpotlightTarget);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.32, 0.42, 0.88));
    this.model = new ModelController(this.camera, this.canvas);
    this.scene.add(this.model.root, this.leaves.group);
    this.model.addEventListener('progress', (event) => this.dispatchEvent(new CustomEvent('progress', { detail: (event as CustomEvent<number>).detail })));
    addEventListener('resize', this.resize);
  }

  async start() {
    try {
      await this.model.load();
      this.clock.start();
      this.animate();
      this.dispatchEvent(new Event('ready'));
    } catch (error) {
      this.fallback(error);
    }
  }

  private animate = () => {
    this.frame = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.05);
    this.model.update(delta);
    this.leaves.update(delta);
    this.composer.render();
  };

  private resize = () => {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(innerWidth, innerHeight);
    this.composer.setSize(innerWidth, innerHeight);
  };

  private fallback(error: unknown) {
    console.error('3D scene fallback', error);
    this.canvas.remove();
    const image = document.createElement('img');
    image.className = 'scene-fallback';
    image.src = '/images/cover.png';
    image.alt = 'TONIC.CO architectural render';
    this.host.prepend(image);
    this.dispatchEvent(new Event('fallback'));
  }

  setResultAccent(element: Element) {
    gsap.to(this.accentLight.color, { r: new THREE.Color(RESULT_CONTENT[element].accent).r, g: new THREE.Color(RESULT_CONTENT[element].accent).g, b: new THREE.Color(RESULT_CONTENT[element].accent).b, duration: 1.4 });
    gsap.to(this.accentLight, { intensity: 55, duration: 1.4 });
  }

  async beginDrawSpotlight() {
    this.model.getRotatingWorldCenter(this.drawSpotlightTarget.position);
    this.drawSpotlightTarget.updateMatrixWorld();
    gsap.killTweensOf(this.drawSpotlight);
    await gsap.to(this.drawSpotlight, {
      intensity: DRAW_SPOTLIGHT.intensity,
      duration: DRAW_SPOTLIGHT.fadeIn,
      ease: 'power2.out',
    });
  }

  async endDrawSpotlight() {
    gsap.killTweensOf(this.drawSpotlight);
    await gsap.to(this.drawSpotlight, {
      intensity: 0,
      duration: DRAW_SPOTLIGHT.fadeOut,
      ease: 'power2.inOut',
    });
  }

  resetAccent() {
    const color = new THREE.Color('#f5d8cb');
    gsap.to(this.accentLight.color, { r: color.r, g: color.g, b: color.b, duration: .8 });
    gsap.to(this.accentLight, { intensity: 32, duration: .8 });
    gsap.killTweensOf(this.drawSpotlight);
    this.drawSpotlight.intensity = 0;
  }

  dispose() {
    cancelAnimationFrame(this.frame);
    removeEventListener('resize', this.resize);
    this.model.dispose();
    this.leaves.dispose();
    this.composer.dispose();
    this.renderer.dispose();
  }
}
