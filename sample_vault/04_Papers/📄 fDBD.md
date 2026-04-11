---
tags: [Paper, OOD, Defense]
status: 🧠 Processed
---
# 📄 fDBD (Feature Distance to Decision Boundary)

**📌 Related Insights:**
- [[✨ Relativity Over Absolutes]]
- [[✨ Superficial vs Geometric Alignment]]
**🗣️ Relevant Presentations:**
- [[🗣️ Report - Mapping the Unknown (OOD and Calibration)]]
**🔑 Key Concepts:** [[🧠 Neural Collapse]]

## Core Summary
fDBD is an Out-of-Distribution (OOD) detection algorithm that completely bypasses the final Softmax layer (which is famously known to be overconfident). Instead, it measures how a sample's features physically align within the strict geometric landscape created by [[🧠 Neural Collapse]].

## Core Mechanisms
1. **The Problem with Absolute Distance:** Older OOD detection methods tried to measure how far a feature representation was to the nearest decision boundary. However, features with naturally larger mathematical norms (magnitudes) would misleadingly appear further from the boundary just because they are scaled larger, causing false positives.
2. **The fDBD Ratio:** To normalize this, fDBD uses a relative geometric property:
   $$ fDBD~Score = \frac{Distance~to~Decision~Boundary}{Distance~to~Class~Center} $$
3. By dividing the boundary distance by the center distance, the problematic magnitude of the vector cancels out. The metric is transformed into a pure [[✨ Relativity Over Absolutes|relative ratio]]. 

## Connection to Insights
- If a sample is genuine (In-Distribution), it should be very close to the center and far from the boundary, resulting in a very high score. If it is an OOD sample, it sits awkwardly in the latent space, resulting in a low score. 
- This paper perfectly proves that relying on the **relativity** of spatial geometry to measure anomalies is far superior and more robust than relying on absolute distance thresholds.
