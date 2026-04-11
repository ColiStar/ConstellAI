---
tags: [Paper, Diffusion, ConceptSpace, LatentGeometry]
status: 🧠 Processed
---
# 📄 Interpret Diffusion

**📌 Related Insights:**
- [[✨ Disentanglement and Anchoring]]
- [[✨ Superficial vs Geometric Alignment]]
**🔑 Key Concepts:** [[🧠 Orthogonal Projection (Concept Erasure)]]

## Core Summary
Interpret Diffusion reveals that diffusion models possess a highly structured latent "concept space" (h-space). Rather than poorly fine-tuning a model to remove NSFW concepts or to learn a new stylistic preference, one can simply find the specific directional vector corresponding to that concept and mathematically erase it or amplify it.

## Core Mechanisms
1. **Discovering Concept Vectors:** The researchers extracted intermediate hidden states (h-space) and used PCA/SVMs to find a linear boundary (a vector) that perfectly separates, for instance, "safe images" from "NSFW images" or "male" from "female".
2. **Concept Manipulation via Math:** Once the target vector is identified, they apply an orthogonal projection. By subtracting this vector's component during the denoising steps, the model is physically prevented from generating that concept, without damaging or entangling with any other unrelated concepts.

## Connection to Insights
- By using [[🧠 Orthogonal Projection (Concept Erasure)]], this paper achieves perfect [[✨ Disentanglement and Anchoring]]. It proves that concepts in a well-trained model are naturally somewhat orthogonal, and we can manipulate this geometry directly for safety and alignment, heavily reinforcing [[✨ Superficial vs Geometric Alignment]].
