---
tags: [Insight, CoT, Variance, Reasoning]
aliases: [Variance of Trajectories, Dynamic Compute]
status: 🌱 Incubating
---

# ✨ The Variance of Trajectories 

> [!quote] Core Idea
> Granting models longer reasoning trajectories (Test-time compute) can solve complex problems, but it introduces extreme "Variance" and "Hallucinations."

## 🔗 Related Papers & Phenomena
*   **[[📄 DeepSeek-R1]] (Long Chain-of-Thought)**: The model learned to allocate compute dynamically. It spends thousands of tokens thinking about hard problems, and minimal tokens on simple ones.
*   **[[📄 PostAlign]] (Vision-Language Models)**: Proposed **[[🧠 Selective Reasoning]]**. It discovered that for simple images, forcing the model to explicitly reason leads to "Overthinking" and hallucinations. Thus, reasoning is only triggered when the input is deemed `<COMPLEX>`.
*   **[[📄 Incoherence (Hot Mess)]] (Model Incoherence)**: Proved that as reasoning length increases, errors become dominated by **Variance**, causing the model to become incoherent and contradictory.

## 💡 Cross-Domain Inspiration
> [!tip] Latent-Space CoT Truncation Mechanism
> Since long CoT introduces high variance (Incoherence), could we integrate [[📄 NCI]]'s [[🧠 Neural Collapse]] theory?
> What if, at each step of the CoT generation, we monitor whether the hidden states begin to "deviate from the ID cluster center" or exhibit an "abnormal Norm expansion"? If the reasoning trajectory wanders into an OOD space, it could trigger a `<wait>` token (like in R1) to backtrack, or force the model to conclude immediately.
