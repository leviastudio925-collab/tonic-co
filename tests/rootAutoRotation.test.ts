import { describe, expect, it } from 'vitest';
import { RootAutoRotation } from '../src/scene/RootAutoRotation';

describe('RootAutoRotation', () => {
  it('advances the building only while idle rotation is enabled', () => {
    const motion = new RootAutoRotation();
    expect(motion.advance(1, 2, true)).toBeCloseTo(1.11);
    expect(motion.advance(1, 2, false)).toBe(1);
  });

  it('remains stationary after the draw begins', () => {
    const motion = new RootAutoRotation();
    motion.stopForDraw();
    expect(motion.advance(1, 2, true)).toBe(1);
  });
});
