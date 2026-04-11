"use client";

/**
 * useGraph — SWR-backed hook for the full graph response.
 *
 * The graph is fetched exactly once per browser session (24 h dedupe window)
 * because the vault is static.  Switching between Insight lenses does NOT
 * trigger a re-fetch — the canvas re-renders from the already-cached data.
 */

import useSWR from "swr";
import type { GraphResponse } from "@/lib/types";

interface UseGraphResult {
  graph: GraphResponse | null;
  loading: boolean;
  error: string | null;
}

export function useGraph(): UseGraphResult {
  const { data, error, isLoading } = useSWR<GraphResponse>("/api/graph");

  return {
    graph: data ?? null,
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? "Unknown error" : null,
  };
}
