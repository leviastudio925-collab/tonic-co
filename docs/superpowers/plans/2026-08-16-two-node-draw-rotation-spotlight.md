# Two-Node Draw Rotation and Spotlight Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rotate only `柱体.001` and `柱体_Baked` during the final draw and temporarily illuminate their front face with a warm-white spotlight.

**Architecture:** Make `MODEL_MANIFEST` the exact ownership contract for the two-node rotating group and its shared pivot. Add a focused draw-light controller to `TonicScene`, and put the asynchronous fade-in → rotation → fade-out sequence in a small testable `runDrawAnimation` function used by `AppController`.

**Tech Stack:** TypeScript, Three.js, GSAP, Vitest, Playwright, Vite, Sites hosting

## Global Constraints

- Rotate exactly `柱体.001` and `柱体_Baked`; every other GLB node remains outside `TonicRotatingAssembly`.
- Use pivot `[-0.013582343235611916, 4.769895553588867, 0.026729106903076172]`.
- Preserve the 0.42-second wind-up and three turns over seven seconds.
- Fade a warm-white front spotlight in for 0.5 seconds, hold it during rotation, and fade it out for 0.8 seconds.
- Apply result accent lighting only after the temporary draw spotlight has faded.
- Preserve assessment scoring, leaf motion, embedded model materials, typography, and camera controls.

---

### Task 1: Lock the two-node rotation contract

**Files:**
- Modify: `tests/modelManifest.test.ts`
- Modify: `src/scene/modelManifest.ts`

**Interfaces:**
- Produces: `MODEL_MANIFEST.rotatingNodeNames` equal to `['柱体.001', '柱体_Baked']` and the new shared pivot.

- [ ] **Step 1: Write the failing manifest test**

Assert exact node ownership and pivot:

```ts
expect(MODEL_MANIFEST.rotatingNodeNames).toEqual(['柱体.001', '柱体_Baked']);
expect(MODEL_MANIFEST.pivot).toEqual([
  -0.013582343235611916,
  4.769895553588867,
  0.026729106903076172,
]);
```

- [ ] **Step 2: Verify the test fails**

Run `pnpm test tests/modelManifest.test.ts`. Expected: the existing `.003` node list and old pivot fail the new assertions.

- [ ] **Step 3: Implement the exact manifest**

Replace the `.003` assembly list with the two requested node names and record their shared exported center as `pivot`. Keep the existing stop angles and draw timing.

- [ ] **Step 4: Verify the focused test passes**

Run `pnpm test tests/modelManifest.test.ts`. Expected: all manifest tests pass.

### Task 2: Add a testable spotlight sequence

**Files:**
- Create: `src/scene/drawAnimation.ts`
- Create: `tests/drawAnimation.test.ts`
- Modify: `src/scene/Scene.ts`
- Modify: `src/app/AppController.ts`

**Interfaces:**
- Produces: `DRAW_SPOTLIGHT` with `intensity: 150`, `fadeIn: 0.5`, and `fadeOut: 0.8`.
- Produces: `runDrawAnimation(scene, element): Promise<void>` consuming `beginDrawSpotlight()`, `model.rotateTo(element)`, and `endDrawSpotlight()`.
- Produces: `TonicScene.beginDrawSpotlight()` and `TonicScene.endDrawSpotlight()`.

- [ ] **Step 1: Write failing sequence tests**

Use a lightweight fake scene to assert call order `light:start`, `rotate:<element>`, `light:stop`, and assert `light:stop` still occurs when rotation rejects. Assert the three spotlight constants exactly.

- [ ] **Step 2: Verify the tests fail**

Run `pnpm test tests/drawAnimation.test.ts`. Expected: the missing module/API fails collection.

- [ ] **Step 3: Implement the sequence helper**

Create `runDrawAnimation` with a `try/finally` around `model.rotateTo(element)` so the temporary light always fades out.

- [ ] **Step 4: Implement the scene spotlight**

Add a warm `THREE.SpotLight('#ffe2cf', 0, 28, Math.PI / 7, 0.65, 1.4)` on the camera-facing side, aim it at an explicit scene target near the normalized cylinder center, add both objects to the scene, and animate intensity with GSAP using `DRAW_SPOTLIGHT`.

- [ ] **Step 5: Connect the controller**

Replace the direct `scene.model.rotateTo(result)` call with `runDrawAnimation(scene, result)`. Keep result locking before the animation and `setResultAccent` after it.

- [ ] **Step 6: Verify focused and full tests**

Run `pnpm test tests/drawAnimation.test.ts` and then `pnpm test`. Expected: the sequence tests and all existing tests pass.

### Task 3: Verify motion, lighting, build, and deployment

**Files:**
- Modify: `tests/app-flow.spec.ts` only if an observable regression assertion is needed.
- Modify: `design-qa.md`
- Refresh: `outputs/tonic-five-elements-3d-project.zip`
- Refresh: `outputs/tonic-sites-build.tar.gz`

**Interfaces:**
- Consumes: the two-node manifest and temporary spotlight sequence.
- Produces: verified local build and a new private Sites version at the existing TONIC.CO URL.

- [ ] **Step 1: Run the production build**

Run `pnpm run build`. Confirm TypeScript and Vite complete successfully.

- [ ] **Step 2: Run the browser flow**

Run `pnpm run test:e2e`. Confirm the assessment, draw, result, and restart flows pass without fallback or console errors.

- [ ] **Step 3: Capture draw evidence**

Capture the page during the seven-second rotation and after completion. Check that only the two requested cylinders change orientation, the front face is illuminated during rotation, and the spotlight is absent afterward.

- [ ] **Step 4: Record and package**

Append evidence to `design-qa.md`, refresh the project ZIP, rebuild the Sites static archive from the exact commit, and save the changes.

- [ ] **Step 5: Publish the verified version**

Push the exact source commit to the existing Sites source repository, save a new archived version, deploy privately, wait for `succeeded`, and open the returned production URL.
