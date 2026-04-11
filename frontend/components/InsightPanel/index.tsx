"use client";

/**
 * InsightPanel — draggable + resizable floating insight window.
 *
 * Spawns at top-left (x=24, y=80).  User can drag via the header bar
 * and resize from any edge/corner.  Position resets when activeInsight changes.
 *
 * Uses DraggablePanel (react-rnd) instead of fixed positioning.
 */

import ReactMarkdown from "react-markdown";
import DraggablePanel from "@/components/DraggablePanel";
import type { InsightData } from "@/lib/types";

interface InsightPanelProps {
  insight: InsightData | null;
}

export default function InsightPanel({ insight }: InsightPanelProps) {
  return (
    <DraggablePanel
      panelKey={insight?.id ?? null}
      defaultX={24}
      defaultY={80}
      defaultWidth={400}
      defaultHeight={560}
      minWidth={300}
      minHeight={200}
      zIndex={40}
      className="glass-panel"
    >
      {insight && (
        <>
          {/* Left accent bar */}
          <div style={{
            position: "absolute",
            top: 0, left: 0,
            width: "2px", height: "100%",
            background: `linear-gradient(to bottom, transparent, ${insight.color}70, transparent)`,
            pointerEvents: "none",
          }} />

          {/* ── Header (drag handle) ── */}
          <div
            className="panel-drag-handle"
            style={{
              padding: "14px 20px 12px 26px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              flexShrink: 0,
              cursor: "grab",
              userSelect: "none",
            }}
          >
            {/* Letter glyph + label row */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <span style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "30px",
                fontWeight: 900,
                lineHeight: 1,
                color: insight.color,
                textShadow: `0 0 20px ${insight.color}`,
                flexShrink: 0,
              }}>
                {insight.letter}
              </span>
              <div>
                <div style={{ fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-label)", marginBottom: "2px" }}>
                  Insight Lens · drag to move
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.25, wordBreak: "break-word" }}>
                  {cleanInsightName(insight.name)}
                </div>
              </div>
            </div>

            {/* Core idea quote */}
            <div style={{
              padding: "8px 12px",
              background: `${insight.color}0D`,
              borderLeft: `2px solid ${insight.color}60`,
              borderRadius: "0 6px 6px 0",
            }}>
              <p style={{ fontSize: "12px", lineHeight: 1.6, color: insight.color_secondary, margin: 0, fontStyle: "italic" }}>
                {insight.core_idea}
              </p>
            </div>
          </div>

          {/* ── Scrollable body ── */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 20px 26px" }}>
            <div className="md-body" style={{ fontSize: "13px" }}>
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 style={{ color: insight.color_secondary, borderBottom: `1px solid ${insight.color}30`, paddingBottom: "4px" }}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 style={{ color: insight.color_secondary }}>{children}</h3>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote style={{ borderLeftColor: insight.color }}>
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {stripForPanel(insight.body_md)}
              </ReactMarkdown>
            </div>
          </div>

          {/* Bottom accent */}
          <div style={{ height: "2px", background: `linear-gradient(to right, ${insight.color}60, transparent)`, flexShrink: 0 }} />
        </>
      )}
    </DraggablePanel>
  );
}

function cleanInsightName(raw: string): string {
  return raw.replace(/^[^\w]+\s*/, "").trim();
}

function stripForPanel(md: string): string {
  return md
    .replace(/>\s*\[!quote\]\s*Core Idea\s*\n/gi, "> **Core Idea**\n")
    .replace(/>\s*\[!tip\]\s*/gi, "> 💡 ")
    .replace(/>\s*\[!(?:abstract|note|info)\]\s*/gi, "> ")
    .replace(/\[\[[^\]|]*\|([^\]]+)\]\]/g, "**$1**")
    .replace(/\[\[([^\]]+)\]\]/g, "**$1**");
}
