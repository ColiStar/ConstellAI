# ✨ ConstellAI: Designing Relativity Over Absolutes

**ConstellAI** is an interaction design experiment and 2.5D knowledge graph visualizer built to map out high-dimensional concepts in AI alignment research. 

Traditionally, knowledge management tools present information as flat lists or chaotic, physics-driven node-link diagrams. ConstellAI proposes a different paradigm: treating a corpus of research papers as **fixed stars in a deep-space starfield**, and shifting the interactive focus entirely onto the "Lenses" we use to view them.

This application is the programmatic manifestation of an undergraduate thesis focused on **AI Interpretability and Spatial Interaction Design**.

---

## 🔭 The Philosophy: "Relativity Over Absolutes"

The core philosophy driving this interface is that individual data points (stars/papers) are absolute and static, but *meaning* is geometric and relative. 

When a user interacts with the system, they don't search for papers—they switch **Insight Lenses**. Switching a lens reorganizes the connections between scattered stars to reveal hidden structures and exact letter-shaped constellations (such as **R, V, D, S**).

### Core Experiential Features
- **Deterministic Geometric Constellations:** Shifting a lens explicitly draws glowing constellation lines that form strict, recognizable typography across the canvas, proving that perspective dictates pattern.
- **Liquid Glassmorphism Panels:** A custom UI layer using heavy blur, saturation filters, and low-opacity dark tones, allowing the glowing stars beneath to bleed organically through the interface.
- **Nested Contextual Threads:** As users explore high-level papers, secondary glass panels slide out to define mathematical concepts (Level 2 definitions), connected by glowing spatial threads.

---

## 🎥 Visual Demo


https://github.com/user-attachments/assets/7fce0249-b6da-432e-be57-d0233959b99c









---

## 🏛 Design & Concept Architectures
If you are evaluating the theoretical and design constraints of this project, please refer to:
* 📖 [**CASE_STUDY_SESSION.md**](./CASE_STUDY_SESSION.md) - A conceptual deep-dive into why physics simulations were rejected in favor of fixed-coordinate geometry to enforce typographic constellations.
* 🏛 [**ARCHITECTURE.md**](./ARCHITECTURE.md) - The vault structure mapping the relationship between absolute stars (Papers) and their telescope lenses (Insights).

---

## 🚀 Running the Space Locally
ConstellAI parses its spatial graph from a strict, local Read-Only Obsidian Markdown Vault. 

**Wait for Backend API parsing (Window 1):**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Launch the Canvas Interface (Window 2):**
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:3000` to enter the spatial matrix.
