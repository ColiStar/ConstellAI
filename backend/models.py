"""
ConstellAI — Pydantic v2 data models.

All graph entities are typed here. The parser produces these; the router
serves them. Nothing else may invent shapes.
"""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Atomic building blocks
# ---------------------------------------------------------------------------


class Position(BaseModel):
    x: float
    y: float


class ConceptRef(BaseModel):
    """Lightweight reference embedded inside a PaperDetail response."""
    id: str  # slug form, e.g. "neural-collapse"
    title: str  # display name, e.g. "Neural Collapse"


# ---------------------------------------------------------------------------
# Graph-level models  (returned by GET /api/graph)
# ---------------------------------------------------------------------------


class NodeData(BaseModel):
    """A single paper node as rendered in the starfield."""
    id: str = Field(..., description="URL-safe slug derived from the file title")
    title: str
    tags: list[str]
    insight_ids: list[str] = Field(
        ..., description="Slugs of the insights this paper belongs to"
    )
    concept_ids: list[str] = Field(
        ..., description="Slugs of core concepts referenced in this paper"
    )
    position: Position


class EdgeData(BaseModel):
    """A directed constellation edge between two paper nodes."""
    source: str  # NodeData.id
    target: str  # NodeData.id
    insight_id: str


class InsightData(BaseModel):
    """One 'Telescope Lens' — defines a constellation + its letter."""
    id: str  # slug, e.g. "relativity-over-absolutes"
    name: str
    letter: Literal["R", "V", "D", "S"]
    color: str  # hex, e.g. "#7C3AED"
    color_secondary: str  # hex
    core_idea: str
    body_md: str  # full markdown body of the insight file
    paper_ids: list[str]
    edges: list[EdgeData]


class GraphResponse(BaseModel):
    nodes: list[NodeData]
    insights: list[InsightData]


# ---------------------------------------------------------------------------
# Detail models  (returned by GET /api/papers/{id} and /api/concepts/{id})
# ---------------------------------------------------------------------------


class PaperDetail(BaseModel):
    id: str
    title: str
    tags: list[str]
    status: str
    summary_md: str  # raw markdown; frontend renders it
    insight_ids: list[str]
    concepts: list[ConceptRef]


class ConceptDetail(BaseModel):
    id: str
    title: str
    tags: list[str]
    status: str
    body_md: str  # raw markdown
    related_paper_ids: list[str]
    related_insight_ids: list[str]
