---
tags: [Insight, Relativity, OOD, RL]
aliases: [Relativity > Absolutes]
status: 🌱 Incubating
---

# ✨ Relativity Over Absolutes

> [!quote] Core Idea
> Many breakthrough advancements stem from abandoning the pursuit of "absolute values" and instead utilizing "relative relationships or ratios" in latent space.

## 🔗 Related Papers & Applications
*   **[[📄 DeepSeek-R1]] (Reinforcement Learning)**: [[🧠 GRPO (Group Relative Policy Optimization)]] does not rely on an absolute Value Model for scoring. Instead, it generates a batch of answers for the same prompt and calculates their **relative advantage**. This solves the inaccuracy of absolute scoring.
*   **[[📄 fDBD]] (OOD Detection)**: Abandons evaluating how far a feature is from the boundary (an absolute value), as the feature's norm affects this value. fDBD introduces a **ratio**: "distance to boundary" divided by "distance to center" to detect anomalies.
*   **[[📄 NCI]] (OOD Detection)**: Similarly ignores absolute feature magnitudes, focusing instead on the **Cosine Similarity (angle)** between features and weight vectors.

## 💡 Cross-Domain Inspiration
> [!tip] Population-Distribution OOD Detection
> Can we apply the philosophy of [[🧠 GRPO]] to OOD detection?
> Current OOD methods calculate an absolute score for a single image (e.g., fDBD score). If we have the model infer a batch of images simultaneously and use their "relative distribution network" in the latent space to catch outliers, could we breakthrough the scaling laws of single-sample detection?
