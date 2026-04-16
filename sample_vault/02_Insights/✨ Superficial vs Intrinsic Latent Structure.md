---
tags: [Insight, Safety, Alignment, Geometry]
aliases: [Superficial vs Intrinsic Latent Structure]
status: 🌱 Incubating
---

# ✨ Superficial vs Intrinsic Latent Structure

> [!quote] Core Idea
> Trying to alter a model purely through "Superficial Instructions (Text/Prompts)" is fragile. True alignment exists within the model's **Deep Geometric Distribution** — not in the words it outputs.

## 🔗 Related Papers & Phenomena

- **[[📄 Safety Alignment Just a Few Tokens Deep]]** *(Large Language Models | AI Safety)*
    - Reveals that current safety alignments are shallow. The KL divergence between an aligned model and its unaligned base drops to near zero after just 5 tokens — forcing the model to output "Sure" at the start instantly collapses the entire safety defense.

- **[[📄 DeepSeek-R1]]** *(Large Language Models | Reinforcement Learning)*
    - The authors bypassed traditional SFT and went straight to RL. They discovered that human-annotated SFT only provides a "superficial format" which restricts the model's ability to explore optimal geometric paths — RL discovers richer, non-human-like reasoning structures.

- **[[📄 CroPA]]** *(Multimodal | Adversarial Attack)*
    - Proves that text-based defense is an illusion. Attackers can directly exploit the latent geometry (image perturbation) to override the entire linguistic pathway. *An image truly is worth a thousand text prompts.*

- **[[📄 NCI]]** / **[[📄 fDBD]]** *(Image Classification | OOD Detection)*
    - These papers demonstrate that verifying whether a model truly *knows* a sample isn't about its final text output, but whether its feature space exhibits the perfect geometric structure of [[🧠 Neural Collapse]] (ETF).

- **[[📄 Interpret Diffusion]]** *(Image Generation | Interpretability)*
    - Shows that abstract safety concepts (violence, nudity) exist as navigable geometric coordinates in the latent space — proving we can manipulate the model's internal geometry directly, far more robustly than relying on superficial prompt restrictions.

## 💡 Inspiration

> [!tip] Geometry-Constrained Safety Alignment
> Future safety alignment shouldn't just teach the model to say "I cannot answer this." Rather, much like Neural Collapse, it should force "harmful concepts" to collapse into an **isolated, disconnected cluster** in the latent space.
>
> If we measure this using fDBD metrics, the features triggered by any Jailbreak attempt would geometrically be classified as extreme OOD, and intrinsically rejected by the base layer — completely immunizing against Prefilling attacks.
