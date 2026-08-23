# Tonic.co Five Elements Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a desktop-first immersive Three.js website that presents the Tonic.co building, collects a lightweight five-elements assessment, performs a weighted real-time draw through the rotating lower structure, and displays an actionable result.

**Architecture:** A Vite single-page application owns the document flow while focused modules own assessment, draw state, 3D rendering, model control, scroll transitions, and results. Pure scoring and draw logic are tested independently with Vitest; browser-facing modules communicate through explicit events and a small application controller. The GLB is inspected before scene integration so the rotating group and five stopping angles are based on actual node evidence.

**Tech Stack:** Vite, TypeScript, Three.js, GSAP with ScrollTrigger, Vitest, Playwright, CSS, sessionStorage

## Global Constraints

- Desktop-first only; do not build a dedicated mobile layout or mobile performance profile.
- Keep the experience purely client-side with no account, database, backend, analytics, or personal-data network submission.
- Treat the assessment as an artistic lifestyle experience, not professional fortune telling or a complete BaZi calculation.
- Preserve the Tonic.co black/red visual identity and existing model materials.
- Use the real Metal and Wood cards; use clearly identified local temporary cards for Water, Fire, and Earth.
- The animation result must be locked before rotation starts; never randomize again when the animation ends.
- If WebGL/model loading fails, retain the assessment and two-dimensional draw using `cover3.png`.
- Do not claim faithful Kage comparison until the reference and local prototype have both been captured in an approved browser.

---

## Planned File Structure

```text
.
├── index.html                         # Application shell and metadata
├── package.json                       # Scripts and pinned dependencies
├── tsconfig.json                      # TypeScript configuration
├── vite.config.ts                     # Vite and Vitest configuration
├── public/
│   ├── models/building.glb            # Web model copied from 1.glb
│   └── images/
│       ├── cover.png                  # Static WebGL/model fallback
│       └── cards/
│           ├── metal.jpg              # Supplied formal card
│           ├── wood.jpg               # Supplied formal card
│           ├── water.svg              # Temporary local card
│           ├── fire.svg               # Temporary local card
│           ├── earth.svg              # Temporary local card
│           └── advice-placeholder.svg # Temporary suggestion artwork
├── scripts/
│   └── inspect-glb.mjs                 # Reports node hierarchy and bounds
├── src/
│   ├── main.ts                         # Composition root
│   ├── styles.css                      # Desktop layout and visual tokens
│   ├── app/AppController.ts            # Flow and event orchestration
│   ├── assessment/questions.ts         # Question and answer definitions
│   ├── assessment/scoring.ts           # Pure score calculation
│   ├── assessment/types.ts             # Shared five-element types
│   ├── draw/weightedDraw.ts             # Pure weighted random draw
│   ├── results/content.ts               # Result copy and asset mapping
│   ├── scene/Scene.ts                   # Renderer, camera, lights and fallback
│   ├── scene/ModelController.ts         # Model loading and rotating assembly
│   ├── scene/modelManifest.ts           # Verified node names and stop angles
│   ├── scene/ScrollController.ts        # GSAP scroll/camera transitions
│   ├── state/SessionState.ts            # sessionStorage adapter
│   └── ui/
│       ├── AssessmentView.ts            # Form rendering and validation
│       ├── DrawView.ts                  # Draw controls and status
│       └── ResultView.ts                # Result and advice rendering
├── tests/
│   ├── scoring.test.ts
│   ├── weightedDraw.test.ts
│   ├── sessionState.test.ts
│   └── app-flow.spec.ts
└── design-qa.md                         # Blocking visual QA report
```

### Task 1: Project foundation and verified asset intake

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/styles.css`
- Create: `public/models/building.glb`
- Create: `public/images/cover.png`
- Create: `public/images/cards/metal.jpg`
- Create: `public/images/cards/wood.jpg`
- Create: `public/images/cards/water.svg`
- Create: `public/images/cards/fire.svg`
- Create: `public/images/cards/earth.svg`
- Create: `public/images/cards/advice-placeholder.svg`

**Interfaces:**
- Consumes: supplied files at the exact `G:/portfolio/学生LIST/25FALL/丁云菲/项目四/` paths.
- Produces: `npm run dev`, `npm run build`, `npm test`, local asset URLs under `/models` and `/images`.

- [ ] **Step 1: Initialize version control and add ignore rules**

Run:

```powershell
git init
```

Create `.gitignore` with `node_modules/`, `dist/`, `.vite/`, `playwright-report/`, and `test-results/`.

- [ ] **Step 2: Create the Vite/TypeScript configuration**

Use scripts `dev: vite`, `build: tsc --noEmit && vite build`, `test: vitest run`, and `test:e2e: playwright test`. Add runtime dependencies `three` and `gsap`; add development dependencies `@playwright/test`, `@types/three`, `typescript`, `vite`, and `vitest`.

- [ ] **Step 3: Copy supplied assets without modifying the source files**

Copy the GLB and three images to the planned public paths. Confirm SHA-256 hashes and byte sizes before and after copying. Create three clearly marked temporary SVG cards with the same black-on-warm-white visual family and a visible `TEMPORARY CARD` footer; create one abstract five-color advice placeholder SVG.

- [ ] **Step 4: Add a minimal shell and smoke entry point**

`index.html` must include `#app`, a loading region, and a `noscript` message. `src/main.ts` must render a temporary `TONIC.CO` heading only; `src/styles.css` must set a black background, white text, `color-scheme: dark`, and full-viewport body.

- [ ] **Step 5: Install and verify**

Run:

```powershell
pnpm install
pnpm test
pnpm run build
```

Expected: zero test failures and a successful Vite production build.

- [ ] **Step 6: Commit**

```powershell
git add .gitignore package.json tsconfig.json vite.config.ts index.html src public
git commit -m "chore: scaffold tonic five elements experience"
```

### Task 2: Inspect the GLB and define the rotating assembly contract

**Files:**
- Create: `scripts/inspect-glb.mjs`
- Create: `src/scene/modelManifest.ts`
- Create: `tests/modelManifest.test.ts`

**Interfaces:**
- Consumes: `public/models/building.glb`.
- Produces: `MODEL_MANIFEST` with `rotatingNodeNames: string[]`, `pivot: [number, number, number]`, and `stopAngles: Record<Element, number>`.

- [ ] **Step 1: Write a failing manifest test**

Test that `rotatingNodeNames` is non-empty, every pivot component is finite, and the stop-angle keys are exactly `metal`, `wood`, `water`, `fire`, `earth`. Test that all stop angles are finite and unique modulo `2π`.

- [ ] **Step 2: Run the focused test**

Run `pnpm vitest run tests/modelManifest.test.ts`.

Expected: FAIL because `src/scene/modelManifest.ts` does not exist.

- [ ] **Step 3: Implement GLB inspection**

The script must parse the GLB JSON chunk, print each node index/name/parent/children/mesh/translation/rotation/scale, list mesh primitive material indices, and write no files. Run it against the copied GLB and save the relevant observations in comments inside `modelManifest.ts`.

- [ ] **Step 4: Verify the rotating object in Blender if GLB hierarchy is ambiguous**

Open the supplied `.blend` read-only, identify the five-sided lower assembly, confirm its object names and pivot, then export a corrected GLB only if necessary. Never overwrite the supplied Blender or GLB files. Re-run the inspector after any corrected export.

- [ ] **Step 5: Populate the manifest from evidence**

Define:

```ts
export type Element = 'metal' | 'wood' | 'water' | 'fire' | 'earth';

export interface ModelManifest {
  rotatingNodeNames: string[];
  pivot: [number, number, number];
  stopAngles: Record<Element, number>;
}
```

Populate exact node names, measured pivot, and five measured face angles. Do not guess node names or angles.

- [ ] **Step 6: Run tests and commit**

Run `pnpm vitest run tests/modelManifest.test.ts && pnpm run build`.

Expected: PASS and successful build.

```powershell
git add scripts/inspect-glb.mjs src/scene/modelManifest.ts tests/modelManifest.test.ts public/models/building.glb
git commit -m "feat: define verified rotating model assembly"
```

### Task 3: Assessment scoring and weighted draw engine

**Files:**
- Create: `src/assessment/types.ts`
- Create: `src/assessment/questions.ts`
- Create: `src/assessment/scoring.ts`
- Create: `src/draw/weightedDraw.ts`
- Create: `tests/scoring.test.ts`
- Create: `tests/weightedDraw.test.ts`

**Interfaces:**
- Consumes: `AssessmentAnswers { birthDate: string; stateAnswers: Element[]; preference: Element }`.
- Produces: `calculateWeights(answers): ElementWeights` and `drawElement(weights, random?): Element`.

- [ ] **Step 1: Write failing scoring tests**

Cover spring→wood, summer→fire, autumn→metal, winter→water, a month-end soil bonus, five state answers contributing 50%, preference contributing 15%, normalized values summing to `1`, and invalid dates throwing `AssessmentValidationError`.

- [ ] **Step 2: Run scoring tests and confirm failure**

Run `pnpm vitest run tests/scoring.test.ts`.

Expected: FAIL because scoring modules do not exist.

- [ ] **Step 3: Implement the assessment types, questions, and scoring**

Use a fixed `ELEMENTS` tuple and an `ElementWeights` record. Split raw contributions into date `0.35`, state `0.50`, preference `0.15`, then normalize. Keep question copy exactly as approved in the design spec.

- [ ] **Step 4: Write failing draw tests**

Inject deterministic random values. Assert that `0` selects the first cumulative bucket, values near `1` select the last bucket, every element receives a minimum probability of `0.05`, and input weights are not mutated.

- [ ] **Step 5: Implement the weighted draw**

Export:

```ts
export function drawElement(
  weights: ElementWeights,
  random: () => number = Math.random,
): Element;
```

Clamp each raw probability to at least `0.05`, renormalize, calculate a cumulative distribution in `ELEMENTS` order, and return the final element as a floating-point safety fallback.

- [ ] **Step 6: Run tests and commit**

Run `pnpm vitest run tests/scoring.test.ts tests/weightedDraw.test.ts`.

Expected: PASS.

```powershell
git add src/assessment src/draw tests/scoring.test.ts tests/weightedDraw.test.ts
git commit -m "feat: add five elements assessment and weighted draw"
```

### Task 4: Session state and semantic document flow

**Files:**
- Create: `src/state/SessionState.ts`
- Create: `src/ui/AssessmentView.ts`
- Create: `src/ui/DrawView.ts`
- Create: `src/ui/ResultView.ts`
- Create: `src/results/content.ts`
- Create: `tests/sessionState.test.ts`
- Modify: `index.html`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: scoring/draw types and result element.
- Produces: `SessionState.load/save/clear`, view events `assessment:submit`, `draw:start`, `draw:again`, `assessment:restart`.

- [ ] **Step 1: Write failing session-state tests**

Use an in-memory `Storage` double. Test round-trip save/load, malformed JSON returning `null`, schema-version mismatch returning `null`, and storage exceptions falling back to in-memory state.

- [ ] **Step 2: Run the focused tests**

Run `pnpm vitest run tests/sessionState.test.ts`.

Expected: FAIL because the adapter does not exist.

- [ ] **Step 3: Implement session storage**

Store a versioned payload under `tonic-five-elements:v1`. The payload contains only assessment answers, normalized weights, locked result, and flow step. Do not persist telemetry, user agent, IP-derived data, or timestamps.

- [ ] **Step 4: Build semantic page sections**

Create `hero`, `assessment`, `draw`, and `result` sections with accessible labels, fieldsets, legends, buttons, validation messages, and an `aria-live="polite"` draw-status region. The date field and every question are required.

- [ ] **Step 5: Implement result content**

Provide each element with Chinese/English labels, exactly three keywords, one concise explanation, exactly three actionable suggestions, accent color, card URL, and the shared advice placeholder URL. Include the artistic-experience disclaimer near the form and results.

- [ ] **Step 6: Style the desktop flow**

Create CSS tokens for black, warm white, Tonic red, and five accent colors. Use a restrained editorial layout, strong focus styles, a maximum readable line length, and no dedicated mobile breakpoint. Add a narrow-window safeguard that stacks overlapping columns below `900px` without claiming mobile optimization.

- [ ] **Step 7: Run tests and commit**

Run `pnpm test && pnpm run build`.

Expected: PASS and successful build.

```powershell
git add index.html src/state src/ui src/results src/styles.css tests/sessionState.test.ts
git commit -m "feat: add assessment and result document flow"
```

### Task 5: Three.js scene, model interaction, and fallback

**Files:**
- Create: `src/scene/Scene.ts`
- Create: `src/scene/ModelController.ts`
- Modify: `src/main.ts`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `MODEL_MANIFEST`, `/models/building.glb`, `/images/cover.png`.
- Produces: `Scene.start()`, `Scene.dispose()`, `ModelController.rotateTo(element): Promise<void>`, and progress/error events.

- [ ] **Step 1: Implement the scene shell**

Create a WebGL renderer with capped desktop pixel ratio, perspective camera, deep-red fog, hemisphere fill, red area/point key light, warm rim light, and an animation loop. Mount one fixed canvas behind the document.

- [ ] **Step 2: Implement loading and fallback states**

Use `GLTFLoader` progress callbacks to update the visible percentage. On loader or WebGL failure, replace the canvas region with `cover.png`, add a `scene-fallback` class, and dispatch `scene:fallback`; do not disable form modules.

- [ ] **Step 3: Implement model normalization and observation controls**

Compute a `Box3`, center the model, scale it to a target world height, set a stable camera distance, and add damped `OrbitControls`. Disable panning, clamp polar angle and distance, and resume subtle auto-rotation after pointer interaction ends.

- [ ] **Step 4: Implement the verified rotating group**

Resolve every `MODEL_MANIFEST.rotatingNodeNames` value; fail visibly if any verified name is absent. Re-parent those nodes under one pivot group while preserving world transforms. `rotateTo(element)` must apply a short reverse wind-up, several full turns, and an eased stop at `stopAngles[element]`.

- [ ] **Step 5: Add result lighting transitions**

Expose `setResultAccent(element)` and tween light colors/intensity to the approved element accents without removing the red base lighting.

- [ ] **Step 6: Verify and commit**

Run `pnpm run build`, then open the local preview and verify loading percentage, centered model, drag, limited zoom, auto-rotation recovery, fallback simulation, and all five stop angles.

```powershell
git add src/scene src/main.ts src/styles.css
git commit -m "feat: add immersive building scene and rotating draw mechanism"
```

### Task 6: Scroll choreography and application orchestration

**Files:**
- Create: `src/scene/ScrollController.ts`
- Create: `src/app/AppController.ts`
- Modify: `src/main.ts`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: UI events, `calculateWeights`, `drawElement`, `ModelController.rotateTo`, `SessionState`.
- Produces: one deterministic application flow from assessment through result.

- [ ] **Step 1: Implement scroll choreography**

Register GSAP ScrollTrigger. Fade hero text, strengthen red light, move the camera toward the lower assembly, and park the model behind/alongside assessment content. Respect `prefers-reduced-motion` by using immediate state changes and no scrubbed camera animation.

- [ ] **Step 2: Implement the controller state machine**

Use states `hero`, `assessment`, `ready`, `drawing`, and `result`. On valid submission, calculate and save weights. On draw start, call `drawElement` once, save the locked result, disable the button, await `rotateTo`, apply result accent, render the result, then move to `result`.

- [ ] **Step 3: Implement repeat and restart behavior**

`draw:again` uses saved weights but generates a new locked result. `assessment:restart` clears answers/result, returns to `assessment`, restores red base lighting, and focuses the date field.

- [ ] **Step 4: Restore a saved session**

On boot, rehydrate the form and last completed flow state. If the saved state is `drawing`, restore it as `ready` so a refresh cannot imply an animation completed.

- [ ] **Step 5: Verify and commit**

Run `pnpm test && pnpm run build`, then manually verify every transition including invalid submission, repeated draw, restart, refresh, and reduced motion.

```powershell
git add src/app src/scene/ScrollController.ts src/main.ts src/styles.css
git commit -m "feat: orchestrate scroll assessment draw and result flow"
```

### Task 7: End-to-end tests and production hardening

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/app-flow.spec.ts`
- Modify: `package.json`
- Modify: `src/**/*.ts` only where tests expose defects

**Interfaces:**
- Consumes: complete local application.
- Produces: repeatable desktop browser verification.

- [ ] **Step 1: Write the desktop happy-path test**

At `1440×900`, load the page, wait for scene-ready or fallback, scroll to assessment, enter a fixed birth date, answer all five questions, choose a preference, submit, start the draw, wait for the result, and assert a result heading plus three suggestions are visible.

- [ ] **Step 2: Write validation and persistence tests**

Assert incomplete submission shows a validation message. Complete the form, reload, and assert fields restore. Trigger restart and assert the stored payload is cleared.

- [ ] **Step 3: Write a deterministic-result browser test**

Before app scripts run, replace `Math.random` with a fixed function. Assert the visible result matches the cumulative bucket expected from the entered answers and the draw cannot be triggered twice during animation.

- [ ] **Step 4: Run and fix**

Run:

```powershell
pnpm test
pnpm run test:e2e
pnpm run build
```

Expected: all unit and end-to-end tests pass, and the production build succeeds.

- [ ] **Step 5: Inspect network and console behavior**

Verify that form submission generates no personal-data request, all assets are local, no source-site assets are hotlinked, and the console has no uncaught error during happy path, repeat draw, restart, or fallback.

- [ ] **Step 6: Commit**

```powershell
git add playwright.config.ts tests package.json src
git commit -m "test: verify complete five elements experience"
```

### Task 8: Visual comparison, design QA, and preview handoff

**Files:**
- Create: `design-qa.md`
- Modify: visual implementation files only when QA identifies a concrete mismatch

**Interfaces:**
- Consumes: source reference evidence, Blender render, supplied cards, and running local prototype.
- Produces: `design-qa.md` with `final result: passed` or an explicit blocked reason.

- [ ] **Step 1: Start the persistent local preview**

Run the Vite development server on an available fixed port and keep it running for handoff.

- [ ] **Step 2: Capture the reference if browser access is available**

Capture the Kage reference at desktop size, including initial state, scroll behavior, typography, camera interaction, loading treatment, and visible controls. If access remains unavailable, record the exact blocker and do not label the build a faithful clone.

- [ ] **Step 3: Capture the local experience**

Capture hero, assessment, drawing, Metal result, Wood result, one temporary-card result, narrow desktop, reduced-motion, and model-fallback states. Test drag, limited zoom, scrolling, form validation, repeat draw, and restart.

- [ ] **Step 4: Write and iterate the QA report**

Record evidence, severity, location, expected behavior, observed behavior, and fix for every issue. Fix all P0/P1/P2 findings, recapture affected states, and repeat until the document ends with `final result: passed`. Remaining P3 polish may be listed as follow-up notes.

- [ ] **Step 5: Run final verification**

Run `pnpm test`, `pnpm run test:e2e`, and `pnpm run build` from a clean working tree. Confirm the preview still runs from the exact delivered source.

- [ ] **Step 6: Commit and hand off**

```powershell
git add design-qa.md src public tests
git commit -m "chore: complete visual QA and preview handoff"
```

Provide the local preview URL and clearly identify the temporary Water, Fire, Earth, and advice graphics that should be replaced later.
