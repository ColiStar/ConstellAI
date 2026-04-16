---
domain: Multimodal
tags: [Adversarial Attack]
status: 🧠 Processed
---
> [!info] **Full Title:** *An Image Is Worth 1000 Lies: Adversarial Transferability across Prompts on Vision-Language Models*

## Core Summary
- **Goal:** Achieve **Cross-Prompt Adversarial Transferability** on Vision-Language Models (VLMs).
- **The Threat:** A single maliciously crafted image can hijack the VLM to output a specific target text (e.g., "unknown" or "bomb"), **regardless of what the user asks**.
- **Key Advantage:** Defeats the limitation of traditional attacks that only work on fixed, seen prompts.

## Core Mechanisms
- **The Flaw of Baselines:** Optimizing image noise for only one or a few prompts fails to generalize to unseen user questions.
- **CroPA Strategy (Minimax Game):** Simultaneous training of two opposing forces:
    1. **Image Perturbation ($\delta_v$):** Learns to *minimize* the language modeling loss for the target text. (Goal: Force the bad output).
    2. **Learnable Prompt Perturbation ($\delta_t$):** Learns to *maximize* the loss. (Goal: Act as a virtual "troublemaker" exploring the worst-case text space).
- **Resulting Dynamics:** By forcing $\delta_v$ to survive the harshest attacks from $\delta_t$ during training, the image noise becomes universally robust across the entire prompt embedding space.

## Results
- **SOTA Attack Success Rate (ASR):** Achieves >90% ASR on unseen prompts, drastically outperforming Multi-P baselines.
- **Universal Hijack:** Successfully forces models (like BLIP-2 or LLaVA) to generate refusal or toxic content against any user instruction.

## Connection to Insights
- **1. The Threat: Proving [[✨ Superficial vs Intrinsic Latent Structure]]**
    - CroPA proves that defending a model via surface-level text prompts is an illusion. Attackers can directly exploit the latent geometry (image perturbation) to override the language pathways entirely. *An image truly is worth a thousand text prompts.*
- **2. The Cure: Forcing [[✨ Disentanglement and Anchoring]]**
    - CroPA is the ultimate adversary—it **weaponizes entanglement** by fusing visual noise with toxic text outputs.
    - **The Countermeasure:** The *only* way to defend against this latent hijack is by forcing the model to explicitly ground itself on clean, orthogonal anchors. By requiring the model to physically draw a bounding box for its outputs (as seen in **[[📄 PostAlign]]**), we manually break this fake correlation.

**📌 Related Insights:**
- [[✨ Disentanglement and Anchoring]]
- [[✨ Superficial vs Intrinsic Latent Structure]]

**📄 Source:** [Original PDF](file:///Users/colicoli/Desktop/obisidian/594BBtest/pdf/AN%20IMAGE%20IS%20WORTH%201000%20LIES.pdf)
