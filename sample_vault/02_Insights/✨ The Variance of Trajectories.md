---
tags: [Insight, CoT, Variance, Reasoning]
aliases: [Variance of Trajectories, Dynamic Compute]
status: 🌱 Incubating
---

# ✨ The Variance of Trajectories

> [!quote] Core Idea
> Granting models longer reasoning trajectories (Test-Time Compute) can solve complex problems, but it introduces extreme **Variance** and **Hallucinations**. The path to an answer is a double-edged sword.

## 🔗 Related Papers & Phenomena

- **[[📄 DeepSeek-R1]]** *(Large Language Models | Reinforcement Learning)*
    - The model learned to allocate compute dynamically — spending thousands of tokens thinking about hard problems and minimal tokens on simple ones. However, unconstrained CoT occasionally collapses into chaotic language mixing, requiring a multi-stage pipeline to tame the variance.

- **[[📄 PostAlign]]** *(Multimodal | Hallucination)*
    - Proposed **[[🧠 Selective Reasoning]]**: for simple images, forcing the model to explicitly reason leads to "Overthinking" and hallucinations. Reasoning is dynamically triggered only when the input is deemed `<COMPLEX>`.

- **[[📄 Incoherence (Hot Mess)]]** *(Large Language Models | Uncertainty)*
    - Proved that as reasoning length increases, errors become dominated by **Variance** ($Incoherence \rightarrow 1.0$), causing the model to become incoherent and self-contradictory — an "industrial accident" rather than a systematic failure.

## 💡 Inspiration

> [!tip] Latent-Space CoT Truncation Mechanism
> Since long CoT introduces high variance (as proven by Incoherence), could we integrate [[📄 NCI]]'s [[🧠 Neural Collapse]] theory?
>
> At each step of CoT generation, monitor whether the hidden states begin to "deviate from the ID cluster center" or exhibit an "abnormal norm expansion." If the reasoning trajectory wanders into OOD space, trigger a `<wait>` token (like in R1) to backtrack, or force the model to conclude immediately.
