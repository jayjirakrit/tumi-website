// Wedding ring artwork: flat front view, silver band, brilliant diamond, sparkles.
// Same 400x280 viewbox as Cinnamoroll; on-screen size is set in RingGuide.css / GameGuides.css (ring is the smaller companion).
export const RING_VIEWBOX = { w: 400, h: 280 };

export const RING_PALETTE = {
  metalFill: "#DDE5EE",
  metalLine: "#7F93AA",
  metalShade: "#B7C4D3",
  white: "#FFFFFF",
  gemFill: "#E4F4FC",
  gemFacet: "#BFE3F7",
  sparkle: "#5BC4F2",
};

const P = RING_PALETTE;

// start/end: fractions of TIMING.drawMs; array order is paint order; last end = 1.0
export const RING_STROKES = [
  // Band: outer circle clockwise + inner circle counter-clockwise => transparent hole
  { id: "band", start: 0.0, end: 0.42, stroke: P.metalLine, width: 5, fill: P.metalFill,
    d: "M114 178 A86 86 0 1 1 286 178 A86 86 0 1 1 114 178 Z M138 178 A62 62 0 1 0 262 178 A62 62 0 1 0 138 178 Z" },
  { id: "bandShine", start: 0.34, end: 0.5, stroke: P.white, width: 5, fill: null,
    d: "M128 150 A76 76 0 0 1 160 112" },
  { id: "bandShade", start: 0.36, end: 0.52, stroke: P.metalShade, width: 3, fill: null,
    d: "M156 226 A62 62 0 0 0 244 226" },
  // Collet holding the stone, under the diamond
  { id: "collet", start: 0.44, end: 0.58, stroke: P.metalLine, width: 4, fill: P.metalShade,
    d: "M178 90 L222 90 L212 106 L188 106 Z" },
  // Diamond: outline, light facet fill, facet lines
  { id: "gem", start: 0.5, end: 0.74, stroke: P.metalLine, width: 4, fill: P.gemFill,
    d: "M164 52 L182 24 L218 24 L236 52 L200 100 Z" },
  { id: "gemFacetFill", start: 0.68, end: 0.82, stroke: null, width: 0, fill: P.gemFacet,
    d: "M164 52 L192 52 L200 100 Z" },
  { id: "gemLines", start: 0.7, end: 0.88, stroke: P.sparkle, width: 2.5, fill: null,
    d: "M164 52 L236 52 M182 24 L192 52 L200 24 L208 52 L218 24 M192 52 L200 100 L208 52" },
  // Sparkles last: four-point stars, light blue outline, white fill
  { id: "sparkleA", start: 0.8, end: 1.0, stroke: P.sparkle, width: 3, fill: P.white,
    d: "M282 22 Q282 40 300 40 Q282 40 282 58 Q282 40 264 40 Q282 40 282 22 Z" },
  { id: "sparkleB", start: 0.84, end: 1.0, stroke: P.sparkle, width: 3, fill: P.white,
    d: "M122 59 Q122 70 133 70 Q122 70 122 81 Q122 70 111 70 Q122 70 122 59 Z" },
  { id: "sparkleC", start: 0.88, end: 1.0, stroke: P.sparkle, width: 2.5, fill: P.white,
    d: "M306 102 Q306 110 314 110 Q306 110 306 118 Q306 110 298 110 Q306 110 306 102 Z" },
];
