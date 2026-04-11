# 🧠 The Vibecoding Journey: Prompt Engineering Log

ConstellAI was entirely "Vibecoded". While an autonomous AI agent generated the actual React and Python source code, the system architecture, mathematical constraints, and UX philosophy were strictly dictated by my highly structured Prompts and Obsidian Vault design.

Below is a curated record of the exact Prompts I engineered to direct the AI, followed by a concise summary of how the AI responded to those constraints.

---

## 🟢 Part 1: The Master Initialization Prompt

**My Goal:** I needed to feed my structured Obsidian Vault (MOCs, Insights, Concepts, and Papers) into the AI, and force it to adopt a specific aesthetic framework ("Relativity Over Absolutes") without relying on generic, boring UI libraries.

### 📝 My Prompt Excerpt:
> **Role Definition:** You are a Senior Full-Stack Engineer and Elite Creative Technologist. Your objective is to build a Web Application that visualizes commonalities among research papers. The core philosophical driver is **"Relativity over Absolutes."**
> 
> **File System Constraints:** You must strictly separate the data from the source code. Read from my `/04_Papers`, `/03_Concepts`, and `/02_Insights` folders, but NEVER alter them. 
>
> **The Typography Geometry Mandate:** We have 4 core insights. When an "Insight" is activated via a radio tuning slider, the connections drawn between seemingly scattered stars must form a recognizable English letter:
> - Relativity Over Absolutes -> Letter: **R**
> - The Variance of Trajectories -> Letter: **V**
> - Disentanglement and Anchoring -> Letter: **D**
> - Spurious Correlations -> Letter: **S**
>
> **Nested Glassmorphism Engine:** When a Paper is clicked, slide out a high-end Glassmorphism panel. If the summary highlights a "Core Concept", slide out a secondary, nested Level-2 panel connected by a glowing SVG thread. Boring UI libraries (MUI, Bootstrap) are STRICTLY FORBIDDEN.

### 🤖 AI Response:
The AI successfully built the foundational stack:
1. **Backend:** A stateless FastAPI parser that systematically read my markdown files and converted the frontmatter into a JSON Graph.
2. **Frontend:** A Next.js HTML5 Canvas loop. 
3. **The Result:** While technically functional, the geometric typography (R, D, S) looked distorted, and the Glassmorphism panels were built as rigid CSS Grid sidebars rather than beautifully floating layers. I needed to issue a strict architectural correction.

---

## 🟠 Part 2: The UI/UX Correction Directive

**My Goal:** The AI failed the aesthetic constraints. I had to explicitly instruct it on frontend layout algorithms (Absolute positioning vs. CSS Grid) and correct the math for the Canvas Bezier curves.

### 📝 My Prompt Excerpt:
> **[CRITICAL FIX 1] Typography Geometry & Canvas Scaling:** Except for the letter 'V', the edges drawn for 'A', 'D', and 'S' do not visually resemble their letters. Re-calculate the `NODE_POSITIONS` and Bezier curve logic. Render a semi-transparent text label (`rgba(255,255,255,0.4)`) next to EVERY star by default so I can read it without hovering.
>
> **[CRITICAL FIX 2] The Glassmorphism Panels (Not Sidebars!):** You implemented a docked sidebar. It is completely unreadable. Float, don't Dock. The panels must be floating CSS cards (`position: absolute`) floating over the Canvas with a min-width of 500px and generous internal padding. Fix the Z-index so the Level 2 panel slides out gracefully without ANY text overlapping.
>
> **[CRITICAL FIX 3] The Spectrum Slider:** The UI at the bottom is a messy pile. Build a Real Slider: It must visually imply a physical sliding/tuning mechanism, rather than just raw button text.

### 🤖 AI Response:
The AI executed the UI refactoring flawlessly:
- Replaced quadratic curves with **Cubic Bezier control points** to draw legible R, D, and S curves.
- Upgraded the React layout to use `react-rnd`, making the Level 1 and Level 2 Glassmorphism windows fully draggable and resizable over the canvas.

---

## 🔵 Part 3: Production Polish & ML Foundation

**My Goal:** With the visual layer perfected, I needed to push the application from an MVP into a production-ready state, optimizing caching and preparing a real Machine Learning pipeline to replace manual regex parsing.

### 📝 My Prompt Excerpt:
> **Frontend Performance & Caching Strategy:** Refactor the frontend data-fetching layer to use **TanStack Query (React Query)** or **SWR**. Ensure the GraphCanvas data is aggressively cached (stale-time configurations) to prevent redundant backend hits when switching Insight lenses.
>
> **Extensibility: The ML Semantic Clustering Foundation:** Currently, our `[Paper] -> [Insight]` mapping relies on explicit regex/frontmatter matching. Create a new Python module (`semantic_cluster.py`) that outlines how we *would* use a local embedding model (e.g., `all-MiniLM-L6-v2`) to compute cosine-similarity scores between new unseen papers and our existing Insights. Write the class structure, add a mocked embedding fallback, and write a Pytest suite to prove the math works.

### 🤖 AI Response:
The AI successfully:
- Implemented `SWR` with a `dedupingInterval`, resulting in zero-latency switching between constellations.
- Wrote `semantic_cluster.py` leveraging cosine-similarity math and a mock embedder, securing 78/78 passing TDD Pytest assertions. 

---

### 📝 Conclusion
By strictly defining the knowledge ontology, engineering constraints, and visual vibe in plain English, I was able to direct an AI to rapidly spin up a complex 2.5D knowledge visualizer perfectly tailored to my UCSB 594BB research. This is the power of high-stakes Vibecoding.
