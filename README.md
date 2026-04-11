# ✨ ConstellAI: Visualizing Relativity Over Absolutes

## 🌌 Motivation
This project was born out of my experience in the **UCSB 594BB** course. Throughout the semester, I immersed myself in numerous State-of-the-Art (SOTA) AI research papers spanning diverse sub-fields. 

As I studied, I began to sense deep, underlying connections between these papers. Even when papers originated from entirely different domains, they often shared similar high-level structural thoughts or philosophical approaches. However, traditional knowledge management tools—such as flat lists, rigid folders, or chaotic force-directed physics graphs—entirely failed to capture these nuanced, cross-domain relationships. 

I wanted a visual, spatial way to represent and organize these hidden connections. I conceptualized a system where individual papers act as **fixed stars**, and the underlying connections act as **Lenses (Insights)** that reveal specific constellations when viewed from the right perspective.

## 🛠️ How I Built This (The Contribution)

My core contribution to this project is not the boilerplate HTML or Python code itself, but the **Knowledge Architecture and the Prompt Engineering (Vibecoding)** that brought it to life. I acted as the Domain Expert and Product Director, utilizing AI as my engineering team.

Here is exactly how I built ConstellAI:
1. **Knowledge Extraction:** First, I reviewed the SOTA papers and extracted multiple high-level "Insights". These insights formed the core ontology of the constellations.
2. **Structuring the Vault:** I constructed a rigorous, highly-structured local knowledge base (a Markdown Obsidian Vault), systematically dividing data into MOCs (Maps of Content), Insights, Concepts, and Papers.
3. **Prompt Engineering & System Design:** I taught an autonomous AI agent exactly how to interpret my knowledge base. I provided explicit directives on how the backend (FastAPI) should parse my vault, and established strict UX/UI "Vibe" mandates (like Liquid Glassmorphism and exact Bezier-curve rendering logic) to ensure the 2.5D interface accurately reflected my philosophical concept.

The true value of this project lies entirely in the **Prompt Framework** and problem-solving methodology I used to turn theoretical knowledge structures into a fully working full-stack matrix.

---

## 🎬 Visual Demo
https://github.com/user-attachments/assets/7fce0249-b6da-432e-be57-d0233959b99c

---

## 🧠 The Vibecoding Journey
If you want to see exactly how I directed an AI to build a full-stack, visually complex application from a set of Markdown files, please read my Prompt Engineering Log:

📖 [**PROMPT_ENGINEERING_JOURNEY.md**](./PROMPT_ENGINEERING_JOURNEY.md) 
This document showcases the raw prompts I designed to command the AI, enforce physical geometry on the canvas, correct its UI mistakes, and architect a robust semantic clustering ML backend.

---

## 🚀 Running ConstellAI Locally
This repository includes a packaged `sample_vault/` (containing my study notes, concept breakdowns, and insights synthesized from reading real SOTA AI papers during the UCSB 594BB course). That means you can launch it instantly out of the box!

```bash
# In the ConstellAI directory
bash start.sh
```

*(This automatically boots the FastAPI backend parser on `:8000` and the Next.js visualizer on `:3000`)*
