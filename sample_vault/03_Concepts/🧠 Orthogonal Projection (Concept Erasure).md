---
tags: [Concept, LinearAlgebra, Alignment]
status: 🌳 Mature
---
# 🧠 Orthogonal Projection (Concept Erasure)

**📌 Related Papers:** [[📄 Interpret Diffusion]]
**🔗 Related Insights:** [[✨ Disentanglement and Anchoring]], [[✨ Superficial vs Geometric Alignment]]

## What is Orthogonal Projection in Latent Space?
It is a profound geometric intervention technique. Instead of retraining or fine-tuning a model to "forget" a harmful or biased concept, we find the specific mathematical direction (vector) that represents that concept in the model's latent high-dimensional space, and we geometrically subtract it from any future calculations.

## The Math Simplified
1. Imagine the latent space has a clean direction vector $V_{gender}$ that represents the shift from masculine to feminine.
2. We have an image's hidden representation state $H$.
3. We want to evaluate the image *without* it being influenced by gender bias.
4. We mathematically project $H$ onto the orthogonal complement of $V_{gender}$. 
   Essentially: $H_{erased} = H - \text{projection\_of}(H \text{ onto } V_{gender})$

## Why it matters in our Graph
This concept is the mathematical soul of [[✨ Disentanglement and Anchoring]]. It proves that neural networks, despite being considered "black boxes," actually structure human knowledge in linear, geometric ways. By using orthogonal projection, we can manually decouple entangled concepts without causing collateral damage to the rest of the model's capabilities. This represents a massive conceptual leap towards [[✨ Superficial vs Geometric Alignment|Deep Geometric Alignment]].
