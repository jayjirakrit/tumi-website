import { useEffect, useRef } from "react";
import { RING_STROKES } from "../../data/RingDrawing";
import { TIMING } from "../../data/CinnamorollDrawing"; // read-only: shared duration
import { useLoadingGate } from "../../hook/UseLoadingGate";
import { usePrefersReducedMotion } from "../../hook/UsePrefersReducedMotion";
import { prepareRing, drawRing } from "./drawRing";
import "./RingGuide.css";

const RingGuide = () => {
  const canvasRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const { phase, ready, capped, fail } = useLoadingGate({
    minMs: TIMING.minMs,
    capMs: TIMING.capMs,
  });
  const start = ready || capped;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !start) return; // page not loaded yet
    let raf = 0;
    let ro = null;
    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("2d context unavailable");
      const prepared = prepareRing(RING_STROKES);
      const { drawMs } = TIMING;
      let size = { w: 0, h: 0 };
      // Reduced motion, or cap hit before load: paint the finished ring at once.
      let t = reduced || !ready ? drawMs : 0;
      const t0 = performance.now();

      const paint = () => drawRing(ctx, size.w, size.h, t, prepared, drawMs);

      const fit = () => {
        const r = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(r.width * dpr);
        canvas.height = Math.round(r.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        size = { w: r.width, h: r.height };
        // Resizing clears the canvas; repaint the held figure.
        if (t >= drawMs) paint();
      };

      fit();
      ro = new ResizeObserver(() => {
        try {
          fit();
        } catch {
          fail();
        }
      });
      ro.observe(canvas);

      if (t >= drawMs) {
        paint();
      } else {
        const frame = (now) => {
          try {
            t = Math.max(0, now - t0);
            paint();
            if (t < drawMs) raf = requestAnimationFrame(frame);
          } catch {
            fail();
          }
        };
        raf = requestAnimationFrame(frame);
      }
    } catch {
      fail(); // never block the game or the sibling drawing
    }
    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
    };
    // ready is read once at start; as a dep it would restart a finished ring.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, start, fail]);

  if (phase === "gone") return null;
  return (
    <div className="ring-guide" aria-hidden="true">
      <div className="ring-guide__stage">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default RingGuide;
