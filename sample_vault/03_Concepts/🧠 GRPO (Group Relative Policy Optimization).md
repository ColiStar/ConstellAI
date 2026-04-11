---
tags: [Concept, RL, DeepSeek]
status: 🌳 Mature
---
# 🧠 GRPO (Group Relative Policy Optimization)

**📌 Related Papers:** [[📄 DeepSeek-R1]]
**🔗 Related Insights:** [[✨ Relativity Over Absolutes]]

## What is GRPO?
Group Relative Policy Optimization (GRPO) is a reinforcement learning algorithm introduced by DeepSeek, designed to optimize large language models without relying on a separate, heavily parameterized Value Model (critic). 

## Core Algorithm
Traditional RLHF (like PPO) requires an Absolute Value Model to predict the expected reward of a state, calculating the "Advantage" by subtracting this baseline from the actual reward. This absolute scoring is notoriously unstable, resource-intensive, and requires keeping a massive second model in VRAM.

GRPO bypasses the absolute baseline entirely. For a given question $q$:
1. The policy model generates a group of $G$ distinct outputs: $\{y_1, y_2, ..., y_G\}$.
2. A Reward Model (or a rule-based verifier, like checking if math is correct) evaluates each output to assign scalar rewards: $\{r_1, r_2, ..., r_G\}$.
3. Instead of using a trained absolute critic to decide if these scores are good, GRPO calculates the **Relative Advantage** of each output simply by normalizing the rewards within this specific group:
   $$ A_i = \frac{r_i - mean(r)}{std(r)} $$

## Why it matters
By adopting an approach where [[✨ Relativity Over Absolutes|relative comparison]] replaces absolute scoring, GRPO dramatically reduces training memory/compute overhead (by completely removing the critic model). It forces the top generated answers in a batch to surface as "good" and the worst as "bad," providing a highly stable, self-contained baseline for gradient updates.
