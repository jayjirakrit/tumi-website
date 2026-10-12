# Research: Wedding Ring Drawing

Phase 0. No NEEDS CLARIFICATION remain. Baseline: the 001 as-built pattern (`GameLoader.jsx`, `drawCinnamoroll.js`, `useLoadingGate`).

## R1 One canvas for both, or one canvas each
- **Decision**: one canvas each, in separate components.
- **Rationale**: FR-012 requires either drawing to fail without affecting the other. With separate components each has its own try/catch and `fail()`; the failing one returns `null` and the sibling is untouched. A shared canvas would require editing Cinnamoroll's draw loop (FR-011 risk).
- **Rejected**: merging into `GameLoader` (couples failure, edits Cinnamoroll code); drawing on the freehand canvas (Clear would erase it).

## R2 Reuse versus refactor of the canvas effect
- **Decision**: `RingGuide.jsx` mirrors `GameLoader.jsx` (about 60 duplicated lines of effect). No shared `useGuideCanvas` hook extracted now.
- **Rationale**: extracting means rewriting the proven Cinnamoroll component, contradicting "do not modify Cinnamoroll's look/behavior". Two copies are acceptable; a refactor can follow once both are verified.
- **Reused as is (imported, never edited)**: `useLoadingGate` (ready/cap/fail), `usePrefersReducedMotion`, `TIMING`.

## R3 Drawing routine
- **Decision (user-confirmed at gate 2)**: new self-contained `drawRing.js` with its own `prepare()` and `drawRing(ctx, w, h, t, strokes, drawMs)`; it imports only `RING_VIEWBOX` from the ring data. `drawCinnamoroll.js` and `CinnamorollDrawing.js` stay byte-untouched; no `viewbox` parameter is added anywhere.
- **Rationale**: FR-011 and the gate-2 instruction. Cost is about 40 duplicated lines (easing, dash-offset, fill fade); the ring may later diverge freely.

## R4 Simultaneous start and finish
- **Decision**: both components call `useLoadingGate` independently and share `TIMING.drawMs` (1500) via a read-only import from `CinnamorollDrawing.js`. Stroke slices of the ring end at 1.0.
- **Rationale**: both gates resolve from the same `load`/`document.fonts.ready` signals, so React 18 batches both `ready` updates into one commit and the two effects start within the same frame. Importing one `drawMs` guarantees equal duration (FR-004, FR-005, SC-003). Cap (12 s) and reduced motion behave identically in both.
- **Risk**: a sub-frame offset in `t0` is invisible; first frame may compute a tiny negative `t`, which `clamp01` handles.

## R5 Layout: beside, same size, ring raised
- **Decision**: wrapper `.game-guides` is an absolute, `pointer-events: none`, `display: flex` row filling `.game-board-inner`; two equal slots (`flex: 1 1 0; min-width: 0`). DOM order: ring in slot 1 (left), Cinnamoroll in slot 2 (right). The ring uses the same `400 / 280` aspect, `RING_VIEWBOX` of 400x280 and the same stage rule as Cinnamoroll (`width: min(90%, 480px); max-height: 90%`), so both are drawn at identical dimensions and scale.
- **Raise**: ring stage gets `transform: translateY(calc(-1 * var(--ring-raise)))` with `--ring-raise: 4%` (percentage of the stage's own height). A transform does not affect layout, so no overlap or reflow. It is one CSS variable to tune; keep it at or below about 5% so the stage stays inside the slot's 5% vertical margin (the slot clips with `overflow: hidden`).
- **Rationale**: equal slots guarantee no overlap at any width (SC-004); identical stage rules keep size parity at every width, and both shrink together because both are slot percentages. Overrides of `.game-loader` live in `GameGuides.css`, so `GameLoader.css` is untouched.
- **Rejected**: grid with fixed columns (no gain); stacking on narrow screens (spec says side by side on phones); media queries (not needed); negative margin for the raise (affects layout).
- **Narrow-width check**: at 320 px the board inner is about 220 px wide, so each slot is about 110 px; both drawings about 99x69. Small but whole; accepted per the spec edge case and the gate-2 decision.

## R6 Ring artwork
- **Decision**: flat front view of a single ring drawn in a 400x280 viewbox (art about 172 units wide, 242 tall, centred; same box as Cinnamoroll): band as one path of two opposite-winding circles (nonzero fill leaves a transparent hole), collet, brilliant-cut diamond (outline, facet lines, light-blue facet fill), three four-point sparkles.
- **Palette**: silver `#DDE5EE` fill / `#7F93AA` outline (no brown, no gold), diamond `#E4F4FC` with `#BFE3F7` facet, sparkle outline `#5BC4F2` with white fill, white highlight; all from Cinnamoroll's cool palette (`skyBlue`, `eyeBlue`, `white`). Brown outline is deliberately not reused because it reads as gold (FR-003).
- **Order (z and animation)**: band -> highlight -> collet -> diamond -> facets -> sparkles last, so the diamond appears to "light up" at the end.

## R7 Accessibility
- **Decision**: ring is decorative: `aria-hidden="true"` from the start, no `role="status"`, no hidden text. Cinnamoroll's existing status region is unchanged.
- **Rationale**: avoids a second "loading" announcement.

## R8 Failure semantics
- **Decision**: ring `fail()` -> `phase gone` -> component returns `null`; the flex slot disappears and the remaining guide widens to the full row (still centred, still capped). Same for Cinnamoroll failing.
- **Rationale**: FR-012 and the edge case "only one can be shown".
