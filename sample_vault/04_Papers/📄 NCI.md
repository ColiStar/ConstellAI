---
domain: Image Classification
tags: [OOD Detection]
status: 🧠 Processed
---
> [!info] **Full Title:** *Detecting Out-of-Distribution through the Lens of Neural Collapse*

## Core Summary
- **Goal:** Design a robust OOD detector utilizing the fundamental geometric phenomenon of **Neural Collapse**.
- **The Intuition (The Star & The Shadow):** During terminal training, the model's feature space collapses into a perfectly symmetric "Star" shape (Equiangular Tight Frame, ETF). Normal data perfectly aligns with the corners of this star. OOD data doesn't belong to the star — it casts a very "short shadow" when projected onto any of the corners.
- **Key Advantage:** Completely eliminates the need to store or compare against massive training datasets (unlike KNN), relying entirely on geometric properties baked into the model's weights.

## Core Mechanisms
- **Mechanism 1: pScore (Projection Score):** By the principle of *Self-Duality* in Neural Collapse, the final layer's weight vectors $w_c$ perfectly overlap with the "corners of the star" (class centroids). NCI measures the cosine-like projection of the input feature $f(x)$ onto these weight vectors:
$$pScore_c(x) = \frac{w_c^T f(x)}{||w_c||_2}$$
*If the projection shadow is short, it's not aligning with the ETF structure → flagged as an anomaly.*
- **Mechanism 2: Feature Norm Filtering ($L_1$ Norm):** Neural Collapse dictates that true ID features are pushed far from the origin. OOD samples, failing to trigger meaningful activations, tend to cluster near the origin. NCI uses the $L_1$ norm to filter out weak OOD noise that might accidentally point in the right direction.

## Results
- **SOTA without Data-Retrieval:** Combining the projection logic with the $L_1$ norm filter, NCI significantly outperforms data-heavy methods like KNN (e.g., boosting average AUROC from 82.43 to 88.56).
- **Robust Generalization:** Demonstrates exceptional robustness across different network architectures and datasets (NINCO, iNaturalist, Texture) because Neural Collapse is a universal property of well-trained networks.

> [!note] 📊 Twin Swords of Latent Geometry: fDBD vs. NCI
> 
> *💡 Both papers solve the Curse of Dimensionality by abandoning absolute measurements. fDBD looks at the "voids" between classes, while NCI looks at the "pillars" of the classes.*
> 
> | Feature | **fDBD** (The Voids / Walls) | **NCI** (The Pillars / Star) |
> | :--- | :--- | :--- |
> | **Geometric Focus** | **Decision Boundaries** (Hyperplanes separating classes). | **Class Centroids** (Weight vectors of the ETF structure). |
> | **Mathematical Core** | $d_{DB}(x) / Dev(x)$ (Ratio of distances). | $w_c^T f(x) / \|w_c\|_2$ (Vector projection). |
> | **🔗 Relativity Insight** | Relies on the **Relative Ratio** of boundary distance to deviation. | Relies on the **Relative Angle** (projection) between features and weights. |
> | **🔗 Geometric Insight** | Exploits **Hyperplanes** where models are most uncertain. | Exploits the symmetric **Neural Collapse** geometry forged during training. |
> | **Computational Speed** | Extremely Fast $O(\|C\| \cdot P)$, closed-form. | Extremely Fast $O(\|C\| \cdot P)$, matrix multiplication. |

## Connection to Insights
- **🔗 Leveraging [[✨ Relativity Over Absolutes]]:** NCI abandons the absolute Euclidean distance used by traditional methods (like Mahalanobis). Instead, the *pScore* fundamentally relies on the **Relative Angle / Cosine Projection** between the feature vector and the weight vector — asking "Are you pointing in the relatively same direction?"
- **🔗 Proving [[✨ Superficial vs Intrinsic Latent Structure]]:** NCI is the ultimate manifestation of this insight. OOD detection shouldn't rely on superficial outputs, but on whether the input feature strictly obeys the rigid, symmetrical **ETF geometry** forged during the Neural Collapse phase of training.

**📌 Related Insights:**
- [[✨ Relativity Over Absolutes]]
- [[✨ Superficial vs Intrinsic Latent Structure]]

**📄 Source:** [Original PDF](file:///Users/colicoli/Desktop/obisidian/594BBtest/pdf/Detecting%20Out-of-distribution.pdf)

**🔑 Key Concepts:**
- [[🧠 Neural Collapse]]
