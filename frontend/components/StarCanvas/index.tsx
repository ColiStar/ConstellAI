"use client";

import {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import type { NodeData, InsightData } from "@/lib/types";
import { SPACE_BG } from "@/lib/colors";
import { createStars, drawStars }       from "./layers/ParallaxStars";
import { drawNodes, hitTestNode }        from "./layers/PaperNodes";
import { drawConstellationEdges }        from "./layers/ConstellationEdges";
import { useParallax }                   from "@/hooks/useParallax";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StarCanvasRef {
  /** Programmatic pointer-position lookup (e.g. from onClick on wrapper) */
  toLogical: (clientX: number, clientY: number) => { x: number; y: number };
}

interface StarCanvasProps {
  nodes: NodeData[];
  activeInsight: InsightData | null;
  /** [0→1] edge draw-in progress, animated by parent */
  edgeProgress: number;
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const StarCanvas = forwardRef<StarCanvasRef, StarCanvasProps>(function StarCanvas(
  { nodes, activeInsight, edgeProgress, hoveredId, selectedId, onHover, onSelect },
  ref,
) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const mouseOffset = useParallax();
  const starsRef    = useRef(createStars());

  // Expose logical coordinate converter to parent
  useImperativeHandle(ref, () => ({
    toLogical(clientX: number, clientY: number) {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((clientX - rect.left) / rect.width)  * 1400,
        y: ((clientY - rect.top)  / rect.height) * 800,
      };
    },
  }));

  // ── Draw loop ──────────────────────────────────────────────────────
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const draw = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      if (startRef.current === null) startRef.current = timestamp;
      const t = (timestamp - startRef.current) / 1000; // seconds

      // ── 0. Background ──────────────────────────────────────────────
      ctx.fillStyle = SPACE_BG;
      ctx.fillRect(0, 0, w, h);

      // Vignette
      const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.1, w / 2, h / 2, h * 0.85);
      vignette.addColorStop(0, "rgba(10, 15, 30, 0)");
      vignette.addColorStop(1, "rgba(3, 7, 18, 0.7)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      // ── 1. Parallax stars ──────────────────────────────────────────
      drawStars(ctx, starsRef.current, w, h, mouseOffset.current.x, mouseOffset.current.y, t);

      // ── 1b. Ghost letter watermark ────────────────────────────────
      if (activeInsight) {
        const breathAlpha = 0.03 + 0.015 * Math.sin(t * 0.5);
        ctx.save();
        ctx.font = `900 ${h * 0.82}px ui-sans-serif, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = activeInsight.color;
        ctx.globalAlpha = breathAlpha * edgeProgress;
        ctx.fillText(activeInsight.letter, w / 2, h / 2);
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      // ── 2. Constellation edges (if insight active) ─────────────────
      if (activeInsight && edgeProgress > 0) {
        drawConstellationEdges(ctx, nodes, activeInsight, w, h, edgeProgress);
      }

      // ── 3. Paper nodes ─────────────────────────────────────────────
      drawNodes(ctx, nodes, w, h, t, {
        hoveredId,
        selectedId,
        activeInsight,
      });

      frameRef.current = requestAnimationFrame(draw);
    },
    [nodes, activeInsight, edgeProgress, hoveredId, selectedId, mouseOffset],
  );

  // ── Resize handling ────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Start / restart RAF when draw callback changes ─────────────────
  useEffect(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(draw);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [draw]);

  // ── Mouse interaction ──────────────────────────────────────────────
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const lx   = ((e.clientX - rect.left) / rect.width)  * 1400;
      const ly   = ((e.clientY - rect.top)  / rect.height) * 800;
      onHover(hitTestNode(nodes, lx, ly));
    },
    [nodes, onHover],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const lx   = ((e.clientX - rect.left) / rect.width)  * 1400;
      const ly   = ((e.clientY - rect.top)  / rect.height) * 800;
      const hit  = hitTestNode(nodes, lx, ly);
      onSelect(hit === selectedId ? null : hit);
    },
    [nodes, selectedId, onSelect],
  );

  return (
    <canvas
      ref={canvasRef}
      id="canvas-wrapper"
      style={{ cursor: hoveredId ? "pointer" : "crosshair" }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    />
  );
});

export default StarCanvas;
