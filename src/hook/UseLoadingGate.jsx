import { useEffect, useState, useCallback } from "react";

// Returns { phase: "show" | "done" | "gone", ready, capped, fail }
// - ready: page fully loaded (and fonts ready where supported); drawing starts then.
// - minMs is measured from the moment ready becomes true (start of drawing).
// - capMs is measured from mount; reaching it settles the loader as "done".
// - "done" = drawing complete, the finished figure stays as a guide.
// - "gone" = failure; the loader is removed so the game is never blocked.
export const useLoadingGate = ({ minMs, capMs }) => {
  const [ready, setReady] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);
  const [capped, setCapped] = useState(false);
  const [phase, setPhase] = useState("show");

  useEffect(() => {
    let alive = true;
    const markReady = () => {
      const fonts = document.fonts && document.fonts.ready;
      if (fonts && typeof fonts.then === "function") {
        fonts.then(
          () => alive && setReady(true),
          () => alive && setReady(true),
        );
      } else {
        setReady(true);
      }
    };
    const onLoad = () => markReady();
    if (document.readyState === "complete") {
      markReady();
    } else {
      window.addEventListener("load", onLoad);
      // Re-check: load may have fired between the check above and attaching.
      if (document.readyState === "complete") markReady();
    }
    const tMax = setTimeout(() => setCapped(true), capMs);
    return () => {
      alive = false;
      window.removeEventListener("load", onLoad);
      clearTimeout(tMax);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount only

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setMinElapsed(true), minMs);
    return () => clearTimeout(t);
  }, [ready, minMs]);

  useEffect(() => {
    if (phase === "show" && ((ready && minElapsed) || capped)) setPhase("done");
  }, [phase, ready, minElapsed, capped]);

  const fail = useCallback(() => setPhase("gone"), []);
  return { phase, ready, capped, fail };
};
