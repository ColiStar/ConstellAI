---
tags: [Concept, VLM, Reasoning]
status: 🌳 Mature
---
# 🧠 Selective Reasoning

**📌 Related Papers:** [[📄 PostAlign]]
**🔗 Related Insights:** [[✨ The Variance of Trajectories]]

## What is Selective Reasoning?
Selective Reasoning is a mechanism that dynamically decides *when* a model should engage its costly and highly-variable Chain-of-Thought (CoT) capability, and when it should skip CoT to provide an immediate answer.

## Core Algorithm
Instead of blindly prompting "Think step-by-step" for every query, the system first uses a lightweight router (or a simple generation preamble) to classify the complexity of the input.
- **`<SIMPLE>`:** The model outputs the answer immediately (saving compute and avoiding hallucination).
- **`<COMPLEX>`:** The model is allowed to generate a reasoning trajectory.

## Why it matters
Forcing a model to reason about trivially simple prompts often causes "Overthinking", where the model hallucinates non-existent details just to fulfill the CoT requirement. Selective Reasoning directly mitigates [[✨ The Variance of Trajectories]], optimizing both performance and computational cost.
