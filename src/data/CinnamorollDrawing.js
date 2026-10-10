// Original hand-authored Cinnamoroll line drawing for the game loading screen.
// Coordinates live in VIEWBOX units; paint order = array order (back to front).
export const VIEWBOX = { w: 400, h: 280 };

export const PALETTE = {
  white: "#FFFFFF",
  skyBlue: "#BFE3F7",
  eyeBlue: "#5BC4F2",
  outline: "#B98F62",
  cheekPink: "#F9D3E0",
};

export const TIMING = { drawMs: 1500, minMs: 1700, capMs: 12000 };

const O = PALETTE.outline;
const W = PALETTE.white;
const S = PALETTE.skyBlue;

// start/end are fractions of drawMs in which each stroke animates.
export const STROKES = [
  // Long drooping ears, behind the head
  { id: "earL", start: 0.0, end: 0.2, stroke: O, width: 5, fill: S,
    d: "M120 58 C80 62 35 100 10 138 C2 165 25 195 70 192 C105 188 128 160 135 132" },
  { id: "earR", start: 0.1, end: 0.3, stroke: O, width: 5, fill: S,
    d: "M286 58 C326 62 371 100 396 138 C404 165 381 195 336 192 C301 188 278 160 271 132" },
  // Curled tail, behind the body
  { id: "tail", start: 0.2, end: 0.32, stroke: O, width: 5, fill: W,
    d: "M152 178 C122 166 100 182 104 202 C108 217 130 222 152 214" },
  // Body and feet
  { id: "body", start: 0.3, end: 0.5, stroke: O, width: 5, fill: W,
    d: "M150 136 C132 175 135 215 165 230 L240 230 C270 215 272 175 256 136" },
  { id: "footL", start: 0.45, end: 0.55, stroke: O, width: 5, fill: W,
    d: "M144 236 a16 9 0 1 0 32 0 a16 9 0 1 0 -32 0 Z" },
  { id: "footR", start: 0.48, end: 0.58, stroke: O, width: 5, fill: W,
    d: "M228 236 a16 9 0 1 0 32 0 a16 9 0 1 0 -32 0 Z" },
  // Head, wide with a flat chin
  { id: "head", start: 0.4, end: 0.7, stroke: O, width: 5, fill: W,
    d: "M105 100 C105 45 145 14 203 14 C262 14 301 45 301 98 C301 128 255 142 203 142 C150 142 105 130 105 100 Z" },
  // Arms in front of the body
  { id: "armL", start: 0.55, end: 0.65, stroke: O, width: 5, fill: W,
    d: "M158 160 C140 158 128 170 132 188 C136 202 150 202 158 196" },
  { id: "armR", start: 0.58, end: 0.7, stroke: O, width: 5, fill: W,
    d: "M238 192 C225 176 222 152 228 136 C232 124 246 128 246 141 C247 156 251 172 254 188" },
  // Face details
  { id: "eyeL", start: 0.7, end: 0.78, stroke: null, width: 0, fill: PALETTE.eyeBlue,
    d: "M137 70 a8 11 0 1 0 16 0 a8 11 0 1 0 -16 0 Z" },
  { id: "eyeR", start: 0.72, end: 0.8, stroke: null, width: 0, fill: PALETTE.eyeBlue,
    d: "M254 70 a8 11 0 1 0 16 0 a8 11 0 1 0 -16 0 Z" },
  { id: "cheekL", start: 0.78, end: 0.88, stroke: null, width: 0, fill: PALETTE.cheekPink,
    d: "M108 99 a22 12 0 1 0 44 0 a22 12 0 1 0 -44 0 Z" },
  { id: "cheekR", start: 0.8, end: 0.9, stroke: null, width: 0, fill: PALETTE.cheekPink,
    d: "M253 99 a22 12 0 1 0 44 0 a22 12 0 1 0 -44 0 Z" },
  { id: "mouth", start: 0.88, end: 1.0, stroke: O, width: 3, fill: null,
    d: "M189 80 q7 9 14 0 q7 9 14 0" },
];
