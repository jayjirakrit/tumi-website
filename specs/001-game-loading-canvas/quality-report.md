# Quality Report: Game Loading Drawing (001-game-loading-canvas)

**Verdict: PASS WITH NOTES** (re-verified after Phase 7, see Delta section at the end)

Scope: full, fresh. Area: frontend. Review was by code reading against spec.md and design.md. The dispatcher's Chrome checks are carried over as given. Items it could not verify stay "unverified".

## Acceptance criteria

| ID | Status | Evidence |
|----|--------|----------|
| US1-1 (drawing shown, white/light blue) | met | GameLoader mounted at Game.jsx:80; palette in CinnamorollDrawing.js:5-11; dispatcher render check in Chrome |
| US1-2 (replaced by game, no action) | met (timing unverified) | UseLoadingGate.jsx:24-32 (ready+min -> exit -> gone, unmount at GameLoader.jsx:77) |
| US1-3 / FR-003 (recognisable, brown outline, pink cheeks) | met | Dispatcher render check; strokes for ears, head, eyes, cheeks, mouth and outline colour in CinnamorollDrawing.js. SC-002 stakeholder score not measurable here |
| US2-1 / FR-010 (stroke by stroke) | met (code) | drawCinnamoroll.js:28-44 dash-offset reveal by timestamp. Live animation not observed (tab hidden) |
| US2-2 / FR-011 (min about 1-2 s) | met (code), unverified live | TIMING.minMs=1700 (CinnamorollDrawing.js:13); draw ends at 1500 ms, before the 1700 ms gate |
| US3-1 / FR-005 phone | met | Dispatcher check at 320x568, no horizontal scroll; CSS min(80vw,480px), aspect-ratio, max-height 60vh |
| US3-2 desktop | met | Dispatcher check at 1280x700; DPR cap 2 at GameLoader.jsx:34 |
| US3-3 / FR-008 reduced motion | met (code), unverified live | GameLoader.jsx:27,54-55 paints finished figure; fadeMs=0 at :13; CSS transition none |
| FR-004 / FR-006 / SC-003 | partial (accepted) | Forced 1.7 s hold; 250 ms fade; gone about 1.95 s. Known/accepted tension with FR-006 and SC-001 |
| FR-007 / SC-005 (never blocked) | met (code), unverified live | try/catch around setup, frame and resize calling fail() (GameLoader.jsx:21-70); hard cap 4000 ms (UseLoadingGate.jsx:15). Forced-failure not exercised |
| FR-001 chunk-download window | partial (accepted) | App's plain "Loading..." during chunk download (design open question 1) |
| FR-009 only Game page | met | grep: GameLoader imported only in Game.jsx. Other-route isolation not run live |
| Edge: resize/rotate | met (code), unverified live | ResizeObserver refit with repaint when t>=drawMs (GameLoader.jsx:41,45-51) |
| Edge: slow load, calm finished state | met (code) | The animation loop stops at drawMs; the finished figure stays until ready or the 4 s cap |

## Gates

- `npm run build` -> pass (built in 1.91 s, Game chunk 6.22 kB)
- No lint or test script was run (none specified for this check). No spec tests exist for the hook or drawing (see findings).

## Design conformance

- Hooks, drawing function and component match design.md 4.1-4.3.
- The only differences are small hardening additions: the `ctx` null check and the try/catch in the frame and resize callbacks. These are consistent with FR-007.
- Game.jsx feature lines are the import at line 4 and `<GameLoader />` at line 80, as designed. The pre-existing `use` import still builds. It is out of scope.
- No new dependencies. No secrets, network, storage or user input are involved, so there is nothing to flag on the security side.

## Findings

Critical: none. Major: none.

Minor:
1. Unverified live: 1.7 s / 2 s timing, reduced-motion path, forced-failure path, resize repaint, other-route isolation, navigate-away cleanup, dev StrictMode double effect. Needs a visible-tab run. Owner: frontend/dispatcher.
2. `src/hook/UseLoadingGate.jsx` and `src/components/game/drawCinnamoroll.js` · frontend · no automated specs for the assertions listed in design.md ("Specs must assert"). The repo has no test setup, so this is coverage not delivered, not a regression. Suggested fix: add specs if a test runner is introduced.
3. `src/components/game/GameLoader.jsx:79-83` · frontend · `role="status"` with an `aria-label` on a visual-only overlay. A screen reader announces "Loading game" and nothing else. This is acceptable. Optionally add `aria-busy`.
4. `src/components/game/GameLoader.jsx:16` · frontend · the paint-on-resize path calls `paint()` inside `fit()` before `size` is final for the first call. This is harmless because `t` is below `drawMs` at that point, except in the reduced-motion path, where `paint()` is called again right after. There is one redundant draw. No action needed.
5. Known and accepted, recorded for traceability: the forced 1.7 s minimum against FR-006 and SC-001, App's plain "Loading..." during chunk download, and the overlay hiding the Navbar for about 1.7 s.

---

## Delta re-verification (Phase 7 follow-ups T020-T024)

Scope: full, delta. Changed: UseLoadingGate.jsx, GameLoader.jsx/.css, Game.jsx (mount point), CinnamorollDrawing.js (capMs). Method: code reading plus the dispatcher's Chrome evidence. **Verdict stays PASS WITH NOTES.**

Intent change (user-requested): loader is drawn inside the Cinnamon Board (`.game-board-inner`, Game.jsx:100-101) and drawing starts only once readyState is complete and fonts are ready.

### Findings addressed

| Finding | Status | Evidence |
|---|---|---|
| code-review #1 readyState race | fixed | UseLoadingGate.jsx:28-34 checks readyState, attaches `load`, re-checks; `alive` guard on fonts promise (:20-21) |
| #5 fade duration single source | fixed | `TIMING.fadeMs` -> `fadeMs` -> CSS var `--game-loader-fade` (GameLoader.jsx:13,85; css:9). Reduced motion gives 0 and CSS `transition: none` |
| #6 a11y | fixed | visually-hidden "Loading game" text (:90), `aria-busy` while showing (:87), `aria-hidden` during exit (:88) |
| Old minor #3 (aria-busy) | closed | as above |

### Criteria changes

- US1-1/US1-2/US2-1/US2-2: still met in code. `minMs` (1700) is now measured from ready, and the rAF clock `t0` starts in the same effect run, so the 1500 ms draw still ends before the gate opens.
- FR-007 / SC-005: hard cap is now `capMs` 12000 from mount (was 4000). A page that never reaches `load` shows a blank gradient board for up to 12 s, then releases. Failure path still calls `fail()`. Not exercised live.
- Navbar-hidden note (old finding 5) no longer applies: Navbar is visible (dispatcher check).
- FR-006 / SC-001: the visitor-visible wait now includes load + fonts + 1.7 s + 0.25 s. Same accepted tension, slightly larger.

### Gates

- `npm run build` -> pass (1.89 s, Game chunk 6.65 kB)
- No lint or test script exists/was run.

### Live verification status

- Verified by dispatcher (hidden tab): loader rect equals `.game-board-inner`, Navbar visible, `aria-busy="true"`, loader removed afterwards.
- UNVERIFIED: animation actually painting, timing, reduced motion, failure path, resize repaint, StrictMode double effect.

### Hidden-tab question

If the tab is hidden at load, rAF is paused so the figure is never drawn, but `setTimeout` still fires (throttled, about 1 s granularity). `ready` becomes true after load/fonts, `minElapsed` after about 1.7 s, and the loader fades and unmounts without the drawing having completed. It does not matter: nobody sees it, the game is never blocked (consistent with FR-007), and returning to the tab shows the game. Side effect: the same property means an unfocused load skips the animation entirely. Not a defect.

### New / remaining findings (minor)

1. `src/components/game/GameLoader.jsx:8` · frontend · orphaned comment "Hard cap from mount..." with nothing beneath it (the constant moved to TIMING). Remove or move it.
2. `src/hook/UseLoadingGate.jsx:24` · frontend · the no-`document.fonts` branch calls `setReady(true)` without the `alive` guard. Harmless on React 18+ (no warning). Optional.
3. `src/components/game/GameLoader.css:2` · frontend · absolute positioning relies on `.game-board-inner` being a positioned element. The dispatcher's rect check confirms it today; this is a fragile coupling if the board CSS changes.
4. Doc drift (note, not a code defect): design.md 4.1/4.2 and spec wording (full-screen overlay; drawing starts at mount; maxMs 4 s, no wait for load/fonts) no longer match the code (board-scoped; drawing starts at ready; capMs 12 s). Owner: solution-architect/business-analyst to update when convenient.
5. Earlier minors #1, #2, #4 and the accepted items are unchanged.

Critical: none. Major: none.

## Documentation sync note

After the final follow-up (T026-T027: the finished figure stays on the board as a guide), `spec.md` (FR-001..FR-015, SC-001..SC-006), `design.md`, `plan.md`, `research.md`, `data-model.md` and `quickstart.md` were updated to the as-built behaviour. Findings above that mention the full-screen overlay, the Navbar being covered, `maxMs`, or the minimum display time are historical. This report has not been re-run against the final code; live checks listed as unverified in `quickstart.md` remain open.

## Closure (2026-10-12)

Spec closed. Docs were synced to the current code (board-scoped guide that persists after drawing; drawing starts after page load and fonts; `TIMING = { drawMs: 1500, minMs: 1700, capMs: 12000 }`; no fade, exit or `maxMs`). Live check on a production preview at desktop width: the loader sits inside `.game-board-inner` with `pointer-events: none`, the figure is painted and stays, freehand strokes appear on top, Clear removes only the strokes, no loader on other routes, no console errors, `npm run build` passes. Not exercised: phone widths, throttled load, reduced motion, failure path. Earlier findings that mention the overlay, fade or `maxMs` are historical.
