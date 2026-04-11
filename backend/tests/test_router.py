"""
TDD — router / API endpoint tests written BEFORE implementation.

These verify the HTTP contract of the FastAPI app.
All tests must FAIL until main.py + router.py are implemented.

Run with:  pytest backend/tests/test_router.py -v
"""
from __future__ import annotations

import pytest
from httpx import AsyncClient, ASGITransport


# Will fail until main.py exists and exports `app`
from backend.main import app


@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


pytestmark = pytest.mark.asyncio


# ---------------------------------------------------------------------------
# GET /api/graph
# ---------------------------------------------------------------------------


async def test_graph_returns_200(client: AsyncClient):
    resp = await client.get("/api/graph")
    assert resp.status_code == 200


async def test_graph_has_nodes_and_insights(client: AsyncClient):
    resp = await client.get("/api/graph")
    data = resp.json()
    assert "nodes" in data
    assert "insights" in data


async def test_graph_nine_nodes(client: AsyncClient):
    resp = await client.get("/api/graph")
    assert len(resp.json()["nodes"]) == 9


async def test_graph_four_insights(client: AsyncClient):
    resp = await client.get("/api/graph")
    assert len(resp.json()["insights"]) == 4


async def test_graph_node_has_position(client: AsyncClient):
    resp = await client.get("/api/graph")
    node = resp.json()["nodes"][0]
    assert "position" in node
    assert "x" in node["position"]
    assert "y" in node["position"]


async def test_graph_insight_has_letter(client: AsyncClient):
    resp = await client.get("/api/graph")
    insight = resp.json()["insights"][0]
    assert insight["letter"] in ("R", "V", "D", "S")


# ---------------------------------------------------------------------------
# GET /api/papers/{id}
# ---------------------------------------------------------------------------


async def test_paper_known_id_returns_200(client: AsyncClient):
    resp = await client.get("/api/papers/deepseek-r1")
    assert resp.status_code == 200


async def test_paper_unknown_id_returns_404(client: AsyncClient):
    resp = await client.get("/api/papers/nonexistent-paper")
    assert resp.status_code == 404


async def test_paper_response_shape(client: AsyncClient):
    resp = await client.get("/api/papers/deepseek-r1")
    data = resp.json()
    assert "id" in data
    assert "title" in data
    assert "summary_md" in data
    assert "concepts" in data
    assert "insight_ids" in data


async def test_paper_deepseek_has_grpo_concept(client: AsyncClient):
    resp = await client.get("/api/papers/deepseek-r1")
    concepts = resp.json()["concepts"]
    concept_ids = [c["id"] for c in concepts]
    assert "grpo-group-relative-policy-optimization" in concept_ids


# ---------------------------------------------------------------------------
# GET /api/concepts/{id}
# ---------------------------------------------------------------------------


async def test_concept_known_id_returns_200(client: AsyncClient):
    resp = await client.get("/api/concepts/neural-collapse")
    assert resp.status_code == 200


async def test_concept_unknown_id_returns_404(client: AsyncClient):
    resp = await client.get("/api/concepts/does-not-exist")
    assert resp.status_code == 404


async def test_concept_response_shape(client: AsyncClient):
    resp = await client.get("/api/concepts/neural-collapse")
    data = resp.json()
    assert "id" in data
    assert "title" in data
    assert "body_md" in data
    assert "related_paper_ids" in data


async def test_concept_neural_collapse_papers(client: AsyncClient):
    resp = await client.get("/api/concepts/neural-collapse")
    paper_ids = resp.json()["related_paper_ids"]
    assert "nci" in paper_ids
    assert "fdbd" in paper_ids
