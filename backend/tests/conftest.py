"""
Shared pytest fixtures.

VAULT_ROOT points at the real read-only vault so integration tests use
actual markdown data. Unit tests that need isolation receive a tmp_path
fixture from pytest directly.
"""
from __future__ import annotations

import pathlib

import pytest

# The real vault — parser integration tests read from here.
VAULT_ROOT = pathlib.Path(__file__).parents[3]  # /594BBtest


@pytest.fixture
def vault_root() -> pathlib.Path:
    return VAULT_ROOT


@pytest.fixture
def papers_dir(vault_root: pathlib.Path) -> pathlib.Path:
    return vault_root / "04_Papers"


@pytest.fixture
def insights_dir(vault_root: pathlib.Path) -> pathlib.Path:
    return vault_root / "02_Insights"


@pytest.fixture
def concepts_dir(vault_root: pathlib.Path) -> pathlib.Path:
    return vault_root / "03_Concepts"
