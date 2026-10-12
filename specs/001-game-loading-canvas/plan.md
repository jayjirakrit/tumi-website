# Implementation Plan: Game Loading Drawing

**Branch**: `001-game-loading-canvas` | **Date**: 2026-10-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-game-loading-canvas/spec.md`

## Summary

**As-built.** Show an animated, stroke-by-stroke 2D Cinnamoroll on a canvas inside the game board (an absolute layer in `.game-board-inner`; Navbar, title and tool bar stay visible). The figure is hand-authored vector path data (`src/data`) drawn with the 2D canvas API (`Path2D` + dash-offset animation), no new dependencies and no image download. Drawing starts once the page is ready (`document.readyState === "complete"` plus `document.fonts.ready`). After drawing there is no fade or unmount: the finished figure stays as a persistent guide beneath the freehand canvas (`pointer-events: none`). A small hook tracks `show` -> `done` (ends `aria-busy` after 1.7 s from ready, or at a 12 s cap from mount) and `gone` on failure so the visitor is never blocked. Reduced motion paints the finished figure at once. Details: [research.md](./research.md).

## Technical Context

**Language/Version**: JavaScript/JSX, React 18.3, Vite 7

**Primary Dependencies**: none new (browser Canvas 2D, `Path2D`, `ResizeObserver`, `matchMedia`)

**Storage**: N/A

**Testing**: no test runner is configured for this feature; verification is `npm run build` plus the browser walkthrough in [quickstart.md](./quickstart.md)

**Target Platform**: modern mobile and desktop browsers (production browserslist), GitHub Pages under `/tumi-website`

**Project Type**: single-page web app (one area: `frontend`, root `.`)

**Performance Goals**: draw loop at display rate on a mid-range phone; game usable immediately (nothing covers the board); loader code and data well under 10 KB

**Constraints**: mobile-first 320-1920 px, never block the game (FR-012), reduced-motion fallback, canvas backing store capped at DPR 2, loader shown only on `/game`, guide never takes pointer input

**Scale/Scope**: 1 page, 1 new component, 1 hook (+1 tiny hook), 1 data module, 1 small edit to `Game.jsx`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / standard | Pre-research | Post-design |
|----------------------|--------------|-------------|
| I Mobile-first | Pass: phone is primary target in spec | Pass: stage `min(90%, 480px)` of the board, uniform scale, verified at 320/360/640x360 |
| II Performance | Pass: no extra downloads promised | Pass: vector data in bundle, no libs, DPR cap 2, no PNG used |
| III Component structure | Pass | Pass: `components/game/GameLoader.{jsx,css}`, data in `src/data`, hooks in `src/hook` |
| IV Simplicity | Pass | Pass: one component, two small hooks, no boundary/context/store |
| V Static-deploy safety | Pass | Pass: no asset or route URLs added; routing unchanged |
| Hard constraints (JS/JSX, no heavy deps) | Pass | Pass |
| Quality gate `npm run build` | n/a | In quickstart; passes as built |
| Verification: browser walkthrough | n/a | quickstart.md steps 1-12 |

No violations; Complexity Tracking is empty. Check re-run against the as-built code: no new dependency, no new route or asset URL, `Game.css` untouched.

## Project Structure

### Documentation (this feature)

```text
specs/001-game-loading-canvas/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── design.md
├── contracts/README.md   # states "none": single frontend area, requireContracts=false
└── tasks.md              # /speckit-tasks (not created here)
```

### Source Code (repository root)

```text
src/
├── data/CinnamorollDrawing.js            # NEW  palette, timing, stroke paths
├── hook/UseLoadingGate.jsx               # NEW  ready (load + fonts) + minMs + capMs + fail -> phase show/done/gone
├── hook/UsePrefersReducedMotion.jsx      # NEW  matchMedia boolean
└── components/game/
    ├── GameLoader.jsx                    # NEW  guide layer + canvas + rAF draw + resize
    ├── GameLoader.css                    # NEW  absolute layer, z-index layering, stage sizing, visually-hidden
    ├── drawCinnamoroll.js                # NEW  pure draw(ctx, w, h, t, strokes)
    └── Game.jsx                          # EDIT mount <GameLoader/> as first child of .game-board-inner
```

**Structure Decision**: single `frontend` area. Contracts: none (no inter-area interface; see `contracts/README.md`). `App.jsx` routing, Navbar and other pages are unchanged.

## Complexity Tracking

No Constitution Check violations.

## Design Sketches

Key implementation snippets for review live in [design.md](./design.md), written during
planning and reviewed at the plan gate before tasks are generated.
