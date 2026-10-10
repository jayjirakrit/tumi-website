import { VIEWBOX } from "../../data/CinnamorollDrawing";

const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const clamp01 = (x) => Math.min(1, Math.max(0, x));

export function prepare(strokes) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return strokes.map((s) => {
    let len = 0;
    try {
      svg.setAttribute("d", s.d);
      len = svg.getTotalLength();
    } catch {
      /* drawn static */
    }
    return { ...s, path: new Path2D(s.d), len };
  });
}

export function drawCinnamoroll(ctx, w, h, t, strokes, drawMs) {
  const k = Math.min(w / VIEWBOX.w, h / VIEWBOX.h);
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.translate((w - VIEWBOX.w * k) / 2, (h - VIEWBOX.h * k) / 2);
  ctx.scale(k, k);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const s of strokes) {
    const p = ease(clamp01((t / drawMs - s.start) / (s.end - s.start)));
    if (p <= 0) continue;
    if (s.fill) {
      // fill fades in over the last 30% of the stroke
      ctx.globalAlpha = clamp01((p - 0.7) / 0.3);
      ctx.fillStyle = s.fill;
      ctx.fill(s.path);
      ctx.globalAlpha = 1;
    }
    if (s.stroke) {
      ctx.strokeStyle = s.stroke;
      ctx.lineWidth = s.width;
      ctx.setLineDash(s.len > 0 && p < 1 ? [s.len, s.len] : []);
      ctx.lineDashOffset = s.len * (1 - p);
      ctx.stroke(s.path);
    }
  }
  ctx.restore();
}
