"""
ConstellAI — Vault Parser.

Reads the Obsidian markdown vault and produces typed graph data.
The vault root is read-only; this module never writes to it.

Public API consumed by tests and the router:
    slugify(text)          -> str
    discover_files(dir)    -> list[Path]
    parse_paper(path)      -> PaperDetail
    parse_insight(path)    -> InsightData
    parse_concept(path)    -> ConceptDetail
    build_graph(vault)     -> GraphResponse
"""
from __future__ import annotations

import re
import pathlib
from typing import Any

import frontmatter  # python-frontmatter

from backend.models import (
    Position,
    ConceptRef,
    NodeData,
    EdgeData,
    InsightData,
    PaperDetail,
    ConceptDetail,
    GraphResponse,
)

# ---------------------------------------------------------------------------
# Static configuration — node positions & insight metadata
# ---------------------------------------------------------------------------

# Fixed pixel coordinates on a 1400×800 canvas.
#
# Positions are carefully chosen so that constellation bezier edges form
# legible letters R, V, D, S.  Key layout invariants:
#   R: NCI and DeepSeek share y=190 (clean horizontal top-bar)
#      fDBD sits below-right of DeepSeek (leg target)
#   V: DeepSeek upper-left, Incoherence upper-right, PostAlign lower-center
#   D: EFA and Interpret share x=175 (vertical left spine)
#      PostAlign and CroPA form the right arc
#   S: Safety top-right; bezier arcs trace the S curve through fDBD,
#      DeepSeek, NCI
_NODE_POSITIONS: dict[str, Position] = {
    # Positions shifted RIGHT so constellation center-of-gravity ≈ x=863 (out of 1400),
    # keeping all nodes clear of the InsightPanel (≈ x=0–440 in logical space).
    #
    # Letter invariants:
    #   R: NCI(550,210) and DeepSeek(750,185) near same y → top bar
    #      fDBD(870,430) is leg target below-right of DeepSeek
    #   V: DeepSeek upper-left, Incoherence(1080,155) upper-right, PostAlign(915,530) tip
    #   D: EFA(710,360) and Interpret(710,590) share x=710 → vertical left spine
    #      PostAlign + CroPA(980,590) form the right arc
    #   S: Safety(1200,310) top-right anchor; bezier arcs trace S through fDBD, DeepSeek, NCI
    "deepseek-r1":                              Position(x=750, y=185),
    "nci":                                      Position(x=550, y=210),
    "fdbd":                                     Position(x=870, y=430),
    "postalign":                                Position(x=915, y=530),
    "incoherence-hot-mess":                     Position(x=1080, y=155),
    "efa":                                      Position(x=710, y=360),
    "interpret-diffusion":                      Position(x=710, y=590),
    "cropa":                                    Position(x=980, y=590),
    "safety-alignment-just-a-few-tokens-deep":  Position(x=1200, y=310),
}

# Insight slug → letter, colors
_INSIGHT_META: dict[str, dict[str, Any]] = {
    "relativity-over-absolutes": {
        "letter": "R",
        "color": "#7C3AED",
        "color_secondary": "#A78BFA",
        "core_idea": "Context defines meaning; absolute values are secondary to relative differences.",
    },
    "the-variance-of-trajectories": {
        "letter": "V",
        "color": "#0EA5E9",
        "color_secondary": "#38BDF8",
        "core_idea": "The path to an answer reveals more than the answer itself.",
    },
    "disentanglement-and-anchoring": {
        "letter": "D",
        "color": "#10B981",
        "color_secondary": "#34D399",
        "core_idea": "Strict separation of concerns allows for surgical manipulation without collateral damage.",
    },
    "superficial-vs-intrinsic-latent-structure": {
        "letter": "S",
        "color": "#F59E0B",
        "color_secondary": "#FCD34D",
        "core_idea": "True alignment is structural, not just linguistic.",
    },
}

# Wikilink patterns that appear in vault files
_PAPER_LINK_RE = re.compile(r"\[\[📄\s*([^\]|]+?)(?:\|[^\]]*)?\]\]")
_CONCEPT_LINK_RE = re.compile(r"\[\[🧠\s*([^\]|]+?)(?:\|[^\]]*)?\]\]")
_INSIGHT_LINK_RE = re.compile(r"\[\[✨\s*([^\]|]+?)(?:\|[^\]]*)?\]\]")

# Frontmatter key used for related-papers list inside concept files
_FRONTMATTER_PAPERS_RE = re.compile(
    r"\[\[📄\s*([^\]|]+?)(?:\|[^\]]*)?\]\]"
)


# ---------------------------------------------------------------------------
# Public helpers
# ---------------------------------------------------------------------------


def slugify(text: str) -> str:
    """
    Convert a vault filename (may contain emoji, brackets, spaces) to a
    URL-safe lowercase slug.

    Examples:
        "📄 DeepSeek-R1"  →  "deepseek-r1"
        "🧠 GRPO (Group Relative Policy Optimization)"
                          →  "grpo-group-relative-policy-optimization"
    """
    # Strip emoji and leading/trailing whitespace
    text = re.sub(r"[^\w\s\-\(\)]", "", text, flags=re.UNICODE).strip()
    # Collapse parentheses content inline (remove brackets, keep text)
    text = re.sub(r"[()]", " ", text)
    # Lowercase
    text = text.lower()
    # Replace whitespace / underscores / multiple hyphens with single hyphen
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


def discover_files(directory: pathlib.Path) -> list[pathlib.Path]:
    """Return all .md files in *directory* (non-recursive)."""
    return sorted(directory.glob("*.md"))


# ---------------------------------------------------------------------------
# Private extraction helpers
# ---------------------------------------------------------------------------


def _extract_body(post: frontmatter.Post) -> str:
    """Return the markdown body of a parsed frontmatter post."""
    return post.content.strip()


def _wikilinks(text: str, pattern: re.Pattern[str]) -> list[str]:
    """Extract all matches of *pattern* in *text*, stripped."""
    return [m.strip() for m in pattern.findall(text)]


def _insight_slug_from_name(name: str) -> str:
    """
    Map a raw wikilink target like '✨ Relativity Over Absolutes' or
    'Relativity Over Absolutes' to its canonical slug.
    """
    # Strip the leading emoji if present
    name = re.sub(r"^[^\w]+", "", name).strip()
    return slugify(name)


# ---------------------------------------------------------------------------
# Public parse functions
# ---------------------------------------------------------------------------


def parse_paper(path: pathlib.Path) -> PaperDetail:
    post = frontmatter.load(str(path))
    title = path.stem.strip()  # e.g. "📄 DeepSeek-R1"
    paper_id = slugify(title)

    raw_body = _extract_body(post)
    full_text = f"{title}\n{raw_body}"

    # Insight links come from frontmatter list OR inline wikilinks in body
    fm_insights: list[str] = []
    if "Related Insights" in post.metadata:
        raw = post.metadata["Related Insights"]
        if isinstance(raw, list):
            fm_insights = [slugify(re.sub(r"^[^\w]+", "", s).strip()) for s in raw]

    body_insights = [
        _insight_slug_from_name(n) for n in _wikilinks(full_text, _INSIGHT_LINK_RE)
    ]

    # Deduplicate, preserve order, keep only known insight slugs
    known_slugs = set(_INSIGHT_META.keys())
    seen: set[str] = set()
    insight_ids: list[str] = []
    for slug in fm_insights + body_insights:
        if slug in known_slugs and slug not in seen:
            insight_ids.append(slug)
            seen.add(slug)

    # Concept wikilinks (body only)
    concept_names = _wikilinks(raw_body, _CONCEPT_LINK_RE)
    concepts: list[ConceptRef] = []
    seen_concepts: set[str] = set()
    for name in concept_names:
        cid = slugify(name)
        if cid not in seen_concepts:
            concepts.append(ConceptRef(id=cid, title=name.strip()))
            seen_concepts.add(cid)

    tags: list[str] = post.metadata.get("tags", [])
    if isinstance(tags, str):
        tags = [tags]

    return PaperDetail(
        id=paper_id,
        title=title,
        tags=tags,
        status=str(post.metadata.get("status", "")),
        summary_md=raw_body,
        insight_ids=insight_ids,
        concepts=concepts,
    )


def parse_insight(path: pathlib.Path) -> InsightData:
    post = frontmatter.load(str(path))
    title = path.stem.strip()
    insight_id = slugify(re.sub(r"^[^\w]+", "", title).strip())

    # Keep original body contents without extraction/stripping
    raw_body = _extract_body(post)
    core_idea = "" # Hidden to give space back to the main body

    # Paper ids mentioned in insight body
    full_text = raw_body
    paper_names = _wikilinks(full_text, _PAPER_LINK_RE)
    paper_ids: list[str] = []
    seen: set[str] = set()
    for name in paper_names:
        pid = slugify(name)
        if pid not in seen:
            paper_ids.append(pid)
            seen.add(pid)

    meta = _INSIGHT_META.get(insight_id, {})
    letter = meta.get("letter", "R")
    color = meta.get("color", "#FFFFFF")
    color_secondary = meta.get("color_secondary", "#FFFFFF")
    
    # (Dynamic edges will be added during graph build)
    edges: list[EdgeData] = []

    return InsightData(
        id=insight_id,
        name=title,
        letter=letter,  # type: ignore[arg-type]
        color=color,
        color_secondary=color_secondary,
        core_idea=core_idea,
        body_md=raw_body,
        paper_ids=paper_ids,
        edges=edges,
    )


def parse_concept(path: pathlib.Path) -> ConceptDetail:
    post = frontmatter.load(str(path))
    title = path.stem.strip()
    concept_id = slugify(re.sub(r"^[^\w]+", "", title).strip())

    raw_body = _extract_body(post)
    full_text = f"{title}\n{raw_body}"

    # Related papers from frontmatter key or inline wikilinks
    paper_names = _wikilinks(full_text, _PAPER_LINK_RE)
    paper_ids: list[str] = []
    seen: set[str] = set()
    for name in paper_names:
        pid = slugify(name)
        if pid not in seen:
            paper_ids.append(pid)
            seen.add(pid)

    insight_names = _wikilinks(full_text, _INSIGHT_LINK_RE)
    insight_ids = list({_insight_slug_from_name(n) for n in insight_names})

    tags: list[str] = post.metadata.get("tags", [])
    if isinstance(tags, str):
        tags = [tags]

    return ConceptDetail(
        id=concept_id,
        title=title,
        tags=tags,
        status=str(post.metadata.get("status", "")),
        body_md=raw_body,
        related_paper_ids=paper_ids,
        related_insight_ids=insight_ids,
    )


# ---------------------------------------------------------------------------
# Graph builder — the top-level function
# ---------------------------------------------------------------------------


def build_graph(vault_root: pathlib.Path) -> GraphResponse:
    """
    Parse the entire vault and return a fully typed GraphResponse.

    Paper node positions come from _NODE_POSITIONS (static, designed for
    letter-forming constellations). Papers missing a position entry fall
    back to (0, 0) and a warning is printed — this should not happen in
    the known vault.
    """
    papers_dir = vault_root / "04_Papers"
    insights_dir = vault_root / "02_Insights"

    # Parse all papers → PaperDetail
    paper_details: dict[str, PaperDetail] = {}
    for path in discover_files(papers_dir):
        pd = parse_paper(path)
        paper_details[pd.id] = pd

    # Parse all insights → InsightData
    insight_list: list[InsightData] = []
    for path in discover_files(insights_dir):
        ins = parse_insight(path)
        insight_list.append(ins)

    # Sort insights in canonical slider order
    _slider_order = [
        "relativity-over-absolutes",
        "the-variance-of-trajectories",
        "disentanglement-and-anchoring",
        "superficial-vs-intrinsic-latent-structure",
    ]
    insight_list.sort(
        key=lambda i: _slider_order.index(i.id) if i.id in _slider_order else 99
    )

    # Build NodeData for each paper and collect insight memberships
    nodes: list[NodeData] = []
    insight_to_papers: dict[str, list[str]] = {ins.id: [] for ins in insight_list}

    for paper_id, pd in paper_details.items():
        pos = _NODE_POSITIONS.get(paper_id)
        if pos is None:
            print(f"[WARN] No position defined for paper '{paper_id}', defaulting to (0,0)")
            pos = Position(x=0, y=0)
        
        # Track memberships
        for iid in pd.insight_ids:
            if iid in insight_to_papers:
                insight_to_papers[iid].append(paper_id)

        nodes.append(
            NodeData(
                id=paper_id,
                title=pd.title,
                tags=pd.tags,
                insight_ids=pd.insight_ids,
                concept_ids=[c.id for c in pd.concepts],
                position=pos,
            )
        )

    # Dynamically generate edges for each insight
    # Sort papers by X-coordinate to create a clean progression
    for ins in insight_list:
        member_pids = insight_to_papers.get(ins.id, [])
        if len(member_pids) < 2:
            continue

        # Sort by x coordinate
        sorted_pids = sorted(
            member_pids,
            key=lambda pid: (_NODE_POSITIONS.get(pid).x if _NODE_POSITIONS.get(pid) else 0)
        )

        for i in range(len(sorted_pids) - 1):
            ins.edges.append(
                EdgeData(
                    source=sorted_pids[i],
                    target=sorted_pids[i+1],
                    insight_id=ins.id
                )
            )

    return GraphResponse(nodes=nodes, insights=insight_list)
