"use client";

/**
 * ConstellAI — Main page.
 *
 * State:
 *   activeInsightId   → which insight lens is active (constellation + InsightPanel)
 *   edgeProgress      → [0→1] edge draw-in animation
 *   selectedPaperId   → clicked node  → PaperPanel
 *   selectedConceptId → clicked concept pill → ConceptPanel
 *   hoveredId         → canvas hover feedback
 */

import { useState, useEffect, useRef, useCallback } from "react";
import type { InsightData } from "@/lib/types";
import { INSIGHT_COLORS }  from "@/lib/colors";
import { useGraph }        from "@/hooks/useGraph";
import StarCanvas          from "@/components/StarCanvas";
import InsightSlider       from "@/components/InsightSlider";
import InsightPanel        from "@/components/InsightPanel";
import PaperPanel          from "@/components/PaperPanel";
import ConceptPanel        from "@/components/ConceptPanel";

const EDGE_ANIM_MS = 1100;

export default function ConstellAIPage() {
  const { graph, loading, error } = useGraph();

  const [activeInsightId,   setActiveInsightId]   = useState<string | null>(null);
  const [edgeProgress,      setEdgeProgress]       = useState(0);
  const [selectedPaperId,   setSelectedPaperId]    = useState<string | null>(null);
  const [selectedConceptId, setSelectedConceptId]  = useState<string | null>(null);
  const [hoveredId,         setHoveredId]          = useState<string | null>(null);

  const rafRef   = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  // ── Insight toggle + edge animation ────────────────────────────────
  const handleInsightSelect = useCallback((id: string | null) => {
    setSelectedConceptId(null);

    if (id === activeInsightId) {
      setActiveInsightId(null);
      setEdgeProgress(0);
      return;
    }

    setEdgeProgress(0);
    setActiveInsightId(id);
    if (id === null) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;

    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const p = Math.min(1, (ts - startRef.current) / EDGE_ANIM_MS);
      setEdgeProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
  }, [activeInsightId]);

  const handlePaperSelect = useCallback((id: string | null) => {
    setSelectedPaperId(id);
    setSelectedConceptId(null);
  }, []);

  const handleConceptSelect = useCallback((conceptId: string) => {
    setSelectedConceptId(conceptId);
  }, []);

  // ── Sync body CSS custom props ──────────────────────────────────────
  useEffect(() => {
    if (!activeInsightId) {
      document.body.style.removeProperty("--insight-primary");
      document.body.style.removeProperty("--insight-secondary");
      return;
    }
    const c = INSIGHT_COLORS[activeInsightId];
    if (c) {
      document.body.style.setProperty("--insight-primary",   c.primary);
      document.body.style.setProperty("--insight-secondary", c.secondary);
    }
  }, [activeInsightId]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const activeInsight: InsightData | null =
    graph?.insights.find((i) => i.id === activeInsightId) ?? null;

  if (error) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#ef4444", fontFamily: "monospace", fontSize: "15px", padding: "32px", textAlign: "center" }}>
        Backend unreachable: {error}<br />
        <span style={{ opacity: 0.6, fontSize: "13px", marginTop: "8px", display: "block" }}>Start the FastAPI server: uvicorn backend.main:app --reload --port 8000</span>
      </div>
    );
  }

  return (
    <>
      {/* ── Canvas ── */}
      <StarCanvas
        nodes={graph?.nodes ?? []}
        activeInsight={activeInsight}
        edgeProgress={edgeProgress}
        hoveredId={hoveredId}
        selectedId={selectedPaperId}
        onHover={setHoveredId}
        onSelect={handlePaperSelect}
      />

      {/* ── Loading overlay ── */}
      {loading && (
        <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", zIndex: 100, pointerEvents: "none" }}>
          <span style={{ fontSize: "14px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(248,250,252,0.5)" }}>
            Calibrating telescope
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            {[0,1,2].map((i) => (
              <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#7C3AED", animation: `breathe 1.4s ease-in-out ${i * 0.25}s infinite` }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Wordmark (top-left, always above InsightPanel) ── */}
      {!loading && (
        <div style={{ position: "fixed", top: "28px", left: "32px", zIndex: 55, pointerEvents: "none" }}>
          <div style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(248,250,252,0.9)" }}>
            ConstellAI
          </div>
          <div style={{ fontSize: "11px", letterSpacing: "0.07em", color: "rgba(203,213,225,0.6)", marginTop: "2px" }}>
            Constellation Spatial Matrix
          </div>
        </div>
      )}

      {/* ── Center hint (REMOVED) ── */}

      {/* ── Insight Slider (bottom-center) ── */}
      {!loading && graph && (
        <InsightSlider
          insights={graph.insights}
          activeId={activeInsightId}
          onSelect={handleInsightSelect}
        />
      )}

      {/* ── Insight Panel (left floating card, full body markdown) ── */}
      <InsightPanel insight={activeInsight} />

      {/* ── Paper Panel (right floating card) ── */}
      <PaperPanel
        paperId={selectedPaperId}
        activeInsight={activeInsight}
        onConceptSelect={handleConceptSelect}
        onClose={() => { setSelectedPaperId(null); setSelectedConceptId(null); }}
      />

      {/* ── Concept Panel (further left of PaperPanel, no overlap) ── */}
      <ConceptPanel
        conceptId={selectedConceptId}
        activeInsight={activeInsight}
        onClose={() => setSelectedConceptId(null)}
      />
    </>
  );
}
