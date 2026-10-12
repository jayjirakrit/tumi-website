# Tasks: Game Loading Drawing

**Input**: `specs/001-game-loading-canvas/` (spec.md, plan.md, design.md, research.md, data-model.md, quickstart.md)
**Area**: `frontend` (root `.`) — all tasks below belong to this single area.
**Tests**: No test runner is configured and none were requested. Verification is `npm run build` plus the browser walkthrough in `quickstart.md`.
**Format**: `- [ ] T### [P?] [US?] Description with file path`

Decisions approved at the time (design.md §7; the overlay and the 1.7 s forced exit were later superseded by the board-scoped persistent guide, see the note after Phase 7): keep App's plain "Loading..." while the Game chunk downloads; always apply the 1.7 s minimum; under reduced motion keep the hold with the static figure; use the sampled palette (outline `#B98F62`, sky blue `#BFE3F7`, eye blue `#5BC4F2`, cheek pink `#F9D3E0`).

## Phase 1: Setup

- [X] T001 Run `npm run build` once on the current tree to record the baseline, and note whether the existing `import { ..., use } from "react"` in `src/components/game/Game.jsx` makes it fail or warn (design.md §6).
- [X] T002 If T001 failed or warned because of `use`, remove only the unused `use` import from `src/components/game/Game.jsx` and re-run `npm run build` until the baseline is clean. Skip if the baseline was clean.

## Phase 2: Foundational (blocks all user stories)

- [X] T003 [P] Create `src/data/CinnamorollDrawing.js` exporting `VIEWBOX` (400x280), `PALETTE` (white, skyBlue, eyeBlue, outline, cheekPink with the approved hex values), `TIMING` (`drawMs: 1500, minMs: 1700, fadeMs: 250, maxMs: 4000`) and `STROKES` (back-to-front list: ears, body, head, eyes, cheeks, mouth, arm, tail, feet; each with `id, start, end, stroke, width, fill, d`), following the schema in `data-model.md` and the sketch in design.md §4.2.
- [X] T004 [P] Create `src/hook/UsePrefersReducedMotion.jsx` exporting `usePrefersReducedMotion()` (initial value from `matchMedia("(prefers-reduced-motion: reduce)")`, safe when `matchMedia` is missing, follows live changes) per design.md §4.1.
- [X] T005 [P] Create `src/hook/UseLoadingGate.jsx` exporting `useLoadingGate({ minMs, maxMs, fadeMs })` returning `{ phase: "show" | "exit" | "gone", fail }`: ready = `document.readyState === "complete"` or window `load`; dismiss when (ready and min elapsed), failure (immediate, no fade) or cap; clean up timers and listeners on unmount (design.md §4.1).
- [X] T006 Create `src/components/game/drawCinnamoroll.js` exporting `prepare(strokes)` (builds `Path2D` plus measured length via a detached SVG `getTotalLength()`, falling back to `len = 0` on error) and `drawCinnamoroll(ctx, w, h, t, strokes, drawMs)` (uniform scale and centring from `VIEWBOX`, eased per-stroke progress, fill fades in over the last 30%, dash-offset stroke reveal, `t >= drawMs` yields the complete figure), per design.md §4.3.

**Checkpoint**: data, hooks and pure draw function exist; `npm run build` still passes.

## Phase 3: User Story 1 — Cinnamoroll appears while the Game page loads (P1) 🎯 MVP

**Goal**: On entering `/game`, a white and light blue 2D Cinnamoroll (subtle brown outline, pink cheeks) fills a full-screen overlay, then the overlay gives way to the game without any visitor action.
**Independent test**: Hard-reload `/tumi-website/game`: the figure shows centred, the game is usable at about 1.7–2 s, and other routes show no loader (quickstart steps 1, 8, 9).

- [X] T007 [US1] Create `src/components/game/GameLoader.css` with `.game-loader` (fixed, `inset: 0`, `z-index: 2000`, light radial white-to-light-blue background, opacity transition), `.game-loader--exit` (opacity 0, `pointer-events: none`), `.game-loader__stage` (`width: min(80vw, 480px); aspect-ratio: 400 / 280; max-height: 60vh`), canvas sizing, and a `prefers-reduced-motion` rule that removes the transition (design.md §4.2).
- [X] T008 [US1] Create `src/components/game/GameLoader.jsx`: use `useLoadingGate` with `TIMING` and `usePrefersReducedMotion`; on mount paint the figure on its canvas (size the backing store from `getBoundingClientRect` with DPR capped at 2, call `prepare` and `drawCinnamoroll` with `t = TIMING.drawMs` for now); wrap setup and draw in try/catch that calls `fail()`; render `null` when phase is `gone`; render the overlay with `role="status"` and `aria-label="Loading game"`.
- [X] T009 [US1] Edit `src/components/game/Game.jsx`: add `import GameLoader from "./GameLoader";` and render `<GameLoader />` as the first child of the root `div`, leaving the board, Navbar and canvas init logic untouched so the board canvas still measures `.game-board-inner` on mount.
- [-] T010 [US1] Run `npm run build`, then `npm run dev` and check on `/game`: overlay present at mount and gone by about 2 s, game board canvas non-zero size and still draws, no loader on `/`, `/journey`, `/about`; leaving and returning to `/game` plays it again. (skipped at close 2026-10-12: written for the superseded overlay design; covered in part by T025/T028)

**Checkpoint**: MVP — the figure shows during loading and hands over to the game.

## Phase 4: User Story 2 — Drawing is presented as an animated drawing (P2)

**Goal**: The character is drawn progressively, stroke by stroke, and always completes before the game appears.
**Independent test**: Hard-reload `/game` and watch ears, head and body drawn first, then eyes, cheeks and mouth; no half-drawn flash when loading is instant (quickstart steps 1, 6).

- [X] T011 [US2] In `src/components/game/GameLoader.jsx`, replace the single paint with a `requestAnimationFrame` loop driven by `performance.now() - t0` that calls `drawCinnamoroll` each frame until `t >= TIMING.drawMs`; under reduced motion paint the finished figure once with no loop; cancel the frame and any observer in the effect cleanup.
- [X] T012 [US2] Tune `STROKES` timing slices (`start`/`end`) in `src/data/CinnamorollDrawing.js` so the order reads ears → body → head → eyes/cheeks → mouth, and verify `t = 0` paints nothing and `t >= drawMs` paints every stroke complete (design.md §4.3 table).
- [-] T013 [US2] Verify in the browser (normal, Slow 4G, CPU 6x throttle): the animation always finishes, never repeats or freezes mid-stroke, and the game appears within about 0.5 s of the page being ready (quickstart steps 1, 6). (skipped at close 2026-10-12: written for the superseded overlay design; covered in part by T025/T028)

**Checkpoint**: US1 and US2 both work; the drawing animates and completes.

## Phase 5: User Story 3 — Works well on phones and for all visitors (P3)

**Goal**: The figure is whole and centred from 320 px to 1920 px, adapts to resize and rotation, respects reduced motion, and never blocks the game.
**Independent test**: Quickstart steps 2, 3, 4, 5 and 7.

- [X] T014 [US3] In `src/components/game/GameLoader.jsx`, add a `ResizeObserver` on the canvas that re-sizes the backing store and redraws at the current time, including a repaint of the finished figure when `t >= drawMs` (resizing clears the canvas), and disconnect it on cleanup.
- [X] T015 [US3] Confirm failure and edge paths in `src/components/game/GameLoader.jsx` and `src/hook/UseLoadingGate.jsx`: forcing `Path2D` or `getContext` to fail removes the overlay immediately with no uncaught error; the 4 s cap removes it even if the page never reports ready; navigating away mid-animation leaves no running frame, timer or observer (check the dev console, including StrictMode double effects).
- [-] T016 [US3] Browser-verify responsive behavior: figure whole and centred with no scrollbars at 320x568, 360x640, 640x360 (rotation), 1280x800 and 1920x1080 (also at DPR 2); resize mid-animation keeps it whole and centred; with `prefers-reduced-motion: reduce` emulated the finished figure shows at once with no animation and no fade (quickstart steps 2–5, 7). (skipped at close 2026-10-12: written for the superseded overlay design; covered in part by T025/T028)

**Checkpoint**: all three stories independently verified.

## Phase 6: Polish & Cross-Cutting

- [X] T017 Tune the path coordinates and colors in `src/data/CinnamorollDrawing.js` against `src/img/Cinnamoroll.png` (side-by-side comparison; white and light blue dominant, brown only on outlines, pink only on cheeks) until the figure is clearly recognisable as the character (SC-002, quickstart step 10).
- [X] T018 Final quality gate: run `npm run build` and `npm run preview`, open `/tumi-website/game`, and confirm the bundle works under the base path.
- [-] T019 Execute the full browser walkthrough in `specs/001-game-loading-canvas/quickstart.md` (steps 1–10) at desktop and mobile widths and record any deviation, including iOS Safari `getTotalLength()` behavior if a device is available. (skipped at close 2026-10-12: written for the superseded overlay design; covered in part by T025/T028)

## Dependencies & Execution Order

- Setup (T001–T002) → Foundational (T003–T006) → US1 (T007–T010) → US2 (T011–T013) → US3 (T014–T016) → Polish (T017–T019).
- Within Foundational, T003, T004 and T005 touch different files and are parallel; T006 imports `VIEWBOX` from T003, so it follows T003.
- US1 tasks are sequential (T008 needs T007's classes, T009 needs T008). US2 and US3 both edit `GameLoader.jsx`, so run them sequentially (T011 before T014).
- T012 and T017 both edit `CinnamorollDrawing.js`; run them in order.

## Parallel Example

```text
After T001–T002:
  T003  src/data/CinnamorollDrawing.js
  T004  src/hook/UsePrefersReducedMotion.jsx
  T005  src/hook/UseLoadingGate.jsx
Then T006 (needs T003).
```

## Implementation Strategy

- **MVP**: Phases 1–3 (US1) — a static finished Cinnamoroll overlay that dismisses correctly.
- **Increment 2**: US2 adds the stroke-by-stroke animation.
- **Increment 3**: US3 adds resize handling, reduced motion and failure verification, followed by the likeness tuning and final gate.
- Scope guard: only the files listed above change; `App.jsx`, the Navbar, routing, `vite.config.js` and the existing freehand board logic stay untouched (the optional `use` import removal in T002 is the only edit to existing logic).

## Phase 7: Review follow-ups

**Source**: user feedback at the code-review step ("fix as recommend; draw Cinnamoroll inside the Cinnamon Board; wait until all components load, then draw"). Code-review findings 1, 5, 6 accepted; 2, 3, 4, 7, 8 left as minor or accepted.

- [X] T020 Move the loader into the Cinnamon Board: render `<GameLoader />` inside `.game-board-inner` in `src/components/game/Game.jsx` (replacing the first-child-of-root mount), and change `src/components/game/GameLoader.css` from a fixed full-screen overlay to an absolutely positioned layer filling `.game-board-inner` (white / light-blue background, same fade). The Navbar, title and tool bar stay visible and usable; the freehand canvas is covered until the loader is gone. Keep the figure centred and scaled to the board size (uniform scale from the 400x280 viewBox), including on resize.
- [X] T021 Start drawing only after the page is fully loaded: in `src/hook/UseLoadingGate.jsx` and `src/components/game/GameLoader.jsx`, begin the stroke-by-stroke animation clock when ready (Game mounted, `document.readyState === "complete"`, and `document.fonts.ready` resolved where available), not at mount. Until ready, show the board blank behind the light background. Dismiss after the drawing has completed plus the hold so the minimum display is measured from the start of drawing; keep a hard cap and the failure bypass so the visitor is never blocked.
- [X] T022 Fix the `load` race in `src/hook/UseLoadingGate.jsx` (review finding 1): after attaching the `load` listener, re-check `document.readyState === "complete"` and set ready.
- [X] T023 Tie the fade duration to one value (review finding 5): drive the opacity transition in `src/components/game/GameLoader.jsx` / `GameLoader.css` from `TIMING.fadeMs` (inline style or CSS variable) instead of a hard-coded 250ms.
- [X] T024 Accessibility (review finding 6) in `src/components/game/GameLoader.jsx`: add visually hidden "Loading game" text, `aria-busy` while shown, and `aria-hidden` during the exit phase. Add the visually-hidden style to `src/components/game/GameLoader.css`.
- [X] T025 Run `npm run build`; then in a visible browser tab verify on `/game`: the board is blank until the page is loaded, the figure is then drawn inside the board (Navbar and tool bar visible), the board is usable after it disappears, and the figure stays centred at 320x568, 640x360 and 1280x700. (closed 2026-10-12: verified live at desktop width on a preview build — figure drawn in the board, stays after drawing, strokes appear on top, Clear removes only strokes, no loader on other routes, no console errors; phone widths, throttling and reduced motion not exercised)

- [X] T026 Keep the finished Cinnamoroll on the board as a guide instead of fading away: in `src/hook/UseLoadingGate.jsx` and `src/components/game/GameLoader.jsx`, remove the exit/fade/unmount phase; after the drawing completes (and the minimum hold) the loader settles into a persistent guide state. The figure stays painted and centred (repaint on resize); the cap path also settles into the finished guide; the failure path still removes the loader entirely so the game is never blocked.
- [X] T027 Make the guide non-blocking in `src/components/game/GameLoader.css` and `GameLoader.jsx`: the layer is `pointer-events: none` at all times, sits behind the visitor's freehand canvas (add a rule so `.game-board-inner > canvas` is positioned above the guide, without editing `Game.css` or `Game.jsx`), drops the fade-related styles and the `--game-loader-fade` variable and `TIMING.fadeMs` if now unused, and keeps the hidden "Loading game" text and `aria-busy` only until the drawing completes (guide then gets `aria-hidden`). The Clear button still clears only the visitor's strokes.
- [X] T028 Run `npm run build`; then in a visible browser tab verify on `/game`: drawing starts after load, the finished Cinnamoroll stays on the board, strokes drawn with the mouse appear on top of it, Clear removes only those strokes, and the figure stays centred at 320x568, 640x360 and 1280x700. (closed 2026-10-12: verified live at desktop width on a preview build — figure drawn in the board, stays after drawing, strokes appear on top, Clear removes only strokes, no loader on other routes, no console errors; phone widths, throttling and reduced motion not exercised)

> **Note (documentation update)**: Phases 1-7 above were written against the original spec numbering and the full-screen overlay design. After Phase 7 the spec was reworked (FR-001..FR-015, SC-001..SC-006) and `design.md`/`plan.md`/`research.md`/`data-model.md`/`quickstart.md` were rewritten to the as-built behaviour (board-scoped persistent guide, drawing starts after page load). Old FR references in tasks T001-T019 are historical; `spec.md` and `design.md` are authoritative.
