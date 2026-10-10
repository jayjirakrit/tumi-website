# Design: Game Loading Drawing

Spec: `spec.md` · Plan: `plan.md` · Research: `research.md` · Data: `data-model.md` · Contracts: none (single area)

## 1. Approach

Planned (not built). A full-screen overlay `GameLoader` is mounted inside `GamePage`; the game (Navbar, board, canvas) renders normally underneath so the existing canvas init effect still measures `.game-board-inner`. `GameLoader` draws Cinnamoroll on its own `<canvas>` from hand-authored SVG path data (`src/data/CinnamorollDrawing.js`) via `Path2D`, revealing outlines with a dash-offset animation and fading in fills. A hook `useLoadingGate` decides when to dismiss (ready AND minimum time, or failure, or hard cap). Reduced motion paints the finished figure once. Unchanged: `App.jsx` routing, Navbar, other pages, the freehand board logic. No new dependencies.

## 2. Key decisions

| Decision | Choice | Why / trade-off |
|----------|--------|-----------------|
| Overlay vs swap | Fixed overlay over a fully rendered game | Board canvas reads parent size on mount; swapping would break it |
| "Page ready" | Game mounted + `readyState === "complete"` | Only real signals; no data fetch exists (research R1) |
| Art source | Vector path strings in `src/data`, drawn with `Path2D` | Original illustration (spec), tiny, no download, resolution independent |
| Stroke animation | `setLineDash([len,len])` + `lineDashOffset`; `len` from detached SVG `getTotalLength()` | Canvas cannot measure paths; failure degrades to static figure |
| Dismissal driver | `setTimeout` gate, not animation end | rAF throttling or canvas failure can never trap the visitor (FR-007) |
| Timing | draw 1.5 s, min 1.7 s, fade 0.25 s, cap 4 s | Game usable at 1.7 s, gone by about 1.95 s (SC-003) |
| Sizing | Fixed viewBox 400x280, uniform scale + centring, DPR cap 2 | One code path for 320-1920 px and rotation (FR-005) |
| Reduced motion | Finished figure, no fade | FR-008 and spec assumption |
| Chunk-download phase | Leave existing "Loading..." fallback | Out of loader scope; open question 1 |

## 3. Flow

```text
navigate /game
  -> App Suspense shows "Loading..." until Game chunk arrives (unchanged)
  -> GamePage mounts: board + Navbar render; <GameLoader/> overlay mounts (phase=show)
       t=0        rAF loop draws strokes by timestamp (or finished figure if reduced motion)
       ready      readyState==="complete" (already true on in-app navigation) or window "load"
       t=minMs    minElapsed=true
       ready && minElapsed -> phase=exit (pointer-events:none, fade) -> after fadeMs phase=gone (unmount)
  failure path:  try/catch in canvas setup/draw -> onFail -> phase exit immediately
  cap path:      t=maxMs -> phase exit regardless of ready
  resize/rotate: ResizeObserver -> resize backing store -> next frame redraws at current t
  unmount early (user navigates away): cancel rAF, timers, observers
```

## 4. Key files

Requirement -> key files (grouped):

| Requirements | Key files |
|--------------|-----------|
| FR-001, 002, 003, 009 | `src/data/CinnamorollDrawing.js`, `GameLoader.jsx`, `Game.jsx` (mount point only) |
| FR-004, 006, 011 | `src/hook/UseLoadingGate.jsx` |
| FR-010 | `drawCinnamoroll.js`, `CinnamorollDrawing.js` (start/end slices) |
| FR-005 | `GameLoader.jsx` (resize), `GameLoader.css` |
| FR-007 | `UseLoadingGate.jsx` (failed, cap), `GameLoader.jsx` (try/catch) |
| FR-008 | `UsePrefersReducedMotion.jsx`, `GameLoader.jsx` |

### 4.1 Core / shared building blocks (frontend)

#### src/hook/UseLoadingGate.jsx — FR-004, 006, 007, 011
```jsx
import { useEffect, useState, useCallback } from "react";

// Returns { phase: "show" | "exit" | "gone", fail }
export const useLoadingGate = ({ minMs, maxMs, fadeMs }) => {
  const [ready, setReady] = useState(() => document.readyState === "complete");
  const [minElapsed, setMinElapsed] = useState(false);
  const [capped, setCapped] = useState(false);
  const [failed, setFailed] = useState(false);
  const [phase, setPhase] = useState("show");

  useEffect(() => {
    const onLoad = () => setReady(true);
    if (!ready) window.addEventListener("load", onLoad);
    const tMin = setTimeout(() => setMinElapsed(true), minMs);
    const tMax = setTimeout(() => setCapped(true), maxMs);
    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(tMin);
      clearTimeout(tMax);
    };
  }, []); // mount only

  useEffect(() => {
    if (phase === "show" && ((ready && minElapsed) || failed || capped)) {
      setPhase(fadeMs > 0 && !failed ? "exit" : "gone");
    }
    if (phase === "exit") {
      const t = setTimeout(() => setPhase("gone"), fadeMs);
      return () => clearTimeout(t);
    }
  }, [phase, ready, minElapsed, failed, capped, fadeMs]);

  const fail = useCallback(() => setFailed(true), []);
  return { phase, fail };
};
```
**Check**: every path (ready+min, failure, cap) ends in `gone`; nothing depends on the canvas.
**Specs must assert**:
- Already-complete document: dismissed at about minMs, not earlier (FR-011).
- Slow ready (after minMs): dismissal within fadeMs of ready (SC-003).
- `fail()` removes the overlay immediately with no fade.
- At maxMs the overlay goes even if ready never arrives.
- Unmount before timers fire leaves no timer or listener behind.

#### src/hook/UsePrefersReducedMotion.jsx — FR-008
```jsx
import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(
    () => typeof matchMedia === "function" && matchMedia(QUERY).matches
  );
  useEffect(() => {
    if (typeof matchMedia !== "function") return;
    const mq = matchMedia(QUERY);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
};
```
**Check**: SSR/old-browser safe; follows live preference changes.
**Specs must assert**:
- Returns true when the media query matches at first render.
- Updates when the preference toggles.

### 4.2 Features / pages (frontend)

#### Game loading drawing — `src/data/CinnamorollDrawing.js`, `src/components/game/GameLoader.jsx`, `GameLoader.css`

Data (schema in [data-model.md](./data-model.md); coordinates are first-pass and are tuned against `src/img/Cinnamoroll.png` during implementation):
```js
export const VIEWBOX = { w: 400, h: 280 };
export const PALETTE = {
  white: "#FFFFFF", skyBlue: "#BFE3F7", eyeBlue: "#5BC4F2",
  outline: "#B98F62", cheekPink: "#F9D3E0",
};
export const TIMING = { drawMs: 1500, minMs: 1700, fadeMs: 250, maxMs: 4000 };

const O = PALETTE.outline;
// Back to front. start/end are fractions of drawMs.
export const STROKES = [
  { id: "earL", start: 0.00, end: 0.20, stroke: O, width: 5, fill: PALETTE.skyBlue,
    d: "M120 70 C80 70 40 110 20 150 C15 175 50 190 85 175 C115 160 125 125 125 95" },
  { id: "earR", start: 0.10, end: 0.30, stroke: O, width: 5, fill: PALETTE.skyBlue,
    d: "M280 70 C320 70 360 110 380 150 C385 175 350 190 315 175 C285 160 275 125 275 95" },
  { id: "body", start: 0.30, end: 0.50, stroke: O, width: 5, fill: PALETTE.white,
    d: "M150 140 C140 190 150 235 200 240 C250 235 260 190 250 140" },
  { id: "head", start: 0.40, end: 0.70, stroke: O, width: 5, fill: PALETTE.white,
    d: "M95 95 C95 50 145 30 200 30 C255 30 305 50 305 95 C305 125 260 145 200 145 C140 145 95 125 95 95 Z" },
  // eyes/cheeks/mouth: fill-only or short outlines, 0.70-1.00
  { id: "eyeL", start: 0.70, end: 0.78, stroke: null, width: 0, fill: PALETTE.eyeBlue,
    d: "M155 72 a8 12 0 1 0 0.01 0 Z" },
  { id: "cheekL", start: 0.78, end: 0.88, stroke: null, width: 0, fill: PALETTE.cheekPink,
    d: "M105 108 a22 12 0 1 0 0.01 0 Z" },
  { id: "mouth", start: 0.88, end: 1.00, stroke: O, width: 3, fill: null,
    d: "M185 105 q7 8 15 0 q8 8 15 0" },
  // eyeR, cheekR, arm, tail, feet follow the same shape
];
```
Component:
```jsx
const GameLoader = () => {
  const canvasRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const { phase, fail } = useLoadingGate({
    ...TIMING, fadeMs: reduced ? 0 : TIMING.fadeMs,
  });

  useEffect(() => {
    if (phase === "gone") return;
    const canvas = canvasRef.current;
    let raf = 0, size = { w: 0, h: 0 };
    try {
      const ctx = canvas.getContext("2d");
      const prepared = prepare(STROKES); // Path2D + measured len, per stroke
      const fit = () => {
        const r = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(r.width * dpr);
        canvas.height = Math.round(r.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        size = { w: r.width, h: r.height };
      };
      fit();
      const ro = new ResizeObserver(fit);
      ro.observe(canvas);
      const t0 = performance.now();
      const frame = (now) => {
        const t = reduced ? TIMING.drawMs : now - t0;
        drawCinnamoroll(ctx, size.w, size.h, t, prepared, TIMING.drawMs);
        if (!reduced && t < TIMING.drawMs) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
      return () => { cancelAnimationFrame(raf); ro.disconnect(); };
    } catch (e) {
      fail(); // never block the game
    }
  }, [reduced]);

  if (phase === "gone") return null;
  return (
    <div className={`game-loader ${phase === "exit" ? "game-loader--exit" : ""}`}
         role="status" aria-label="Loading game">
      <div className="game-loader__stage"><canvas ref={canvasRef} /></div>
    </div>
  );
};
```
Note on resize after the draw ends: `fit()` clears the canvas, so a resize while the figure is held must repaint. Implementation draws once more inside the `ResizeObserver` callback when `t >= drawMs` (keeps "frozen figure stays whole").

CSS (key rules only):
```css
.game-loader { position: fixed; inset: 0; z-index: 2000; overflow: hidden;
  display: grid; place-items: center;
  background: radial-gradient(circle at 50% 45%, #fff 0%, #e8f4fc 60%, #cfe9f8 100%);
  transition: opacity 250ms ease; }
.game-loader--exit { opacity: 0; pointer-events: none; }
.game-loader__stage { width: min(80vw, 480px); aspect-ratio: 400 / 280; max-height: 60vh; }
.game-loader canvas { width: 100%; height: 100%; display: block; }
@media (prefers-reduced-motion: reduce) { .game-loader { transition: none; } }
```
**Check**: figure whole and centred at 320x568, 640x360 and 1920x1080; light-blue/white dominates, brown only on outlines, pink only on cheeks.
**Specs must assert**:
- Overlay present on `/game` at mount and gone by about 2 s on fast loads; absent on other routes.
- Game board canvas is non-zero size after the overlay is gone, and drawing on it still works.
- Reduced motion: first painted frame is the complete figure.
- Forced `Path2D`/`getContext` failure: overlay removed, no uncaught error, game reachable.
- Resize and orientation change keep the figure centred and uncropped, including after the draw has finished.
- Navigating away mid-animation leaves no running rAF/observer (no console errors).

### 4.3 Algorithms / business rules

#### src/components/game/drawCinnamoroll.js — FR-010
```js
import { VIEWBOX } from "../../data/CinnamorollDrawing";

const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const clamp01 = (x) => Math.min(1, Math.max(0, x));

export function prepare(strokes) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return strokes.map((s) => {
    let len = 0;
    try { svg.setAttribute("d", s.d); len = svg.getTotalLength(); } catch { /* static */ }
    return { ...s, path: new Path2D(s.d), len };
  });
}

export function drawCinnamoroll(ctx, w, h, t, strokes, drawMs) {
  const k = Math.min(w / VIEWBOX.w, h / VIEWBOX.h);
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.translate((w - VIEWBOX.w * k) / 2, (h - VIEWBOX.h * k) / 2);
  ctx.scale(k, k);
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  for (const s of strokes) {
    const p = ease(clamp01((t / drawMs - s.start) / (s.end - s.start)));
    if (p <= 0) continue;
    if (s.fill) {                       // fill fades in over the last 30% of the stroke
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
| Input | Expected |
|-------|----------|
| `t = 0` | Nothing painted (clean canvas, no partial flicker before first stroke) |
| `t = 0.35*drawMs` | Ears finished with fill, body mid-stroke, head not started |
| `t >= drawMs` (or reduced motion) | Every stroke `p = 1`: solid lines, full fills |
| `len = 0` (measure failed) | Stroke appears whole as soon as `p > 0`; no dash |
| Fill-only stroke (`stroke: null`) | Fades in by alpha only; never throws |

Overlapping slices: later strokes paint over earlier ones, so path order in `STROKES` is the z-order (ears behind head).

### 4.4 Routing, config & infra (only where a decision lives)

#### src/components/game/Game.jsx
```jsx
import GameLoader from "./GameLoader";
// ...
return (
  <div>
    <GameLoader />   {/* fixed overlay; first child, board below stays mounted */}
    <Navbar />
    <div id="game-container">...</div>
  </div>
);
```
**Check**: the only edit to Game.jsx is one import and one JSX line; routing in `App.jsx`, `vite.config.js` base path and Navbar are untouched. Optional one-token fix if the build complains: drop the unused `use` import (section 6).

## 5. Data touched

- Static `STROKES`, `PALETTE`, `TIMING` in `src/data/CinnamorollDrawing.js` — see [data-model.md](./data-model.md). No storage, network or persisted state.

## 6. Risks, gaps & mismatches

- **Spec tension, accepted**: FR-006 (do not noticeably delay the game) vs FR-011 (forced 1-2 s minimum). The spec's assumptions accept the trade-off; fast loads always wait about 1.7 s.
- **Spec tension**: SC-001 says "or the game directly, if loading is instant" while FR-011 forces the minimum even for instant loads. Design always applies the minimum (no skip). See open question 2.
- **Chunk-download gap**: until the Game chunk loads, the user sees App's plain "Loading..." text, not Cinnamoroll (FR-001 "whenever the Game page is loading on entry" is not met for that window). Open question 1.
- **Likeness risk**: hand-authored paths may not hit SC-002 at first pass; budget iteration against the reference image (overlay comparison in the walkthrough). Ear/body asymmetry, arm and tail details can be simplified before the head and ears are.
- **Detached `getTotalLength()`** is expected to work in current browsers; if a browser returns 0 the figure shows without stroke animation (still correct, still not blocked). Verify on iOS Safari.
- **Existing code**: `Game.jsx` imports `use` from `react` (absent in React 18.3). If `npm run build` fails or warns, remove that import (outside feature scope, one token). Game files are untracked in git.
- **Existing behaviour untouched**: the board's `mousedown/mousemove` handlers are mouse-only (no touch) and resize is a TBD; the loader does not fix these.
- **Overlay covers the Navbar** for about 1.7 s, so navigation is unavailable then; acceptable for a loading screen, noted for review.
- **Dev StrictMode**: effects run twice in development; cleanup cancels rAF/observer, and the gate timers are re-created, so no leak. Verify in dev, not only in the preview build.
- **Backgrounded tab**: timers throttle but still fire; progress is timestamp-based so the figure completes instantly on return.

## 7. Open questions

1. Chunk-download phase: accept App's plain "Loading..." fallback until the Game chunk mounts (recommended, small chunk), or also use a Cinnamoroll fallback on the `/game` route (risks restarting the animation on mount)?
2. Revisit in the same session: always show the 1.7 s minimum (recommended, simplest, consistent with FR-011), or skip the loader when the page is already ready (SC-001 wording)?
3. Reduced motion: keep the same 1.7 s hold with the static figure (recommended, consistent), or shorten to about 0.6 s since nothing is animating?
4. Should the overlay cover the Navbar (recommended: full-screen, calm) or leave it visible and clickable?
5. Accept brown outline `#B98F62`, sky blue `#BFE3F7`, eye blue `#5BC4F2`, cheek pink `#F9D3E0` as sampled by eye from the reference, or supply exact brand hex values?
