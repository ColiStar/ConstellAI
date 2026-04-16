---
domain: Image Classification
tags: [OOD Detection]
status: 🧠 Processed
---
> [!info] **Full Title:** *Fast Decision Boundary based Out-of-Distribution Detector* (ICML 2024)

## Core Summary
- **Goal:** Build an extremely efficient, **Auxiliary Model-Free** Out-of-Distribution (OOD) detector.
- **The Intuition (Rooms & Walls):** Normal (ID) samples sit comfortably in the center of their class "rooms." Anomalies (OOD) are confusing to the model — they get stuck at the "walls" (Decision Boundaries) between classes.
- **Key Advantage:** Uses a closed-form algebraic estimation, making it as fast as basic confidence scores but significantly more accurate.

## Core Mechanisms
- **1. Distance to Decision Boundary ($d_{DB}$):** Instead of measuring distance from the center, fDBD calculates the shortest distance from feature vector $f(x)$ to the decision hyperplane separating predicted class $\hat{c}$ from any other class $j$:
$$d_{\hat{c},j}(x) = \frac{(w_{\hat{c}} - w_j)^T f(x) + (b_{\hat{c}} - b_j)}{||w_{\hat{c}} - w_j||_2}$$
- **2. Deviation Regularization (The Core Magic):** Absolute distance is misleading — OOD features can have inflated magnitudes. fDBD divides by the sample's deviation from the training mean $\mu$:
$$Dev(x) = ||f(x) - \mu||_2$$
- **3. The Final fDBD Score:**
$$S_{fDBD}(x) = \frac{d_{DB}(x)}{Dev(x)}$$
*In plain English: "Distance to the wall ÷ its own signal volume." A small score means it is hugging the wall → likely an anomaly.*

## Results
- **Crushing Complex Baselines:** Achieves state-of-the-art AUROC and FPR95 (e.g., 44.60 FPR95), significantly outperforming heavy baselines like ViM and Mahalanobis Distance (MDS).
- **Zero Latency Overhead:** Relies on $O(|C| \cdot P)$ closed-form estimations, running essentially as fast as the baseline MSP (Maximum Softmax Probability).

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
- **🔗 Leveraging [[✨ Relativity Over Absolutes]]:** fDBD proves that absolute distance in high-dimensional space is deceptive. By utilizing the $d_{DB}/Dev$ ratio, it evaluates **Relative Proportion** rather than absolute coordinates, perfectly neutralizing the signal inflation of OOD samples.
- **🔗 Proving [[✨ Superficial vs Intrinsic Latent Structure]]:** Instead of trusting the superficial Softmax probabilities, fDBD directly calculates distances to the physical **Decision Hyperplanes** in latent space. True safety lies in mapping the geometric boundaries, not reading the final probability score.

**📌 Related Insights:**
- [[✨ Relativity Over Absolutes]]
- [[✨ Superficial vs Intrinsic Latent Structure]]

**📄 Source:** [Original PDF](file:///Users/colicoli/Desktop/obisidian/594BBtest/pdf/Fast%20Decision%20Boundary.pdf)

**🔑 Key Concepts:**
- [[🧠 Neural Collapse]]
