"""
ConstellAI — Semantic Clustering Foundation.

Demonstrates how a local embedding model (e.g. all-MiniLM-L6-v2 via
sentence-transformers) would automatically map unseen papers to the
existing Insight lenses at scale (1,000+ nodes).

Pipeline at scale:
  1. Embed each paper's title + abstract → dense vector
  2. Embed each Insight's core_idea + body_md → dense vector
  3. Compute cosine similarity between paper vector and every Insight vector
  4. Assign paper to all Insights whose similarity ≥ COSINE_THRESHOLD

This module ships with a deterministic *mock* embedding fallback so the
entire test suite runs in CI with zero model downloads.  Set the
environment variable ``CONSTELLAI_USE_EMBEDDINGS=true`` (and install
``sentence-transformers``) to switch to real vectors in production.
"""
from __future__ import annotations

import hashlib
import math
import os
from dataclasses import dataclass, field

# ---------------------------------------------------------------------------
# Module-level constants
# ---------------------------------------------------------------------------

#: Default cosine similarity threshold above which a paper is assigned
#: to an Insight lens.  Tunable via SemanticClusterer(threshold=…).
COSINE_THRESHOLD: float = 0.35

#: Dimensionality of the mock embedding vectors.
MOCK_DIM: int = 64


# ---------------------------------------------------------------------------
# Low-level math helpers
# ---------------------------------------------------------------------------


def _mock_embed(text: str, dim: int = MOCK_DIM) -> list[float]:
    """
    Deterministic pseudo-embedding derived from a SHA-256 hash of *text*.

    Properties:
    - Same input → same output (deterministic for snapshot tests).
    - Different inputs → meaningfully different vectors.
    - Output is L2-normalised so cosine similarity is simply the dot product.
    """
    seed = int(hashlib.sha256(text.encode()).hexdigest(), 16)
    vec: list[float] = []
    for _ in range(dim):
        # Linear congruential step (Knuth multiplier)
        seed = (seed * 6_364_136_223_846_793_005 + 1_442_695_040_888_963_407) & 0xFFFF_FFFF_FFFF_FFFF
        vec.append(((seed >> 33) / 0x7FFF_FFFF) - 1.0)
    norm = math.sqrt(sum(v * v for v in vec)) or 1.0
    return [v / norm for v in vec]


def _cosine(a: list[float], b: list[float]) -> float:
    """Cosine similarity between two L2-normalised vectors (= dot product)."""
    return sum(x * y for x, y in zip(a, b))


# ---------------------------------------------------------------------------
# Data containers
# ---------------------------------------------------------------------------


@dataclass
class InsightEmbedding:
    """Pre-computed embedding for a single Insight lens."""

    insight_id: str
    text: str
    vector: list[float] = field(default_factory=list)


@dataclass
class SimilarityResult:
    """Similarity score between a query paper and one Insight lens."""

    insight_id: str
    score: float
    above_threshold: bool


# ---------------------------------------------------------------------------
# Main class
# ---------------------------------------------------------------------------


class SemanticClusterer:
    """
    Maps new papers to existing Insight lenses via embedding cosine similarity.

    Example (mock, zero dependencies)::

        clusterer = SemanticClusterer(use_real_model=False)
        clusterer.index_insights(insight_dicts)
        results = clusterer.rank_insights("New paper abstract text…")
        assigned = clusterer.assign_insights("New paper abstract text…")

    Example (production, requires ``pip install sentence-transformers``)::

        import os
        os.environ["CONSTELLAI_USE_EMBEDDINGS"] = "true"
        clusterer = SemanticClusterer()   # auto-detects env var
        clusterer.index_insights(insight_dicts)
        …
    """

    def __init__(
        self,
        *,
        threshold: float = COSINE_THRESHOLD,
        use_real_model: bool | None = None,
    ) -> None:
        self.threshold = threshold
        self._index: list[InsightEmbedding] = []
        self._encoder = None

        if use_real_model is None:
            use_real_model = (
                os.getenv("CONSTELLAI_USE_EMBEDDINGS", "false").lower() == "true"
            )

        if use_real_model:
            try:
                from sentence_transformers import SentenceTransformer  # type: ignore[import-untyped]

                self._encoder = SentenceTransformer("all-MiniLM-L6-v2")
            except ImportError:
                # Graceful degradation: fall back to mock
                pass

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _embed(self, text: str) -> list[float]:
        if self._encoder is not None:
            return self._encoder.encode(text, normalize_embeddings=True).tolist()
        return _mock_embed(text)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def index_insights(self, insights: list[dict[str, str]]) -> None:
        """
        Pre-compute and cache embedding vectors for each Insight.

        Args:
            insights: sequence of dicts that must contain at minimum the
                      keys ``id``, ``core_idea``, and ``body_md``.
        """
        self._index = []
        for ins in insights:
            text = f"{ins.get('core_idea', '')} {ins.get('body_md', '')}".strip()
            self._index.append(
                InsightEmbedding(
                    insight_id=ins["id"],
                    text=text,
                    vector=self._embed(text),
                )
            )

    def rank_insights(self, paper_text: str) -> list[SimilarityResult]:
        """
        Compute cosine similarity between *paper_text* and every indexed Insight.

        Returns:
            List of :class:`SimilarityResult` sorted by *score* descending.
            Returns an empty list when the index is empty.
        """
        if not self._index:
            return []
        paper_vec = self._embed(paper_text)
        results: list[SimilarityResult] = []
        for ins in self._index:
            score = _cosine(paper_vec, ins.vector)
            results.append(
                SimilarityResult(
                    insight_id=ins.insight_id,
                    score=round(score, 6),
                    above_threshold=score >= self.threshold,
                )
            )
        results.sort(key=lambda r: r.score, reverse=True)
        return results

    def assign_insights(self, paper_text: str) -> list[str]:
        """
        Return only the Insight IDs whose similarity score ≥ threshold.

        This is the function that would replace the current regex/frontmatter
        matching pipeline when the corpus grows beyond manual curation.
        """
        return [r.insight_id for r in self.rank_insights(paper_text) if r.above_threshold]
