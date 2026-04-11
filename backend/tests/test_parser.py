"""
TDD — parser tests written BEFORE implementation.

All tests in this file must FAIL initially (ImportError or assertion).
They define the exact contract the parser module must satisfy.

Run with:  pytest backend/tests/test_parser.py -v
"""
from __future__ import annotations

import pathlib

import pytest

# This import will fail until parser.py is implemented — that is intentional.
from backend.parser import (
    slugify,
    discover_files,
    parse_paper,
    parse_insight,
    parse_concept,
    build_graph,
)
from backend.models import (
    NodeData,
    InsightData,
    PaperDetail,
    ConceptDetail,
    GraphResponse,
)


# ---------------------------------------------------------------------------
# Unit: slugify
# ---------------------------------------------------------------------------


class TestSlugify:
    def test_basic(self):
        assert slugify("DeepSeek-R1") == "deepseek-r1"

    def test_strips_emoji(self):
        # Vault filenames start with emoji (📄, 🧠, ✨)
        assert slugify("📄 DeepSeek-R1") == "deepseek-r1"

    def test_strips_special_chars(self):
        assert slugify("Safety Alignment Just a Few Tokens Deep") == (
            "safety-alignment-just-a-few-tokens-deep"
        )

    def test_parentheses_removed(self):
        assert slugify("🧠 GRPO (Group Relative Policy Optimization)") == (
            "grpo-group-relative-policy-optimization"
        )

    def test_handles_hot_mess(self):
        assert slugify("📄 Incoherence (Hot Mess)") == "incoherence-hot-mess"


# ---------------------------------------------------------------------------
# Integration: file discovery
# ---------------------------------------------------------------------------


class TestDiscoverFiles:
    def test_finds_all_papers(self, papers_dir: pathlib.Path):
        files = discover_files(papers_dir)
        assert len(files) == 9, f"Expected 9 paper files, got {len(files)}"

    def test_finds_all_insights(self, insights_dir: pathlib.Path):
        files = discover_files(insights_dir)
        assert len(files) == 4, f"Expected 4 insight files, got {len(files)}"

    def test_finds_all_concepts(self, concepts_dir: pathlib.Path):
        files = discover_files(concepts_dir)
        assert len(files) == 4, f"Expected 4 concept files, got {len(files)}"

    def test_returns_only_md_files(self, papers_dir: pathlib.Path):
        files = discover_files(papers_dir)
        assert all(f.suffix == ".md" for f in files)


# ---------------------------------------------------------------------------
# Integration: parse_paper
# ---------------------------------------------------------------------------


class TestParsePaper:
    def test_returns_paper_detail(self, papers_dir: pathlib.Path):
        path = next(papers_dir.glob("*DeepSeek-R1*"))
        paper = parse_paper(path)
        assert isinstance(paper, PaperDetail)

    def test_deepseek_id(self, papers_dir: pathlib.Path):
        path = next(papers_dir.glob("*DeepSeek-R1*"))
        paper = parse_paper(path)
        assert paper.id == "deepseek-r1"

    def test_deepseek_has_three_insights(self, papers_dir: pathlib.Path):
        path = next(papers_dir.glob("*DeepSeek-R1*"))
        paper = parse_paper(path)
        assert len(paper.insight_ids) == 3

    def test_deepseek_has_grpo_concept(self, papers_dir: pathlib.Path):
        path = next(papers_dir.glob("*DeepSeek-R1*"))
        paper = parse_paper(path)
        concept_ids = {c.id for c in paper.concepts}
        assert "grpo-group-relative-policy-optimization" in concept_ids

    def test_summary_md_not_empty(self, papers_dir: pathlib.Path):
        path = next(papers_dir.glob("*DeepSeek-R1*"))
        paper = parse_paper(path)
        assert len(paper.summary_md) > 50

    def test_nci_has_two_insights(self, papers_dir: pathlib.Path):
        path = next(papers_dir.glob("*NCI*"))
        paper = parse_paper(path)
        assert len(paper.insight_ids) == 2

    def test_postalign_insights_are_variance_and_disentanglement(
        self, papers_dir: pathlib.Path
    ):
        path = next(papers_dir.glob("*PostAlign*"))
        paper = parse_paper(path)
        assert "the-variance-of-trajectories" in paper.insight_ids
        assert "disentanglement-and-anchoring" in paper.insight_ids


# ---------------------------------------------------------------------------
# Integration: parse_insight
# ---------------------------------------------------------------------------


class TestParseInsight:
    def test_returns_insight_data(self, insights_dir: pathlib.Path):
        path = next(insights_dir.glob("*Relativity*"))
        insight = parse_insight(path)
        assert isinstance(insight, InsightData)

    def test_relativity_letter(self, insights_dir: pathlib.Path):
        path = next(insights_dir.glob("*Relativity*"))
        insight = parse_insight(path)
        assert insight.letter == "R"

    def test_variance_letter(self, insights_dir: pathlib.Path):
        path = next(insights_dir.glob("*Variance*"))
        insight = parse_insight(path)
        assert insight.letter == "V"

    def test_disentanglement_letter(self, insights_dir: pathlib.Path):
        path = next(insights_dir.glob("*Disentanglement*"))
        insight = parse_insight(path)
        assert insight.letter == "D"

    def test_superficial_letter(self, insights_dir: pathlib.Path):
        path = next(insights_dir.glob("*Superficial*"))
        insight = parse_insight(path)
        assert insight.letter == "S"

    def test_relativity_paper_ids(self, insights_dir: pathlib.Path):
        path = next(insights_dir.glob("*Relativity*"))
        insight = parse_insight(path)
        assert "deepseek-r1" in insight.paper_ids
        assert "fdbd" in insight.paper_ids
        assert "nci" in insight.paper_ids

    def test_insight_has_color(self, insights_dir: pathlib.Path):
        path = next(insights_dir.glob("*Relativity*"))
        insight = parse_insight(path)
        assert insight.color.startswith("#")

    def test_insight_edges_reference_known_papers(self, insights_dir: pathlib.Path):
        path = next(insights_dir.glob("*Relativity*"))
        insight = parse_insight(path)
        paper_id_set = set(insight.paper_ids)
        for edge in insight.edges:
            assert edge.source in paper_id_set
            assert edge.target in paper_id_set


# ---------------------------------------------------------------------------
# Integration: parse_concept
# ---------------------------------------------------------------------------


class TestParseConcept:
    def test_returns_concept_detail(self, concepts_dir: pathlib.Path):
        path = next(concepts_dir.glob("*Neural Collapse*"))
        concept = parse_concept(path)
        assert isinstance(concept, ConceptDetail)

    def test_neural_collapse_id(self, concepts_dir: pathlib.Path):
        path = next(concepts_dir.glob("*Neural Collapse*"))
        concept = parse_concept(path)
        assert concept.id == "neural-collapse"

    def test_neural_collapse_has_related_papers(self, concepts_dir: pathlib.Path):
        path = next(concepts_dir.glob("*Neural Collapse*"))
        concept = parse_concept(path)
        assert "nci" in concept.related_paper_ids
        assert "fdbd" in concept.related_paper_ids

    def test_body_md_not_empty(self, concepts_dir: pathlib.Path):
        path = next(concepts_dir.glob("*Neural Collapse*"))
        concept = parse_concept(path)
        assert len(concept.body_md) > 50


# ---------------------------------------------------------------------------
# Integration: build_graph (full pipeline)
# ---------------------------------------------------------------------------


class TestBuildGraph:
    def test_returns_graph_response(self, vault_root: pathlib.Path):
        graph = build_graph(vault_root)
        assert isinstance(graph, GraphResponse)

    def test_nine_nodes(self, vault_root: pathlib.Path):
        graph = build_graph(vault_root)
        assert len(graph.nodes) == 9

    def test_four_insights(self, vault_root: pathlib.Path):
        graph = build_graph(vault_root)
        assert len(graph.insights) == 4

    def test_all_nodes_have_positions(self, vault_root: pathlib.Path):
        graph = build_graph(vault_root)
        for node in graph.nodes:
            assert node.position.x > 0
            assert node.position.y > 0

    def test_all_nodes_have_insight_ids(self, vault_root: pathlib.Path):
        graph = build_graph(vault_root)
        for node in graph.nodes:
            assert len(node.insight_ids) >= 1, (
                f"Node {node.id!r} has no insight_ids"
            )

    def test_insight_letters_are_r_v_d_s(self, vault_root: pathlib.Path):
        graph = build_graph(vault_root)
        letters = {i.letter for i in graph.insights}
        assert letters == {"R", "V", "D", "S"}

    def test_deepseek_in_three_insights(self, vault_root: pathlib.Path):
        graph = build_graph(vault_root)
        deepseek = next(n for n in graph.nodes if n.id == "deepseek-r1")
        assert len(deepseek.insight_ids) == 3

    def test_no_duplicate_node_ids(self, vault_root: pathlib.Path):
        graph = build_graph(vault_root)
        ids = [n.id for n in graph.nodes]
        assert len(ids) == len(set(ids))
