# Model, Leaves, and Site Publish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the tower with `6.glb`, add accessible low-density 3D falling leaves, repair preview behavior, and publish the validated site.

**Architecture:** Preserve the existing Vite/Three.js application. Treat the GLB manifest as the model compatibility contract, add a self-contained `FallingLeaves` instanced-mesh component, connect it to `TonicScene`, and deploy the exact successful production build through Sites.

**Tech Stack:** TypeScript, Vite, Three.js, GSAP, Vitest, Playwright, Sites hosting

## Global Constraints

- Never modify the source `G:/portfolio/学生LIST/25FALL/丁云菲/项目四/6.glb`.
- Preserve the new GLB's 13 embedded images, 13 textures, and 9 materials.
- Rotate only the verified `.003` lower assembly around Z `0.06912755966186523`.
- Render 16 non-interactive leaves, reduced under `prefers-reduced-motion: reduce`.
- Preserve all assessment, typography, lighting, and desktop interaction behavior.

---

### Task 1: New model compatibility contract

**Files:**
- Modify: `tests/modelManifest.test.ts`
- Modify: `src/scene/modelManifest.ts`
- Modify: `src/scene/ModelController.ts`
- Replace: `public/models/building.glb`

**Interfaces:**
- Produces: updated `MODEL_MANIFEST.pivot` and GLB-native material loading.

- [ ] Add a failing assertion that the pivot equals `[-0.04250910505652428, 5.90395450592041, 0.06912755966186523]`.
- [ ] Run the focused manifest test and observe the old Z coordinate failure.
- [ ] Update the pivot and remove the runtime Metal/Wood material replacement path.
- [ ] Copy `6.glb` to the project model path and inspect its nodes, UVs, images, textures, and materials.
- [ ] Run the focused test and confirm it passes.

### Task 2: Deterministic falling-leaf motion

**Files:**
- Create: `src/scene/FallingLeaves.ts`
- Create: `tests/fallingLeaves.test.ts`
- Modify: `src/scene/Scene.ts`

**Interfaces:**
- Produces: `createLeafStates(count, reducedMotion, seed)`, `advanceLeaf(state, delta, reducedMotion)`, and `FallingLeaves` with `group`, `update(delta)`, and `dispose()`.

- [ ] Write failing tests for 16 standard leaves, reduced-motion count, outer-third bias, deterministic generation, downward motion, and vertical wrapping.
- [ ] Run the focused test and confirm it fails because the component is absent.
- [ ] Implement deterministic state helpers and an instanced tapered-leaf mesh with red/rust/ivory vertex colors.
- [ ] Add the component to `TonicScene`, update it in the render loop, and dispose it with the scene.
- [ ] Run all unit tests and confirm they pass.

### Task 3: Preview, build, and publishing

**Files:**
- Modify: `design-qa.md`
- Create or modify: `.openai/hosting.json`
- Refresh: `outputs/tonic-five-elements-3d-project.zip`

**Interfaces:**
- Produces: working local preview, successful production build, and deployed site URL.

- [ ] Run the full browser flow and verify the model loads without fallback or console errors.
- [ ] Run the production build and verify emitted model assets and application bundle.
- [ ] Capture a desktop hero image and inspect model framing, embedded materials, leaf density, and text overlap.
- [ ] Record evidence in `design-qa.md`, refresh the deliverable ZIP, and commit the exact validated source.
- [ ] Package and publish the validated build through Sites, wait for successful deployment, and open the deployed URL.
