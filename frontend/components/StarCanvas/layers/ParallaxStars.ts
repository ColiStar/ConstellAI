/**
 * ParallaxStars — generates and renders three depth layers of background stars.
 *
 * Stars are created once and stored as static data. Each frame the renderer
 * applies a parallax offset derived from the current mouse position.
 */

import { STAR_LAYERS } from "@/lib/colors";

export interface Star {
  x: number;   // normalised [0, 1]
  y: number;   // normalised [0, 1]
  r: number;   // radius in px
  alpha: number;
  twinklePhase: number;   // offset into sin() for twinkling
  twinkleSpeed: number;
  layerIndex: number;
}

/** Seed the star field once at startup. */
export function createStars(): Star[] {
  const stars: Star[] = [];
  STAR_LAYERS.forEach((layer, li) => {
    for (let i = 0; i < layer.count; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: layer.minR + Math.random() * (layer.maxR - layer.minR),
        alpha: layer.alpha * (0.7 + Math.random() * 0.3),
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.4 + Math.random() * 0.8,
        layerIndex: li,
      });
    }
  });
  return stars;
}

/** Draw all star layers onto *ctx* with the given parallax offsets. */
export function drawStars(
  ctx: CanvasRenderingContext2D,
  stars: Star[],
  w: number,
  h: number,
  mouseX: number,   // normalised [-1, 1]
  mouseY: number,
  t: number,        // elapsed seconds for twinkling
): void {
  stars.forEach((star) => {
    const layer = STAR_LAYERS[star.layerIndex];
    const px = mouseX * layer.parallax * w;
    const py = mouseY * layer.parallax * h;

    const sx = star.x * w + px;
    const sy = star.y * h + py;

    const twinkle = 0.85 + 0.15 * Math.sin(t * star.twinkleSpeed + star.twinklePhase);
    const a = star.alpha * twinkle;

    ctx.beginPath();
    ctx.arc(sx, sy, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(226, 232, 240, ${a.toFixed(3)})`;
    ctx.fill();
  });
}
