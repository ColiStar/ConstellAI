# ConstellAI ✨

**ConstellAI** is an interactive, 2.5D knowledge graph visualizer built to map out high-dimensional concepts in AI alignment research. Unlike traditional force-directed graphs that simulate physics, ConstellAI enforces strict geometries. Papers act as fixed stars, while overarching "Insights" act as lenses. Switching lenses reveals constellation trajectories forming actual typography (R, V, D, S) across the deep-space starfield.

Designed with a heavy focus on the "Relativity Over Absolutes" philosophy, this project serves as a programmatic manifestation of an undergraduate thesis on AI interpretability and advanced interaction design.

## Features
- **Liquid Glassmorphism:** Heavy blur and saturation filters mixed with low-opacity dark tones allow glowing stars to bleed organically through draggable panels.
- **2.5D Parallax Starfield:** A multi-layered, interactive canvas renderer driving hundreds of background stars tracking cursor positions.
- **Deterministic Edge Curves:** Uses custom cubic-bezier math to draw dynamic, glowing constellation lines that strictly enforce letter-shape formations.
- **Parse-Once Architecture:** A stateless Python/FastAPI backend instantly generates Graph mappings from a read-only local Markdown Obsidian Vault using `SWR` deduplicated caching on the client.

## Tech Stack
* **Frontend:** Next.js 14, TypeScript, React 18, HTML5 Canvas, Framer Motion, Tailwind CSS, react-rnd
* **Backend:** Python 3.10+, FastAPI, Pydantic v2, Python-Frontmatter

## Deep Dives & Documentation
If you are evaluating this repository, please review the extensive architectural write-ups:
* 📖 [**CASE_STUDY_SESSION.md**](./CASE_STUDY_SESSION.md) - A full 11-section engineering blog post documenting the core geometric logic, TDD pipeline, canvas vs DOM trade-offs, and "Vibe" aesthetics logic.
* 🏛 [**ARCHITECTURE.md**](./ARCHITECTURE.md) - Contains the vault structure, rendering decisions, hard-coded star coordinates, and API contacts.
* 🤖 [**YC_Raw_Session_Transcript.md**](./YC_Raw_Session_Transcript.md) - Full, untampered autonomous coding agent session transcript of the architecture process (cleaned and scrubbed).

## Running Locally

Because the system works by strictly reading an external read-only Obsidian Vault containing the actual research paper markdown, running it requires pointing the backend to a mock or real vault structure.

If you have the vault configured:

**1. Start the Backend (FastAPI)**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**2. Start the Frontend (Next.js)**
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:3000` to enter the spatial matrix.
