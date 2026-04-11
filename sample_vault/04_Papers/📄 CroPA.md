---
tags: [Paper, VLM, Attack, Jailbreak]
status: 🧠 Processed
---
# 📄 CroPA (Cross-Prompt Adversarial Attack on VLMs)

**📌 Related Insights:**
- [[✨ Disentanglement and Anchoring]]
- [[✨ Spurious Correlations]]

## Core Summary
CroPA (Cross-Prompt Adversarial attack) demonstrates a catastrophic vulnerability in Vision-Language Models (VLMs). Attackers can inject a subtle, invisible noise pattern into an image. This noise creates such a strong, fake feature correlation that it completely "hijacks" the VLM's linguistic pathway, forcing it to generate a target malicious text regardless of what text prompt the user types in.

## Core Mechanisms
1. **Cross-Modality Entanglement:** Modern VLMs rely on cross-attention mechanisms designed to bind visual patches tightly to text tokens. 
2. **The Hijack:** The CroPA adversarial perturbation is mathematically optimized to maximize the attention weight of the fake visual noise against *all* possible language inputs. The language model becomes entirely anchored to the adversarial visual noise, completely ignoring the actual image content and the user's question.

## Connection to Insights
- CroPA is the ultimate adversary to [[✨ Disentanglement and Anchoring]]. It weaponizes entanglement. The only way to defend against this is by forcing the model to explicitly ground itself on clean, orthogonal anchors (like the bounding boxes used in [[📄 PostAlign]]) before reasoning, explicitly attempting to break this fake correlation manually.
