"use client";

/**
 * usePaper — SWR-backed hook for a single paper's full detail.
 *
 * Passing null as paperId suspends the fetch (SWR conditional fetching).
 * Previously fetched papers are served from cache instantly on re-open.
 */

import useSWR from "swr";
import type { PaperDetail } from "@/lib/types";

interface UsePaperResult {
  paper: PaperDetail | null;
  loading: boolean;
  error: boolean;
}

export function usePaper(paperId: string | null): UsePaperResult {
  const { data, error, isLoading } = useSWR<PaperDetail>(
    paperId ? `/api/papers/${paperId}` : null,
  );

  return {
    paper: data ?? null,
    loading: isLoading,
    error: !!error,
  };
}
