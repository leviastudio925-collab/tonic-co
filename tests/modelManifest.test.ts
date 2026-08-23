import { describe, expect, it } from 'vitest';
import { ELEMENTS } from '../src/assessment/types';
import { DRAW_MOTION, MODEL_MANIFEST } from '../src/scene/modelManifest';
import { gltfRuntimeName } from '../src/scene/modelManifest';

describe('MODEL_MANIFEST', () => {
  it('rotates only the two approved cylinder meshes around their shared center', () => {
    expect(MODEL_MANIFEST.rotatingNodeNames).toEqual(['柱体.001', '柱体_Baked']);
    expect(MODEL_MANIFEST.pivot.every(Number.isFinite)).toBe(true);
    expect(MODEL_MANIFEST.pivot).toEqual([
      -0.013582343235611916,
      4.769895553588867,
      0.026729106903076172,
    ]);
  });

  it('defines one unique finite stop angle for every element', () => {
    expect(Object.keys(MODEL_MANIFEST.stopAngles).sort()).toEqual([...ELEMENTS].sort());
    const normalized = Object.values(MODEL_MANIFEST.stopAngles).map((angle) => {
      expect(Number.isFinite(angle)).toBe(true);
      return ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    });
    expect(new Set(normalized.map((value) => value.toFixed(6))).size).toBe(ELEMENTS.length);
  });

  it('maps exactly one card face node for every element', () => {
    expect(Object.keys(MODEL_MANIFEST.cardFaceNodes).sort()).toEqual([...ELEMENTS].sort());
    expect(new Set(Object.values(MODEL_MANIFEST.cardFaceNodes)).size).toBe(ELEMENTS.length);
  });

});

describe('DRAW_MOTION', () => {
  it('uses a slower three-turn ceremonial draw', () => {
    expect(DRAW_MOTION.turns).toBe(3);
    expect(DRAW_MOTION.duration).toBe(7);
    expect(DRAW_MOTION.windUp).toBeGreaterThan(0);
    expect(DRAW_MOTION.windUpDuration).toBeGreaterThan(0);
    expect(DRAW_MOTION.windUpDuration).toBeLessThan(DRAW_MOTION.duration);
  });
});

describe('gltfRuntimeName', () => {
  it('matches the punctuation sanitization applied by GLTFLoader', () => {
    expect(gltfRuntimeName('柱体.003')).toBe('柱体003');
    expect(gltfRuntimeName('panel:front/1')).toBe('panelfront1');
  });
});
