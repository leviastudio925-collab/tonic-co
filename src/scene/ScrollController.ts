import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { TonicScene } from './Scene';

gsap.registerPlugin(ScrollTrigger);

export class ScrollController {
  private triggers: ScrollTrigger[] = [];
  constructor(private scene: TonicScene) {}
  start() {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const hero = document.querySelector('.hero');
    const assessment = document.querySelector('#assessment');
    if (hero) {
      const tween = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 } })
        .to('.hero-copy', { opacity: 0, y: -70 }, 0)
        .to(this.scene.camera.position, { x: 5.8, y: 1.0, z: 7.6 }, 0);
      if (tween.scrollTrigger) this.triggers.push(tween.scrollTrigger);
    }
    if (assessment) {
      const tween = gsap.to(this.scene.camera.position, { x: 7.7, y: -1.15, z: 8.5, ease: 'none', scrollTrigger: { trigger: assessment, start: 'top bottom', end: 'top 15%', scrub: 1 } });
      if (tween.scrollTrigger) this.triggers.push(tween.scrollTrigger);
    }
  }
  dispose() { this.triggers.forEach((trigger) => trigger.kill()); }
}

