# Design: Game Loading Drawing

Spec: `spec.md` · Plan: `plan.md` · Research: `research.md` · Data: `data-model.md` · Contracts: none (single area)

## 1. Approach

**As-built** (documents the code in `src/`, which superseded the approved overlay design). `GameLoader` is mounted as the first child of `.game-board-inner` in `Game.jsx` and is an absolutely positioned layer filling the board only. Navbar, page title and tool bar stay visible and usable throughout. It draws Cinnamoroll on its own `<canvas>` from hand-authored SVG path data (`src/data/CinnamorollDrawing.js`) via `Path2D`, revealing outlines with a dash-offset animation and fading in fills. Drawing starts only once the page is ready (`document.readyState === "complete"`, re-checked after attaching the `load` listener, plus `document.fonts.ready`). When drawing finishes there is no fade, exit or unmount: the finished figure stays as a persistent guide beneath the visitor's freehand canvas (`pointer-events: none`, `z-index: 0`, transparent background). Failure is the only path that removes the loader. Reduced motion paints the finished figure at once. `useLoadingGate` returns `phase` (`show` -> `done`, or `gone` on failure). Unchanged: `App.jsx` routing, Navbar, other pages, the freehand board logic. No new dependencies.

## 2. Key decisions

| Decision | Choice | Why / trade-off |
|----------|--------|-----------------|
| Placement | Absolute layer inside `.game-board-inner`, not a full-screen overlay | Board stays reachable and page chrome visible; no layout change to the board |
| After drawing | Figure persists as a guide (`show` -> `done`); no fade, no unmount | Gives the visitor something to trace; trade-off: it permanently sits under strokes (section 6) |
| Layering | Loader `z-index: 0`, `pointer-events: none`; `.game-board-inner > canvas` is `position: relative; z-index: 1` (rule in `GameLoader.css`) | Freehand strokes paint above the figure and receive all input; `Game.css` untouched |
| "Page ready" | `readyState === "complete"` (re-checked after listener attach) and `document.fonts.ready` | Only real signals; no data fetch exists (research R1). Drawing waits for ready so the animation is seen once the main thread is free |
| Art source | Vector path strings in `src/data`, drawn with `Path2D` | Original illustration (spec), tiny, no download, resolution independent |
| Stroke animation | `setLineDash([len,len])` + `lineDashOffset`; `len` from detached SVG `getTotalLength()` | Canvas cannot measure paths; failure degrades to a static stroke |
| Timing | `drawMs` 1500, `minMs` 1700, `capMs` 12000 (from mount) | `minMs` counts from ready and only ends `aria-busy`; `capMs` releases a page whose `load` never fires |
| Cap behaviour | On cap before ready, paint the finished figure at once | Visitor never waits on a stuck load; the guide still appears |
| Sizing | Fixed viewBox 400x280, uniform scale + centring, DPR cap 2; stage `min(90%, 480px)` of the board | One code path for 320-1920 px and rotation (FR-010, SC-004) |
| Reduced motion | Finished figure at once | FR-014 |
| Accessibility | `role="status"`, hidden "Loading game" text, `aria-busy` while `show`, `aria-hidden` once `done` | Announces loading, then stops advertising a decorative guide |
| Clear button | Untouched; wipes only the visitor's strokes | The figure lives on a separate canvas |
| Chunk-download phase | Leave existing "Loading..." fallback | Out of loader scope (section 6) |

## 3. Flow

```text
navigate /game
  -> App Suspense shows "Loading..." until Game chunk arrives (unchanged)
  -> GamePage mounts: Navbar, title, tool bar, board render; <GameLoader/> mounts in .game-board-inner
     (phase=show, aria-busy)
       mount       capMs timer starts; canvas stays blank
       ready       readyState==="complete" (already true on in-app navigation) or window "load",
                   then document.fonts.ready -> start=true: fit canvas, rAF loop draws by timestamp from t=0
                   (reduced motion: finished figure painted once)
       t=drawMs    last frame painted; rAF stops; figure stays on screen
       ready+minMs minElapsed -> phase=done (aria-busy false, aria-hidden); nothing unmounts
  cap path:      mount+capMs -> capped; if not ready, finished figure painted at once; phase=done
  failure path:  try/catch in setup/frame/resize -> fail() -> phase=gone -> loader removed (no figure)
  resize/rotate: ResizeObserver -> fit() resizes backing store and repaints the held figure
                 (mid-animation the next frame repaints)
  unmount early (user navigates away): cancel rAF, disconnect observer, clear timers, remove load listener
```

## 4. Key files

Requirement -> key files (grouped):

| Requirements | Key files |
|--------------|-----------|
| FR-001, 002, 003, 009, 015 | `src/data/CinnamorollDrawing.js`, `GameLoader.jsx`, `Game.jsx` (mount point only) |
| FR-004, 006, 011, 013 | `src/hook/UseLoadingGate.jsx` |
| FR-005 | `drawCinnamoroll.js`, `CinnamorollDrawing.js` (start/end slices) |
| FR-006, 007, 008, 010 | `GameLoader.jsx` (resize), `GameLoader.css` |
| FR-012 | `UseLoadingGate.jsx` (`fail`, cap), `GameLoader.jsx` (try/catch) |
| FR-014 | `UsePrefersReducedMotion.jsx`, `GameLoader.jsx` |

### 4.1 Core / shared building blocks (frontend)

#### src/hook/UseLoadingGate.jsx — FR-004, 006, 011, 012, 013 (as built)
```jsx
// Returns { phase: "show" | "done" | "gone", ready, capped, fail }
export const useLoadingGate = ({ minMs, capMs }) => {
  const [ready, setReady] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);
  const [capped, setCapped] = useState(false);
  const [phase, setPhase] = useState("show");

  useEffect(() => {
    let alive = true;
    const markReady = () => {
      const fonts = document.fonts && document.fonts.ready;
      if (fonts && typeof fonts.then === "function")
        fonts.then(() => alive && setReady(true), () => alive && setReady(true));
      else setReady(true);
    };
    const onLoad = () => markReady();
    if (document.readyState === "complete") markReady();
    else {
      window.addEventListener("load", onLoad);
      if (document.readyState === "complete") markReady(); // re-check after attach
    }
    const tMax = setTimeout(() => setCapped(true), capMs);   // from mount
    return () => { alive = false; window.removeEventListener("load", onLoad); clearTimeout(tMax); };
  }, []); // mount only

  useEffect(() => {            // minMs counts from ready, i.e. from drawing start
    if (!ready) return;
    const t = setTimeout(() => setMinElapsed(true), minMs);
    return () => clearTimeout(t);
  }, [ready, minMs]);

  useEffect(() => {
    if (phase === "show" && ((ready && minElapsed) || capped)) setPhase("done");
  }, [phase, ready, minElapsed, capped]);

  const fail = useCallback(() => setPhase("gone"), []);
  return { phase, ready, capped, fail };
};
```
**Check**: `done` only changes `aria-busy`/`aria-hidden`; it never unmounts anything. Only `fail()` removes the loader (`gone`).
**Specs must assert**:
- Document already complete: `ready` after `document.fonts.ready` resolves; `done` at `minMs` after that, not earlier.
- `load` firing between the first `readyState` check and `addEventListener` is still caught (re-check).
- `document.fonts` missing or rejecting still yields `ready`.
- `capMs` from mount sets `capped` even if `load` never fires; `phase` becomes `done`.
- `fail()` sets `gone` immediately, no fade.
- Unmount before timers fire leaves no timer or listener behind.

#### src/hook/UsePrefersReducedMotion.jsx — FR-014
```jsx
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

#### Game loading drawing — `src/data/CinnamorollDrawing.js`, `GameLoader.jsx`, `GameLoader.css` (as built)

Data (schema in [data-model.md](./data-model.md)): `VIEWBOX {400x280}`, `PALETTE`, and
```js
export const TIMING = { drawMs: 1500, minMs: 1700, capMs: 12000 };
// STROKES, back to front (start/end = fractions of drawMs): earL, earR, tail, body, footL,
// footR, head, armL, armR, eyeL, eyeR, cheekL, cheekR, mouth. Example:
{ id: "mouth", start: 0.88, end: 1.0, stroke: O, width: 3, fill: null, d: "M189 80 q7 9 14 0 q7 9 14 0" }
```
Component (key parts):
```jsx
const { phase, ready, capped, fail } = useLoadingGate({ minMs: TIMING.minMs, capMs: TIMING.capMs });
const start = ready || capped;              // cap releases even if load never completes

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas || !start) return;            // page not loaded yet: draw nothing
  let raf = 0, ro = null;
  try {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2d context unavailable");
    const prepared = prepare(STROKES);
    let size = { w: 0, h: 0 };
    let t = reduced || !ready ? drawMs : 0; // reduced motion / cap before load: finished figure at once
    const t0 = performance.now();
    const paint = () => drawCinnamoroll(ctx, size.w, size.h, t, prepared, drawMs);
    const fit = () => {                     // backing store = rect * min(dpr, 2); setTransform; size = rect
      if (t >= drawMs) paint();             // resize clears the canvas: repaint the held figure
    };
    fit();
    ro = new ResizeObserver(() => { try { fit(); } catch { fail(); } });
    ro.observe(canvas);
    if (t >= drawMs) paint();
    else {
      const frame = (now) => {
        try { t = now - t0; paint(); if (t < drawMs) raf = requestAnimationFrame(frame); }
        catch { fail(); }
      };
      raf = requestAnimationFrame(frame);
    }
  } catch { fail(); }                       // never block the game
  return () => { cancelAnimationFrame(raf); if (ro) ro.disconnect(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [reduced, start, fail]);                 // ready read once at start; as a dep it would restart a finished figure

if (phase === "gone") return null;
return (
  <div className="game-loader" role="status" aria-busy={phase === "show"}
       aria-hidden={phase === "done" ? true : undefined}>
    <span className="visually-hidden">Loading game</span>
    <div className="game-loader__stage"><canvas ref={canvasRef} /></div>
  </div>
);
```
CSS (key rules; no background, transition or media query):
```css
.game-loader { position: absolute; inset: 0; z-index: 0; overflow: hidden;
  display: grid; place-items: center; pointer-events: none; }
.game-board-inner > canvas { position: relative; z-index: 1; }   /* freehand canvas above the guide */
.game-loader__stage { width: min(90%, 480px); aspect-ratio: 400 / 280; max-height: 90%; }
.game-loader canvas { width: 100%; height: 100%; display: block; }
/* .visually-hidden: 1px clipped box carrying the "Loading game" text */
```
**Check**: loader rect equals `.game-board-inner`; figure whole and centred at 320x568, 640x360 and 1920x1080; Navbar, title and tool bar are never covered; the board is not blocked (`pointer-events: none`).
**Specs must assert**:
- Nothing is drawn before the page is ready; on ready the animation starts at t=0.
- Reduced motion: first painted frame is the complete figure; no rAF loop.
- Cap before ready: finished figure painted at once, `phase` `done`.
- After `done` the canvas is still mounted and still shows the figure (no fade, no unmount).
- Forced `Path2D`/`getContext` failure: loader removed (`gone`), no uncaught error, game usable.
- Resize and orientation change keep the held figure centred and uncropped.
- Loader has `pointer-events: none` and sits beneath the freehand canvas (strokes visible over the figure); Clear wipes only the visitor's strokes, the figure stays.
- `aria-busy` true during `show`, false after `minMs`; hidden text is `aria-hidden` once done.
- Navigating away mid-animation leaves no running rAF/observer.

### 4.3 Algorithms / business rules

#### src/components/game/drawCinnamoroll.js — FR-005 (unchanged from design)
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
| `t = 0` | Nothing painted (clean canvas, transparent) |
| `t = 0.35*drawMs` | Ears finished with fill, body mid-stroke, head not started |
| `t >= drawMs` (or reduced motion, or cap before ready) | Every stroke `p = 1`: solid lines, full fills |
| `len = 0` (measure failed) | Stroke appears whole as soon as `p > 0`; no dash |
| Fill-only stroke (`stroke: null`) | Fades in by alpha only; never throws |

Path order in `STROKES` is the z-order (ears and tail behind head and body).

### 4.4 Routing, config & infra (only where a decision lives)

#### src/components/game/Game.jsx
```jsx
import GameLoader from "./GameLoader";
// ...
<div className="game-board">
  <div className="game-board-inner">
    <GameLoader />          {/* absolute guide layer; first child, freehand canvas follows */}
    <canvas ref={canvasRef} />
  </div>
</div>
```
**Check**: the only edit to Game.jsx is one import and one JSX line inside the board; `App.jsx` routing, `vite.config.js` base path and Navbar are untouched. The loader is absolute, so the board canvas still measures `.game-board-inner` as before.

## 5. Data touched

- Static `STROKES`, `PALETTE`, `TIMING` in `src/data/CinnamorollDrawing.js` — see [data-model.md](./data-model.md). No storage, network or persisted state.

## 6. Risks, gaps & mismatches

Known risks:
- **Hidden tab**: rAF is paused in hidden tabs and drawing starts only once ready. If the tab is hidden at load the animation may go unseen; on return the next frame shows the finished figure (progress is timestamp-based).
- **iOS Safari `getTotalLength()`** on a detached SVG path is expected to work but is unverified; if it returns 0 or throws, the stroke is drawn whole without dash animation (correct, not blocked).
- **Guide permanently under strokes**: the figure never fades, so visitors always draw over it and cannot hide it. Intended as a tracing guide; see open question 2.
- **Chunk-download gap**: until the Game chunk loads the user sees App's plain "Loading..." text, not Cinnamoroll (FR-001 "whenever the Game page is loading on entry" is not met for that window). Left as is (open question 1).
- **Spec alignment**: `minMs` no longer delays the game (nothing is covered); it only ends `aria-busy`. Consistent with the updated spec: FR-011 (no delay, board usable at once) and SC-001/SC-003.
- **Likeness (SC-002)**: the finished figure renders recognisably (verified); detail tuning against the reference is a review item.
- **Existing behaviour untouched**: the board's `mousedown/mousemove` handlers are mouse-only (no touch) and resize is a TBD; the loader does not fix these.
- **Dev StrictMode**: effects run twice in development; cleanup cancels rAF/observer and timers are re-created, so no leak. Verify in dev, not only in the preview build.

Live verification status:

| Verified live | Not verified live |
|---------------|-------------------|
| Finished figure renders recognisably | Animation actually painting stroke by stroke |
| Loader rect equals the board rect | Timing (`minMs`, `capMs`, start after ready) |
| Layering and `pointer-events: none` as described | Reduced-motion path |
| `npm run build` passes | Failure path (`Path2D`/`getContext` broken) |
| | Resize / rotation with the held figure |
| | Freehand strokes drawn over the figure |

## 7. Open questions

1. Chunk-download phase: keep App's plain "Loading..." fallback until the Game chunk mounts (current), or also use a Cinnamoroll fallback on the `/game` route (risks restarting the animation on mount)?
2. Should the persistent guide be dismissible or toggleable by the visitor (currently permanent until leaving the page)?
3. Accept brown outline `#B98F62`, sky blue `#BFE3F7`, eye blue `#5BC4F2`, cheek pink `#F9D3E0` as sampled by eye from the reference, or supply exact brand hex values?
