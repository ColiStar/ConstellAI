// ConstellAI — design token palette

export const SPACE_BG = "#030712";
export const SPACE_VIGNETTE = "#0a0f1e";

export const NODE_DEFAULT = "#E2E8F0";
export const NODE_HALO = "rgba(148, 163, 184, 0.25)";
export const NODE_ACTIVE = "#FFFFFF";

export const INSIGHT_COLORS: Record<string, { primary: string; secondary: string }> = {
  "relativity-over-absolutes":         { primary: "#7C3AED", secondary: "#A78BFA" },
  "the-variance-of-trajectories":      { primary: "#0EA5E9", secondary: "#38BDF8" },
  "disentanglement-and-anchoring":     { primary: "#10B981", secondary: "#34D399" },
  "superficial-vs-geometric-alignment":{ primary: "#F59E0B", secondary: "#FCD34D" },
};

// Star field layers
export const STAR_LAYERS = [
  { count: 220, minR: 0.4, maxR: 1.0, parallax: 0.018, alpha: 0.45 },
  { count: 80,  minR: 1.0, maxR: 1.8, parallax: 0.045, alpha: 0.60 },
  { count: 28,  minR: 1.8, maxR: 2.8, parallax: 0.11,  alpha: 0.80 },
];
