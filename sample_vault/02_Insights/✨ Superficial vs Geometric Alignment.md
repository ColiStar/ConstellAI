---
tags: [Insight, Safety, Alignment, Geometry]
aliases: [Superficial vs Geometric Alignment]
status: 🌱 Incubating
---

# ✨ Superficial vs Geometric Alignment

> [!quote] Core Idea
> Trying to alter a model purely through "Superficial Instructions (Text/Prompts)" is fragile. True alignment exists within the model's "Deep Geometric Distribution."

## 🔗 Related Papers & Phenomena
*   **[[📄 Safety Alignment Just a Few Tokens Deep]]**: Reveals that current safety alignments are shallow. Forcing the model to output "Sure" at the start instantly collapses the safety defense.
*   **[[📄 DeepSeek-R1]]**: The authors boldly bypassed traditional SFT (Supervised Fine-Tuning) and went straight to RL. They discovered that human-annotated SFT only provides a "superficial format" which restricts the model's ability to explore optimal geometric paths.
*   **[[📄 NCI]] / [[📄 fDBD]]**: These papers demonstrate that verifying whether a model truly *knows* a sample isn't about its final text output, but whether its feature space exhibits the perfect geometric structure of [[🧠 Neural Collapse]] (ETF).

## 💡 Cross-Domain Inspiration
> [!tip] Geometry-Constrained Safety Alignment
> Future safety alignment shouldn't just teach the model to say "I cannot answer this." Rather, much like Neural Collapse, it should force "harmful concepts" to collapse into an isolated, disconnected cluster in the latent space.
> If we measure this using fDBD metrics, the features triggered by any Jailbreak attempt would geometrically be classified as extreme OOD, and intrinsically rejected by the base layer—completely immunizing against Prefilling attacks.
