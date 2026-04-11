# ConstellAI — Architecture Decision Record

**Status:** Production-ready MVP  
**Last updated:** 2026-04-10  
**Working dir:** `/Users/colicoli/Desktop/obisidian/594BBtest/ConstellAI`  
**Data vault (read-only):** `/Users/colicoli/Desktop/obisidian/594BBtest`

---

## 1. Vault Scan Summary

### Papers (9 nodes / Stars)
| File | Insights | Concepts |
|---|---|---|
| DeepSeek-R1 | R, V, S | GRPO |
| NCI | R, S | Neural Collapse |
| fDBD | R, S | Neural Collapse |
| PostAlign | V, D | Selective Reasoning |
| Incoherence (Hot Mess) | V | — |
| EFA | D | Orthogonal Projection |
| Interpret Diffusion | D | — |
| CroPA | D | — |
| Safety Alignment Just a Few Tokens Deep | S | Neural Collapse |

### Insights (4 Telescope Lenses → Constellation Letters)
| File | Slider pos | Letter | Paper IDs |
|---|---|---|---|
| Relativity Over Absolutes | 0 | **R** | DeepSeek-R1, fDBD, NCI |
| The Variance of Trajectories | 1 | **V** | DeepSeek-R1, PostAlign, Incoherence |
| Disentanglement and Anchoring | 2 | **D** | EFA, Interpret Diffusion, CroPA, PostAlign |
| Superficial vs Geometric Alignment | 3 | **S** | Safety Alignment, DeepSeek-R1, NCI, fDBD |

### Concepts (4 Level-2 Nodes)
- GRPO (Group Relative Policy Optimization)
- Neural Collapse
- Orthogonal Projection (Concept Erasure)
- Selective Reasoning

---

## 2. Architectural Decision: Rendering Engine

### Option A — `react-force-graph-2d` (Physics Simulation)
**Verdict: REJECTED** — physics layout fights fixed coordinates. Letter-forming bezier edges require pixel-precise node positions; force simulation would randomize them.

### Option B — Custom HTML5 Canvas ✅ CHOSEN
Full ownership of the render pipeline: fixed node coordinates, multi-pass radial gradient halos, 3-layer parallax starfield, cubic bezier constellation edges, 60 fps RAF loop. Hit-testing implemented manually via distance comparison in logical space.

---

## 3. Architectural Decision: Stack

### Frontend — Next.js (App Router) + TypeScript
- **Framer Motion** for panel enter/exit animations
- **react-rnd** for draggable + resizable floating windows
- **SWR** for data-fetching and aggressive client-side caching
- **react-markdown** for rendering vault markdown bodies

### Backend — FastAPI + Python 3.13
- **Pydantic v2** for strict request/response models
- **python-frontmatter** for YAML + markdown parsing
- **`functools.lru_cache`** for in-process graph caching (parsed once, served many)
- **pytest + httpx** for TDD

### Dev
Two processes (`uvicorn :8000`, `next dev :3000`). Next.js rewrites `/api/*` to the FastAPI server.

---

## 4. Project Structure

```
ConstellAI/
├── backend/
│   ├── main.py                    # FastAPI app, CORS middleware
│   ├── models.py                  # Pydantic v2 schemas
│   ├── parser.py                  # Vault markdown → graph data
│   ├── router.py                  # /api/graph, /api/papers/{id}, /api/concepts/{id}
│   ├── semantic_cluster.py        # ML embedding clustering (Phase 2)
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── test_parser.py         # 36 tests
│   │   ├── test_router.py         # 14 tests
│   │   └── test_semantic.py       # 28 tests
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── layout.tsx             # Root layout + SWRProvider
│   │   ├── page.tsx               # State machine + component orchestration
│   │   └── globals.css            # Liquid glass tokens + animations
│   ├── components/
│   │   ├── StarCanvas/            # Canvas orchestrator + RAF loop
│   │   │   └── layers/
│   │   │       ├── ParallaxStars.ts
│   │   │       ├── ConstellationEdges.ts
│   │   │       └── PaperNodes.ts  # 3-pass radial gradient nodes
│   │   ├── DraggablePanel/        # react-rnd floating window wrapper
│   │   ├── InsightPanel/          # Left draggable — full insight body
│   │   ├── PaperPanel/            # Right draggable — paper detail
│   │   ├── ConceptPanel/          # Level-2 draggable — concept detail
│   │   ├── InsightSlider/         # Bottom radio-tuning slider
│   │   └── SWRProvider/           # Global SWR cache configuration
│   ├── hooks/
│   │   ├── useGraph.ts            # SWR — full graph (cached 24 h)
│   │   ├── usePaper.ts            # SWR — paper detail (per-ID cache)
│   │   ├── useConcept.ts          # SWR — concept detail (per-ID cache)
│   │   └── useParallax.ts         # Mouse → parallax offset (ref, no re-render)
│   ├── lib/
│   │   ├── types.ts
│   │   ├── constellation.ts       # Cubic bezier edge definitions
│   │   ├── colors.ts
│   │   └── fetcher.ts             # SWR global fetcher
│   └── next.config.ts
├── ARCHITECTURE.md
└── CASE_STUDY_SESSION.md
```

---

## 5. Canvas Rendering Stack (Back → Front)

| Z-Layer | Content | Notes |
|---|---|---|
| 0 | CSS background | `#030712` deep void |
| 1 | Radial vignette | Darkens edges to focus attention on centre |
| 2 | Parallax stars (3 depth layers) | 328 stars; `useRef` mouse offset — zero re-renders |
| 3 | Ghost letter watermark | Active insight letter at 82 vh, opacity 0.03–0.05 |
| 4 | Constellation edges | Cubic bezier, 3-pass glow, animated draw-in |
| 5 | Paper nodes | 3-pass radial gradient (diffuse glow → corona → hot core) |
| 6 | DOM overlays | InsightSlider, draggable panels |

---

## 6. Node Positions (Canvas 1400 × 800)

Positions shifted right so the constellation center of gravity sits at x≈863, clear of the InsightPanel (≈ x=0–440 in logical space).

```
deepseek-r1         (750, 185)   upper-center
nci                 (550, 210)   upper, left-center
fdbd                (870, 430)   center-right
postalign           (915, 530)   lower-center
incoherence         (1080, 155)  upper-right
efa                 (710, 360)   center-left
interpret-diffusion (710, 590)   center-left lower  ← same x as EFA (D spine)
cropa               (980, 590)   center-right lower
safety-alignment    (1200, 310)  far right
```

### Letter Formation

**R** — NCI(550,210) / DeepSeek(750,185) / fDBD(870,430)  
Nearly-horizontal top bar (NCI→DeepSeek, y≈200) + spine drop from NCI + diagonal leg from DeepSeek to fDBD.

**V** — DeepSeek(750,185) / Incoherence(1080,155) / PostAlign(915,530)  
Two arms converge at PostAlign's bottom tip. Cubic control points lean inward to sharpen the V angle.

**D** — EFA(710,360) / Interpret(710,590) / PostAlign(915,530) / CroPA(980,590)  
EFA and Interpret share x=710 → perfect vertical left spine. PostAlign + CroPA form the rounded right arc. Traversal: spine ↓, top arc ↗, right bump ↘, bottom arc ←.

**S** — Safety(1200,310) / fDBD(870,430) / DeepSeek(750,185) / NCI(550,210)  
Top arc: Safety rises to y≈100 then sweeps left to fDBD. Waist: fDBD ascending diagonally to DeepSeek. Bottom arc: DeepSeek dips to y≈420 then closes left to NCI.

---

## 7. Insight Color Palette

| Insight | Letter | Primary | Secondary |
|---|---|---|---|
| Relativity Over Absolutes | R | `#7C3AED` violet | `#A78BFA` |
| The Variance of Trajectories | V | `#0EA5E9` cyan-blue | `#38BDF8` |
| Disentanglement and Anchoring | D | `#10B981` emerald | `#34D399` |
| Superficial vs Geometric Alignment | S | `#F59E0B` amber | `#FCD34D` |

---

## 8. Panel System

All three panels are **draggable + resizable floating windows** via `react-rnd`, wrapped in a shared `DraggablePanel` component. A `position:fixed; inset:0; pointer-events:none` Framer Motion overlay hosts the Rnd instance, placing it in viewport coordinate space. Any element with `className="panel-drag-handle"` becomes the drag handle.

| Panel | Default spawn | Width | z-index |
|---|---|---|---|
| InsightPanel | x=24, y=80 | 400 px | 40 |
| PaperPanel | x=880, y=80 | 480 px | 42 |
| ConceptPanel | x=440, y=80 | 420 px | 45 |

**Liquid glass spec:**
- `background: rgba(8,12,28,0.35)` — stars bleed through
- `backdrop-filter: blur(28px) saturate(160%)`
- `border: 1px solid rgba(255,255,255,0.10)` — all 4 sides
- `box-shadow: 0 8px 32px rgba(0,0,0,0.42)`

---

## 9. Data Fetching & Caching (Phase 2)

### SWR Strategy

The Obsidian vault is **read-only at runtime**. The backend parses it exactly once into an `lru_cache`; there is no mutation pathway. This justifies an aggressive client-side cache policy:

| Hook | Key | Revalidate on focus | Dedupe interval |
|---|---|---|---|
| `useGraph` | `/api/graph` | No | 24 h |
| `usePaper` | `/api/papers/{id}` | No | 24 h |
| `useConcept` | `/api/concepts/{id}` | No | 24 h |

Re-opening the same paper panel after it has been visited costs **zero network requests** — SWR serves the cached response instantly. Switching between the four Insight lenses costs **zero network requests** — the full graph is already in memory.

---

## 10. ML Semantic Clustering (Phase 2 Foundation)

`backend/semantic_cluster.py` establishes the architecture for scaling `[Paper] → [Insight]` mapping beyond manual frontmatter curation.

### Current approach (explicit)
Insight membership is declared in paper YAML frontmatter or via `[[✨ Insight]]` wikilinks. Works perfectly at ≤ 50 papers; breaks down when a corpus grows beyond what can be hand-curated.

### Semantic approach (≥ 1,000 nodes)
```
paper text  ──embed──▶ dense vector ──cosine──▶ [ (insight_id, score) ]
insight text ──embed──▶ dense vector              assign if score ≥ 0.35
```

**Model:** `all-MiniLM-L6-v2` via `sentence-transformers` (22 M params, 384-dim, <100 ms/doc on CPU).

**CI fallback:** `_mock_embed()` — deterministic SHA-256-seeded pseudo-vector, L2-normalised. No model download required.

**Activation:** set `CONSTELLAI_USE_EMBEDDINGS=true` in the environment.

### Test coverage
28 tests across four classes: `TestMockEmbedder`, `TestCosine`, `TestSemanticClustererIndexing`, `TestRankInsights`, `TestAssignInsights`, `TestDefaultThreshold`. All 28 pass.

---

## 11. API Contract

```
GET /api/graph
→ { nodes: NodeData[], insights: InsightData[] }

GET /api/papers/{paper_id}
→ PaperDetail (title, tags, summary_md, insight_ids, concepts)

GET /api/concepts/{concept_id}
→ ConceptDetail (title, body_md, related_paper_ids, related_insight_ids)

GET /health
→ { status: "ok" }
```

---

## 12. Test Coverage

| Suite | File | Count |
|---|---|---|
| Vault parsing | `test_parser.py` | 36 |
| API endpoints | `test_router.py` | 14 |
| ML clustering | `test_semantic.py` | 28 |
| **Total** | | **78** |

All 78 tests pass against the live vault.
