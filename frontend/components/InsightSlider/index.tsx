"use client";

/**
 * InsightSlider — Physical radio-tuning mechanism.
 *
 * Layout (bottom-centered):
 *   ┌─────────────────────────────────────────────┐
 *   │  R          V          D          S         │  ← Letter labels
 *   │  ●──────────○──────────○──────────○         │  ← Track + animated thumb (●)
 *   │  Relativity Variance   Disentangle Superfici│  ← Short names
 *   └─────────────────────────────────────────────┘
 *
 * The thumb CSS-transitions between 4 positions.
 * Clicking a stop moves the thumb; clicking the active stop deactivates.
 */

import type { InsightData } from "@/lib/types";

interface InsightSliderProps {
  insights: InsightData[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

const TRACK_W    = 540;  // px — total track width
const STOP_GAP   = TRACK_W / 3;    // distance between each of 4 stops
const THUMB_SIZE = 16;  // px

export default function InsightSlider({ insights, activeId, onSelect }: InsightSliderProps) {
  const activeIndex = insights.findIndex((i) => i.id === activeId);
  const thumbX = activeIndex >= 0 ? activeIndex * STOP_GAP : -999; // off-track when none active

  const activeInsight = insights.find((i) => i.id === activeId) ?? null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "28px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0px",
        userSelect: "none",
      }}
    >
      {/* ── Core insight quote (above slider) ── */}
      <div style={{
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "8px",
        maxWidth: `${TRACK_W + 80}px`,
        overflow: "hidden",
      }}>
        {activeInsight && (
          <p style={{
            fontSize: "11px",
            lineHeight: 1.55,
            color: "rgba(226,232,240,0.5)",
            fontStyle: "italic",
            textAlign: "center",
            margin: 0,
            animation: "fade-in 0.3s ease forwards",
          }}>
            &ldquo;{activeInsight.core_idea}&rdquo;
          </p>
        )}
      </div>

      {/* ── Slider widget ── */}
      <div style={{ width: `${TRACK_W + 80}px`, padding: "0 40px", boxSizing: "border-box" }}>

        {/* Letter labels (above track) */}
        <div style={{ display: "flex", width: `${TRACK_W}px`, marginLeft: "0px", marginBottom: "8px" }}>
          {insights.map((ins, i) => {
            const isActive = ins.id === activeId;
            return (
              <div
                key={ins.id}
                style={{
                  width: `${STOP_GAP}px`,
                  flexShrink: 0,
                  display: "flex",
                  justifyContent: i === insights.length - 1 ? "flex-end" : "center",
                  paddingRight: i === insights.length - 1 ? "0px" : "0px",
                }}
              >
                <span style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "20px",
                  fontWeight: 800,
                  lineHeight: 1,
                  color: isActive ? ins.color : "rgba(255,255,255,0.18)",
                  textShadow: isActive ? `0 0 16px ${ins.color}` : "none",
                  transition: "all 0.35s ease",
                  cursor: "pointer",
                }}
                  onClick={() => onSelect(ins.id === activeId ? null : ins.id)}
                >
                  {ins.letter}
                </span>
              </div>
            );
          })}
        </div>

        {/* Track + thumb row */}
        <div style={{ position: "relative", width: `${TRACK_W}px`, height: "20px", display: "flex", alignItems: "center" }}>

          {/* Track background */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: "100%",
            height: "3px",
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.10)",
            borderRadius: "3px",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
          }} />

          {/* Active track fill */}
          {activeIndex >= 0 && (
            <div style={{
              position: "absolute",
              top: "50%",
              left: 0,
              width: `${activeIndex * STOP_GAP}px`,
              height: "3px",
              transform: "translateY(-50%)",
              background: `linear-gradient(to right, ${activeInsight?.color ?? "transparent"}88, ${activeInsight?.color ?? "transparent"})`,
              borderRadius: "3px",
              transition: "width 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
              boxShadow: `0 0 10px 2px ${activeInsight?.color ?? "transparent"}60`,
            }} />
          )}

          {/* Stop dots */}
          {insights.map((ins, i) => {
            const isActive = ins.id === activeId;
            const isPast = activeIndex >= 0 && i < activeIndex;
            return (
              <div
                key={ins.id}
                onClick={() => onSelect(ins.id === activeId ? null : ins.id)}
                style={{
                  position: "absolute",
                  left: `${i * STOP_GAP}px`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: isActive ? "0px" : "8px",  // hide stop under thumb when active
                  height: isActive ? "0px" : "8px",
                  borderRadius: "50%",
                  background: isPast ? (activeInsight?.color ?? "transparent") : "rgba(255,255,255,0.2)",
                  border: isPast ? "none" : "1px solid rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  zIndex: 1,
                }}
              />
            );
          })}

          {/* Animated thumb */}
          {activeIndex >= 0 && (
            <div
              onClick={() => onSelect(null)}
              style={{
                position: "absolute",
                left: `${activeIndex * STOP_GAP}px`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: `${THUMB_SIZE}px`,
                height: `${THUMB_SIZE}px`,
                borderRadius: "50%",
                background: `radial-gradient(circle at 38% 38%, rgba(255,255,255,0.85) 0%, ${activeInsight?.color ?? "#7C3AED"} 55%)`,
                boxShadow: [
                  `0 0 0 2px rgba(255,255,255,0.22)`,
                  `0 0 0 5px rgba(${hexToRgb(activeInsight?.color ?? "#7C3AED")}, 0.20)`,
                  `0 0 18px 6px ${activeInsight?.color ?? "#7C3AED"}70`,
                  `0 0 40px 10px ${activeInsight?.color ?? "#7C3AED"}30`,
                ].join(", "),
                transition: "left 0.4s cubic-bezier(0.32, 0.72, 0, 1), background 0.3s ease, box-shadow 0.3s ease",
                zIndex: 2,
                cursor: "pointer",
              }}
            />
          )}
        </div>

        {/* Short names (below track) */}
        <div style={{ display: "flex", width: `${TRACK_W}px`, marginTop: "8px" }}>
          {insights.map((ins, i) => {
            const isActive = ins.id === activeId;
            return (
              <div
                key={ins.id}
                style={{
                  width: `${STOP_GAP}px`,
                  flexShrink: 0,
                  display: "flex",
                  justifyContent: i === insights.length - 1 ? "flex-end" : "center",
                }}
              >
                <span
                  onClick={() => onSelect(ins.id === activeId ? null : ins.id)}
                  style={{
                    fontSize: "9px",
                    fontWeight: 500,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: isActive ? ins.color_secondary : "rgba(255,255,255,0.18)",
                    transition: "color 0.3s ease",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: `${STOP_GAP - 4}px`,
                    cursor: "pointer",
                    display: "block",
                    textAlign: i === insights.length - 1 ? "right" : "center",
                  }}
                >
                  {shortName(ins.name)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function shortName(name: string): string {
  // Strip emoji, take first word(s), max 10 chars
  const stripped = name.replace(/^[^\w\s]+\s*/, "").trim();
  return stripped.length > 12 ? stripped.slice(0, 11) + "…" : stripped;
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}
