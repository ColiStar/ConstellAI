---
tags: [Paper, OOD, Defense]
status: 🧠 Processed
---
# 📄 NCI (Neural Collapse Inspired OOD)

**📌 Related Insights:**
- [[✨ Relativity Over Absolutes]]
- [[✨ Superficial vs Geometric Alignment]]
**🗣️ Relevant Presentations:**
- [[🗣️ Report - Mapping the Unknown (OOD and Calibration)]]
**🔑 Key Concepts:** [[🧠 Neural Collapse]]

## Core Summary
NCI leverages the geometry of [[🧠 Neural Collapse]] to perform Out-of-Distribution (OOD) detection. Instead of looking at output probabilities, it calculates the relative Cosine Similarity between a sample's features and the final linear classifier's weight vectors.

## Core Mechanisms
Because perfectly trained networks converge to Neural Collapse, the weight vectors of the classifier perfectly align with the feature cluster centers (Self-Duality). NCI simply measures the angle (Cosine Similarity) between the input feature and these weight vectors. 

## Connection to Insights
- Calculating an angle is inherently calculating a relation/ratio. NCI ignores the absolute magnitude of the feature, focusing entirely on [[✨ Relativity Over Absolutes|relative direction]].
- It proves that examining the [[✨ Superficial vs Geometric Alignment|geometric convergence]] is a far more robust metric for reliability than the superficial final logits.
