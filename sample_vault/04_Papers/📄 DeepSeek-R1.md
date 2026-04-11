---
tags: [Paper, Reasoning, RL]
status: 🧠 Processed
---
# 📄 DeepSeek-R1

**📌 Related Insights:**
- [[✨ Relativity Over Absolutes]]
- [[✨ The Variance of Trajectories]]
- [[✨ Superficial vs Geometric Alignment]]
**🗣️ Relevant Presentations:**
- [[🗣️ Report - The Paradox of AI Reasoning]]
**🔑 Key Concepts:** [[🧠 GRPO (Group Relative Policy Optimization)]]

## Core Summary
DeepSeek-R1 introduces a paradigm shift in training Large Reasoning Models. Instead of relying purely on massive Supervised Fine-Tuning (SFT) datasets containing human reasoning traces, R1 utilizes large-scale Reinforcement Learning (RL) using [[🧠 GRPO (Group Relative Policy Optimization)]] to organically discover and optimize Chain-of-Thought behaviors.

## Core Mechanisms
1. **Zero-SFT RL (DeepSeek-R1-Zero):** The base model is directly trained with RL on rule-based tasks (math, coding) without seeing any human thought processes. It autonomously develops reasoning skills like "reflection", "backtracking," and planning. This proves that reasoning capabilities are a natural byproduct of RL optimization landscapes rather than mere mimicry of human text.
2. **GRPO Algorithm:** It uses population-based relative reward calculation. This proves that [[✨ Relativity Over Absolutes|calculating relative advantage within a generated group is more stable and efficient than using a global absolute critic (Value Model)]].
3. **Cold-Start SFT (DeepSeek-R1):** To solve the "gibberish" and language-mixing issues seen in R1-Zero, a tiny amount of high-quality "Cold-Start" SFT data is used prior to RL. This acts purely to establish a readable format, before letting the model explore the geometric space autonomously.

## Connection to Insights
- **Geometric Alignment:** The authors noted that relying heavily on SFT forces the model into a fragile "superficial format" that actually hinders its reasoning capabilities. By letting RL sculpt the model dynamically, they achieved much stronger [[✨ Superficial vs Geometric Alignment|geometric optimization]].
- **Variance of Trajectories:** While R1 can think for thousands of tokens to solve hard problems, this extremely long CoT sequence exhibits the [[✨ The Variance of Trajectories|variance double-edged sword]]. If unconstrained, the model occasionally gets stuck in infinite loops of reflection or wanders off-topic due to accumulating variance over the long token horizon.
