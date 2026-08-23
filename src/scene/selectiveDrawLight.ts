import * as THREE from 'three';

export const DRAW_LIGHT_LAYER = 1;

export function enableDrawLightLayer(root: THREE.Object3D) {
  root.traverse((node) => node.layers.enable(DRAW_LIGHT_LAYER));
}

export function configureDrawSpotlight(light: THREE.SpotLight) {
  light.layers.set(DRAW_LIGHT_LAYER);
}
