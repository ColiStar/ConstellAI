/**
 * PaperNodes — renders the glowing paper star nodes on the canvas.
 *
 * Each node has:
 *   - outer diffuse glow (large low-opacity radial gradient)
 *   - mid halo (medium, more saturated)
 *   - hot white core circle
 *   - label with shadow simulation (drawn twice: shadow offset then main)
 *   - pulse ring on hover / selection
 */

import type { NodeData, InsightData } from "@/lib/types";
import { NODE_DEFAULT, NODE_ACTIVE } from "@/lib/colors";

export interface NodeRenderState {
  hoveredId: string | null;
  selectedId: string | null;
  activeInsight: InsightData | null;
}

function scaleX(lx: number, w: number): number { return (lx / 1400) * w; }
function scaleY(ly: number, h: number): number { return (ly / 800)  * h; }

export function drawNodes(
  ctx: CanvasRenderingContext2D,
  nodes: NodeData[],
  w: number,
  h: number,
  t: number,
  state: NodeRenderState,
): void {
  const { hoveredId, selectedId, activeInsight } = state;
  const activeSet = new Set(activeInsight?.paper_ids ?? []);

  nodes.forEach((node) => {
    const cx = scaleX(node.position.x, w);
    const cy = scaleY(node.position.y, h);

    const isHovered  = node.id === hoveredId;
    const isSelected = node.id === selectedId;
    const isActive   = activeSet.has(node.id);

    const breathe = 0.55 + 0.45 * Math.sin(t * 1.4 + node.position.x * 0.008);
    const haloColor = isActive && activeInsight ? activeInsight.color : "#94A3B8";

    // ── Pass 1: Outer diffuse glow ──────────────────────────────
    const outerR = isSelected ? 52 : isHovered ? 42 : isActive ? 36 : 22;
    const outerA = (isSelected ? 0.28 : isHovered ? 0.24 : isActive ? 0.18 : 0.10) * breathe;
    {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR);
      g.addColorStop(0,   hexToRgba(haloColor, outerA));
      g.addColorStop(0.5, hexToRgba(haloColor, outerA * 0.45));
      g.addColorStop(1,   hexToRgba(haloColor, 0));
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }

    // ── Pass 2: Mid corona halo ─────────────────────────────────
    const midR = isSelected ? 20 : isHovered ? 16 : isActive ? 13 : 8;
    const midA = (isSelected ? 0.65 : isHovered ? 0.55 : isActive ? 0.42 : 0.24) * breathe;
    {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, midR);
      g.addColorStop(0,   hexToRgba(haloColor, midA));
      g.addColorStop(0.6, hexToRgba(haloColor, midA * 0.55));
      g.addColorStop(1,   hexToRgba(haloColor, 0));
      ctx.beginPath();
      ctx.arc(cx, cy, midR, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }

    // ── Pass 3: Hot white core ──────────────────────────────────
    const coreR = isSelected ? 5.5 : isHovered ? 4.8 : isActive ? 4.2 : 3.0;
    {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      // Bright white centre that fades into the insight color
      g.addColorStop(0,   "rgba(255,255,255,0.98)");
      g.addColorStop(0.35, hexToRgba(haloColor, 0.95));
      g.addColorStop(1,   hexToRgba(haloColor, 0.70));
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }

    // ── Selection ring ──────────────────────────────────────────
    if (isSelected) {
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,0.55)`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // ── Hover ring ──────────────────────────────────────────────
    if (isHovered && !isSelected) {
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,0.32)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // ── Node label (shadow simulation: draw twice) ──────────────
    const labelAlpha = isHovered || isSelected ? 0.96 : isActive ? 0.80 : 0.48;
    const labelSize  = isHovered || isSelected ? 13 : 12;
    const rawTitle   = node.title.replace(/^[^\w]+\s*/, "");
    const label      = rawTitle.length > 22 ? rawTitle.slice(0, 20) + "…" : rawTitle;
    const labelY     = cy + coreR + 18;
    const fontWeight = isHovered || isSelected ? 600 : 400;

    ctx.font = `${fontWeight} ${labelSize}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = "center";

    // Shadow pass (1px offset, darker)
    ctx.fillStyle = `rgba(2,6,18,${labelAlpha * 0.75})`;
    ctx.fillText(label, cx + 1, labelY + 1);

    // Main pass
    ctx.fillStyle = `rgba(226,232,240,${labelAlpha})`;
    ctx.fillText(label, cx, labelY);

    ctx.textAlign = "left";
  });
}

/** Hit-test: returns the id of the first node within click radius, or null. */
export function hitTestNode(
  nodes: NodeData[],
  px: number,
  py: number,
  hitR: number = 24,
): string | null {
  for (const node of nodes) {
    const dx = node.position.x - px;
    const dy = node.position.y - py;
    if (dx * dx + dy * dy < hitR * hitR) return node.id;
  }
  return null;
}

function hexToRgba(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}
