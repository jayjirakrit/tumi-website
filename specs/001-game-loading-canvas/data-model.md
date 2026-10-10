# Data Model: Game Loading Drawing

No persisted data, API or storage. Static in-memory definitions in `src/data/CinnamorollDrawing.js` (key excerpt in [design.md](./design.md) 4.2).

## Module constants
| Name | Type | Notes |
|------|------|-------|
| `VIEWBOX` | `{ w: 400, h: 280 }` | Logical coordinate space for all paths |
| `PALETTE` | object | `white #FFFFFF`, `skyBlue #BFE3F7` (ear/body shading, backdrop), `eyeBlue #5BC4F2`, `outline #B98F62` (subtle brown), `cheekPink #F9D3E0` |
| `TIMING` | `{ drawMs: 1500, minMs: 1700, fadeMs: 250, maxMs: 4000 }` | research R5, R8 |
| `STROKES` | `Stroke[]` | Ordered back to front; array order = paint order |

## Stroke
| Field | Type | Rules |
|-------|------|-------|
| `id` | string | e.g. `earL`, `head`, `eyeL`; debug/test handle |
| `d` | string | SVG path data in VIEWBOX units |
| `stroke` | colour or `null` | Outline colour; `null` = fill-only shape |
| `fill` | colour or `null` | Painted (fading in) after the outline completes |
| `width` | number | Line width in VIEWBOX units (scales with canvas) |
| `start`, `end` | number 0-1 | Slice of `drawMs` in which the stroke animates; `0 <= start < end <= 1`; slices may overlap; the last `end` is 1 |

## Derived at runtime (not stored)
- `len` per stroke from `getTotalLength()`; 0 or error means the stroke is drawn complete.
- Progress `p = ease(clamp((t - start*drawMs) / ((end - start)*drawMs)))`, easeInOutQuad.

## Hook state (`useLoadingGate`)
`ready`, `minElapsed`, `failed`, `phase: "show" | "exit" | "gone"`. Transitions: show -> exit when `(ready && minElapsed) || failed || maxElapsed`; exit -> gone after `fadeMs` (0 under reduced motion).
