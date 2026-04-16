---
domain: Image Generation
tags: [Fairness]
status: 🧠 Processed
---
> [!info] **Full Title:** *Fair Generation without Unfair Distortions: Debiasing Text-to-Image Generation with Entanglement-Free Attention*

## Core Summary
- **Goal:** Debias generation *without* "Unfair Distortion" (Attribute Entanglement).
- **Capability:** Decouples Target Attribute (Person) from Non-Target Attribute (Background).
- **Key Advantage:** Surgical precision; edits race/gender while preserving exact scene context.

## Core Mechanisms
- **The Problem with Global Vectors:** $h \leftarrow h + c$ alters the whole image (e.g., adding "Black Doctor" might change hospital background to a slum due to bias).
- **Solution: EFA (Entanglement-Free Attention)** inside Cross-Attention layers.
- **Training via Masked Counterfactuals:**
    1. **Predictor:** An Attention Value Predictor (AP) generates spatial updates $AP_a(z_t)$.
    2. **Mask ($M$):** Extracts human bounding/segmentation mask (Human = 1, Bg = 0).
    3. **Target Loss:** Update only the human region: $L_{target} = E[||M \odot (\epsilon - \epsilon_\theta^{cf})||^2_2]$.
    4. **Reg Loss:** Freeze the background: $L_{reg} = Penalty(z_t^{cf}, 1-M)$.
- **Inference:** Randomize attributes (e.g., $P(Male)=0.5$) $\rightarrow$ Apply AP. **No mask needed at test time**.

## Results
- **SOTA Decoupling:** Reaches parity in demographics while maintaining near-perfect background preservation.
- **Metrics:** High PSNR / DINO (Background matched), Low LPIPS vs. Baselines.
- **Multi-Attribute:** Can stack EFA modules (e.g., Race EFA + Gender EFA) without quality degradation.

> [!note] 💡 Comparison: Interpret Diffusion vs. EFA
> 
> | Feature | Interpret Diffusion | EFA (Entanglement-Free) |
> | :--- | :--- | :--- |
> | **Intervention** | **Feature Space ($h$-space)** | **Cross-Attention Space** |
> | **Formula** | $h_{new} = h_{old} + \lambda c$ | $Softmax([QK^T, AP_a(z_t)])[V, V_a]$ |
> | **Spatial Awareness** | **None** (Global addition) | **High** (Dynamic routing via AP) |
> | **Side Effect** | High Attribute Entanglement (Alters Bg). | Zero Entanglement (Preserves Bg). |
> | **Analogy** | Broad Paintbrush 🖌️ | Precise Scalpel 🩻 |

## Connection to Insights
- This is a prime practical example of [[✨ Disentanglement and Anchoring]]. By providing a clear, orthogonal anchor for human attributes separate from environmental attributes, EFA prevents the model's biases from collapsing and destroying the entire spatial composition of the image.

**📌 Related Insights:**
- [[✨ Disentanglement and Anchoring]]

**📄 Source:** [Original PDF](file:///Users/colicoli/Desktop/obisidian/594BBtest/pdf/Fair%20Generation%20without%20Unfair%20Distortions.pdf)
