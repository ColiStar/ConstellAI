"use client";

/**
 * ConceptPanel — draggable + resizable floating concept window.
 *
 * Spawns at x=440, y=80 (left of PaperPanel's default position).
 * Header is drag handle.  Resets position on new concept selection.
 */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import DraggablePanel from "@/components/DraggablePanel";
import { useConcept } from "@/hooks/useConcept";
import type { InsightData } from "@/lib/types";

interface ConceptPanelProps {
  conceptId: string | null;
  activeInsight: InsightData | null;
  onClose: () => void;
}

export default function ConceptPanel({ conceptId, activeInsight, onClose }: ConceptPanelProps) {
  const { concept, loading } = useConcept(conceptId);

  const insightColor  = activeInsight?.color          ?? "#7C3AED";
  const insightColor2 = activeInsight?.color_secondary ?? "#A78BFA";

  return (
    <DraggablePanel
      panelKey={conceptId}
      defaultX={440}
      defaultY={80}
      defaultWidth={420}
      defaultHeight={560}
      minWidth={280}
      minHeight={160}
      zIndex={45}
      className="glass-panel-inner"
    >
      {/* Top accent bar */}
      <div style={{
        height: "2px",
        background: `linear-gradient(to right, transparent, ${insightColor}70, transparent)`,
        flexShrink: 0,
      }} />

      {/* ── Header (drag handle) ── */}
      <div
        className="panel-drag-handle"
        style={{
          padding: "14px 18px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
          cursor: "grab",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
          <span style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-label)", paddingTop: "2px" }}>
            Core Concept
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
              fontSize: "15px",
              lineHeight: 1,
              padding: "3px 7px",
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
            aria-label="Close concept"
          >×</button>
        </div>

        {loading ? (
          <div style={{ display: "flex", gap: "5px", alignItems: "center", marginTop: "14px" }}>
            {[0,1,2].map((i) => (
              <div key={i} style={{
                width:"5px", height:"5px", borderRadius:"50%",
                background: insightColor,
                animation: `breathe 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        ) : concept ? (
          <div style={{ marginTop: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{ fontSize: "18px", lineHeight: 1 }}>🧠</span>
              <h3 style={{
                fontSize: "15px", fontWeight: 700, lineHeight: 1.3,
                color: "var(--text-primary)", letterSpacing: "-0.01em",
                wordBreak: "break-word",
              }}>
                {cleanTitle(concept.title)}
              </h3>
            </div>

            {concept.related_insight_ids.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {concept.related_insight_ids.map((id) => (
                  <span key={id} className="insight-pill" style={{ color: insightColor, fontSize: "10px" }}>
                    {slugToLabel(id)}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* ── Scrollable body ── */}
      {concept && !loading && (
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px 18px", display: "flex", flexDirection: "column", gap: "14px" }}>

          {concept.related_paper_ids.length > 0 && (
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {concept.related_paper_ids.map((id) => (
                  <span key={id} style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    paddingLeft: "10px",
                    borderLeft: `2px solid ${insightColor}50`,
                    wordBreak: "break-word",
                  }}>
                    {slugToTitle(id)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ height: "1px", background: `linear-gradient(to right, transparent, ${insightColor}30, transparent)` }} />

          <div className="md-body" style={{ fontSize: "13px" }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {stripWikilinks(concept.body_md)}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </DraggablePanel>
  );
}

function cleanTitle(raw: string): string {
  return raw.replace(/^[^\w]+\s*/, "").trim();
}

function slugToLabel(slug: string): string {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function slugToTitle(slug: string): string {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function stripWikilinks(md: string): string {
  return md
    .replace(/\[\[[^\]|]*\|([^\]]+)\]\]/g, "$1")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/>\s*\[!(?:quote|tip|abstract|note)\]\s*/gi, "> ");
}
