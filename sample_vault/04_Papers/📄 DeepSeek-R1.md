---
domain: Large Language Models
tags: [Reinforcement Learning]
status: 🧠 Processed
---
> [!info] **Full Title:** *DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning*

## Core Summary
- **Goal:** Elicit advanced reasoning capabilities in LLMs using pure Reinforcement Learning (RL) and transfer this capability to smaller, efficient models.
- **The Breakthrough:** Proves that complex reasoning (self-reflection, verification) can **organically emerge** without human-annotated data.
- **The Democratization:** Discovers that the reasoning power of a massive 671B model can be perfectly **distilled** into much smaller open-source models, achieving SOTA performance without needing RL on the small models themselves.

## Core Mechanisms
- **1. Emergence (DeepSeek-R1-Zero):**
    - Trained purely via RL with rule-based rewards (accuracy, formatting) without any supervised fine-tuning (SFT).
    - *The Engine (GRPO):* Abandons the heavy "Critic" value model used in traditional PPO, optimizing policies based on **Relative Advantage** within a group of outputs. This makes large-scale RL computationally feasible.
- **2. Taming the Chaos (DeepSeek-R1):**
    - Pure RL causes language mixing and poor readability.
    - The R1 pipeline fixes this via a multi-stage approach: Cold-Start SFT → Reasoning RL → Rejection Sampling → General SFT & Alignment RL.
- **3. Knowledge Distillation:**
    - Instead of running expensive RL on smaller models, they generated 800K high-quality reasoning traces from R1.
    - Fine-tuned dense models (like Qwen 1.5B–32B and Llama 8B–70B) purely on these traces, proving that reasoning patterns are highly transferrable.

## Results
- **Matching Proprietary Giants:** DeepSeek-R1 matches OpenAI o1-1217 on elite benchmarks like AIME 2024 (79.8%) and MATH-500 (97.3%).
- **The Power of Distillation:** `DeepSeek-R1-Distill-Qwen-1.5B` surpasses massive closed-source, non-reasoning models (like GPT-4o) on math benchmarks.

## Connection to Insights
- **🔗 Proving [[✨ Superficial vs Intrinsic Latent Structure]]:** Relying heavily on SFT forces the model into a fragile "superficial format" (imitating human priors), which caps its performance. By bypassing SFT and letting pure RL sculpt the model dynamically, they achieved much stronger geometric optimization, allowing the model to discover *superior, non-human-like* reasoning pathways.
- **🔗 Mapping [[✨ The Variance of Trajectories]]:** While R1 can think for thousands of tokens, this unconstrained CoT exhibits the variance double-edged sword. Extremely long trajectories occasionally cause the model to get trapped in incorrect logic paths or collapse into chaotic language mixing. The R1 multi-stage pipeline is a masterclass in taming this exact variance.
- **🔗 Leveraging [[✨ Relativity Over Absolutes]]:** The entire success of R1 relies on **GRPO**. In high-dimensional spaces, evaluating the *absolute* reward of a complex reasoning chain is nearly impossible. GRPO abandons the bulky absolute Value Model (Critic) and optimizes based purely on the **Relative Advantage** among a group of outputs — proving that relative comparisons are fundamentally more robust and efficient.

**📌 Related Insights:**
- [[✨ Relativity Over Absolutes]]
- [[✨ The Variance of Trajectories]]
- [[✨ Superficial vs Intrinsic Latent Structure]]

**📄 Source:** [Original PDF](file:///Users/colicoli/Desktop/obisidian/594BBtest/pdf/deepseekr1.pdf)

**🔑 Key Concepts:**
- [[🧠 GRPO (Group Relative Policy Optimization)]]
