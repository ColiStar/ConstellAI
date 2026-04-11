"use client";

/**
 * useConcept — SWR-backed hook for a single concept's full detail.
 *
 * Passing null as conceptId suspends the fetch.
 * Re-opening the same concept panel hits the SWR cache — zero latency.
 */

import useSWR from "swr";
import type { ConceptDetail } from "@/lib/types";

interface UseConceptResult {
  concept: ConceptDetail | null;
  loading: boolean;
  error: boolean;
}

export function useConcept(conceptId: string | null): UseConceptResult {
  const { data, error, isLoading } = useSWR<ConceptDetail>(
    conceptId ? `/api/concepts/${conceptId}` : null,
  );

  return {
    concept: data ?? null,
    loading: isLoading,
    error: !!error,
  };
}
