# Tonic.co Five Elements Experience — Design QA

## Evidence

- Source visual truth: `G:/portfolio/学生LIST/25FALL/丁云菲/项目四/cover3.png`
- Source supporting cards: `G:/portfolio/学生LIST/25FALL/丁云菲/项目四/属性-04.jpg`, `属性-05.jpg`
- Implementation URL: `http://127.0.0.1:4173/`
- Implementation screenshots:
  - `outputs/hero-english-asterone.png`
  - `outputs/hero-final.png`
  - `outputs/qa-assessment.png`
  - `outputs/qa-result.png`
- Source pixels: 1920 × 1080.
- Implementation pixels: 1440 × 900 at CSS viewport 1440 × 900 and device scale factor 1.
- Normalization: compared as desktop full-view compositions rather than pixel-identical crops. The source is a cinematic 16:9 Blender render; the implementation is a 16:10 interactive viewport with intentionally different black-stage framing.
- States: hero idle, assessment form, weighted draw completion, Wood result.

## Full-view comparison

The source and implementation were opened in one comparison input. The implementation preserves the central vertical architecture, deep black/red palette, metallic red highlights, high-contrast circular/structural rhythm, and large areas of negative space. It intentionally replaces the source's full red environment and foreground roof silhouette with a black digital exhibition stage and editorial interface, matching the approved “Kage-style black exhibition + Tonic red lighting” direction rather than duplicating the Blender frame.

## Focused-region comparison

- Assessment: inspected `outputs/qa-assessment.png`; headings, five-column answer controls, borders, red selection language, and persistent model background are readable and visually consistent.
- Result: inspected `outputs/qa-result.png`; the supplied Wood card remains sharp and unmodified, the green result accent is restrained, three recommendations are visible, and model/background contrast remains adequate.
- No separate focused hero crop was required because model lighting, navigation, title, and scroll affordance are all readable in the full 1440 × 900 capture.

## Required fidelity surfaces

- Fonts and typography: modern sans-serif UI, oversized Chinese display heading, wide-tracked microcopy, clear hierarchy, and appropriate optical contrast. No clipping in the tested desktop viewport.
- Spacing and layout rhythm: model remains central; title and metadata balance the left/right negative space. Assessment uses a stable two-column desktop grid; result uses balanced copy/card columns.
- Colors and tokens: near-black base, Tonic red key light, warm-white text, and result-specific accent colors. Contrast passed visual inspection.
- Image quality and asset fidelity: GLB is rendered live. Supplied Metal and Wood JPGs are used directly. Water, Fire, Earth, and advice art are explicitly labeled temporary local assets; no remote or hotlinked imagery is used.
- Copy and content: all approved questions, the artistic-experience disclaimer, five result explanations, and three recommendations per result are present.

## Interaction and technical checks

- Primary interactions tested: model load, canvas rendering, assessment validation, all required input groups, weighted draw, result reveal, three suggestions, reload restoration, and restart clearing.
- Automated browser flow: 3 Playwright scenarios passed in Edge at 1440 × 900.
- Unit tests: 19 passed.
- Browser console: checked after hero, assessment, draw, and result; no errors or warnings remained.
- WebGL state: one `.scene-canvas`, zero `.scene-fallback` in the verified run.
- Production build: passed.

## Comparison history

1. Earlier finding — P1: the first implementation fell back to `cover3.png` because GLTFLoader removed punctuation from Blender node names.
   - Fix: added tested runtime-name conversion and resolved the verified `.003` rotating group using actual loader names.
   - Post-fix evidence: `outputs/hero-live.png`; browser inspection reported one canvas and no fallback.
2. Earlier finding — P2: the large hero title was below the first viewport because content aligned to the bottom of a 130vh section.
   - Fix: centered hero content vertically while retaining the longer scroll section.
   - Post-fix evidence: `outputs/hero-final.png`; title, metadata, model, and scroll cue are visible together.
3. Earlier finding — P2: temporary SVG textures produced WebGL texture warnings.
   - Fix: only the supplied Metal and Wood raster cards are bound to live model surfaces; temporary SVG cards remain in the two-dimensional result view.
   - Post-fix evidence: final browser inspection recorded only Vite connection debug messages.
4. Requested revision: converted all live interface copy to English, changed the hero display title to `TONIC.CO`, and embedded Asterone DEMO as the interface typeface.
   - Verification: Playwright asserts the hero title, absence of CJK characters in live body text, and computed `Asterone` font family.
   - Post-fix evidence: `outputs/hero-english-asterone.png`; no title overflow at 1440 × 900 and the browser console remains clean.
5. Requested typography refinement: limited Asterone to the hero `TONIC.CO` title and moved all other live interface text to Avenir Next World.
   - Implementation: embedded Avenir Next World at weights 200, 400, 500, 600, 800, and 900 plus regular italic.
   - Verification: Playwright confirms the hero computed font contains `Asterone` and the body computed font contains `Avenir Next World`.
   - Post-fix evidence: `outputs/hero-asterone-avenir.png`; hierarchy remains clear and no browser warnings are present.
6. Requested overlap correction: separated the hero eyebrow, title, supporting copy, and scroll cue into explicit vertical zones; added an opaque blurred navigation surface so scrolling questions cannot visually collide with header text; reduced and wrapped long assessment options.
   - Verification: hero element collision assertions pass in Playwright.
   - Post-fix evidence: `outputs/hero-no-overlap.png` and `outputs/assessment-no-overlap.png`.

## Findings

- No actionable P0, P1, or P2 findings remain.
- P3 — Initial auto-rotation can briefly present a less detailed fabric side of the model. This is acceptable for an interactive object that continuously rotates and supports drag control; a future art-direction pass could set a photographed hero angle after the final five card textures exist.
- P3 — The Three.js application bundle is approximately 740 kB before gzip. It remains about 208 kB gzip and loads successfully locally; optional route/module splitting could further polish first load.

## Open questions

- Final Water, Fire, Earth, and five-element advice graphics are still external design deliverables and must replace the clearly marked placeholders later.
- Direct Kage reference capture was unavailable through the approved in-app browser connection. This QA therefore verifies the approved Tonic.co visual direction against the supplied Blender render and does not claim pixel-level Kage replication.

## Implementation checklist

- [x] Live GLB centered in the desktop hero.
- [x] Black/red immersive lighting and restrained bloom.
- [x] Required assessment inputs and validation.
- [x] Weighted result locked before animation.
- [x] Independent lower assembly rotation.
- [x] Supplied Metal/Wood cards and explicit temporary assets.
- [x] Session-only persistence with no personal-data network request.
- [x] Static fallback retained for model/WebGL failure.
- [x] Automated tests, console inspection, build, and screenshots completed.

## Follow-up polish

- Replace the three temporary element cards and advice artwork when final files are supplied.
- Re-tune the hero camera and exact stop angles after all five permanent card faces are available.
- Capture and compare the Kage reference if the approved in-app browser connection becomes available.

## Lighting and texture verification — 2026-08-10

- Raised hemisphere illumination, warm front fill, and tone-mapping exposure while retaining the black/red atmosphere.
- Verified the updated hero in `outputs/hero-brighter-light.png`; the model loads through WebGL with no fallback or console errors.
- Inspected the source GLB: all 154 mesh primitives contain `TEXCOORD_0` UV coordinates, including every five-element card face.
- The GLB currently embeds zero image textures; supplied Metal and Wood raster artwork is assigned at runtime. Water, Fire, and Earth can be added by the same path when final raster assets arrive.

## Lower pentagon draw verification — 2026-08-10

- Whole-building idle rotation stops when the draw starts, keeping the roof, banners, and scaffold stationary.
- Only the verified `.003` lower five-sided assembly receives the GSAP draw rotation.
- Draw motion now uses three turns over seven seconds, plus a 0.42-second reverse wind-up and eased stop.
- Verification: 22 unit tests passed, 3 browser flows passed, and the production build completed successfully.

## Replacement model and falling leaves — 2026-08-11

- Replaced the tower with the supplied `6.glb` copy and preserved its 13 embedded images, 13 textures, and 9 authored materials.
- Updated the lower pentagon pivot to Z `0.06912755966186523` and mapped the replacement export's `平面.003_Baked` node.
- Removed the old runtime Metal/Wood material override so the replacement GLB remains visually authoritative.
- Added 16 low-density instanced 3D leaves with outer-third placement, depth variation, continuous wrapping, and reduced-motion behavior.
- Reproduced and fixed the local fallback issue caused by the renamed baked plane node.
- Verification: 27 unit tests passed, 3 browser flows passed, production build succeeded, WebGL canvas loaded with no fallback or console errors.
- Visual evidence: `outputs/hero-new-model-leaves.png`.

final result: passed
