import { describe, expect, it } from 'vitest';
import { DRAW_SPOTLIGHT, runDrawAnimation } from '../src/scene/drawAnimation';

describe('runDrawAnimation', () => {
  it('brings up the front light before rotation and fades it afterwards', async () => {
    const calls: string[] = [];
    const scene = {
      beginDrawSpotlight: async () => { calls.push('light:start'); },
      model: { rotateTo: async (element: string) => { calls.push(`rotate:${element}`); } },
      endDrawSpotlight: async () => { calls.push('light:stop'); },
    };

    await runDrawAnimation(scene, 'wood');

    expect(calls).toEqual(['light:start', 'rotate:wood', 'light:stop']);
  });

  it('always fades the draw light when rotation fails', async () => {
    const calls: string[] = [];
    const scene = {
      beginDrawSpotlight: async () => { calls.push('light:start'); },
      model: { rotateTo: async () => { calls.push('rotate'); throw new Error('rotation failed'); } },
      endDrawSpotlight: async () => { calls.push('light:stop'); },
    };

    await expect(runDrawAnimation(scene, 'fire')).rejects.toThrow('rotation failed');
    expect(calls).toEqual(['light:start', 'rotate', 'light:stop']);
  });
});

describe('DRAW_SPOTLIGHT', () => {
  it('uses a restrained warm-light fade around the seven-second draw', () => {
    expect(DRAW_SPOTLIGHT.intensity).toBe(150);
    expect(DRAW_SPOTLIGHT.fadeIn).toBe(0.5);
    expect(DRAW_SPOTLIGHT.fadeOut).toBe(0.8);
  });
});
