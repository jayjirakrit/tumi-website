# Quickstart / Verification: Game Loading Drawing

Run `npm run dev`, open `http://localhost:5173/tumi-website/game` (base path `/tumi-website`).

## Gate
`npm run build` succeeds. Also `npm run preview` and open `/tumi-website/game` to confirm the bundle works under the base path.

## Browser walkthrough (desktop and mobile, per constitution)
Use DevTools device emulation; hard-reload on `/game` each time.
1. **1280x800**: Cinnamoroll is drawn stroke by stroke (ears, head, body, then eyes, cheeks, mouth), centred and crisp; the game appears at about 1.7-2 s with no flicker of a half drawing (FR-001..004, 010, 011).
2. **360x640 and 320x568**: whole figure visible, centred, no scrollbars. Rotate to 640x360: figure rescales and stays whole (FR-005, SC-004).
3. **1920x1080**, also at DPR 2: proportionate, not blurry (SC-004).
4. **Resize mid-animation**: drawing continues and stays whole and centred.
5. **Reduced motion**: DevTools Rendering -> emulate `prefers-reduced-motion: reduce`; finished figure shows immediately, no stroke animation, game follows (FR-008).
6. **Slow 4G + CPU 6x throttle**: figure ends finished (no repeat, not frozen mid-stroke); game appears within about 0.5 s of ready (SC-003).
7. **Failure**: before load set `Path2D = undefined` (or break `HTMLCanvasElement.prototype.getContext`) and reload; the game appears with no click and no uncaught error (FR-007, SC-005).
8. **Isolation**: visit `/`, `/journey`, `/about`, `/other`: no loader. Leave `/game` and return: loader plays again (FR-009).
9. **After loader**: draw on the board, Clear, change colour and width; behaviour unchanged, canvas not 0x0.
10. Compare side by side with `src/img/Cinnamoroll.png` (SC-002 review).
