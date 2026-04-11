"""
TDD: semantic_cluster.py

All tests run with use_real_model=False (mock embedder) so no model is
downloaded in CI.  The test suite specifies the contract first, then
verifies the implementation satisfies it.
"""
from __future__ import annotations

import math

import pytest

from backend.semantic_cluster import (
    COSINE_THRESHOLD,
    SemanticClusterer,
    SimilarityResult,
    _cosine,
    _mock_embed,
)

# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

MOCK_INSIGHTS: list[dict[str, str]] = [
    {
        "id": "relativity-over-absolutes",
        "core_idea": "Scores and rankings are relative, not absolute.",
        "body_md": "## Context\nEvaluation scores are meaningless without a reference baseline.",
    },
    {
        "id": "the-variance-of-trajectories",
        "core_idea": "Learning trajectories vary even from identical initialisations.",
        "body_md": "## Context\nHidden policy diversity leads to unstable fine-tuning dynamics.",
    },
    {
        "id": "disentanglement-and-anchoring",
        "core_idea": "Disentangle task features from spurious correlations.",
        "body_md": "## Context\nOrthogonal projection removes protected attributes geometrically.",
    },
    {
        "id": "superficial-vs-geometric-alignment",
        "core_idea": "Surface-level alignment differs from deep geometric alignment.",
        "body_md": "## Context\nA few output tokens can mask misaligned internal representations.",
    },
]


@pytest.fixture
def clusterer() -> SemanticClusterer:
    c = SemanticClusterer(use_real_model=False)
    c.index_insights(MOCK_INSIGHTS)
    return c


# ---------------------------------------------------------------------------
# Unit tests — _mock_embed
# ---------------------------------------------------------------------------


class TestMockEmbedder:
    def test_output_is_unit_vector(self):
        vec = _mock_embed("hello world")
        norm = math.sqrt(sum(v * v for v in vec))
        assert abs(norm - 1.0) < 1e-6, f"Expected unit vector, got norm={norm}"

    def test_deterministic_same_input(self):
        assert _mock_embed("same text") == _mock_embed("same text")

    def test_different_inputs_produce_different_vectors(self):
        a = _mock_embed("paper about neural collapse")
        b = _mock_embed("paper about reinforcement learning from human feedback")
        assert a != b

    def test_default_dimension_is_64(self):
        assert len(_mock_embed("test")) == 64

    def test_custom_dimension(self):
        assert len(_mock_embed("test", dim=128)) == 128

    def test_all_values_in_range(self):
        for v in _mock_embed("range test"):
            assert -1.0 <= v <= 1.0


# ---------------------------------------------------------------------------
# Unit tests — _cosine
# ---------------------------------------------------------------------------


class TestCosine:
    def test_identical_vectors_give_one(self):
        v = [1.0, 0.0, 0.0]
        assert abs(_cosine(v, v) - 1.0) < 1e-9

    def test_orthogonal_vectors_give_zero(self):
        assert abs(_cosine([1.0, 0.0], [0.0, 1.0])) < 1e-9

    def test_opposite_vectors_give_minus_one(self):
        assert abs(_cosine([1.0, 0.0], [-1.0, 0.0]) + 1.0) < 1e-9

    def test_symmetry(self):
        a = _mock_embed("alpha")
        b = _mock_embed("beta")
        assert abs(_cosine(a, b) - _cosine(b, a)) < 1e-9


# ---------------------------------------------------------------------------
# Integration tests — SemanticClusterer
# ---------------------------------------------------------------------------


class TestSemanticClustererIndexing:
    def test_index_loads_all_insights(self, clusterer: SemanticClusterer):
        assert len(clusterer._index) == len(MOCK_INSIGHTS)

    def test_index_stores_correct_ids(self, clusterer: SemanticClusterer):
        ids = {e.insight_id for e in clusterer._index}
        assert ids == {ins["id"] for ins in MOCK_INSIGHTS}

    def test_index_stores_unit_vectors(self, clusterer: SemanticClusterer):
        for entry in clusterer._index:
            norm = math.sqrt(sum(v * v for v in entry.vector))
            assert abs(norm - 1.0) < 1e-6

    def test_reindex_replaces_previous(self):
        c = SemanticClusterer(use_real_model=False)
        c.index_insights(MOCK_INSIGHTS)
        c.index_insights(MOCK_INSIGHTS[:1])
        assert len(c._index) == 1


class TestRankInsights:
    def test_returns_one_result_per_insight(self, clusterer: SemanticClusterer):
        results = clusterer.rank_insights("deep learning paper")
        assert len(results) == len(MOCK_INSIGHTS)

    def test_results_sorted_by_score_descending(self, clusterer: SemanticClusterer):
        results = clusterer.rank_insights("some text")
        scores = [r.score for r in results]
        assert scores == sorted(scores, reverse=True)

    def test_all_scores_in_valid_range(self, clusterer: SemanticClusterer):
        for r in clusterer.rank_insights("test query"):
            assert -1.0 <= r.score <= 1.0, f"Out-of-range score: {r.score}"

    def test_result_type(self, clusterer: SemanticClusterer):
        for r in clusterer.rank_insights("type check"):
            assert isinstance(r, SimilarityResult)

    def test_above_threshold_flag_matches_score(self, clusterer: SemanticClusterer):
        """above_threshold must be consistent with score >= threshold."""
        for r in clusterer.rank_insights("threshold consistency"):
            assert r.above_threshold == (r.score >= clusterer.threshold)

    def test_empty_index_returns_empty_list(self):
        c = SemanticClusterer(use_real_model=False)
        assert c.rank_insights("anything") == []

    def test_self_similarity_is_near_one(self):
        """Querying with an insight's own text should rank it first with score ≈ 1."""
        c = SemanticClusterer(use_real_model=False)
        ins = MOCK_INSIGHTS[0]
        c.index_insights([ins])
        text = f"{ins['core_idea']} {ins['body_md']}"
        results = c.rank_insights(text)
        assert results[0].insight_id == ins["id"]
        assert results[0].score > 0.99


class TestAssignInsights:
    def test_returns_only_above_threshold_ids(self, clusterer: SemanticClusterer):
        text = "variance trajectory policy gradient"
        assigned = clusterer.assign_insights(text)
        expected = [
            r.insight_id
            for r in clusterer.rank_insights(text)
            if r.above_threshold
        ]
        assert assigned == expected

    def test_threshold_zero_assigns_all(self):
        c = SemanticClusterer(threshold=0.0, use_real_model=False)
        c.index_insights(MOCK_INSIGHTS)
        assigned = c.assign_insights("any text at all")
        assert len(assigned) == len(MOCK_INSIGHTS)

    def test_threshold_one_assigns_none(self):
        c = SemanticClusterer(threshold=1.0, use_real_model=False)
        c.index_insights(MOCK_INSIGHTS)
        # No two different texts can have cosine exactly 1.0
        assert c.assign_insights("some unrelated query text") == []

    def test_lower_threshold_gives_at_least_as_many_as_higher(self, clusterer: SemanticClusterer):
        text = "orthogonal projection alignment geometry tokens"
        c_low  = SemanticClusterer(threshold=0.10, use_real_model=False)
        c_high = SemanticClusterer(threshold=0.90, use_real_model=False)
        for c in (c_low, c_high):
            c.index_insights(MOCK_INSIGHTS)
        assert len(c_low.assign_insights(text)) >= len(c_high.assign_insights(text))

    def test_empty_index_returns_empty_list(self):
        c = SemanticClusterer(use_real_model=False)
        assert c.assign_insights("anything") == []


class TestDefaultThreshold:
    def test_module_constant_matches_default(self):
        c = SemanticClusterer(use_real_model=False)
        assert c.threshold == COSINE_THRESHOLD

    def test_custom_threshold_is_stored(self):
        c = SemanticClusterer(threshold=0.72, use_real_model=False)
        assert c.threshold == 0.72
