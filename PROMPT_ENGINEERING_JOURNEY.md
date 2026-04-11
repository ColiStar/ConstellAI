# 🧠 The Vibecoding Journey: Prompt Engineering Log

ConstellAI was entirely "Vibecoded". While an autonomous AI agent generated the actual React and Python source code, the system architecture, mathematical constraints, and UX philosophy were strictly dictated by my highly structured Prompts and Obsidian Vault design.

**The core thesis of this workflow is Leverage**: By providing hyper-specific, technically rigorous constraints in plain English, I directed the AI to act as a Senior Full-Stack Engineering team, while I acted as the Software Architect and Product Director.

Below is the exact transcript of the critical Prompts I engineered to bend the AI to my specific UI/UX and data requirements.

---

## 🟢 Part 1: The Master System Initialization Prompt

**My Goal:** I needed to feed my structured Obsidian Vault (MOCs, Insights, Concepts, and Papers) into the AI, and force it to adopt a highly specific technical stack and aesthetic framework ("Relativity Over Absolutes"). I needed the AI to understand the exact directory mappings of my research.

### 📝 My Exact Prompt:
> **SYSTEM_INITIALIZATION: HIGH-STAKES VIBE CODE DEVELOPMENT**
> **PROJECT_NAME:** ConstellAI (Constellation Spatial Matrix)
> **OS_ENVIRONMENT:** macOS (Apple Silicon M3), Python 3.10+, Node.js (Next.js / Vite React)
> 
> ### 1. Role Definition & Primary Objective
> You are a **Senior Full-Stack Engineer, ML Specialist, and Elite Creative Technologist**. You possess unyielding backend logic capabilities (FastAPI, Vector DBs, TDD) combined with world-class frontend visual execution skills (WebGL, Canvas, Framer Motion, Glassmorphism). Your objective is to build an interactive Web Application that visualizes commonalities among research papers. The core philosophical driver is **"Relativity over Absolutes."**
> 
> ### 2. The Knowledge Graph Structure (Data Definition)
> The raw data is a heavily structured local Obsidian Vault. Your backend (Python/FastAPI) needs to parse these markdown files to construct the graph. Here is the exact structure:
> - **`/04_Papers/`** -> These are the absolute entities (The single "Stars"). Each markdown file represents a research paper. When a user clicks a star, this file's summary goes into the **Level 1 Glassmorphism** panel.
> - **`/03_Concepts/`** -> These are deep theoretical definitions. If a Concept is mentioned/linked in a Paper, and the user clicks it, this file's content must slide out into the **Level 2 Nested Glassmorphism** panel.
> - **`/02_Insights/`** -> These are the "Telescope Lenses" or the overarching commonalities. These files define how specific Papers across different fields align together. When an Insight is selected on the UI Slider, the system must filter and connect the related Papers to draw the constellation.
> - **`/01_MOC/`** -> Maps of Content. These provide the high-dimensional mapping context.
> 
> ### 3. Frontend Core Principles (The "Vibe" Mandate)
> Boring, standard UI libraries (MUI, Bootstrap, generic Dashboards) are STRICTLY FORBIDDEN.
> 1. **The Spatial Starfield (2.5D Parallax):** Use custom HTML5 Canvas inside Next.js/React. Create a deep space dark mode background with 3 distinct parallax layers reacting to mouse movement.
> 2. **Typography Geometry hidden in Layouts:** We have 4 core insights. When an "Insight" is activated... the connections drawn between seemingly scattered stars must form a recognizable English letter:
>    - Insight: Relativity Over Absolutes -> Letter: **R**
>    - Insight: The Variance of Trajectories -> Letter: **V**
>    - Insight: Disentanglement and Anchoring -> Letter: **D**
>    - Insight: Spurious Correlations -> Letter: **S**
> 3. **Nested Glassmorphism Engine:** When a node (Paper) is clicked, gracefully slide out a high-end Glassmorphism panel displaying its summary (Level 1)... slide out a secondary, nested Glassmorphism panel (Level 2) connected to the first by a glowing SVG thread.
> 
> ### 4. Strict Operational Rules
> 1. **Defensive TDD:** Follow Test-Driven Development implicitly. Write a failing test suite (Pytest or Jest) before implementing backend logic.
> 2. **Code Quality:** Strict adherence to Python Type Hints and PEP8. For frontend, strictly type all React components and Hooks with TypeScript.
> 3. **Memory Persistence:** Maintain an `ARCHITECTURE.md` file in the root to persist core architecture decisions so you don't lose context.

### 🤖 AI Execution:
The AI fully respected the routing structure. It built a stateless FastAPI parser bridging my exact Markdown folder boundaries (`01_MOC` through `04_Papers`), and spun up a Next.js Canvas layout. However, it failed the visual constraint on typography legibility.

---

## 🟠 Part 2: The UI/UX Correction Directive

**My Goal:** The AI's initial attempt at drawing the R, V, D, and S letters was mathematically unsound, and its panels were docked sidebars instead of CSS absolute floating cards. I had to explicitly micromanage CSS architecture and Canvas coordinate scaling.

### 📝 My Exact Prompt:
> **Feedback from Lead Architect (USER):**
> The initial implementation has successfully connected the backend, but the Frontend execution fundamentally failed the "Vibe Code" and UX constraints.
> 
> ### [CRITICAL FIX 1] Typography Geometry & Canvas Scaling (The Constellations)
> **Issue:** Except for the letter 'V', the edges drawn for 'A', 'D', and 'S' do not visually resemble their letters. 
> **Action:** Fix the hardcoded `NODE_POSITIONS` and Bezier curve logic in your Canvas rendering. The letters MUST look like legible letters when connected. Treat the Canvas scaling dynamically so proportions aren't destroyed. Render a semi-transparent text label next to EVERY star by default.
> 
> ### [CRITICAL FIX 2] The Glassmorphism Panels (Not Sidebars!)
> **Issue:** You implemented a docked, incredibly narrow sidebar. It is completely unreadable and text overlaps.
> **Action:** Float, don't Dock: The panels must be floating CSS cards (`position: absolute`), not a CSS Grid sidebar. Increase `min-width` to at least `500px`. Fix the Z-index and layout algorithm for the Level 2 (Concept) panel. It must slide out gracefully to the side of Level 1, without ANY text overlapping.
> 
> ### [CRITICAL FIX 3 & 4] Slider Identity & Data Truncation
> **Action:** Build a Real Slider that visually implies a physical sliding/tuning mechanism. Furthermore, the FastAPI parser must pull the *full* markdown body of the Insight file to display in a scrollable overlay, rather than aggressively truncating academic research.

### 🤖 AI Execution:
By aggressively dictating absolute positioning (`position: absolute`) vs CSS Grid, and forcing bezier-curve recalculation, the AI replaced its basic linear links with high-fidelity Cubic Bezier math. It integrated `react-rnd` to create flawless floating glass panes.

---

## 🔵 Part 3: Production Polish & ML Foundation

**My Goal:** Elevating the MVP to production readiness by introducing React Query memory caching and architecting a real Machine Learning pipeline structure.

### 📝 My Exact Prompt:
> **PHASE 2 DEPLOYMENT: PRODUCTION POLISH & ML EXTENSION**
> 
> ### 1. Frontend Performance & Caching Strategy
> The current React application fetches data plainly. Refactor the frontend data-fetching layer to use **TanStack Query (React Query)** or **SWR**. Ensure the GraphCanvas data is aggressively cached to prevent redundant backend hits when switching between Telescope Lenses.
> 
> ### 2. Extensibility: The ML Semantic Clustering Foundation
> Currently, our mapping relies on explicit regex/frontmatter. Create a new Python module (`semantic_cluster.py`) that outlines how we *would* use a local embedding model (e.g., `all-MiniLM-L6-v2`) to compute similarity scores between new unseen papers and our existing Insights. Write the class structure, add a mocked embedding fallback, and write a failing-then-passing test in `test_semantic.py` to prove the threshold logic works.
> 
> ### 3. Code Structuring & Export
> Run a final simplification pass to ensure PEP8 and strict ESLint compliance. Update `ARCHITECTURE.md` with the new performance and ML strategies.

### 🤖 AI Execution:
The AI successfully installed `SWR` with strict deduplication rules to prevent network chatter. It constructed a robust ML scaffolding in Python (`semantic_cluster.py`) that simulates cosine-similarity vector embeddings, wrapped in 78/78 passing Pytest assertions. 

---

### 🏆 Conclusion
This repository demonstrates that "Vibecoding" is an architectural discipline. The quality of the final Next.js and FastAPI application is a direct 1:1 reflection of the clarity, technical strictness, and systemic rigor of the initial User Prompt definitions.
