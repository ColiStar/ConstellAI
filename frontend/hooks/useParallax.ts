"use client";

import { useEffect, useRef } from "react";

export interface ParallaxOffset {
  x: number;
  y: number;
}

/**
 * Returns a ref that always contains the latest normalised mouse offset
 * in the range [-1, 1] on both axes.
 * Using a ref (not state) avoids React re-renders on every mouse move.
 */
export function useParallax(): React.RefObject<ParallaxOffset> {
  const offset = useRef<ParallaxOffset>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      offset.current = {
        x: (e.clientX / window.innerWidth)  * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return offset;
}
