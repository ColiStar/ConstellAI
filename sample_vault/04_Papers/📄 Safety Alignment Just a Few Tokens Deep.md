---
domain: Large Language Models
tags: [AI Safety]
status: 🧠 Processed
---
> [!info] **Full Title:** *Safety Alignment Should Be Made More Than Just a Few Tokens Deep*

## Core Summary
- **Vulnerability:** Safety alignment is a **"Shallow Prefix Shortcut"**.
- **Mechanism:** Refusal behavior exists *only* in the first 1–5 tokens. Bypass them, and the model reverts to the unaligned base distribution.
- **🌟 Significance:** Exposes that current RLHF is a fragile "surface patch" rather than deep unlearning — fundamentally explaining why simple jailbreaks easily bypass AI guardrails.

## Core Mechanisms
- **1. The KL Cliff (The Proof):**
    - $D_{KL}(\pi_{aligned} \| \pi_{base}) \approx 0$ for tokens $t > 5$.
    - 💡 *After the model outputs the first 5 words (e.g., "I cannot fulfill"), its internal distribution operates exactly like the uncensored, unsafe base model.*
- **2. Malicious SFT Exploit (The Attack):**
    - Gradient norm $||\nabla \log \pi_\theta(y_t | x, y_{<t})||$ abnormally spikes at $t_0$.
    - 💡 *During an attack, the "force" altering the model's behavior is heavily concentrated on the very first word. A tiny push here shatters the entire defense.*
- **3. Constrained SFT (The Defense):**
    - **Objective:** $\min_\theta \ldots \log \sigma(\beta_t \log \frac{\pi_\theta}{\pi_{aligned}})$
    - 💡 *Think of $\beta_t$ as a "rubber band." Make it extremely tight for the first 5 tokens (locking them to the safe model), but loose for the rest — so the model can still learn new tasks.*

## Results
- **Attack Success Rate (ASR):** Standard fine-tuning on a few harmful examples causes ASR to jump from near 0% to ~90%, completely destroying safety guardrails.
- **Defense Utility:** Constrained SFT (high $\beta_t$ at $t \leq 5$, low $\beta_t$ later) successfully drops ASR back to near 0% while maintaining downstream benign task performance.

## Connection to Insights
- **🔗 Proving [[✨ Superficial vs Intrinsic Latent Structure]]:** The KL cliff proves alignment is purely **Superficial** (a 5-word linguistic band-aid), lacking deep geometric unlearning of harmful concepts. True robustness requires baking safety into the latent geometry — not just the prefix tokens.
- **🔗 Leveraging [[✨ Relativity Over Absolutes]]:** The defense relies on the **Relative Log-Ratio** ($\log \frac{\pi_\theta}{\pi_{aligned}}$) — proving that maintaining a *relative distance* to a safe anchor is vastly superior to absolute loss penalties.

**📌 Related Insights:**
- [[✨ Superficial vs Intrinsic Latent Structure]]
- [[✨ Relativity Over Absolutes]]

**📄 Source:** [Original PDF](file:///Users/colicoli/Desktop/obisidian/594BBtest/pdf/2406.05946v1.pdf)
