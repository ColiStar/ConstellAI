/**
 * ConstellationEdges — renders glowing cubic-bezier constellation lines.
 *
 * Each edge is drawn as a cubic bezier (two control points), which gives
 * enough freedom to trace letter-shaped strokes between any two node positions.
 *
 * Rendering passes per edge:
 *   1. Wide blur pass  — thick, low-opacity glow
 *   2. Mid glow pass   — medium width, higher opacity, colored secondary
 *   3. Tight core line — 1 px, near-full opacity, primary color
 *
 * The `progress` value [0→1] drives per-edge sequential draw-in animation.
 * Each edge's sub-progress is computed from the global progress stagger.
 */

import type { NodeData, InsightData } from "@/lib/types";
import { getConstellation } from "@/lib/constellation";

function scaleX(lx: number, w: number): number { return (lx / 1400) * w; }
function scaleY(ly: number, h: number): number { return (ly / 800)  * h; }

function hexToRgba(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

function getNodePos(
  nodes: NodeData[],
  id: string,
  w: number,
  h: number,
): { x: number; y: number } | null {
  const node = nodes.find((n) => n.id === id);
  if (!node) return null;
  return { x: scaleX(node.position.x, w), y: scaleY(node.position.y, h) };
}

/**
 * Approximate a cubic bezier as N line segments, return the first
 * `Math.floor(progress * N)` segments so we can animate the draw-in.
 */
function cubicBezierPoints(
  sx: number, sy: number,
  cp1x: number, cp1y: number,
  cp2x: number, cp2y: number,
  ex: number, ey: number,
  steps: number,
  progress: number,
): Array<{ x: number; y: number }> {
  const count = Math.max(1, Math.floor(progress * steps));
  const pts: Array<{ x: number; y: number }> = [];
  for (let i = 0; i <= count; i++) {
    const t  = i / steps;
    const mt = 1 - t;
    pts.push({
      x: mt*mt*mt*sx + 3*mt*mt*t*cp1x + 3*mt*t*t*cp2x + t*t*t*ex,
      y: mt*mt*mt*sy + 3*mt*mt*t*cp1y + 3*mt*t*t*cp2y + t*t*t*ey,
    });
  }
  return pts;
}

function drawGlowingCubic(
  ctx: CanvasRenderingContext2D,
  sx: number, sy: number,
  cp1x: number, cp1y: number,
  cp2x: number, cp2y: number,
  ex: number, ey: number,
  color: string,
  colorSecondary: string,
  progress: number,
): void {
  if (progress <= 0) return;

  const STEPS = 80;
  const pts = cubicBezierPoints(sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey, STEPS, progress);
  if (pts.length < 2) return;

  // ── Pass 1: wide outer glow ──────────────────────────────────────
  ctx.save();
  ctx.lineWidth   = 8;
  ctx.lineCap     = "round";
  ctx.lineJoin    = "round";
  ctx.strokeStyle = hexToRgba(color, 0.10);
  ctx.shadowColor = color;
  ctx.shadowBlur  = 24;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.stroke();
  ctx.restore();

  // ── Pass 2: mid glow ────────────────────────────────────────────
  ctx.save();
  ctx.lineWidth   = 3;
  ctx.lineCap     = "round";
  ctx.lineJoin    = "round";
  ctx.strokeStyle = hexToRgba(colorSecondary, 0.35);
  ctx.shadowColor = colorSecondary;
  ctx.shadowBlur  = 12;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.stroke();
  ctx.restore();

  // ── Pass 3: sharp core ──────────────────────────────────────────
  ctx.save();
  ctx.lineWidth   = 1.2;
  ctx.lineCap     = "round";
  ctx.lineJoin    = "round";
  ctx.strokeStyle = hexToRgba(colorSecondary, 0.85);
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.stroke();
  ctx.restore();

  // ── Animated leading dot ─────────────────────────────────────────
  if (progress < 1) {
    const tip = pts[pts.length - 1];
    ctx.save();
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 3, 0, Math.PI * 2);
    ctx.fillStyle   = hexToRgba(colorSecondary, 0.95);
    ctx.shadowColor = colorSecondary;
    ctx.shadowBlur  = 10;
    ctx.fill();
    ctx.restore();
  }
}

export function drawConstellationEdges(
  ctx: CanvasRenderingContext2D,
  nodes: NodeData[],
  insight: InsightData,
  w: number,
  h: number,
  progress: number,
): void {
  const constellation = getConstellation(insight.id);
  if (!constellation) return;

  const edgeCount = constellation.edges.length;

  constellation.edges.forEach((edge, i) => {
    // Stagger: each edge starts after the previous one reaches ~70%
    const staggerStart = (i / edgeCount) * 0.7;
    const staggerEnd   = staggerStart + (1 / edgeCount) * 1.3;
    const edgeProgress = Math.max(0, Math.min(1,
      (progress - staggerStart) / (staggerEnd - staggerStart)
    ));

    const src = getNodePos(nodes, edge.source, w, h);
    const tgt = getNodePos(nodes, edge.target, w, h);
    if (!src || !tgt) return;

    drawGlowingCubic(
      ctx,
      src.x, src.y,
      scaleX(edge.cp1.x, w), scaleY(edge.cp1.y, h),
      scaleX(edge.cp2.x, w), scaleY(edge.cp2.y, h),
      tgt.x, tgt.y,
      insight.color,
      insight.color_secondary,
      edgeProgress,
    );
  });
}
