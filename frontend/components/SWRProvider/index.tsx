"use client";

/**
 * SWRProvider — global SWR configuration for ConstellAI.
 *
 * Cache strategy rationale:
 *   The Obsidian vault is read-only at runtime; the backend parses it once
 *   and serves it from an in-process lru_cache.  There is no reason to
 *   ever re-fetch during a browser session, so we configure:
 *     - revalidateOnFocus:      false  (switching browser tab never re-fetches)
 *     - revalidateOnReconnect:  false  (reconnecting Wi-Fi never re-fetches)
 *     - dedupingInterval:       24 h   (same URL within 24 h shares one fetch)
 *
 *   Individual hooks can override these defaults via their own useSWR options.
 */

import { type ReactNode } from "react";
import { SWRConfig } from "swr";
import { fetcher } from "@/lib/fetcher";

export default function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 86_400_000, // 24 h in ms
        shouldRetryOnError: true,
        errorRetryCount: 3,
        errorRetryInterval: 2_000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
