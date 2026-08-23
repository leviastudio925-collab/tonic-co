# Lower Pentagon Draw Rotation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Slow the final draw and rotate only the verified lower five-sided assembly while the building root remains stationary.

**Architecture:** Keep the GLB node manifest as the ownership boundary for the lower assembly. Export immutable draw-motion settings for unit verification, and disable root idle motion at the start of `rotateTo` before animating only `rotatingGroup`.

**Tech Stack:** TypeScript, Three.js, GSAP, Vitest, Playwright, Vite

## Global Constraints

- Rotate only `MODEL_MANIFEST.rotatingNodeNames` during a draw.
- Use three forward turns over seven seconds with a short reverse wind-up.
- Preserve orbit drag controls, scoring, textures, lighting, and layout.

---

### Task 1: Lock the draw-motion contract

**Files:**
- Modify: `src/scene/modelManifest.ts`
- Modify: `tests/modelManifest.test.ts`

**Interfaces:**
- Produces: `DRAW_MOTION` with `turns`, `duration`, `windUp`, and `windUpDuration` numeric fields.

- [ ] Write a failing unit test asserting three turns, seven-second duration, and a smaller positive wind-up duration.
- [ ] Run `pnpm test tests/modelManifest.test.ts` and confirm failure because `DRAW_MOTION` is missing.
- [ ] Export the minimal immutable `DRAW_MOTION` configuration.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Stop root motion during the lower-assembly draw

**Files:**
- Modify: `src/scene/ModelController.ts`
- Modify: `tests/modelManifest.test.ts`

**Interfaces:**
- Consumes: `DRAW_MOTION` from `modelManifest.ts`.
- Produces: `rotateTo(element)` that pauses automatic root rotation and animates only `rotatingGroup`.

- [ ] Add a failing source-contract test proving `rotateTo` disables root auto-rotation and reads all animation values from `DRAW_MOTION`.
- [ ] Run the focused test and confirm the expected failure.
- [ ] Add an `autoRotateRoot` flag, set it false at draw start, and replace hard-coded turns/durations with `DRAW_MOTION`.
- [ ] Run all unit tests and confirm they pass.

### Task 3: Browser and build verification

**Files:**
- Modify: `design-qa.md`
- Refresh: `outputs/tonic-five-elements-3d-project.zip`

**Interfaces:**
- Consumes: the completed model controller behavior.
- Produces: verified preview and updated deliverable archive.

- [ ] Run `pnpm run test:e2e` and complete the assessment/draw/result flow.
- [ ] Run `pnpm run build` and confirm a successful production bundle.
- [ ] Inspect the browser console and visual result, then record the verification in `design-qa.md`.
- [ ] Refresh the downloadable ZIP and commit the implementation.
