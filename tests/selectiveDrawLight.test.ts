import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import {
  DRAW_LIGHT_LAYER,
  configureDrawSpotlight,
  enableDrawLightLayer,
} from '../src/scene/selectiveDrawLight';

describe('selective draw lighting', () => {
  it('adds the draw layer to rotating meshes without removing the default layer', () => {
    const root = new THREE.Group();
    const child = new THREE.Mesh();
    root.add(child);

    enableDrawLightLayer(root);

    const defaultLayer = new THREE.Layers();
    const drawLayer = new THREE.Layers();
    drawLayer.set(DRAW_LIGHT_LAYER);
    expect(child.layers.test(defaultLayer)).toBe(true);
    expect(child.layers.test(drawLayer)).toBe(true);
  });

  it('makes the temporary spotlight illuminate only the draw layer', () => {
    const light = new THREE.SpotLight();

    configureDrawSpotlight(light);

    const defaultLayer = new THREE.Layers();
    const drawLayer = new THREE.Layers();
    drawLayer.set(DRAW_LIGHT_LAYER);
    expect(light.layers.test(drawLayer)).toBe(true);
    expect(light.layers.test(defaultLayer)).toBe(false);
  });
});
