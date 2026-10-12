# Design: Wedding Ring Drawing

Spec: `spec.md` · Plan: `plan.md` · Research: `research.md` · Data: `data-model.md` · Contracts: none (single area)

## 1. Approach

Planned (not yet built). Add a second guide drawing, a diamond wedding ring, to the left of Cinnamoroll on the Game board, following the 001 as-built pattern. New: `RingDrawing.js` (stroke data, 400x280 viewbox), `drawRing.js` (self-contained draw routine), `RingGuide.jsx/.css` (own canvas, gate, rAF loop, resize; mirrors `GameLoader`), and `GameGuides.jsx/.css` (an absolute, input-transparent flex row with `<RingGuide/>` then `<GameLoader/>` in two equal slots). Reused unchanged and never edited: `useLoadingGate`, `usePrefersReducedMotion`, `TIMING` (read-only import). Cinnamoroll files (`drawCinnamoroll.js`, `CinnamorollDrawing.js`, `GameLoader.jsx/.css`) stay byte-untouched. Only existing file edited: `Game.jsx` swaps `<GameLoader />` for `<GameGuides />`. Routing, Navbar, other pages and the freehand board logic are untouched. No new dependencies.

## 2. Key decisions

| Decision | Choice | Why / trade-off |
|----------|--------|-----------------|
| Canvas topology | One canvas per drawing, separate components | Independent failure (FR-012); Cinnamoroll code path unchanged (FR-011). Trade-off: a duplicated ~60-line effect |
| Draw routine | New `drawRing.js` with its own `prepare` and easing; no `viewbox` param on Cinnamoroll's | User decision at gate 2: Cinnamoroll files byte-untouched. Trade-off: ~40 duplicated lines |
| Sync | Both call `useLoadingGate`; ring imports `TIMING.drawMs` read-only | Same ready signals -> batched commit -> same-frame start; shared duration -> same finish (FR-004/005) |
| Size parity | Ring viewbox 400x280 and the same stage rule as Cinnamoroll (`min(90%, 480px)`, aspect 400/280) | Identical drawn dimensions and scale at every width, by construction |
| Layout | `.game-guides` flex row, two `flex: 1 1 0; min-width: 0` slots, ring left, Cinnamoroll right | No overlap at any width; shrink together (FR-010, SC-004); no media queries |
| Raise | `.ring-guide__stage { transform: translateY(calc(-1 * var(--ring-raise))) }`, default `--ring-raise: 4%` | Small tunable offset, no layout effect; at or below about 5% stays inside the slot margin (no clip) |
| CSS ownership | Slot override in `GameGuides.css`; `GameLoader.css` untouched | `.game-guides .game-loader` outranks `.game-loader`, turning the absolute layer into a flex item |
| Layering | Wrapper `z-index: 0; pointer-events: none`; freehand canvas keeps `z-index: 1` from `GameLoader.css` | Strokes above both guides, input reaches the board (FR-007) |
| Ring art | Flat front view, silver band with transparent hole, collet, brilliant diamond, 3 sparkles | Recognisable at small sizes (SC-002); cool palette only, no gold (FR-003) |
| Band hole | One path, two opposite-winding circles, nonzero fill | A hole without clipping or compositing; board shows through |
| A11y | Ring `aria-hidden="true"`, no status role | Decorative; avoids a second "loading" announcement |
| Failure | Own `fail()` -> `null`; sibling slot widens | FR-012, edge case "only one can be shown" |
| Clear button | Untouched | Guides are on separate canvases |

## 3. Flow

```text
navigate /game -> App Suspense "Loading..." until chunk (unchanged)
  -> GamePage mounts: Navbar, title, tool bar, board
       .game-board-inner
         <GameGuides/>   absolute flex row, pointer-events none, z 0
            <RingGuide/>  (slot 1, left, raised)   gate B -> canvas B
            <GameLoader/> (slot 2, right)          gate A -> canvas A
         <canvas/>       freehand, z 1
  ready (readyState complete + fonts.ready), both gates resolve in the same tick
     -> both effects: fit canvas, t0 = now, rAF loop, t = now - t0 in [0, drawMs]
     -> t = drawMs: both stop; figures stay (no fade, no unmount)
  cap (12 s from mount) before ready, or reduced motion: each paints its finished figure once
  failure: one component fails -> it returns null; the other is unaffected
  resize/rotate: each ResizeObserver refits its backing store and repaints the held figure
  unmount: each cancels its rAF, disconnects its observer, its gate clears timers/listeners
```

## 4. Key files

Requirement -> key files (grouped):

| Requirements | Key files |
|--------------|-----------|
| FR-001, 002, 003, 006, 015 | `src/data/RingDrawing.js`, `RingGuide.jsx`, `GameGuides.jsx` |
| FR-004, 005, 013, 014 | `RingGuide.jsx` (gate, `TIMING`, reduced motion), `drawRing.js` |
| FR-007, 008, 009 | `GameGuides.css` (layering, input), `Game.jsx` |
| FR-010 | `GameGuides.css`, `RingGuide.css`, `RingGuide.jsx` (resize) |
| FR-011, 012 | Cinnamoroll files untouched, `RingGuide.jsx` (own try/catch), `GameGuides.jsx` |

### 4.1 Core / shared building blocks (frontend)

No shared or existing building block is changed. `useLoadingGate`, `usePrefersReducedMotion` and `TIMING` are consumed as they are.

### 4.2 Features / pages (frontend)

#### Ring drawing data — `src/data/RingDrawing.js`
Schema in [data-model.md](./data-model.md). Paths are illustrative (ring centred at x=200 in a 400x280 box); final tuning is an implementation/review task.
```js
export const RING_VIEWBOX = { w: 400, h: 280 };   // same box as Cinnamoroll => same scale
export const RING_PALETTE = {
  metalFill: "#DDE5EE", metalLine: "#7F93AA", metalShade: "#B7C4D3",
  white: "#FFFFFF", gemFill: "#E4F4FC", gemFacet: "#BFE3F7", sparkle: "#5BC4F2",
};
const P = RING_PALETTE;
// start/end: fractions of TIMING.drawMs (imported by RingGuide); last end = 1.0
export const RING_STROKES = [
  // Band: outer circle clockwise + inner circle counter-clockwise => transparent hole
  { id: "band", start: 0.0, end: 0.42, stroke: P.metalLine, width: 5, fill: P.metalFill,
    d: "M114 178 A86 86 0 1 1 286 178 A86 86 0 1 1 114 178 Z M138 178 A62 62 0 1 0 262 178 A62 62 0 1 0 138 178 Z" },
  { id: "bandShine", start: 0.34, end: 0.5, stroke: P.white, width: 5, fill: null,
    d: "M128 150 A76 76 0 0 1 160 112" },
  { id: "bandShade", start: 0.36, end: 0.52, stroke: P.metalShade, width: 3, fill: null,
    d: "M156 226 A62 62 0 0 0 244 226" },
  // Collet holding the stone, under the diamond
  { id: "collet", start: 0.44, end: 0.58, stroke: P.metalLine, width: 4, fill: P.metalShade,
    d: "M178 90 L222 90 L212 106 L188 106 Z" },
  // Diamond: outline, light facet fill, facet lines
  { id: "gem", start: 0.5, end: 0.74, stroke: P.metalLine, width: 4, fill: P.gemFill,
    d: "M164 52 L182 24 L218 24 L236 52 L200 100 Z" },
  { id: "gemFacetFill", start: 0.68, end: 0.82, stroke: null, width: 0, fill: P.gemFacet,
    d: "M164 52 L192 52 L200 100 Z" },
  { id: "gemLines", start: 0.7, end: 0.88, stroke: P.sparkle, width: 2.5, fill: null,
    d: "M164 52 L236 52 M182 24 L192 52 L200 24 L208 52 L218 24 M192 52 L200 100 L208 52" },
  // Sparkles last: four-point stars, light blue outline, white fill
  { id: "sparkleA", start: 0.8, end: 1.0, stroke: P.sparkle, width: 3, fill: P.white,
    d: "M282 22 Q282 40 300 40 Q282 40 282 58 Q282 40 264 40 Q282 40 282 22 Z" },
  { id: "sparkleB", start: 0.84, end: 1.0, stroke: P.sparkle, width: 3, fill: P.white,
    d: "M122 59 Q122 70 133 70 Q122 70 122 81 Q122 70 111 70 Q122 70 122 59 Z" },
  { id: "sparkleC", start: 0.88, end: 1.0, stroke: P.sparkle, width: 2.5, fill: P.white,
    d: "M306 102 Q306 110 314 110 Q306 110 306 118 Q306 110 298 110 Q306 110 306 102 Z" },
];
```
**Check**: no gold or brown hue; band top (y 92) is covered by the collet and gem tip (y 100); all coordinates stay inside 0..400 x 0..280 so nothing is clipped.
**Specs must assert**:
- Every stroke has `0 <= start < end <= 1`, ids are unique, and the largest `end` is 1.0.
- `RING_STROKES` order is paint order (band first, sparkles last).
- No palette value falls in a gold/yellow/brown hue range.
- `RING_VIEWBOX` equals `{ w: 400, h: 280 }` (size parity with Cinnamoroll).
- `prepare(RING_STROKES)` returns a `Path2D` and a finite `len` for each stroke (`len` may be 0 for fill-only).

#### Ring draw routine — `src/components/game/drawRing.js` — FR-005
```js
import { RING_VIEWBOX as V } from "../../data/RingDrawing";

const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const clamp01 = (x) => Math.min(1, Math.max(0, x));

export function prepareRing(strokes) {            // own copy; Cinnamoroll's prepare() is not imported
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return strokes.map((s) => {
    let len = 0;
    try { svg.setAttribute("d", s.d); len = svg.getTotalLength(); } catch { /* drawn static */ }
    return { ...s, path: new Path2D(s.d), len };
  });
}

export function drawRing(ctx, w, h, t, strokes, drawMs) {
  const k = Math.min(w / V.w, h / V.h);
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.translate((w - V.w * k) / 2, (h - V.h * k) / 2);
  ctx.scale(k, k);
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  for (const s of strokes) {
    const p = ease(clamp01((t / drawMs - s.start) / (s.end - s.start)));
    if (p <= 0) continue;
    if (s.fill) {                                  // fill fades in over the last 30%
      ctx.globalAlpha = clamp01((p - 0.7) / 0.3);
      ctx.fillStyle = s.fill; ctx.fill(s.path);
      ctx.globalAlpha = 1;
    }
    if (s.stroke) {
      ctx.strokeStyle = s.stroke; ctx.lineWidth = s.width;
      ctx.setLineDash(s.len > 0 && p < 1 ? [s.len, s.len] : []);
      ctx.lineDashOffset = s.len * (1 - p);
      ctx.stroke(s.path);
    }
  }
  ctx.restore();
}
```
**Check**: same maths as Cinnamoroll's routine (so the two feel like one scene) but a separate module; no import from any Cinnamoroll file.
**Specs must assert**: `t = 0` paints nothing; `t >= drawMs` paints every stroke at `p = 1`; `len = 0` draws the stroke whole with no dash; a fill-only stroke fades in by alpha and never throws; a square or wide canvas centres the 400x280 box without distortion.

#### Ring guide component — `src/components/game/RingGuide.jsx`
```jsx
import { RING_STROKES } from "../../data/RingDrawing";
import { TIMING } from "../../data/CinnamorollDrawing";      // read-only: shared duration => finish together
import { useLoadingGate } from "../../hook/UseLoadingGate";
import { usePrefersReducedMotion } from "../../hook/UsePrefersReducedMotion";
import { prepareRing, drawRing } from "./drawRing";
import "./RingGuide.css";

const RingGuide = () => {
  const canvasRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const { phase, ready, capped, fail } = useLoadingGate({ minMs: TIMING.minMs, capMs: TIMING.capMs });
  const start = ready || capped;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !start) return;                 // page not loaded yet: draw nothing
    let raf = 0, ro = null;
    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("2d context unavailable");
      const prepared = prepareRing(RING_STROKES);
      const { drawMs } = TIMING;
      let size = { w: 0, h: 0 };
      let t = reduced || !ready ? drawMs : 0;      // reduced motion / cap before load: finished at once
      const t0 = performance.now();
      const paint = () => drawRing(ctx, size.w, size.h, t, prepared, drawMs);
      const fit = () => { /* identical to GameLoader: dpr<=2, setTransform, repaint if t >= drawMs */ };
      fit();
      ro = new ResizeObserver(() => { try { fit(); } catch { fail(); } });
      ro.observe(canvas);
      if (t >= drawMs) paint();
      else {
        const frame = (now) => {
          try { t = Math.max(0, now - t0); paint(); if (t < drawMs) raf = requestAnimationFrame(frame); }
          catch { fail(); }
        };
        raf = requestAnimationFrame(frame);
      }
    } catch { fail(); }                            // never block the game or the sibling drawing
    return () => { cancelAnimationFrame(raf); if (ro) ro.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, start, fail]);                      // ready read once; as a dep it would restart a finished ring

  if (phase === "gone") return null;
  return (
    <div className="ring-guide" aria-hidden="true">
      <div className="ring-guide__stage"><canvas ref={canvasRef} /></div>
    </div>
  );
};
export default RingGuide;
```
CSS (`RingGuide.css`; slot positioning belongs to `GameGuides.css`). The stage rule mirrors `.game-loader__stage` so sizes match:
```css
.ring-guide { --ring-raise: 4%; display: grid; place-items: center; overflow: hidden; pointer-events: none; }
.ring-guide__stage {
  width: min(90%, 480px); aspect-ratio: 400 / 280; max-height: 90%;
  transform: translateY(calc(-1 * var(--ring-raise)));   /* slightly higher than Cinnamoroll; keep <= ~5% */
}
.ring-guide canvas { width: 100%; height: 100%; display: block; }
```
**Check**: no shared mutable state with `GameLoader`; the one cross-import is the read-only `TIMING`.
**Specs must assert**:
- Nothing is drawn before the page is ready; on ready the animation starts at `t = 0` together with Cinnamoroll (both reach `t = drawMs` within one frame).
- Reduced motion: first painted frame is the complete ring; no rAF loop. Cap before ready: complete ring at once.
- After the animation the canvas stays mounted and shows the ring (no fade, no unmount).
- Forced `getContext`/`Path2D` failure inside `RingGuide` only: it renders `null`, Cinnamoroll still animates, no uncaught error, Clear and drawing still work.
- Ring and Cinnamoroll canvases have equal width and height at 320, 360, 640x360, 1280 and 1920; the ring's top edge is above Cinnamoroll's by the raise amount; changing `--ring-raise` moves it without reflow or clipping.
- Resize/orientation change keeps the ring whole and repainted; the container has `pointer-events: none`.
- Not announced: `aria-hidden="true"` present and no `role="status"`.
- Navigating away mid-animation leaves no running rAF or observer.

#### Guides wrapper — `src/components/game/GameGuides.jsx`, `GameGuides.css`
```jsx
import GameLoader from "./GameLoader";
import RingGuide from "./RingGuide";
import "./GameGuides.css";

// Left: ring (slightly raised), right: Cinnamoroll. Each owns its own failure.
const GameGuides = () => (
  <div className="game-guides">
    <RingGuide />
    <GameLoader />
  </div>
);
export default GameGuides;
```
```css
/* Absolute guide row beneath the freehand canvas; never takes input. */
.game-guides { position: absolute; inset: 0; z-index: 0; display: flex; pointer-events: none; }
/* Turn each guide into an equal slot (outranks .game-loader's absolute inset 0). */
.game-guides .game-loader,
.game-guides .ring-guide { position: relative; inset: auto; flex: 1 1 0; min-width: 0; height: 100%; }
```
**Check**: wrapper rect equals `.game-board-inner`; slots are equal at every width; the freehand canvas still measures `.game-board-inner` because the wrapper is absolute.
**Specs must assert**:
- DOM order puts the ring before Cinnamoroll, and the ring's right edge is at or left of Cinnamoroll's left edge at 320, 360, 640x360, 1280 and 1920 widths.
- Wrapper and both slots have `pointer-events: none`; freehand strokes render above both.
- When one guide returns `null`, the other still renders and stays centred in the full row.

### 4.3 Algorithms / business rules

The stroke-by-stroke routine is `drawRing` above (same maths as `specs/001-game-loading-canvas/design.md` 4.3). Ring-specific behaviour:

| Input | Expected |
|-------|----------|
| `t = 0` | Ring canvas empty and transparent |
| `t = 0.45*drawMs` | Band outlined with fill, shine started, gem not yet started |
| `t >= drawMs` (or reduced motion, or cap before ready) | Band, collet, gem, facets and three sparkles complete, `p = 1` |
| `band` `len` measured as 0 | Band appears whole once `p > 0`, no dash, hole still transparent |
| `gemFacetFill` (`stroke: null`) | Fades in by alpha only; never throws |

### 4.4 Routing, config & infra (only where a decision lives)

#### src/components/game/Game.jsx
```jsx
import GameGuides from "./GameGuides";          // replaces: import GameLoader from "./GameLoader";
// ...
<div className="game-board-inner">
  <GameGuides />                              {/* was <GameLoader />; first child, freehand canvas follows */}
  <canvas ref={canvasRef} />
</div>
```
**Check**: only one import and one JSX line change; `App.jsx`, `vite.config.js` base path, Navbar and `Game.css` are untouched. `Game.jsx` has no other pending edits (the working tree shows only `Memory.jsx` modified).

## 5. Data touched

- Static `RING_VIEWBOX`, `RING_PALETTE`, `RING_STROKES` in `src/data/RingDrawing.js`; `TIMING` read from `CinnamorollDrawing.js` — see [data-model.md](./data-model.md). One CSS variable, `--ring-raise`. No storage, network or persisted state.

## 6. Risks, gaps & mismatches

- **Cinnamoroll gets smaller**: it now shares the board, so its stage is `min(90%, 480px)` of half the board instead of the whole board. Look and behaviour are unchanged; accepted at gate 2.
- **Tiny drawings at 320 px**: about 110 px per slot (both drawings about 99x69). Whole and proportional, but the ring's facets and sparkles may be hard to read. With the viewbox shared, the ring art (about 172 units wide) is smaller on screen than Cinnamoroll's width; only its height matches.
- **Raise clipping**: `.ring-guide` clips (`overflow: hidden`); a `--ring-raise` above about 5% can cut the stage top when the stage is height-limited.
- **Band dash length**: if a browser reports only the first subpath in `getTotalLength()`, the inner circle would pop in at the end of the band stroke. Verify on iOS Safari and Firefox; fallback is splitting the band into two strokes and giving only one a fill.
- **Simultaneity**: two independent gates rely on the same signals and React batching; a tiny `t0` offset is imperceptible.
- **Duplicated code**: the canvas effect (~60 lines) and draw routine (~40 lines) are copies by decision; a shared hook can be extracted later.
- **Hidden tab / iOS `getTotalLength()` / StrictMode**: same as 001 design section 6; no new behaviour.
- **Likeness (SC-002)**: the paths are a first draft from geometry, not yet rendered; shape and colour tuning is an implementation and review task.
- **Existing behaviour untouched**: the freehand canvas is mouse-only and not resize-aware (pre-existing); on rotation the guides refit but the freehand canvas does not. "Strokes are kept" holds because the guides use separate canvases.
- **Spec alignment**: no conflict with spec.md (assumption on placement, size and raise updated to match).

## 7. Open questions

1. Is the default raise of 4% of the stage height right, or should it be higher (needs more slot margin) or lower?
2. Should the ring art be scaled up inside the 400x280 box (currently about 172x242 units, limited by height) so it reads larger at the same stage size?

> **Post-implementation revision (user request, approved on review)**: the ring is now drawn smaller than Cinnamoroll, which is enlarged. Slots use flex-grow 6 (Cinnamoroll) : 4 (ring); stage caps are 560px (Cinnamoroll, override in `GameGuides.css`) and 320px (ring, `RingGuide.css`). This supersedes every "same size" / "equal slot" statement in this document. Cinnamoroll files remain untouched.
