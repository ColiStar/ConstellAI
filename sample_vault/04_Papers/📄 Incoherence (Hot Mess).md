---
tags: [Paper, Reasoning, CoT]
status: 🧠 Processed
---
# 📄 A Hot Mess (Incoherence in Long Chain-of-Thought)

**📌 Related Insights:**
- [[✨ The Variance of Trajectories]]
**🗣️ Relevant Presentations:**
- [[🗣️ Report - The Paradox of AI Reasoning]]

## Core Summary
This paper investigates the behavior of LLMs when forced into generating extremely long Chain-of-Thought (CoT) trajectories. It mathematically proves that while computation scaling helps, it introduces a severe instability parameter: Variance.

## Core Mechanisms
As generating length increases, the probability of the model maintaining logical coherence degrades exponentially due to accumulating errors at each auto-regressive step. The model essentially forgets its original premise or gets distracted by its own generated intermediate context. This makes long CoT a "Hot Mess" of variance.

## Connection to Insights
- This directly establishes the core thesis of [[✨ The Variance of Trajectories]]. It mathematically maps out why we cannot just naively let AI "think forever". Prolonged reasoning trajectories increase variance, demanding truncation mechanisms or [[🧠 Selective Reasoning]].
