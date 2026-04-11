---
tags: [Insight, Disentanglement, VLM, Attack]
aliases: [Disentanglement, Orthogonal Anchors]
status: 🌱 Incubating
---

# ✨ Disentanglement and Anchoring

> [!quote] Core Idea
> Model failures often originate from "Spurious Correlation" (entanglement). Successful solutions usually involve finding an independent, "orthogonal anchor" to constrain the model.

## 🔗 Related Papers & Phenomena
*   **[[📄 EFA]] (Text-to-Image)**: To prevent debiasing from destroying the image background, it forces "human attributes" and "background context" to be **Disentangled (Entanglement-Free)** within the attention mechanism.
*   **[[📄 Interpret Diffusion]] (Text-to-Image)**: Discovers mutually independent semantic vectors in the latent space (h-space), allowing the addition of "anti-NSFW" or "gender-swap" vectors without disturbing other features.
*   **[[📄 CroPA]] (VLM Attacks)**: Attackers exploit entanglement, strongly coupling adversarial noise with all possible prompts. This forces the model to output the same incorrect answer regardless of the question.
*   **[[📄 PostAlign]] (VLM Defense)**: Forces the model to generate `<LOC>` (Bounding Boxes) as **Visual Grounding anchors**, breaking the incorrect entanglement between linguistic habits and visual features.

## 💡 Cross-Domain Inspiration
> [!tip] Conceptual Shield in Latent Space
> Since Interpret Diffusion can find specific concept vectors in h-space, can we automatically discover direction vectors representing "Hallucination" or "Adversarial Attacks (CroPA)" in VLMs like LLaVA?
> During inference, actively subtracting this harmful vector in the feature space would be much deeper and more effective than superficial prompt restrictions.
