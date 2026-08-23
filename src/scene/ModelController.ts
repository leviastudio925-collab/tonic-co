import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import type { Element } from '../assessment/types';
import { DRAW_MOTION, gltfRuntimeName, MODEL_MANIFEST } from './modelManifest';
import { RootAutoRotation } from './RootAutoRotation';
import { enableDrawLightLayer } from './selectiveDrawLight';

export class ModelController extends EventTarget {
  readonly root = new THREE.Group();
  readonly controls: OrbitControls;
  private rotatingGroup = new THREE.Group();
  private baseRotation = 0;
  private idle = true;
  private rootAutoRotation = new RootAutoRotation();

  constructor(private camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    super();
    this.controls = new OrbitControls(camera, domElement);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.minDistance = 7;
    this.controls.maxDistance = 16;
    this.controls.minPolarAngle = Math.PI * 0.28;
    this.controls.maxPolarAngle = Math.PI * 0.66;
    this.controls.addEventListener('start', () => { this.idle = false; });
    this.controls.addEventListener('end', () => { window.setTimeout(() => { this.idle = true; }, 900); });
  }

  async load(url = '/models/building.glb') {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(url, (event) => {
      const progress = event.total ? Math.round((event.loaded / event.total) * 100) : 70;
      this.dispatchEvent(new CustomEvent('progress', { detail: progress }));
    });
    this.root.add(gltf.scene);
    this.prepareRotatingGroup(gltf.scene);
    this.normalize();
    this.dispatchEvent(new CustomEvent('progress', { detail: 100 }));
  }

  private prepareRotatingGroup(scene: THREE.Object3D) {
    this.rotatingGroup.name = 'TonicRotatingAssembly';
    this.rotatingGroup.position.fromArray(MODEL_MANIFEST.pivot);
    scene.add(this.rotatingGroup);
    const missing: string[] = [];
    for (const name of MODEL_MANIFEST.rotatingNodeNames) {
      const node = scene.getObjectByName(name) ?? scene.getObjectByName(gltfRuntimeName(name));
      if (node) this.rotatingGroup.attach(node); else missing.push(name);
    }
    if (missing.length) {
      const runtimeNames: string[] = [];
      scene.traverse((node) => { if (node.name) runtimeNames.push(node.name); });
      throw new Error(`Missing verified rotating nodes: ${missing.join(', ')}; found ${runtimeNames.length} named runtime nodes`);
    }
    enableDrawLightLayer(this.rotatingGroup);
  }

  private normalize() {
    const box = new THREE.Box3().setFromObject(this.root);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const scale = 6.7 / Math.max(size.y, 0.001);
    this.root.scale.setScalar(scale);
    this.root.position.set(-center.x * scale, -center.y * scale - 0.15, -center.z * scale);
    this.camera.position.set(7.7, 2.4, -10.8);
    this.controls.target.set(0, -0.2, 0);
    this.controls.update();
  }

  update(delta: number) {
    this.baseRotation = this.rootAutoRotation.advance(this.baseRotation, delta, this.idle);
    this.root.rotation.y = this.baseRotation;
    this.controls.update();
  }

  async rotateTo(element: Element) {
    this.rootAutoRotation.stopForDraw();
    const target = MODEL_MANIFEST.stopAngles[element];
    const start = this.rotatingGroup.rotation.y;
    const turns = Math.PI * 2 * DRAW_MOTION.turns;
    const destination = target + turns + Math.ceil((start - target) / (Math.PI * 2)) * Math.PI * 2;
    await gsap.timeline()
      .to(this.rotatingGroup.rotation, { y: start - DRAW_MOTION.windUp, duration: DRAW_MOTION.windUpDuration, ease: 'power2.in' })
      .to(this.rotatingGroup.rotation, { y: destination, duration: DRAW_MOTION.duration, ease: 'power4.out' })
      .then();
  }

  getRotatingWorldCenter(target: THREE.Vector3) {
    this.rotatingGroup.updateWorldMatrix(true, false);
    return this.rotatingGroup.getWorldPosition(target);
  }

  dispose() { this.controls.dispose(); }
}
