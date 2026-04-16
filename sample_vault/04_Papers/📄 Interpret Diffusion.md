---
domain: Image Generation
tags: [Interpretability]
status: 🧠 Processed
---
> [!info] **Full Title:** *Self-Discovering Interpretable Diffusion Latent Directions for Responsible Text-to-Image Generation*


## Core Summary
- **Goal:** Find interpretable semantic vectors in Diffusion models without labels/classifiers.
- **Capability:** Enables "Responsible Generation" (Fairness, Safety, Prompt-enhancement).
- **Key Advantage:** Self-supervised, Zero-shot intervention at inference.

## Core Mechanisms
- **Target Space:** U-Net Bottleneck ($h$-space).
- **Self-Supervised Optimization Pipeline:**
    1. **Generate:** $x^+ \leftarrow Diffusion(y^+)$ (e.g., $y^+ = \text{"A female face"}$)
    2. **Mask Concept:** $y^- \leftarrow \text{Remove concept}$ (e.g., $y^- = \text{"A face"}$)
    3. **Optimize Vector ($c$):** Force model to reconstruct $x^+$ using $y^-$ plus a learnable vector $c$.
        - **Loss:** $\min_c ||\epsilon - \epsilon_\theta(x_t, t, y^-, c)||^2_2$
- **Safety Extraction (e.g., Anti-violence):**
    - $y^+ = [Base Prompt] + [Negative Prompt: \text{"Violence"}]$
    - $y^- = [Base Prompt]$
- **Inference (Concept Injection):**
    - **Formula:** $h \leftarrow h + \lambda c$ ($\lambda$: control strength)

## Results
- **Smooth Interpolation:** Linear scaling of $\lambda$ smoothly transitions attributes (e.g., Male $\leftrightarrow$ Female).
- **High Sample Efficiency:** Requires only $\sim200$ generated images to converge.
- **Strong Generalization:** Concept learned on "Dogs" transfers perfectly to "Humans" or "Cats".

> [!info] 🧠 Comparison: Sparse Autoencoders (SAE) vs. Interpret Diffusion
> 
> | Feature | Sparse Autoencoders (SAE) | Interpret Diffusion |
> | :--- | :--- | :--- |
> | **Logic** | **Unsupervised / Global** | **Supervised by Prompt / Targeted** |
> | **Goal** | Find *all* monosemantic vectors in a layer. | Find *one specific* semantic vector ($c$). |
> | **Mechanism** | Map dense activations $\rightarrow$ sparse dictionary. | Minimize $\Delta$ between Prompts ($y^+$ vs $y^-$). |

## Connection to Insights

- **Proving [[✨ Superficial vs Intrinsic Latent Structure]]:** By discovering that abstract concepts (like safety or gender) exist as navigable coordinates in the latent space, this paper proves we can manipulate a model's internal geometry directly for safety. This is far more robust than relying on superficial text prompts.
- **The need for [[✨ Disentanglement and Anchoring]]:** However, manipulating these concepts *globally* causes severe **Attribute Entanglement** (e.g., altering a subject's gender unintentionally distorts the background context). This geometric flaw perfectly highlights why models desperately need an "orthogonal anchor" to isolate features (setting the stage for EFA).

**📌 Related Insights:**
- [[✨ Disentanglement and Anchoring]]
- [[✨ Superficial vs Intrinsic Latent Structure]]

**📄 Source:** [Original PDF](file:///Users/colicoli/Desktop/obisidian/594BBtest/pdf/Self-Discovering%20Interpretable%20Diffusion%20Latent%20Directions.pdf)
