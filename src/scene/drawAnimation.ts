import type { Element } from '../assessment/types';

export const DRAW_SPOTLIGHT = Object.freeze({
  intensity: 150,
  fadeIn: 0.5,
  fadeOut: 0.8,
});

interface DrawAnimationScene {
  beginDrawSpotlight(): Promise<void>;
  model: { rotateTo(element: Element): Promise<void> };
  endDrawSpotlight(): Promise<void>;
}

export async function runDrawAnimation(scene: DrawAnimationScene, element: Element) {
  await scene.beginDrawSpotlight();
  try {
    await scene.model.rotateTo(element);
  } finally {
    await scene.endDrawSpotlight();
  }
}
