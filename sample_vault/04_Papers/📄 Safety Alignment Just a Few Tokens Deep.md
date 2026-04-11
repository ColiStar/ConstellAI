---
tags: [Paper, Alignment, Jailbreak]
status: 🧠 Processed
---
# 📄 Safety Alignment Just a Few Tokens Deep

**📌 Related Insights:**
- [[✨ Superficial vs Geometric Alignment]]
**🗣️ Relevant Presentations:**
- [[🗣️ Report - The Illusion of Alignment and Geometric Defense]]

## Core Summary
This paper exposes the extreme fragility of modern LLM safety checks (like standard RLHF applied at the surface level). It demonstrates that standard safety protocols do not actually rewrite the model's knowledge, but rather train a very thin "refusal layer" at the very beginning of text generation.

## Core Mechanisms
The "Prefilling Attack": By simply bypassing the first few generated tokens—for example, forcing the context state to start with "Sure, here is the recipe for a bomb:"—the entire safety alignment mechanism completely collapses, and the model happily proceeds to output harmful content.

## Connection to Insights
- This is the absolute strongest proof for [[✨ Superficial vs Geometric Alignment|superficial alignment]]. The paper proves that SFT and superficial RLHF only modify a "few tokens deep". To build resilient AI, the defense must be baked into the geometric distribution of the latent space itself, where harmful concepts are geometrically isolated and un-routable.
