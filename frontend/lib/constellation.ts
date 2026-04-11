/**
 * ConstellAI — Constellation Edge Definitions (Cubic Bezier)
 *
 * Each edge uses a full cubic bezier: moveTo(src) → bezierCurveTo(cp1, cp2, dst).
 * Two control points give freedom to make curves trace letter strokes
 * regardless of where star nodes sit.
 *
 * Node positions (logical 1400×800) — shifted RIGHT, center-of-gravity x≈863:
 *   deepseek-r1        (750, 185)   — upper-center
 *   nci                (550, 210)   — upper, left-center  [same y≈200 as DeepSeek → R bar]
 *   fdbd               (870, 430)   — center-right
 *   postalign          (915, 530)   — lower-center        [V tip; D right arc]
 *   incoherence-hot-mess (1080,155) — upper-right         [V right arm]
 *   efa                (710, 360)   — center-left         [D spine top; same x as Interpret]
 *   interpret-diffusion(710, 590)   — center-left, lower  [D spine bottom]
 *   cropa              (980, 590)   — center-right, bottom [D arc bottom]
 *   safety-alignment…  (1200, 310)  — far right           [S top anchor]
 *
 * Letter construction:
 *   R — NCI / DeepSeek / fDBD          3 edges
 *   V — DeepSeek / Incoherence / PostAlign  2 edges
 *   D — EFA / Interpret / CroPA / PostAlign 4 edges
 *   S — Safety / fDBD / DeepSeek / NCI  3 edges
 */

export interface ConstellationEdgeDef {
  source: string;
  target: string;
  /** First cubic bezier control point in logical 1400×800 space */
  cp1: { x: number; y: number };
  /** Second cubic bezier control point in logical 1400×800 space */
  cp2: { x: number; y: number };
}

export interface ConstellationDef {
  insightId: string;
  letter: string;
  edges: ConstellationEdgeDef[];
}

export const CANVAS_W = 1400;
export const CANVAS_H = 800;

export const CONSTELLATIONS: ConstellationDef[] = [
  // ── R (Relativity Over Absolutes) ──────────────────────────────────
  // Nodes: NCI(550,210)  DeepSeek(750,185)  fDBD(870,430)
  //
  // Three strokes construct R:
  //   1. Top bar: NCI ——— DeepSeek  (bows slightly upward, both near y=200)
  //   2. Spine:   NCI → drops straight down to y≈430, sweeps right to fDBD
  //   3. Diagonal leg: DeepSeek → fDBD  (curves right-downward)
  {
    insightId: "relativity-over-absolutes",
    letter: "R",
    edges: [
      {
        source: "nci",
        target: "deepseek-r1",
        cp1: { x: 625, y: 165 },   // bows slightly above midpoint → top bar
        cp2: { x: 700, y: 162 },
      },
      {
        source: "nci",
        target: "fdbd",
        cp1: { x: 550, y: 430 },   // drops straight down from NCI (spine)
        cp2: { x: 730, y: 435 },   // sweeps right at junction level to fDBD
      },
      {
        source: "deepseek-r1",
        target: "fdbd",
        cp1: { x: 820, y: 255 },   // curves diagonally right-down (diagonal leg)
        cp2: { x: 865, y: 355 },
      },
    ],
  },

  // ── V (The Variance of Trajectories) ────────────────────────────────
  // Nodes: DeepSeek(750,185)  Incoherence(1080,155)  PostAlign(915,530)
  //
  // Two arms converge at PostAlign bottom tip — crystal-clear V.
  {
    insightId: "the-variance-of-trajectories",
    letter: "V",
    edges: [
      {
        source: "deepseek-r1",
        target: "postalign",
        cp1: { x: 790, y: 360 },   // leans inward (left arm of V)
        cp2: { x: 880, y: 488 },
      },
      {
        source: "incoherence-hot-mess",
        target: "postalign",
        cp1: { x: 1040, y: 360 }, // leans inward (right arm of V)
        cp2: { x: 970,  y: 488 },
      },
    ],
  },

  // ── D (Disentanglement and Anchoring) ───────────────────────────────
  // Nodes: EFA(710,360)  Interpret(710,590)  PostAlign(915,530)  CroPA(980,590)
  //
  // EFA and Interpret share x=710 → perfect vertical left spine.
  // PostAlign + CroPA form the rounded right arc.
  // Traversal: spine ↓, top arc ↗ right, right bump ↘, base arc ← back
  {
    insightId: "disentanglement-and-anchoring",
    letter: "D",
    edges: [
      {
        source: "efa",
        target: "interpret-diffusion",
        cp1: { x: 700, y: 462 },   // slightly left of both → straight vertical spine
        cp2: { x: 700, y: 532 },
      },
      {
        source: "efa",
        target: "postalign",
        cp1: { x: 710, y: 268 },   // rises above EFA first (top of D arc)
        cp2: { x: 862, y: 355 },   // then sweeps right toward PostAlign
      },
      {
        source: "postalign",
        target: "cropa",
        cp1: { x: 1012, y: 530 },  // bows right beyond both nodes (the D bump)
        cp2: { x: 1022, y: 578 },
      },
      {
        source: "cropa",
        target: "interpret-diffusion",
        cp1: { x: 892, y: 685 },   // arcs below and left (bottom of D)
        cp2: { x: 772, y: 672 },
      },
    ],
  },

  // ── S (Superficial vs Geometric Alignment) ──────────────────────────
  // Nodes: Safety(1200,310)  fDBD(870,430)  DeepSeek(750,185)  NCI(550,210)
  //
  // S = reverse-sigmoid: top arc opens right, crossing diagonal, bottom arc opens right.
  // Edge order traces top → diagonal waist → bottom:
  //   1. Safety → fDBD:    top arc (rises up-right from Safety, sweeps left-high to fDBD)
  //   2. fDBD → DeepSeek:  diagonal crossing ascending left (the waist of S)
  //   3. DeepSeek → NCI:   bottom arc (dips far below both, closes left to NCI)
  {
    insightId: "superficial-vs-geometric-alignment",
    letter: "S",
    edges: [
      {
        source: "safety-alignment-just-a-few-tokens-deep",
        target: "fdbd",
        cp1: { x: 1240, y: 105 }, // rises high-right from Safety
        cp2: { x: 985,  y: 98  }, // stays high as it sweeps left before descending → top arc
      },
      {
        source: "fdbd",
        target: "deepseek-r1",
        cp1: { x: 800, y: 355 },  // slight inward pull → crossing diagonal (waist)
        cp2: { x: 770, y: 252 },
      },
      {
        source: "deepseek-r1",
        target: "nci",
        cp1: { x: 702, y: 430 },  // dips far below both nodes → bottom arc of S
        cp2: { x: 572, y: 408 },
      },
    ],
  },
];

export function getConstellation(insightId: string): ConstellationDef | undefined {
  return CONSTELLATIONS.find((c) => c.insightId === insightId);
}
