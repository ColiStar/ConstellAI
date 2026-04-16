---
tags: [Insight, Relativity, OOD, RL]
aliases: [Relativity > Absolutes]
status: 🌱 Incubating
---

# ✨ Relativity Over Absolutes

> [!quote] Core Idea
> **Problem:** In high-dimensional spaces, absolute metrics (e.g., absolute error rates, softmax probabilities, or cross-entropy loss) are fundamentally distorted by the curse of dimensionality and scaling artifacts.
>
> **Solution:** Evaluation and optimization must rely strictly on **relative relationships** — such as probability ratios, geometric projections, and variance-to-error proportions.

## 🔗 Related Papers & Mechanisms

- **[[📄 DeepSeek-R1]]** *(Large Language Models | Reinforcement Learning)*
    - **Mechanism:** Abandons the absolute Value Network in PPO for GRPO, scoring outputs strictly relative to a sampled group: $A_i = \frac{r_i - \text{mean}(\{r_1,...,r_G\})}{\text{std}(\{r_1,...,r_G\})}$.
    - **Trade-off:** Eliminates the overhead of a Value Model and prevents absolute reward estimation bias. However, optimization destabilizes if the sampled group lacks diversity ($\text{std} \rightarrow 0$).

- **[[📄 Incoherence (Hot Mess)]]** *(Large Language Models | Uncertainty)*
    - **Mechanism:** Abandons absolute error rates to evaluate failure modes via a relative ratio: $Incoherence = \frac{Variance}{Error}$.
    - **Trade-off:** Provides a comparable measure across different model scales, revealing that failures on hard tasks are variance-driven. However, it requires sampling ≥30 trajectories per question to estimate variance reliably.

- **[[📄 Safety Alignment Just a Few Tokens Deep]]** *(Large Language Models | AI Safety)*
    - **Mechanism:** Replaces absolute cross-entropy SFT (which causes gradient explosion) with a constrained relative log-ratio penalty: $\min_\theta E[-\sum \frac{\beta_t}{2} \log\sigma(\beta_t \log\frac{\pi_\theta(y_t|x,y_{<t})}{\pi_{aligned}(y_t|x,y_{<t})})]$.
    - **Trade-off:** Suppresses Attack Success Rates under 3% without degrading downstream utility. However, requires maintaining a frozen copy of the aligned model in memory during training.

- **[[📄 NCI]]** *(Image Classification | OOD Detection)*
    - **Mechanism:** Replaces absolute Maximum Softmax Probability (MSP) with a relative cosine projection onto classifier weights, leveraging Neural Collapse geometry.
    - **Trade-off:** Accurately separates OOD samples that exploit overconfident absolute softmax scores. Requires white-box access to the model's penultimate layer — unusable for black-box APIs.

- **[[📄 fDBD]]** *(Image Classification | OOD Detection)*
    - **Mechanism:** Replaces absolute feature norms with the relative ratio of a sample's distance to the closest decision boundary divided by its deviation from the training mean: $S_{fDBD} = \frac{d_{DB}(x)}{Dev(x)}$.
    - **Trade-off:** Filters out anomalies with strong absolute signals but geometrically incorrect directions. Effectiveness strictly depends on the pre-trained model having well-separated feature clustering.

## 💡 Inspiration

> [!tip] The Vulnerability of Relativity: The Baseline Anchor
> Relative metrics perfectly bypass high-dimensional distortion, but strictly depend on the **stability of their anchor**:
> - GRPO collapses if group variance approaches zero ($\text{std} \rightarrow 0$).
> - Constrained SFT irreversibly absorbs hidden biases present in $\pi_{aligned}$.
> - NCI / fDBD fail entirely if pre-trained weights lack strict geometric separation.
>
> *Relativity is only as reliable as the baseline it is measured against.*

> [!tip] Population-Distribution OOD Detection
> Can we apply the philosophy of [[🧠 GRPO (Group Relative Policy Optimization)]] to OOD detection?
> Current OOD methods calculate an absolute score for a single image (e.g., fDBD score). If we infer a batch of images simultaneously and use their **relative distribution** in latent space to catch outliers, could we break through the scaling laws of single-sample detection?
