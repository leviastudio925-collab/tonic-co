import * as THREE from 'three';

export interface LeafState {
  x: number;
  y: number;
  z: number;
  fallSpeed: number;
  drift: number;
  rollSpeed: number;
  phase: number;
  scale: number;
  colorIndex: number;
}

const TOP = 6.4;
const BOTTOM = -5.6;

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 0x100000000;
  };
}

export function getLeafCount(reducedMotion: boolean) {
  return reducedMotion ? 6 : 16;
}

export function createLeafStates(count: number, reducedMotion: boolean, seed = 2026): LeafState[] {
  const random = seededRandom(seed);
  return Array.from({ length: count }, (_, index) => {
    const central = index % 4 === 3;
    const side = random() < 0.5 ? -1 : 1;
    const x = central ? (random() - 0.5) * 3.2 : side * (2.4 + random() * 4.2);
    return {
      x,
      y: BOTTOM + random() * (TOP - BOTTOM),
      z: -3.2 + random() * 5.2,
      fallSpeed: (0.34 + random() * 0.42) * (reducedMotion ? 0.3 : 1),
      drift: 0.16 + random() * 0.32,
      rollSpeed: 0.45 + random() * 1.1,
      phase: random() * Math.PI * 2,
      scale: 0.09 + random() * 0.07,
      colorIndex: Math.floor(random() * 3),
    };
  });
}

export function advanceLeaf(leaf: LeafState, delta: number, reducedMotion: boolean): LeafState {
  const motionScale = reducedMotion ? 0.28 : 1;
  const phase = leaf.phase + delta * leaf.rollSpeed * motionScale;
  const y = leaf.y - leaf.fallSpeed * delta * motionScale;
  return {
    ...leaf,
    x: leaf.x + Math.sin(phase) * leaf.drift * delta * motionScale,
    y: y < BOTTOM ? TOP + ((BOTTOM - y) % 0.8) : y,
    phase,
  };
}

export class FallingLeaves {
  readonly group = new THREE.Group();
  private mesh: THREE.InstancedMesh;
  private states: LeafState[];
  private matrix = new THREE.Matrix4();
  private quaternion = new THREE.Quaternion();
  private position = new THREE.Vector3();
  private scale = new THREE.Vector3();
  private euler = new THREE.Euler();

  constructor(private reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const count = getLeafCount(reducedMotion);
    this.states = createLeafStates(count, reducedMotion);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([
      0, 0.75, 0,
      0.5, 0, 0.05,
      0, -0.75, 0,
      -0.5, 0, -0.05,
    ], 3));
    geometry.setIndex([0, 1, 2, 0, 2, 3]);
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.9,
      metalness: 0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
    });
    this.mesh = new THREE.InstancedMesh(geometry, material, count);
    const colors = ['#7d140d', '#b33524', '#dcc8b8'].map((color) => new THREE.Color(color));
    this.states.forEach((leaf, index) => this.mesh.setColorAt(index, colors[leaf.colorIndex]));
    this.mesh.instanceColor!.needsUpdate = true;
    this.mesh.frustumCulled = false;
    this.group.name = 'TonicFallingLeaves';
    this.group.add(this.mesh);
    this.syncInstances();
  }

  update(delta: number) {
    this.states = this.states.map((leaf) => advanceLeaf(leaf, delta, this.reducedMotion));
    this.syncInstances();
  }

  private syncInstances() {
    this.states.forEach((leaf, index) => {
      this.position.set(leaf.x, leaf.y, leaf.z);
      this.euler.set(leaf.phase * 0.55, leaf.phase, Math.sin(leaf.phase) * 0.8);
      this.quaternion.setFromEuler(this.euler);
      this.scale.setScalar(leaf.scale);
      this.matrix.compose(this.position, this.quaternion, this.scale);
      this.mesh.setMatrixAt(index, this.matrix);
    });
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  dispose() {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
