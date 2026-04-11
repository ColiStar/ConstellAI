# ConstellAI: Engineering a 2.5D Research Knowledge Graph Visualizer

*From Obsidian vault to production-grade interactive starfield — a full-stack engineering deep-dive.*

---

## Introduction

Most knowledge management tools present information as flat lists or node-link diagrams driven by physics simulations. The goal with ConstellAI was to do something more evocative: treat a corpus of nine AI alignment research papers as **stars in a deep-space starfield**, and reveal hidden structure — actual letter-shaped constellations — only when the user activates a specific "Insight lens."

This case study traces every significant engineering decision made during the build, from the initial canvas vs. library trade-off through to the SWR caching strategy and the ML semantic clustering foundation. It is written to be useful to engineers who want to understand *why* each choice was made, not just *what* was chosen.

---

## 1. The Problem Statement

The client had a structured Obsidian markdown vault at `/594BBtest/` containing:
- **9 research papers** in `04_Papers/` (with YAML frontmatter and markdown bodies)
- **4 insight lenses** in `02_Insights/` (cross-domain theoretical themes)
- **4 concepts** in `03_Concepts/` (mathematical building blocks)

All relationships were encoded as Obsidian wikilinks (`[[📄 Paper]]`, `[[✨ Insight]]`, `[[🧠 Concept]]`). The vault was read-only — the app must never write to it.

The core visual constraint was non-negotiable: **when an Insight lens is activated, the connecting edges between its papers must trace a recognisable letter** (R, V, D, or S). This is not a metaphor; it is a geometric constraint that determines every data structure, coordinate system, and rendering choice in the project.

---

## 2. The Rendering Engine Decision

### Why not react-force-graph-2d?

The obvious first choice for a graph visualizer is a physics-simulation library. Rejected immediately for a simple reason: **physics simulation produces emergent positions**. The letter-formation constraint requires *deterministic, hand-tuned positions*. No force layout algorithm can be instructed to produce an R shape from three specific nodes without fighting the simulation at every frame.

### Why a custom HTML5 Canvas?

The custom canvas route imposes real costs: manual hit-testing, manual hover state, no built-in zoom/pan. These were accepted because the canvas gives complete ownership of the render pipeline:

- **Fixed logical coordinates** — a 1400×800 logical space maps to whatever the viewport actually is. Positions never change; only the scale factor changes.
- **Full cubic bezier control** — letter strokes require precise curve shape, not just source-to-target arcs.
- **Multi-pass per-node rendering** — the three-pass radial gradient halo (outer diffuse → corona → hot white core) is not possible with any graph library's node renderer.
- **3-layer parallax** — 328 background stars across three depth layers, driven by mouse position via `useRef` (not state, which would cause 60fps re-renders of the entire React tree).

The canvas orchestrator (`StarCanvas/index.tsx`) runs a single RAF loop. The draw order is deliberate: background → vignette → parallax stars → ghost letter watermark → constellation edges → paper nodes → DOM overlays. Each layer is a pure function taking canvas context + current state.

---

## 3. The Letter Formation Math

This is the project's core intellectual challenge. Nine stars are positioned on a 1400×800 canvas such that four different subsets of them, when connected with cubic bezier edges, trace four different letters — simultaneously.

### Node position design

The initial instinct is to place nodes where they "look like stars" and then draw edges. This fails. The correct direction is to work backward from the letter geometry:

**R** requires a vertical spine on the left, a horizontal bar, and a diagonal leg. This forces two nodes to share nearly the same Y coordinate (the top bar), and a third to sit below-right of those two.

**V** is the easiest letter: two nodes spread wide at the top, one node centered at the bottom. The visual angle is entirely controlled by the bezier control points leaning inward.

**D** requires a vertical left edge and a curved right half. The key insight: two nodes sharing the same X coordinate produce a *perfectly vertical* edge segment without any curve control needed. EFA and Interpret Diffusion at x=710 provide this spine for free.

**S** is the hardest letter. An S is a reverse sigmoid: top arc opens right, diagonal crossing (the waist), bottom arc opens right again. With four nodes in a roughly diagonal arrangement, the two arcs can be produced by bezier control points that climb *far above* the logical canvas (y≈100, when all nodes are between y=185 and y=590).

### Center-of-gravity shift

In the first implementation, all nine nodes clustered in the left half of the canvas (x=175–980). This was geometrically correct for the letters but visually wrong: the InsightPanel floating card (positioned at x=24, width=400) directly occluded R and the top of D.

The fix was to compute a target center of gravity and shift every node rightward to achieve it. The final layout has center-of-gravity x≈863 (out of 1400 logical units), which in a typical 1440px viewport corresponds to screen x≈860 — well to the right of the 400px InsightPanel.

This illustrates a principle worth keeping: **coordinate systems and UI layout must be designed together, not independently.**

### Cubic bezier control points

Each edge uses the full `bezierCurveTo(cp1x, cp1y, cp2x, cp2y, tx, ty)` form. Two control points give four degrees of freedom per edge, which is sufficient to make any edge trace any curve segment regardless of where the source and target nodes sit.

The S letter shows this most dramatically. The Safety node sits at (1200,310) and fDBD at (870,430). A straight line between them is a shallow diagonal, nowhere near an arc. But with control points at (1240,105) and (985,98) — both far above the canvas's visible top edge — the bezier climbs sharply, sweeps left at altitude, and descends into fDBD, tracing the top arc of the S exactly.

---

## 4. TDD Approach

Tests were written before implementation throughout the backend phase. The sequence was:

1. Write a failing test for `slugify()` with the emoji-stripping edge case
2. Implement `slugify()` until the test passes
3. Write failing tests for `parse_paper()` — assert insight IDs extracted from wikilinks match expected slugs
4. Implement `parse_paper()`
5. Write failing router tests against a real vault (not a mock) before the router existed

Using the real vault in integration tests rather than synthetic fixtures was a deliberate choice. Mocking the vault would mean the tests pass even when the markdown files change structure. Since the vault is read-only and stable, testing against it directly gives high confidence at negligible cost.

The final test distribution across three suites:

| Suite | Tests | Focus |
|---|---|---|
| `test_parser.py` | 36 | Slug generation, frontmatter parsing, wikilink extraction, graph assembly |
| `test_router.py` | 14 | HTTP status codes, response model shapes, 404 handling |
| `test_semantic.py` | 28 | Mock embedder math, cosine correctness, clustering threshold logic |
| **Total** | **78** | All green |

---

## 5. Backend Architecture: Parse-Once, Serve-Many

The FastAPI backend has a simple invariant: **the vault never changes at runtime**. This justifies a bold caching strategy using Python's `functools.lru_cache`:

```python
@functools.lru_cache(maxsize=1)
def _cached_graph() -> GraphResponse:
    return build_graph(_VAULT_ROOT)
```

The vault is parsed exactly once — on the first request — and every subsequent request is served from the in-process cache. Vault parsing involves reading 17 markdown files, extracting YAML frontmatter, running three different regex patterns per file, and assembling a typed Pydantic object graph. On a cold start this takes ~15ms; from cache it is effectively free.

This also means the backend is **stateless between requests** and can be horizontally scaled without any shared state concerns — every replica caches its own parsed graph, all identical.

---

## 6. Frontend Caching: SWR with an Aggressive Strategy

The client-side caching mirrors the backend's logic. Since the vault is static, there is no reason to re-fetch anything during a browser session.

SWR was chosen over TanStack Query for this use case because its API surface is smaller and the per-hook `useSWR(key, fetcher, options)` interface maps cleanly onto the three API endpoints. The global configuration:

```typescript
<SWRConfig value={{
  fetcher,
  revalidateOnFocus: false,      // switching browser tab never triggers a fetch
  revalidateOnReconnect: false,  // reconnecting Wi-Fi never triggers a fetch
  dedupingInterval: 86_400_000,  // same URL is served from cache for 24 hours
}}>
```

The practical impact: **switching between the four Insight lenses costs zero network requests**. The full graph is in the SWR cache after the initial page load. Opening a paper panel a second time is also instant — `usePaper(paperId)` returns the cached `PaperDetail` without touching the network.

The three hooks (`useGraph`, `usePaper`, `useConcept`) all use SWR's conditional fetch pattern — `useSWR(id ? key : null)`. When `paperId` is null (no panel open), SWR does not fire any request.

---

## 7. The Draggable Window System

The initial panel implementation used `position: fixed` with hardcoded screen coordinates. This worked but created an obvious UX problem: the InsightPanel lived at a fixed left position that could overlap any constellation the user was trying to read.

The solution was `react-rnd` — a library that wraps `react-draggable` and `re-resizable`. The key architectural challenge was integrating it with Framer Motion's `AnimatePresence` for enter/exit animations.

The pattern that works:

```
AnimatePresence
  └── motion.div (position:fixed; inset:0; pointer-events:none)  ← animation host
        └── Rnd (pointer-events:all)                              ← drag+resize host
              └── div.glass-panel                                 ← visual content
```

The `motion.div` covers the full viewport but passes all pointer events through (`pointer-events: none`). The Rnd instance positions itself using `x,y` from the `motion.div`'s top-left — which, because it is `position:fixed; inset:0`, is always the viewport's top-left. The Rnd element itself is `pointer-events: all`, so interactions work normally.

Framer Motion can animate the `opacity` and `scale` of the `motion.div` wrapper for entry and exit, giving a smooth fade even though the underlying Rnd is not a motion component.

---

## 8. The Liquid Glass Visual System

The deep-space aesthetic has two requirements that pull against each other: **panels must be readable** (enough contrast for text) and **stars must bleed through panels** (enough transparency to maintain the starfield illusion).

The final calibration:

```css
background: rgba(8, 12, 28, 0.35);           /* 35% opacity — stars visible through panel */
backdrop-filter: blur(28px) saturate(160%);   /* blur averages star colours into the panel tint */
border: 1px solid rgba(255, 255, 255, 0.10); /* subtle glass edge */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.42); /* depth separation from canvas */
```

At 35% opacity, the panel colour is dominated by whatever is behind it (the starfield) rather than the panel's own fill. The `backdrop-filter: blur(28px)` averages the colours of nearby stars into a soft ambient glow that changes as panels are dragged across different regions of the canvas. This is the "liquid" effect — the panel picks up the colour temperature of its environment.

Node rendering uses a three-pass radial gradient to produce a physically plausible star appearance:

1. **Outer diffuse glow** — large radius, low opacity, insight-coloured
2. **Mid corona** — smaller radius, higher opacity
3. **Hot core** — tiny radius, white centre fading to insight colour

Labels are rendered twice (shadow pass offset by 1px, then the main pass) to simulate text shadow on the canvas, which the 2D Canvas API does not support natively.

---

## 9. ML Semantic Clustering: Building for Scale

The current `[Paper] → [Insight]` mapping is explicit: papers declare their Insight membership in YAML frontmatter, and the parser extracts it with regex. This is correct and maintainable at 9 papers. It breaks at 9,000.

`semantic_cluster.py` establishes the architecture for automatic mapping using dense vector similarity:

```python
class SemanticClusterer:
    def index_insights(self, insights): ...      # embed insight texts once
    def rank_insights(self, paper_text): ...     # cosine sim against all insights
    def assign_insights(self, paper_text): ...   # filter by threshold
```

The model path uses `all-MiniLM-L6-v2` from `sentence-transformers` — a 22M parameter model that produces 384-dimensional embeddings and runs in under 100ms per document on CPU. It is activated by setting `CONSTELLAI_USE_EMBEDDINGS=true`.

The CI path uses `_mock_embed()` — a deterministic pseudo-embedding derived from SHA-256 hashing the input text, then L2-normalising the output. It has the mathematical properties required for testing (determinism, unit-normalised, distinct inputs produce distinct vectors) without downloading any model. This means the 28-test semantic suite runs in 0.03 seconds in CI.

The threshold comparison logic (`score >= COSINE_THRESHOLD`) is the core testable claim: the 28 tests fully specify the contract (threshold=0.0 assigns all insights, threshold=1.0 assigns none, `above_threshold` flag always matches the score, empty index returns empty list, self-similarity is ≥0.99, etc.) before verifying the implementation satisfies it.

---

## 10. Key Engineering Trade-offs

### Trade-off 1: Canvas vs. DOM for nodes

Canvas won on visual fidelity (multi-pass radial gradients, breathing halos, text shadow simulation). The cost was manual hit-testing and the inability to use standard accessibility tooling. For a research visualization tool used by one person, this trade-off is strongly in favour of canvas.

### Trade-off 2: Real vault in tests vs. synthetic fixtures

Using the real vault means tests fail if the markdown files change unexpectedly — which is the desired behaviour. A synthetic fixture would make the tests pass even when the parser logic diverges from the actual data. The cost is that tests cannot run without the vault being present, which is acceptable since the vault is the project's source of truth.

### Trade-off 3: SWR's 24h dedupe vs. TanStack Query's stale time

TanStack Query's `staleTime` and `cacheTime` are more granular but require a `QueryClient` provider and slightly more configuration. SWR's `dedupingInterval` is less flexible but sufficient here — the vault is permanently static, so any cache duration longer than one browser session is equivalent. SWR was the more proportional choice.

### Trade-off 4: `lru_cache` vs. Redis for backend caching

`lru_cache` is process-local and lost on restart. Redis would survive restarts and be shared across replicas. For a development-stage single-process FastAPI app serving a static vault, `lru_cache` is both correct and zero-dependency. The decision point for Redis would be horizontal scaling, not current requirements.

### Trade-off 5: Mock embedder dimensionality (64) vs. real model (384)

The mock uses 64 dimensions, the real `all-MiniLM-L6-v2` uses 384. The tests do not hard-code dimensionality — they test mathematical properties (unit norm, sort order, threshold consistency). Swapping to the real model would not require any test changes. This is intentional: the test suite specifies *behaviour*, not *implementation details*.

---

## 11. Lessons and Reflections

**Coordinate systems are a first-class design concern.** The single most expensive bug fix in the project was discovering that the original node positions clustered in the left half of the canvas, behind the InsightPanel. A 10-minute upfront analysis of the UI layout versus the logical coordinate space would have caught this before any code was written.

**Two control points change everything.** The upgrade from quadratic to cubic bezier edges (one control point to two) was the fix that made the R and S letters legible. Quadratic bezier gives you a curve; cubic bezier gives you *direction control at both endpoints*. For letter formation, you need to control where the curve is going when it arrives at the destination, not just where it starts. This is a geometry fact, not a React fact.

**SWR's conditional fetch pattern eliminates an entire class of bugs.** The original `useEffect` + `useState` implementation had a subtle race condition: if you clicked two different papers in quick succession, the second fetch could resolve before the first, leaving stale data in state. SWR's key-based deduplication and atomic cache updates eliminate this class of bug entirely. The hook becomes `useSWR(paperId ? url : null)` and the rest is handled.

**Write tests that specify the contract, not the implementation.** The semantic cluster tests do not test that `_mock_embed` produces any specific vector for any specific input — they test that the output is unit-normalised, deterministic, and distinct across inputs. This means the mock can be swapped for a real model without touching the test suite. Specification over description.

---

## Appendix: Full File Inventory

| Path | Purpose |
|---|---|
| `backend/main.py` | FastAPI app, CORS, health endpoint |
| `backend/models.py` | Pydantic v2 schemas for all graph entities |
| `backend/parser.py` | Vault markdown → typed graph; `_NODE_POSITIONS`; `_INSIGHT_META` |
| `backend/router.py` | Three endpoints; `lru_cache` on all three parse paths |
| `backend/semantic_cluster.py` | `SemanticClusterer`; `_mock_embed`; `_cosine`; `SimilarityResult` |
| `backend/tests/test_parser.py` | 36 TDD tests for parser |
| `backend/tests/test_router.py` | 14 TDD tests for API contracts |
| `backend/tests/test_semantic.py` | 28 TDD tests for ML clustering |
| `frontend/app/layout.tsx` | Root layout; mounts `SWRProvider` |
| `frontend/app/page.tsx` | State machine; wires canvas ↔ panels ↔ slider |
| `frontend/app/globals.css` | Liquid glass tokens; `.glass-panel`; animations |
| `frontend/components/StarCanvas/` | RAF loop; parallax; ghost letter; edge + node dispatch |
| `frontend/components/StarCanvas/layers/ParallaxStars.ts` | 3-depth-layer star field |
| `frontend/components/StarCanvas/layers/ConstellationEdges.ts` | Cubic bezier 3-pass glow |
| `frontend/components/StarCanvas/layers/PaperNodes.ts` | 3-pass radial gradient nodes; text shadow |
| `frontend/components/DraggablePanel/` | react-rnd wrapper; framer-motion overlay pattern |
| `frontend/components/InsightPanel/` | Left panel; full `body_md` markdown |
| `frontend/components/PaperPanel/` | Right panel; concepts list; `usePaper` hook |
| `frontend/components/ConceptPanel/` | Nested panel; `useConcept` hook |
| `frontend/components/InsightSlider/` | Bottom radio-tuning slider; glowing pill track |
| `frontend/components/SWRProvider/` | Global SWR config (24 h dedupe, no focus revalidation) |
| `frontend/hooks/useGraph.ts` | SWR — full graph |
| `frontend/hooks/usePaper.ts` | SWR — paper detail |
| `frontend/hooks/useConcept.ts` | SWR — concept detail |
| `frontend/hooks/useParallax.ts` | Mouse → parallax offset (ref-based) |
| `frontend/lib/constellation.ts` | `CONSTELLATIONS` array; cubic bezier control points |
| `frontend/lib/types.ts` | Shared TypeScript interfaces |
| `frontend/lib/colors.ts` | Palette constants |
| `frontend/lib/fetcher.ts` | SWR global fetcher with typed error |
| `frontend/next.config.ts` | `/api/*` rewrite to FastAPI |
