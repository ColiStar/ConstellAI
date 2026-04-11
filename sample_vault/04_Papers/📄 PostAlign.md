---
tags: [Paper, VLM, Reasoning, Align]
status: 🧠 Processed
---
# 📄 PostAlign

**📌 Related Insights:**
- [[✨ The Variance of Trajectories]]
- [[✨ Disentanglement and Anchoring]]
**🗣️ Relevant Presentations:**
- [[🗣️ Report - The Paradox of AI Reasoning]]
**🔑 Key Concepts:** [[🧠 Selective Reasoning]]

## Core Summary
PostAlign is a framework specifically designed for Vision-Language Models (VLMs). It tackles the high hallucination rate in VLMs by introducing two mechanisms: Selective Reasoning to control thought variance, and Visual Grounding to disentangle text bias from true visual features.

## Core Mechanisms
1. **Selective Reasoning:** It uses [[🧠 Selective Reasoning]] to prevent the VLM from hallucinating on simple images by evaluating the image-text context complexity before deciding to generate a CoT.
2. **Visual Grounding (Anchors):** It forces the model to output explicit bounding boxes `<LOC>` before making claims. This anchors the network's attention purely on the visual context.

## Connection to Insights
- **Variance:** It introduces a practical solution to [[✨ The Variance of Trajectories]] by truncating unnecessary thought processes.
- **Disentanglement:** The bounding boxes act as orthogonal anchors, achieving [[✨ Disentanglement and Anchoring]] that breaks the spurious correlation where VLMs just rely on linguistic guessing rather than looking at the image itself.
