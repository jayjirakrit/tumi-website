# Quickstart / Verification: Game Loading Drawing

As-built. Run `npm run dev`, open `http://localhost:5173/tumi-website/game` (base path `/tumi-website`).

## Gate
`npm run build` succeeds (passes as built). Also `npm run preview` and open `/tumi-website/game` to confirm the bundle works under the base path.

## Browser walkthrough (desktop and mobile, per constitution)
Use DevTools device emulation; hard-reload on `/game` each time. Steps marked (unverified) have not yet been checked live.
1. **1280x800**: Navbar, title and tool bar stay visible. Once the page is ready, Cinnamoroll is drawn stroke by stroke inside the board (ears, tail, body, head, arms, then eyes, cheeks, mouth), centred and crisp, on a transparent background. The finished figure then stays (no fade, no removal). Nothing is blocked at any time (FR-001..004, 010) (animation unverified).
2. **Layering**: the loader's rect equals the board; it has `pointer-events: none` and sits below the freehand canvas (verified). Draw on the board during and after the animation: strokes paint over the figure and the pointer reaches the board (strokes over figure unverified).
3. **360x640 and 320x568**: whole figure visible, centred, no scrollbars. Rotate to 640x360: figure rescales and stays whole, including after the draw has finished (FR-010, SC-004) (unverified).
4. **1920x1080**, also at DPR 2: proportionate, not blurry (SC-004) (unverified).
5. **Resize mid-animation**: drawing continues and stays whole and centred (unverified).
6. **Reduced motion**: DevTools Rendering -> emulate `prefers-reduced-motion: reduce`; finished figure shows immediately, no stroke animation (FR-014) (unverified).
7. **Slow load**: Slow 4G + CPU 6x throttle; nothing is drawn until the page is ready, then the animation runs once. Block `load` (or wait 12 s): the finished figure appears at once at the cap (timing unverified).
8. **Failure**: before load set `Path2D = undefined` (or break `HTMLCanvasElement.prototype.getContext`) and reload; the loader is removed, the game is fully usable, no uncaught error (FR-012, SC-006) (unverified).
9. **Isolation**: visit `/`, `/journey`, `/about`, `/other`: no loader. Leave `/game` and return: it plays again (FR-015).
10. **Board behaviour**: draw, change colour and width; press Clear: only your strokes disappear, the guide figure remains; canvas not 0x0.
11. **Accessibility**: while `show`, the status region has `aria-busy="true"` with hidden "Loading game" text; after about 1.7 s from ready it is `aria-busy="false"` and `aria-hidden="true"`.
12. Compare the finished figure side by side with `src/img/Cinnamoroll.png` (SC-002 review; renders recognisably, verified).
