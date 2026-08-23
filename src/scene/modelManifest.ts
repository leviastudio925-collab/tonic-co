import type { Element } from '../assessment/types';

export interface ModelManifest {
  rotatingNodeNames: string[];
  cardFaceNodes: Record<Element, string>;
  pivot: [number, number, number];
  stopAngles: Record<Element, number>;
}

export function gltfRuntimeName(name: string) {
  return name.replace(/[\[\]\.:/]/g, '');
}

export const DRAW_MOTION = Object.freeze({
  turns: 3,
  duration: 7,
  windUp: 0.18,
  windUpDuration: 0.42,
});

// Only these two exported cylinder meshes form the approved prayer-wheel layer.
// They share the same center in the replacement GLB, which supplies the pivot.
export const MODEL_MANIFEST: ModelManifest = {
  rotatingNodeNames: ['柱体.001', '柱体_Baked'],
  cardFaceNodes: {
    metal: '多边形_4357.003',
    wood: '多边形_4359.003',
    water: '多边形_4360.003',
    fire: '多边形_4361.003',
    earth: '多边形_4362.003',
  },
  pivot: [-0.013582343235611916, 4.769895553588867, 0.026729106903076172],
  stopAngles: {
    metal: 0,
    wood: Math.PI * 0.4,
    water: Math.PI * 0.8,
    fire: Math.PI * 1.2,
    earth: Math.PI * 1.6,
  },
};
