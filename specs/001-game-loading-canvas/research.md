# Research: Game Loading Drawing

All Technical Context items resolved; no NEEDS CLARIFICATION remain. Code inspected: `src/components/game/Game.jsx`, `src/App.jsx`, `src/components/ui/Navbar.jsx`.

## R1. What does "page ready" mean for the Game page?
- **Decision**: ready = (a) the lazy `Game` chunk has loaded and `GamePage` has mounted (React.lazy/Suspense in `App.jsx` guarantees this before our code runs) AND (b) `document.readyState === "complete"` (window `load` fired: CSS and the Navbar logo are in).
- **Findings**: Game has no data fetch and no route loader. The only image is the bundled Navbar logo (`Cinnamoroll.png`). The Navbar `Audio(Music)` is constructed but not fetched until play. Readiness is therefore near-instant on in-app navigation and the minimum display time (FR-011) dominates.
- **Rationale**: uses only signals that exist and can actually be late (Principle IV). Waiting on fonts/images would be speculative.
- **Rejected**: waiting on the board's canvas init - it is synchronous in the mount effect, no signal needed.

## R2. Where does the loader sit relative to the game?
- **Decision**: render the game fully (Navbar, board, canvas) and cover it with a `position: fixed` overlay that unmounts after fade-out.
- **Why**: `Game.jsx` sizes its canvas from `.game-board-inner.clientWidth/Height` in a mount effect; not rendering the board would give a null parent / 0x0 canvas. An overlay leaves layout and the game untouched (spec assumption).
- **Rejected**: `loading ? <Loader/> : <Board/>` - breaks the canvas init effect.

## R3. Chunk-download phase
`App.jsx` shows `<div>Loading...</div>` while the Game chunk downloads, before our component exists. Decision: leave as is (small same-origin static chunk); the loader starts at mount. Open question 1.

## R4. Rendering technique
- **Decision**: hand-authored SVG path strings in `src/data/CinnamorollDrawing.js`, converted to `Path2D`, drawn on a 2D canvas. Stroke-by-stroke reveal via `setLineDash([len, len])` with `lineDashOffset = len * (1 - p)`; fills fade in with `globalAlpha` once their outline completes.
- **Stroke length**: measured once at runtime from a detached `<path>.getTotalLength()` (the canvas API cannot measure paths). If it throws or returns 0, that stroke is drawn complete (graceful degrade to static figure).
- **Rejected**: showing `Cinnamoroll.png` (spec: original illustration, not the file); CSS/SVG animation (spec asks for canvas); Lottie/GSAP/rough.js (heavy, Principle II); sprite sheet (extra download).
- **Why Path2D**: native in all browsers in the production browserslist, parses SVG path syntax so paths can be authored in any vector editor.

## R5. Timing
`drawMs=1500` (stroke animation), `minMs=1700` (earliest dismissal), `fadeMs=250`. The overlay stops capturing pointer events as soon as exit starts, so the game is usable at about 1.7 s and the overlay is gone at about 1.95 s (SC-003 fast case <= 2 s). Slow case: figure already complete and held still; exit starts when ready, fade 0.25 s (SC-003 <= 0.5 s). Dismissal is driven by `setTimeout`, never by animation completion, so a throttled or failed rAF cannot trap the visitor (FR-007). Draw progress is computed from timestamps, so a backgrounded tab jumps to the finished figure.

## R6. Sizing, resize, DPR
Logical drawing space is a fixed viewBox (400 x 280). Canvas backing store is sized to its wrapper (`ResizeObserver`, with `resize`/`orientationchange` fallback) at `devicePixelRatio` capped at 2; draw uses uniform scale `min(w/400, h/280)` with centring. Wrapper CSS: `width: min(80vw, 480px)`, `aspect-ratio: 400 / 280`, `max-height: 60vh`. Fits 320-1920 px without scroll (overlay is fixed with `overflow: hidden`).

## R7. Reduced motion
`matchMedia("(prefers-reduced-motion: reduce)")` -> draw the finished figure once (progress = 1), no stroke animation, no fade. The same minimum hold applies unless open question 3 is answered otherwise.

## R8. Failure path
Canvas creation, `getContext`, `Path2D` and draw errors are caught inside the loader; it calls `onFail` and the hook dismisses immediately. The hook also has an absolute cap (`maxMs=4000` after mount) that dismisses regardless of readiness signals. An error boundary was rejected as over-built: loader code is small and try/catch covers the canvas risks.

## R9. Observations on existing code (not changed by this feature)
- `Game.jsx` imports `use` from `react` (not exported by React 18.3, unused). Verify `npm run build` early; if it errors, removing that import is a one-token fix (design.md section 6).
- The resize TBD comment in `Game.jsx` is out of scope; the loader has its own resize handling.
- `src/components/game/` is untracked in git (in-progress work); our change to `Game.jsx` is a small insertion.
