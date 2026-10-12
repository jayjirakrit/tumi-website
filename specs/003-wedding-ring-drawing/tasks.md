---

description: "Task list for Wedding Ring Drawing"
---

# Tasks: Wedding Ring Drawing

**Input**: Design documents from `/specs/003-wedding-ring-drawing/`

**Prerequisites**: plan.md, spec.md, design.md, research.md, data-model.md, quickstart.md (no `contracts/`: single `frontend` area)

**Tests**: Not requested and no test runner is configured. Verification is `npm run build` plus the browser walkthrough in `quickstart.md`.

**Organization**: Grouped by user story. All tasks are in the `frontend` area (root `.`). Cinnamoroll files (`src/components/game/drawCinnamoroll.js`, `src/data/CinnamorollDrawing.js`, `src/components/game/GameLoader.jsx`, `src/components/game/GameLoader.css`) MUST stay byte-untouched; `TIMING` is imported read-only.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story (US1-US4) from spec.md
- Paths are relative to the repo root; code is specified in `design.md` section 4

---

## Phase 1: Setup

**Purpose**: Confirm the starting point and the files that must not change

- [X] T001 Review the 001 pattern and reused modules in `src/components/game/GameLoader.jsx`, `src/components/game/GameLoader.css`, `src/components/game/drawCinnamoroll.js`, `src/data/CinnamorollDrawing.js` (read-only; confirm `TIMING` exports `drawMs`, `minMs`, `capMs`) and the hooks `src/hook/UseLoadingGate.js(x)`, `src/hook/UsePrefersReducedMotion.js(x)`; note exact hook file names/extensions for imports
- [X] T002 Run `npm run build` to record a passing baseline before any change

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Ring artwork data and draw routine that every story depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 [P] Create `src/data/RingDrawing.js` exporting `RING_VIEWBOX` (`{ w: 400, h: 280 }`), `RING_PALETTE` (silver/white/light-blue only, no gold) and ordered `RING_STROKES` (band, bandShine, bandShade, collet, gem, gemFacetFill, gemLines, 3 sparkles; ids unique, `0 <= start < end <= 1`, last `end` = 1.0) per design.md 4.2
- [X] T004 [P] Create `src/components/game/drawRing.js` exporting `prepareRing(strokes)` and `drawRing(ctx, w, h, t, strokes, drawMs)` (self-contained: own easing, dash-offset stroke animation, fill fade-in, centred 400x280 scale; no import from any Cinnamoroll file) per design.md 4.2

**Checkpoint**: Ring data and draw routine exist; nothing is wired in yet

---

## Phase 3: User Story 1 - See a wedding ring drawn beside Cinnamoroll (Priority: P1) 🎯 MVP

**Goal**: A diamond ring is drawn on the Game board to the left of Cinnamoroll, both animating together after page load, and both staying on the board.

**Independent Test**: Open `/game` fresh; after loading, the ring (left) and Cinnamoroll (right) are drawn at the same time, finish together and remain visible.

### Implementation for User Story 1

- [X] T005 [P] [US1] Create `src/components/game/RingGuide.css` with `.ring-guide` (`--ring-raise: 4%`, grid centre, `overflow: hidden`, `pointer-events: none`), `.ring-guide__stage` (`width: min(90%, 480px); aspect-ratio: 400 / 280; max-height: 90%`, `transform: translateY(calc(-1 * var(--ring-raise)))`) and `.ring-guide canvas` per design.md 4.2
- [X] T006 [US1] Create `src/components/game/RingGuide.jsx`: own `<canvas>`, `useLoadingGate` + `TIMING` (read-only import), rAF loop calling `prepareRing`/`drawRing` from `t = 0` to `drawMs` once the gate is ready, DPR-capped `fit()`, cleanup of rAF/observer, `aria-hidden="true"` and no status role; the figure stays mounted after the animation (depends on T003, T004, T005)
- [X] T007 [P] [US1] Create `src/components/game/GameGuides.jsx` rendering `<RingGuide />` first (left) then `<GameLoader />` (right) inside `.game-guides` (depends on T006)
- [X] T008 [P] [US1] Create `src/components/game/GameGuides.css`: `.game-guides` absolute `inset: 0`, `z-index: 0`, `display: flex`, `pointer-events: none`; `.game-guides .game-loader, .game-guides .ring-guide` as equal flex slots (`position: relative; inset: auto; flex: 1 1 0; min-width: 0; height: 100%`)
- [X] T009 [US1] Edit `src/components/game/Game.jsx`: replace the `GameLoader` import and `<GameLoader />` element with `GameGuides` (only change; keep it the first child of `.game-board-inner`) (depends on T007, T008)
- [X] T010 [US1] Run `npm run build`, then walk through `quickstart.md` for ring + Cinnamoroll appearing together, finishing together and persisting; render-check the ring paths in `src/data/RingDrawing.js` and tune shape/colour until it reads as a diamond ring with a silver band (SC-002)

**Checkpoint**: MVP: both drawings animate side by side and persist

---

## Phase 4: User Story 2 - Draw freehand over both drawings (Priority: P1)

**Goal**: Visitor strokes appear above both guides and Clear removes only the visitor's strokes.

**Independent Test**: Draw over both drawings, press Clear: only strokes vanish; repeat Clear with none present.

### Implementation for User Story 2

- [X] T011 [US2] Verify layering and input in `src/components/game/GameGuides.css` and `src/components/game/RingGuide.css`: wrapper and slots have `pointer-events: none`, wrapper `z-index: 0` sits below the freehand canvas (`.game-board-inner > canvas { z-index: 1 }` in `GameLoader.css`, unchanged); fix only in `GameGuides.css` / `RingGuide.css` if strokes are hidden or input is blocked
- [X] T012 [US2] Browser check per `quickstart.md`: freehand over ring and Cinnamoroll, press Clear (with strokes, with none, repeatedly, and mid-animation); confirm `src/components/game/Game.jsx` Clear logic is unchanged and both guides remain

**Checkpoint**: US1 and US2 work together

---

## Phase 5: User Story 3 - Same animated drawing style as Cinnamoroll (Priority: P2)

**Goal**: Ring follows the 001 behaviour: instant display on slow load or reduced motion, and a failure never breaks the game or the sibling drawing.

**Independent Test**: Reload with throttling and with reduced motion enabled; force a ring failure.

### Implementation for User Story 3

- [X] T013 [US3] In `src/components/game/RingGuide.jsx` add `usePrefersReducedMotion` and the cap path: when reduced motion is on or the cap is reached before ready, start at `t = drawMs` and paint the finished ring once with no rAF loop; keep `ready` read once so a finished ring is never restarted (design.md 4.2)
- [X] T014 [US3] In `src/components/game/RingGuide.jsx` add failure isolation and resize: wrap setup/paint in try/catch calling `fail()` (component returns `null` when `phase === "gone"`), and a `ResizeObserver` that refits and repaints the held figure
- [ ] T015 [US3] Browser check per `quickstart.md`: slow-network/cap case, reduced-motion case, forced ring failure (temporary throw in `src/components/game/RingGuide.jsx`, then remove) shows Cinnamoroll and game still working; verify no stray rAF/observer after leaving `/game`

**Checkpoint**: Behaviour parity with Cinnamoroll

---

## Phase 6: User Story 4 - Both drawings fit on phones and desktops (Priority: P3)

**Goal**: Both drawings are whole, same size, non-overlapping at 320-1920 px; the ring sits slightly higher.

**Independent Test**: View at 320, 360, 640x360, 1280, 1920 and rotate.

### Implementation for User Story 4

- [X] T016 [US4] Verify equal ring and Cinnamoroll rects, ring left of Cinnamoroll with no overlap, and the raise (`--ring-raise`, keep at or below about 5%) at all widths per `quickstart.md` step 3b; adjust only `src/components/game/RingGuide.css` and `src/components/game/GameGuides.css`
- [ ] T017 [US4] Check iOS Safari/Firefox (or closest available) band dash length from `getTotalLength()`; if the inner circle pops in, split the band into two strokes in `src/data/RingDrawing.js` (only the outer one filled)
- [X] T018 [US4] Rotate/resize check: both guides refit and stay whole; confirm `git diff` shows no change to the four protected Cinnamoroll files

**Checkpoint**: All stories complete

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T019 Run `npm run build` (quality gate) and fix any lint/build errors in the new files under `src/components/game/` and `src/data/RingDrawing.js`
- [X] T020 Run the full `quickstart.md` validation (steps 1-12) and confirm `git status` lists only: `src/data/RingDrawing.js`, `src/components/game/{drawRing.js,RingGuide.jsx,RingGuide.css,GameGuides.jsx,GameGuides.css,Game.jsx}` (plus the unrelated pre-existing `Memory.jsx` change)

---

## Dependencies & Execution Order

- **Phase 1** → **Phase 2** (blocks all stories) → **US1** → US2, US3, US4.
- **US1** is the MVP and creates every file; US2-US4 are verification and refinements that build on it (US3 edits `RingGuide.jsx`, so run after US1 and sequentially: T013 → T014).
- **Polish** after all stories.
- Within US1: T005 ∥ T008 (after Phase 2); T006 needs T003, T004, T005; T007 needs T006; T009 needs T007, T008; T010 last.

### Parallel Opportunities

- T003 and T004 (different files).
- T005 and T008 (different CSS files).
- After US1: T011/T012 (US2) can run alongside T016/T017 (US4); T013-T015 (US3) edit `RingGuide.jsx` and run in order.

## Parallel Example: Foundational

```text
Task: "Create src/data/RingDrawing.js ..."            (T003)
Task: "Create src/components/game/drawRing.js ..."    (T004)
```

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phases 1-2, then US1 (T005-T010).
2. STOP and validate: ring and Cinnamoroll animate together, side by side, and persist.

### Incremental Delivery

1. US1 → demo MVP. 2. US2 → confirm game behaviour. 3. US3 → instant display and failure isolation. 4. US4 → responsive and raise tuning. 5. Polish.

## Notes

- Never edit the protected Cinnamoroll files; `Game.jsx` is the only existing file changed.
- Colours stay silver/white/light-blue (no gold or brown).
- Commit per logical group using tags `[ADD]`/`[IMP]` + `[FE]` from `.sdd.config.json`.
