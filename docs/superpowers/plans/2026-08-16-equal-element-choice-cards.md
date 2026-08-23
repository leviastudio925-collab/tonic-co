# Equal Element Choice Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all five element-preference cards equal squares and reduce their internal labels without changing selection behavior or other interface typography.

**Architecture:** Keep the existing HTML and solve the root cause at the CSS grid boundary using zero-minimum equal tracks and zero-minimum labels. Extend the existing Playwright assessment flow with computed geometry and typography assertions, then rebuild and republish the same Sites project.

**Tech Stack:** CSS Grid, Playwright, Vitest, Vite, OpenAI Sites.

## Global Constraints

- Use five equal tracks: `repeat(5, minmax(0, 1fr))`.
- Keep every card square, full-width, and separated by the existing 10px gap.
- Main names use Avenir Next World at `clamp(24px, 2.2vw, 34px)`.
- Small repeated names use `8px`.
- Keep selection, focus, content, scoring, other grids, headings, model rendering, and desktop-only scope unchanged.

---

### Task 1: Reproduce and Fix Unequal Element Cards

**Files:**
- Modify: `tests/app-flow.spec.ts`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: existing `.element-grid`, `.element-grid label`, `.element-grid span`, and `.element-grid small` markup.
- Produces: five equal square cards with bounded text at the 1440×900 desktop test viewport.

- [ ] **Step 1: Add failing geometry and typography assertions**

Before completing the assessment in the primary Playwright flow, add:

```ts
const cards = page.locator('.element-grid label');
await expect(cards).toHaveCount(5);
const metrics = await cards.evaluateAll((nodes) => nodes.map((node) => {
  const card = node.querySelector('span')!;
  const mainText = card.firstChild as Text;
  const range = document.createRange();
  range.selectNode(mainText);
  const box = card.getBoundingClientRect();
  const textBox = range.getBoundingClientRect();
  return {
    width: box.width,
    height: box.height,
    fontSize: parseFloat(getComputedStyle(card).fontSize),
    smallSize: parseFloat(getComputedStyle(card.querySelector('small')!).fontSize),
    textInside: textBox.left >= box.left && textBox.right <= box.right,
  };
}));
expect(Math.max(...metrics.map((item) => item.width)) - Math.min(...metrics.map((item) => item.width))).toBeLessThanOrEqual(1);
expect(Math.max(...metrics.map((item) => item.height)) - Math.min(...metrics.map((item) => item.height))).toBeLessThanOrEqual(1);
expect(metrics.every((item) => Math.abs(item.width - item.height) <= 1)).toBe(true);
expect(metrics.every((item) => item.fontSize <= 34 && item.smallSize === 8 && item.textInside)).toBe(true);
```

- [ ] **Step 2: Run the focused browser test and verify failure**

Run: `pnpm exec playwright test tests/app-flow.spec.ts`

Expected: FAIL because current card widths/heights differ and main text computes to 48px.

- [ ] **Step 3: Apply the minimal CSS root-cause fix**

Append scoped overrides after the current form styles:

```css
.element-grid {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.element-grid label {
  min-width: 0;
}

.element-grid span {
  width: 100%;
  aspect-ratio: 1;
  white-space: nowrap;
  font-size: clamp(24px, 2.2vw, 34px);
}

.element-grid small {
  font-size: 8px;
}
```

- [ ] **Step 4: Run the browser test and verify pass**

Run: `pnpm exec playwright test tests/app-flow.spec.ts`

Expected: all browser tests PASS with equal-card and text-bound assertions.

- [ ] **Step 5: Commit the tested fix**

```bash
git add src/styles.css tests/app-flow.spec.ts
git commit -m "fix: align element preference cards"
```

---

### Task 2: Verify and Publish

**Files:**
- Refresh: `outputs/tonic-five-elements-3d-project.zip`
- Refresh: `outputs/tonic-sites-build.tar.gz`
- Use: `.openai/hosting.json`

**Interfaces:**
- Consumes: committed source HEAD and the production `dist/` build.
- Produces: a new version of the existing private Sites deployment.

- [ ] **Step 1: Run full verification**

Run: `pnpm test`, `pnpm run test:e2e`, and `pnpm run build`.

Expected: zero test failures and a successful Vite production build.

- [ ] **Step 2: Perform desktop visual QA**

Capture the element-preference row at 1440×900. Confirm all cards share identical top, bottom, left-to-right spacing, and square dimensions; confirm all main and small labels are centered and clear of borders.

- [ ] **Step 3: Refresh archives**

Stage the current `dist/` with the existing Sites worker and hosting manifest, refresh `outputs/tonic-sites-build.tar.gz`, and rebuild `outputs/tonic-five-elements-3d-project.zip` from current project source.

- [ ] **Step 4: Publish the exact committed source**

Push current HEAD to the configured Sites source branch, save one version using the exact full commit SHA and refreshed archive, deploy privately, and poll until the deployment succeeds or fails.

- [ ] **Step 5: Record final state**

Run: `git status --short` and `git log -1 --oneline`.

Expected: clean working tree with the card-alignment commit at HEAD.
