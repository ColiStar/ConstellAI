---
tags: [Paper, Diffusion, Debiasing, Disentanglement]
status: 🧠 Processed
---
# 📄 EFA (Entanglement-Free Attributes in Text-to-Image)

**📌 Related Insights:**
- [[✨ Disentanglement and Anchoring]]
- [[✨ Spurious Correlations]]
**🔑 Key Concepts:** [[🧠 Orthogonal Projection (Concept Erasure)]]

## Core Summary
EFA aims to solve the problem of bias in Text-to-Image generation (e.g., generating "A CEO" almost exclusively shows a white male in a suit). However, traditional debiasing methods accidentally destroy the background due to entanglement. EFA forces the "human representation" to be mathematically disentangled from the "environmental context" within the Cross-Attention layers.

## Core Mechanisms
1. **The Entanglement Problem:** If you try to force a diffusion model to generate a female CEO using standard prompt weighting, the model might abruptly change the modern office background into a kitchen or a drastically different scene. This happens because "female" and "domestic settings" are highly entangled in the training data distribution.
2. **Entanglement-Free Attention:** EFA intervenes during the generation process. It identifies the cross-attention maps associated with the target attribute (e.g., gender) and mathematically isolates them from the attention maps of the environment.

## Connection to Insights
- This is a prime practical example of [[✨ Disentanglement and Anchoring]]. By providing a clear, orthogonal anchor for human attributes separate from environmental attributes, EFA prevents the model's biases from collapsing and destroying the entire spatial composition of the image.
