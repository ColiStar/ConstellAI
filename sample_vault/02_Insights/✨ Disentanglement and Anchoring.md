---
tags: [Insight, Disentanglement, VLM, Attack]
aliases: [Disentanglement, Orthogonal Anchors]
status: 🌱 Incubating
---

# ✨ Disentanglement and Anchoring

> [!quote] Core Idea
> **Problem:** Large models rely on probabilistic co-occurrence, making them prone to feature entanglement and blind linguistic association. This lack of grounding leads to hallucinations, biases, and adversarial vulnerabilities.
> 
> **Solution:** Models must explicitly disentangle target features from background contexts and strictly anchor their generation to objective coordinates (e.g., physical bounding boxes or isolated spatial masks) prior to output.
> 
> *In short: without disentanglement, modifying a model is like pulling on a loose thread — everything unravels. Without anchoring, confident outputs are just fluent lies.*

## 🔗 Related Papers & Phenomena

- **[[📄 PostAlign]]** *(Multimodal | Hallucination)*
    - Forces the model to generate bounding box coordinates (`<LOC>`) before text, and uses a `<REJ>` token for non-existent objects. This enforces strict **spatial anchoring**, directly cutting off the model's reliance on entangled linguistic priors and eliminating visual hallucinations.

- **[[📄 EFA]]** *(Image Generation | Fairness)*
    - Combines cross-attention with segmentation masks to restrict attribute edits (e.g., gender) to specific pixel regions. This isolates the target attribute from non-target attributes (e.g., background), proving that **spatial disentanglement** is required for accurate, non-destructive generation.

- **[[📄 Interpret Diffusion]]** *(Image Generation | Interpretability)*
    - Discovers semantic concept vectors in the U-Net bottleneck ($h$-space) via self-supervision. While it provides a tool for **anchoring** specific concepts, its global application lacks spatial awareness, causing severe **entanglement** (e.g., modifying gender unintentionally alters backgrounds). This highlights the necessity of EFA's spatial isolation.

- **[[📄 CroPA]]** *(Multimodal | Adversarial Attack)*
    - Uses imperceptible visual perturbations to shift the text prompt's embedding coverage in the latent space, deceiving the model across various instructions. Proves that current visual-language alignments are highly **entangled and unanchored** — minor visual noise easily detaches the text prompt from its intended semantic meaning.

## 💡 Inspiration

> [!tip] Can PostAlign / EFA / Interpret Diffusion solve the CroPA vulnerability?
> 
> - **PostAlign: Yes (Directly Effective).** Strict physical anchoring via bounding boxes and `<REJ>` rejection directly neutralizes CroPA's ungrounded semantic hallucinations.
> - **EFA: Conceptually Yes (Requires Adaptation).** Its spatial disentanglement could isolate CroPA's global noise, but EFA is designed for Diffusion models, not VLMs — adaptation work required.
> - **Interpret Diffusion: No.** Applies semantic concept vectors globally without spatial awareness. Using it against CroPA would distort non-target attributes rather than cleanly removing the adversarial noise.
