"use client";

/**
 * PaperPanel — draggable + resizable floating paper window.
 *
 * Spawns at top-right area (x=880, y=80).  Header is drag handle.
 * User can drag anywhere and resize from any edge/corner.
 * Position resets on new paper selection (via panelKey=paperId).
 */

import ReactMarkdown from "react-markdown";
import DraggablePanel from "@/components/DraggablePanel";
import { usePaper } from "@/hooks/usePaper";
import type { InsightData } from "@/lib/types";

interface PaperPanelProps {
  paperId: string | null;
  activeInsight: InsightData | null;
  onConceptSelect: (conceptId: string) => void;
  onClose: () => void;
}

export default function PaperPanel({
  paperId,
  activeInsight,
  onConceptSelect,
  onClose,
}: PaperPanelProps) {
  const { paper, loading } = usePaper(paperId);

  const insightColor  = activeInsight?.color          ?? "#7C3AED";
  const insightColor2 = activeInsight?.color_secondary ?? "#A78BFA";

  return (
    <DraggablePanel
      panelKey={paperId}
      defaultX={880}
      defaultY={80}
      defaultWidth={480}
      defaultHeight={620}
      minWidth={320}
      minHeight={200}
      zIndex={42}
      className="glass-panel"
    >
      {/* ── Header (drag handle) ── */}
      <div
        className="panel-drag-handle"
        style={{
          padding: "16px 20px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
          cursor: "grab",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
          <span style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-label)", paddingTop: "2px" }}>
            Research Paper · drag to move
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            style={{
              flexShrink: 0,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              cursor: "pointer",
              color: "rgba(255,255,255,0.5)",
              fontSize: "16px",
              lineHeight: 1,
              padding: "4px 8px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
              e.currentTarget.style.color = "rgba(255,255,255,0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.color = "rgba(255,255,255,0.5)";
            }}
            aria-label="Close"
          >×</button>
        </div>

        {loading ? (
          <LoadingPulse color={insightColor} />
        ) : paper ? (
          <div style={{ marginTop: "12px" }}>
            <h2 style={{
              fontSize: "17px", fontWeight: 700, lineHeight: 1.35,
              color: "var(--text-primary)", marginBottom: "10px",
              letterSpacing: "-0.01em", wordBreak: "break-word",
            }}>
              {cleanTitle(paper.title)}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {paper.insight_ids.map((id) => (
                <span key={id} className="insight-pill" style={{ color: insightColor }}>
                  {slugToLabel(id)}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* ── Scrollable body ── */}
      {paper && !loading && (
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px 22px", display: "flex", flexDirection: "column", gap: "18px" }}>

          {paper.concepts.length > 0 && (
            <div>
              <p style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-label)", marginBottom: "10px" }}>
                Core Concepts — click to explore
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {paper.concepts.map((concept) => (
                  <button
                    key={concept.id}
                    onClick={() => onConceptSelect(concept.id)}
                    style={{
                      background: `${insightColor}14`,
                      border: `1px solid ${insightColor}45`,
                      borderRadius: "8px",
                      padding: "7px 13px",
                      fontSize: "12.5px",
                      color: insightColor2,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "inherit",
                      maxWidth: "100%",
                      wordBreak: "break-word",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${insightColor}26`;
                      e.currentTarget.style.boxShadow = `0 0 14px ${insightColor}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `${insightColor}14`;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    🧠 {cleanTitle(concept.title)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ height: "1px", background: `linear-gradient(to right, transparent, ${insightColor}40, transparent)` }} />

          <div className="md-body">
            <ReactMarkdown>{stripWikilinks(paper.summary_md)}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Bottom accent */}
      <div style={{ height: "2px", background: `linear-gradient(to right, transparent, ${insightColor}60, transparent)`, flexShrink: 0 }} />
    </DraggablePanel>
  );
}

function cleanTitle(raw: string): string {
  return raw.replace(/^[^\w]+\s*/, "").trim();
}

function slugToLabel(slug: string): string {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function stripWikilinks(md: string): string {
  return md
    .replace(/\[\[[^\]|]*\|([^\]]+)\]\]/g, "$1")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/>\s*\[!(?:quote|tip|abstract|note)\]\s*/gi, "> ");
}

function LoadingPulse({ color }: { color: string }) {
  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "14px" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: "6px", height: "6px", borderRadius: "50%",
          background: color,
          animation: `breathe 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}
