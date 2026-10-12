# Data Model: Wedding Ring Drawing

No persisted data, API or storage. Static in-memory definitions in `src/data/RingDrawing.js`; the `Stroke` schema is the one in `specs/001-game-loading-canvas/data-model.md` (unchanged).

## Module constants
| Name | Type | Notes |
|------|------|-------|
| `RING_VIEWBOX` | `{ w: 400, h: 280 }` | Same logical box as Cinnamoroll's, so both draw at the same scale; ring art is centred in it |
| `RING_PALETTE` | object | `metalFill #DDE5EE`, `metalLine #7F93AA`, `metalShade #B7C4D3`, `white #FFFFFF`, `gemFill #E4F4FC`, `gemFacet #BFE3F7`, `sparkle #5BC4F2` |
| `RING_STROKES` | `Stroke[]` | Back to front: band, bandShine, bandShade, collet, gem, gemFacetFill, gemLines, sparkleA, sparkleB, sparkleC |

Timing is not redefined: the ring imports `TIMING` read-only from `CinnamorollDrawing.js` (never edited) (`drawMs 1500`, `minMs 1700`, `capMs 12000`) so both finish together.

## Stroke rules specific to the ring
- Slices (`start`/`end`, fractions of `drawMs`) overlap; the last `end` is exactly `1.0`.
- `band` is one path with two subpaths drawn in opposite directions so a nonzero fill leaves a transparent hole; its dash length is the sum of both circumferences (outer drawn first).
- `gemFacetFill` is fill-only (`stroke: null`) and fades in by alpha.
- No gold hues anywhere in `RING_PALETTE`.

## Derived at runtime (not stored)
`len` per stroke from `getTotalLength()`; `0` or an error means the stroke is drawn whole. Progress `p` as in 001.

## Component state (`RingGuide`)
From `useLoadingGate`: `phase` (`show` -> `done` | `gone`), `ready`, `capped`, `fail`. Only `gone` unmounts (returns `null`). `done` changes nothing visible.

## Layout constant (CSS, not data)
`--ring-raise: 4%` on `.ring-guide__stage`: upward offset as a percentage of the stage height; tunable, keep at or below about 5%.
