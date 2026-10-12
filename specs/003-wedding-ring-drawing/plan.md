# Implementation Plan: Wedding Ring Drawing

**Branch**: `003-wedding-ring-drawing` | **Date**: 2026-10-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-wedding-ring-drawing/spec.md`

## Summary

Add a second persistent guide drawing, a diamond wedding ring (white/silver band, light-blue/white sparkle), to the Game page board, to the left of Cinnamoroll, at the same drawn size and sitting slightly higher. It follows the 001 pattern exactly: hand-authored `Path2D` stroke data in `src/data`, stroke-by-stroke dash-offset animation on its own `<canvas>`, start after page ready, instant paint on cap or reduced motion, no fade/unmount, `pointer-events: none` beneath the freehand canvas. A small layout wrapper places the two guide components ring-left / Cinnamoroll-right in equal slots (ring raised by a small tunable offset); each is an independent component so one failing never removes the other. All Cinnamoroll files (`drawCinnamoroll.js`, `CinnamorollDrawing.js`, `GameLoader.*`) stay byte-untouched; only its slot size changes because it now shares the board. No new dependencies. Details: [research.md](./research.md).

## Technical Context

**Language/Version**: JavaScript/JSX, React 18.3, Vite 7

**Primary Dependencies**: none new (Canvas 2D, `Path2D`, `ResizeObserver`, `matchMedia`; existing `useLoadingGate`, `usePrefersReducedMotion`; read-only import of `TIMING`)

**Storage**: N/A

**Testing**: no test runner configured; verification is `npm run build` plus the browser walkthrough in [quickstart.md](./quickstart.md)

**Target Platform**: modern mobile and desktop browsers, GitHub Pages under `/tumi-website`

**Project Type**: single-page web app (one area: `frontend`, root `.`)

**Performance Goals**: two rAF loops of about 1.5 s at display rate on a mid-range phone; game usable immediately; added code and data under 6 KB

**Constraints**: mobile-first 320-1920 px, side by side non-overlapping at all widths, never block the game (FR-012), each drawing fails independently, DPR cap 2, ring only on `/game`, no pointer input on guides

**Scale/Scope**: 1 page, 2 new components (ring, wrapper) with CSS, 1 data module, 1 ring draw module, 1 tiny edit to `Game.jsx`

## API Contracts

None. Single `frontend` area and `requireContracts` is false; no API, backend or cross-area interface is added or changed, so no `contracts/` files are written. Internal module surfaces are in [design.md](./design.md).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / standard | Pre-research | Post-design |
|----------------------|--------------|-------------|
| I Mobile-first | Pass: phone is primary target in spec | Pass: two equal flex slots, each stage a percentage of its slot with a px cap; checked at 320/360/640x360/1920 in quickstart |
| II Performance | Pass | Pass: vector data in bundle, no images, no libs, DPR cap 2 |
| III Component structure | Pass | Pass: `components/game/{RingGuide,GameGuides}.{jsx,css}`, data in `src/data`, hooks reused from `src/hook` |
| IV Simplicity | Pass | Pass: reuses gate hook, reduced-motion hook and draw routine; one deliberate duplication of the canvas effect and draw routine (research R2, R3) to leave Cinnamoroll untouched |
| V Static-deploy safety | Pass | Pass: no asset or route URLs added |
| Hard constraints (JS/JSX, no heavy deps) | Pass | Pass |
| Quality gate `npm run build` | n/a | In quickstart |
| Verification: browser walkthrough | n/a | quickstart.md steps 1-12 |

No violations; Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/003-wedding-ring-drawing/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── design.md
└── tasks.md              # /speckit-tasks (not created here); no contracts/ (see API Contracts)
```

### Source Code (repository root)

```text
src/
├── data/RingDrawing.js                   # NEW   RING_VIEWBOX (400x280), RING_PALETTE, RING_STROKES
└── components/game/
    ├── RingGuide.jsx                     # NEW   ring canvas + gate + rAF draw + resize (mirror of GameLoader)
    ├── RingGuide.css                     # NEW   ring stage (same size rule as Cinnamoroll) + --ring-raise offset
    ├── GameGuides.jsx                    # NEW   wrapper: <RingGuide/> (left) then <GameLoader/> (right)
    ├── GameGuides.css                    # NEW   absolute flex row, equal slots, overrides .game-loader slot
    ├── drawRing.js                       # NEW   own prepare() + drawRing(ctx, w, h, t, strokes, drawMs); self-contained
    └── Game.jsx                          # EDIT  replace <GameLoader/> with <GameGuides/>
```

**Structure Decision**: single `frontend` area. `GameLoader.jsx`, `GameLoader.css`, `CinnamorollDrawing.js`, `drawCinnamoroll.js`, hooks, `Game.css`, routing, Navbar and other pages are unchanged.

## Complexity Tracking

No Constitution Check violations.

## Design Sketches

Key implementation snippets for review live in [design.md](./design.md), written during
planning and reviewed at the plan gate before tasks are generated.

> **Post-implementation revision (user request, approved on review)**: the ring is now drawn smaller than Cinnamoroll, which is enlarged. Slots use flex-grow 6 (Cinnamoroll) : 4 (ring); stage caps are 560px (Cinnamoroll, override in `GameGuides.css`) and 320px (ring, `RingGuide.css`). This supersedes every "same size" / "equal slot" statement in this document. Cinnamoroll files remain untouched.
