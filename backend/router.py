"""
ConstellAI — FastAPI route handlers.

All responses are fully typed via Pydantic response_model declarations.
The vault path is resolved once at import time; the parsed graph is cached
in-process (re-parsing on every request would be wasteful and the vault
is read-only at runtime).
"""
from __future__ import annotations

import functools
import pathlib

from fastapi import APIRouter, HTTPException

from backend.models import GraphResponse, PaperDetail, ConceptDetail
from backend.parser import build_graph, discover_files, parse_paper, parse_concept

# The real vault root — two levels above the ConstellAI directory
_VAULT_ROOT = pathlib.Path(__file__).parents[2]

router = APIRouter(prefix="/api")


# ---------------------------------------------------------------------------
# Lazy-cached full graph (parsed once, served many times)
# ---------------------------------------------------------------------------

@functools.lru_cache(maxsize=1)
def _cached_graph() -> GraphResponse:
    return build_graph(_VAULT_ROOT)


@functools.lru_cache(maxsize=32)
def _all_papers() -> dict[str, PaperDetail]:
    papers_dir = _VAULT_ROOT / "04_Papers"
    return {
        p.id: p
        for path in discover_files(papers_dir)
        for p in [parse_paper(path)]
    }


@functools.lru_cache(maxsize=16)
def _all_concepts() -> dict[str, ConceptDetail]:
    concepts_dir = _VAULT_ROOT / "03_Concepts"
    return {
        c.id: c
        for path in discover_files(concepts_dir)
        for c in [parse_concept(path)]
    }


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@router.get("/graph", response_model=GraphResponse)
def get_graph() -> GraphResponse:
    """Return the full node + insight graph used to drive the starfield."""
    return _cached_graph()


@router.get("/papers/{paper_id}", response_model=PaperDetail)
def get_paper(paper_id: str) -> PaperDetail:
    """Return full paper detail for the Level 1 Glassmorphism panel."""
    paper = _all_papers().get(paper_id)
    if paper is None:
        raise HTTPException(status_code=404, detail=f"Paper '{paper_id}' not found")
    return paper


@router.get("/concepts/{concept_id}", response_model=ConceptDetail)
def get_concept(concept_id: str) -> ConceptDetail:
    """Return full concept detail for the Level 2 nested panel."""
    concept = _all_concepts().get(concept_id)
    if concept is None:
        raise HTTPException(status_code=404, detail=f"Concept '{concept_id}' not found")
    return concept
