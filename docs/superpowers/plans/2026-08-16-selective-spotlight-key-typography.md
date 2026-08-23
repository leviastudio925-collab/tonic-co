# Selective Spotlight and Key Typography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restrict the temporary draw spotlight to the two rotating cylinder meshes and apply Asterone DEMO only to the three approved title types at overlap-safe desktop sizes.

**Architecture:** A focused Three.js helper owns the selective light-layer configuration, while `ModelController` exposes the normalized rotating-group world center and `TonicScene` refreshes the spotlight target before each draw. Typography remains CSS-only, using selector-specific responsive clamps so homepage typography and all Avenir body text remain unchanged.

**Tech Stack:** TypeScript, Three.js layers and `SpotLight`, GSAP, Vitest, Playwright, Vite, OpenAI Sites.

## Global Constraints

- The temporary draw light affects only `柱体.001` and `柱体_Baked` through Three.js layer `1`.
- Existing scene lights, renderer exposure, fog, bloom, and result accent remain unchanged.
- The spotlight target is refreshed from the rotating group's world-space center before each draw.
- Asterone DEMO applies only to the assessment heading, draw heading, and result element name.
- Assessment and draw headings use `clamp(38px, 4.4vw, 72px)` with `0.98` line-height.
- Result element names use `clamp(36px, 3.4vw, 48px)` with `-0.02em` tracking.
- Homepage `TONIC.CO`, body copy, labels, buttons, keywords, captions, and status text remain unchanged.
- Desktop layout only; no mobile redesign.

---

### Task 1: Isolate the Temporary Draw Light

**Files:**
- Create: `src/scene/selectiveDrawLight.ts`
- Create: `tests/selectiveDrawLight.test.ts`
- Modify: `src/scene/ModelController.ts`
- Modify: `src/scene/Scene.ts`

**Interfaces:**
- Produces: `DRAW_LIGHT_LAYER: 1`
- Produces: `enableDrawLightLayer(root: THREE.Object3D): void`
- Produces: `configureDrawSpotlight(light: THREE.SpotLight): void`
- Produces: `ModelController.getRotatingWorldCenter(target: THREE.Vector3): THREE.Vector3`
- Consumes: the existing `TonicRotatingAssembly` and `TonicScene.beginDrawSpotlight()` sequence.

- [ ] **Step 1: Write failing selective-layer tests**

```ts
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
    expect(child.layers.test(new THREE.Layers())).toBe(true);
    const drawLayer = new THREE.Layers();
    drawLayer.set(DRAW_LIGHT_LAYER);
    expect(child.layers.test(drawLayer)).toBe(true);
  });

  it('makes the temporary spotlight illuminate only the draw layer', () => {
    const light = new THREE.SpotLight();
    configureDrawSpotlight(light);
    const drawLayer = new THREE.Layers();
    drawLayer.set(DRAW_LIGHT_LAYER);
    expect(light.layers.test(drawLayer)).toBe(true);
    const defaultLayer = new THREE.Layers();
    expect(light.layers.test(defaultLayer)).toBe(false);
  });
});
```

- [ ] **Step 2: Run the focused test and verify the missing-module failure**

Run: `pnpm exec vitest run tests/selectiveDrawLight.test.ts`

Expected: FAIL because `src/scene/selectiveDrawLight.ts` does not exist.

- [ ] **Step 3: Implement the selective-light helper**

```ts
import * as THREE from 'three';

export const DRAW_LIGHT_LAYER = 1;

export function enableDrawLightLayer(root: THREE.Object3D) {
  root.traverse((node) => node.layers.enable(DRAW_LIGHT_LAYER));
}

export function configureDrawSpotlight(light: THREE.SpotLight) {
  light.layers.set(DRAW_LIGHT_LAYER);
}
```

- [ ] **Step 4: Apply the layer only to the rotating group and expose its world center**

In `ModelController.prepareRotatingGroup()`, call `enableDrawLightLayer(this.rotatingGroup)` only after the two manifest nodes have been attached. Add:

```ts
getRotatingWorldCenter(target: THREE.Vector3) {
  this.rotatingGroup.updateWorldMatrix(true, false);
  return this.rotatingGroup.getWorldPosition(target);
}
```

- [ ] **Step 5: Configure and retarget the draw spotlight**

In `TonicScene`, call `configureDrawSpotlight(this.drawSpotlight)` once in the constructor. Narrow the light to `Math.PI / 10`, reduce distance to `18`, and set decay to `2`. At the start of `beginDrawSpotlight()` refresh the target:

```ts
this.model.getRotatingWorldCenter(this.drawSpotlightTarget.position);
this.drawSpotlightTarget.updateMatrixWorld();
```

Do not modify hemisphere, red, accent, exposure, fog, or bloom values.

- [ ] **Step 6: Run focused and existing draw tests**

Run: `pnpm exec vitest run tests/selectiveDrawLight.test.ts tests/drawAnimation.test.ts tests/modelManifest.test.ts`

Expected: all tests PASS.

- [ ] **Step 7: Commit the isolated lighting change**

```bash
git add src/scene/selectiveDrawLight.ts src/scene/ModelController.ts src/scene/Scene.ts tests/selectiveDrawLight.test.ts
git commit -m "fix: isolate draw spotlight to rotating meshes"
```

---

### Task 2: Apply Asterone to the Three Approved Title Types

**Files:**
- Modify: `src/styles.css`
- Modify: `tests/app-flow.spec.ts`

**Interfaces:**
- Consumes: existing `.section-copy h2`, `.draw-copy h2`, `.result-title h2`, `.hero h1`, and loaded `Asterone`/`Avenir Next World` font faces.
- Produces: computed selector-specific typography without markup changes.

- [ ] **Step 1: Add failing computed-style assertions**

Extend the Playwright flow after the relevant sections are rendered:

```ts
await expect(page.locator('.section-copy h2')).toHaveCSS('font-family', /Asterone/);
await expect(page.locator('.draw-copy h2')).toHaveCSS('font-family', /Asterone/);
await expect(page.locator('.hero h1')).toHaveCSS('font-family', /Asterone/);
expect(await page.locator('.section-copy h2').evaluate((el) => parseFloat(getComputedStyle(el).fontSize))).toBeLessThanOrEqual(72);
expect(await page.locator('.draw-copy h2').evaluate((el) => parseFloat(getComputedStyle(el).fontSize))).toBeLessThanOrEqual(72);
```

After the result appears, assert:

```ts
await expect(page.locator('.result-title h2')).toHaveCSS('font-family', /Asterone/);
expect(await page.locator('.result-title h2').evaluate((el) => parseFloat(getComputedStyle(el).fontSize))).toBeLessThanOrEqual(48);
```

Retain the existing homepage Asterone assertion as a regression guard; do not change homepage CSS.

- [ ] **Step 2: Run the typography E2E test and verify failure**

Run: `pnpm exec playwright test tests/app-flow.spec.ts`

Expected: FAIL because the section, draw, and result headings still compute to Avenir.

- [ ] **Step 3: Add the scoped CSS overrides**

Append focused rules after the current typography overrides:

```css
.section-copy h2,
.draw-copy h2 {
  font-family: "Asterone", Arial, sans-serif !important;
  font-size: clamp(38px, 4.4vw, 72px);
  line-height: .98;
}

.result-title h2 {
  font-family: "Asterone", Arial, sans-serif !important;
  font-size: clamp(36px, 3.4vw, 48px);
  letter-spacing: -.02em;
  line-height: 1;
}
```

Do not modify `.hero h1` or the global Avenir rule.

- [ ] **Step 4: Add desktop overlap assertions**

At the existing desktop viewport, assert each approved title stays inside its container:

```ts
for (const selector of ['.section-copy h2', '.draw-copy h2', '.result-title h2']) {
  const fits = await page.locator(selector).evaluate((el) => {
    const parent = el.parentElement!;
    const box = el.getBoundingClientRect();
    const parentBox = parent.getBoundingClientRect();
    return box.left >= parentBox.left && box.right <= parentBox.right + 1;
  });
  expect(fits).toBe(true);
}
```

- [ ] **Step 5: Run the E2E test**

Run: `pnpm exec playwright test tests/app-flow.spec.ts`

Expected: PASS with all font-family, maximum-size, and containment assertions.

- [ ] **Step 6: Commit the typography change**

```bash
git add src/styles.css tests/app-flow.spec.ts
git commit -m "style: apply Asterone to key experience titles"
```

---

### Task 3: Verify, Package, and Publish

**Files:**
- Refresh: `outputs/tonic-five-elements-3d-project.zip`
- Refresh: `outputs/tonic-sites-build.tar.gz`
- Use: `.openai/hosting.json`

**Interfaces:**
- Consumes: the committed source HEAD and production `dist/` build.
- Produces: one saved Sites version and one production deployment at the existing project URL.

- [ ] **Step 1: Run the complete unit suite**

Run: `pnpm test`

Expected: all Vitest files PASS with zero failures.

- [ ] **Step 2: Run the complete browser flow**

Run: `pnpm run test:e2e`

Expected: all Playwright tests PASS with zero failures.

- [ ] **Step 3: Build the production bundle**

Run: `pnpm run build`

Expected: TypeScript exits cleanly and Vite creates `dist/`.

- [ ] **Step 4: Perform visual QA**

Capture the assessment, draw mid-rotation, and result sections at the desktop viewport. Confirm the three Asterone titles fit their containers, the homepage is unchanged, only the two rotating cylinders receive the temporary warm light, surrounding architecture remains at its normal brightness, and the temporary light disappears after the draw.

- [ ] **Step 5: Refresh the source and Sites archives**

Copy the current `dist/` into the existing `work/sites-package/dist/client`, retain `scripts/sites-worker.js` as `dist/server/index.js`, retain the existing hosting manifest, create `outputs/tonic-sites-build.tar.gz`, and rebuild `outputs/tonic-five-elements-3d-project.zip` from the committed project source.

- [ ] **Step 6: Push the exact committed HEAD and save a Sites version**

Use a short-lived Sites source credential to push the current HEAD to the configured `main` source branch. Save a new version using that full commit SHA and `outputs/tonic-sites-build.tar.gz`.

- [ ] **Step 7: Deploy and inspect production status**

Deploy the saved version to the existing private Sites project from `.openai/hosting.json`. Poll the returned deployment ID until `succeeded` or `failed`. On success, verify the existing production URL loads the current hashed JavaScript bundle and 3D canvas.

- [ ] **Step 8: Record final repository state**

Run: `git status --short` and `git log -1 --oneline`

Expected: clean working tree and the release commit at HEAD.
