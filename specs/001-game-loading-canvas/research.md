# Research: Game Loading Drawing

As-built. All Technical Context items resolved; no NEEDS CLARIFICATION remain. Code inspected: `src/components/game/Game.jsx`, `src/App.jsx`, `src/components/ui/Navbar.jsx`.

## R1. What does "page ready" mean for the Game page?
- **Decision**: ready = `GamePage` mounted (React.lazy/Suspense guarantees the chunk is in) AND `document.readyState === "complete"` (re-checked after attaching the `load` listener so a load in between is not missed) AND `document.fonts.ready` resolved or rejected (skipped if `document.fonts` is unsupported).
- **Findings**: Game has no data fetch and no route loader. The only image is the bundled Navbar logo. Readiness is near-instant on in-app navigation; on a hard reload it can be late, and drawing waits for it so the animation is actually seen.
- **Rejected**: waiting on the board's canvas init (synchronous in the mount effect, no signal needed).

## R2. Where does the loader sit relative to the game?
- **Decision**: an `position: absolute; inset: 0` layer as the first child of `.game-board-inner`, `z-index: 0`, `pointer-events: none`, transparent. The freehand canvas is raised by `.game-board-inner > canvas { position: relative; z-index: 1 }` (in `GameLoader.css`). Navbar, title and tool bar are not covered.
- **Why**: `Game.jsx` sizes its canvas from `.game-board-inner` in a mount effect, so the board must stay rendered; an absolute layer leaves layout untouched.
- **Superseded**: the approved design used a fixed full-screen overlay that faded out and unmounted. Dropped because the finished figure is kept as a persistent tracing guide and the page chrome should stay usable.
- **Rejected**: `loading ? <Loader/> : <Board/>` (breaks the canvas init effect).

## R3. Chunk-download phase
`App.jsx` shows `<div>Loading...</div>` while the Game chunk downloads, before our component exists. Left as is (small same-origin chunk); the loader starts at mount. Known gap, design.md section 6.

## R4. Rendering technique
- **Decision**: hand-authored SVG path strings in `src/data/CinnamorollDrawing.js`, converted to `Path2D`, drawn on a 2D canvas. Reveal via `setLineDash([len, len])` with `lineDashOffset = len * (1 - p)`; fills fade in with `globalAlpha` over the last 30% of each stroke.
- **Stroke length**: measured once from a detached `<path>.getTotalLength()`. If it throws or returns 0 the stroke is drawn whole (static). iOS Safari behaviour unverified.
- **Rejected**: showing `Cinnamoroll.png` (spec: original illustration); CSS/SVG animation (spec asks for canvas); Lottie/GSAP/rough.js (heavy); sprite sheet (extra download).

## R5. Timing
`TIMING = { drawMs: 1500, minMs: 1700, capMs: 12000 }`.
- Drawing starts when ready (or when the cap fires), not at mount; progress is timestamp-based, so a throttled frame jumps forward.
- `minMs` is measured from ready and only ends `aria-busy` (phase `show` -> `done`). It no longer gates any visual change.
- `capMs` is measured from mount. If it fires before ready, the finished figure is painted at once and phase becomes `done`, so a page whose `load` never fires still shows the guide.
- `fadeMs` and `maxMs` no longer exist: there is no exit.

## R6. Sizing, resize, DPR
Logical space is a fixed viewBox (400 x 280). Backing store follows the canvas rect via `ResizeObserver` at `min(devicePixelRatio, 2)`; draw uses uniform scale `min(w/400, h/280)` with centring. Stage CSS: `width: min(90%, 480px)`, `aspect-ratio: 400 / 280`, `max-height: 90%` of the board. A resize clears the canvas, so once the figure is complete `fit()` repaints it; mid-animation the next frame repaints.

## R7. Reduced motion
`matchMedia("(prefers-reduced-motion: reduce)")` -> finished figure painted once, no rAF loop. Phase timing is unchanged (`done` after `minMs`).

## R8. Failure path
Canvas creation, `getContext`, `Path2D`, frame and resize errors are caught inside the loader, which calls `fail()` -> phase `gone` -> component returns `null` (figure removed, game untouched). This is the only path that removes the loader. No `maxMs` dismissal exists any more. An error boundary was rejected as over-built.

## R9. Observations on existing code (not changed by this feature)
- Game files were untracked in git when the design was written; the change to `Game.jsx` is one import and one JSX line.
- The board's mouse-only handlers and resize TBD are out of scope.
- Clear on the board wipes only the visitor's strokes because the figure lives on a separate canvas.
