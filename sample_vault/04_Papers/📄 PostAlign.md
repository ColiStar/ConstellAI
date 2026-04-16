---
domain: Multimodal
tags: [Hallucination]
status: 🧠 Processed
---
> [!info] **Full Title:** *PostAlign: Multimodal Grounding as a Corrective Lens for MLLMs*

## Core Summary
- **Goal:** Cure MLLM hallucinations caused by **Linguistic Priors** (e.g., guessing a cat is on a sofa without looking).
- **The Solution:** A post-alignment framework utilizing **Multimodal Grounding** as a "corrective lens".
- **Key Advantage:** Forces the model to provide physical coordinates for its words and dynamically adjusts its thinking length.

## Core Mechanisms
- **1. Visual Grounding (The "Show Me" Mechanism):**
    - Uses a special token `<LOC>`: When generating a noun, the model must output `<LOC>` and use a multi-task decoder to draw the exact **Bounding Box / Mask** on the image.
    - **Negative Rejection (`<REJ>`):** If the model hallucinates an object that isn't there, the visual decoder fails, triggering `<REJ>`. The model is forced to refuse the hallucination.
- **2. Textual Grounding (Selective Reasoning):**
    - Dynamically classifies user queries into two tags based on complexity.
    - `[<SIMPLE>]`: Skips rationale generation, answers directly.
    - `[<COMPLEX>]`: Forces the generation of step-by-step rationale (CoT) before the final answer.

## Results
- **Suppressed Hallucination:** Significantly reduces co-occurrence hallucinations and sets new SOTA on POPE, HaloQuest, and VQAv2.
- **Efficiency:** Selective reasoning optimizes inference compute by avoiding unnecessary rationale generation for simple tasks.

## Connection to Insights
- **🔗 Achieving [[✨ Disentanglement and Anchoring]]:** By linking words to `<LOC>` coordinates, PostAlign establishes a rigid **Orthogonal Visual Anchor**. This successfully breaks the spurious correlation where models rely on *linguistic guessing* rather than actually looking at the image.
- **🔗 Managing [[✨ The Variance of Trajectories]]:** The *Selective Reasoning* mechanism directly addresses variance. It proves that forcing a model to generate long Chain-of-Thought for simple tasks leads to "overthinking" and hallucinations. Dynamically truncating the trajectory is the key to controlling this instability.

**📌 Related Insights:**
- [[✨ The Variance of Trajectories]]
- [[✨ Disentanglement and Anchoring]]

**📄 Source:** [Original PDF](file:///Users/colicoli/Desktop/obisidian/594BBtest/pdf/PostAlign.pdf)

**🔑 Key Concepts:** 
- [[🧠 Selective Reasoning]]
