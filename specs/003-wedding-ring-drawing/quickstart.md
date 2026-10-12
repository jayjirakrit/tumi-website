# Quickstart / Verification: Wedding Ring Drawing

Run `npm run dev`, open `http://localhost:5173/tumi-website/game` (base path `/tumi-website`).

## Gate
`npm run build` succeeds. Then `npm run preview` and open `/tumi-website/game` to confirm the bundle works under the base path.

## Browser walkthrough (desktop and mobile, per constitution)
Use DevTools device emulation; hard-reload on `/game` each time.
1. **1280x800**: Navbar, title and tool bar visible. Once the page is ready, the ring (left) and Cinnamoroll (right) start together and both finish within about 1.5 s; both stay on the board, side by side, no overlap (FR-001, 004, 005, 006; SC-001, SC-003).
2. **Ring look**: round white/silver band, brilliant-cut diamond on top with light-blue facet and light-blue/white sparkles, no gold or brown. Show 10 reviewers; at least 9 call it a wedding ring (FR-002, 003; SC-002).
3. **Cinnamoroll unchanged**: compare with the pre-change figure: same strokes, colours, animation order and pace (FR-011). `git diff` shows no change to `drawCinnamoroll.js`, `CinnamorollDrawing.js`, `GameLoader.*`. Only its position and slot size changed.
3b. **Ring placement and size**: the ring is on Cinnamoroll's left, drawn at the same width and height as Cinnamoroll (compare the two canvases' rects: equal), and sits slightly higher (top edge a few percent above Cinnamoroll's). Adjust `--ring-raise` in DevTools and confirm nothing is clipped.
4. **Layering and input**: guides have `pointer-events: none` and sit under the freehand canvas. Draw over the ring and over Cinnamoroll, during and after the animation; strokes paint on top (FR-007).
5. **Clear**: draw, press Clear repeatedly, also with no strokes: only strokes vanish, both drawings stay (FR-008; SC-005).
6. **320x568, 360x640, rotate to 640x360**: both drawings whole, side by side, not overlapping or cropped, scaled together; no horizontal scroll; the held figures repaint after rotation with strokes kept (FR-010; SC-004).
7. **1920x1080**, also DPR 2: balanced, crisp (SC-004).
8. **Reduced motion** (Rendering -> `prefers-reduced-motion: reduce`): both finished drawings appear at once, no animation (FR-014).
9. **Slow load**: Slow 4G + CPU 6x; nothing drawn until the page is ready, then both animate once. Block `load` (or wait 12 s): both finished drawings appear at once (FR-004, 013).
10. **Isolation of failure**: (a) before load set `window.Path2D` to throw only when the path string contains the ring's first move (or temporarily break the ring data) so only `RingGuide` fails: Cinnamoroll still draws, game usable. (b) break Cinnamoroll data only: ring still draws. (c) break both: board plain, game usable, no uncaught error (FR-012; SC-006).
11. **Other pages**: visit `/`, `/journey`, `/about`: no guides (FR-015). Leave `/game` and return: plays again; navigate away mid-animation: no console errors, no leaked rAF/observer.
12. **Dev StrictMode**: repeat steps 1 and 5 in `npm run dev`; effects run twice without duplicate or stuck drawings.
