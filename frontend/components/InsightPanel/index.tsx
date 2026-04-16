"use client";

import { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { motion, AnimatePresence } from "framer-motion";
import DraggablePanel from "@/components/DraggablePanel";
import type { InsightData } from "@/lib/types";

interface InsightPanelProps {
  insight: InsightData | null;
}

export default function InsightPanel({ insight }: InsightPanelProps) {
  const [step, setStep] = useState(0);

  // Reset step when insight changes
  useEffect(() => {
    setStep(0);
  }, [insight?.id]);

  const sections = useMemo(() => {
    if (!insight) return [];
    return splitInsightContent(insight.body_md);
  }, [insight]);

  const nextStep = () => {
    if (sections.length === 0) return;
    setStep((prev) => (prev + 1) % sections.length);
  };

  const prevStep = () => {
    if (sections.length === 0) return;
    setStep((prev) => (prev - 1 + sections.length) % sections.length);
  };

  return (
    <DraggablePanel
      panelKey={insight?.id ?? null}
      defaultX={24}
      defaultY={80}
      defaultWidth={960}    // Balanced Flagship PPT Size
      defaultHeight={600}
      minWidth={700}
      minHeight={450}
      zIndex={40}
      className="glass-panel"
    >
      {insight && sections.length > 0 && (
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          height: "100%", 
          position: "relative",
          overflow: "hidden" 
        }}>
          {/* Left accent bar */}
          <div style={{
            position: "absolute",
            top: 0, left: 0,
            width: "4px", height: "100%",
            background: `linear-gradient(to bottom, transparent, ${insight.color}, transparent)`,
            pointerEvents: "none",
            zIndex: 10,
          }} />

          {/* ── Header (Larger font, more space) ── */}
          <div
            className="panel-drag-handle"
            style={{
              padding: "24px 40px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              flexShrink: 0,
              cursor: "grab",
              background: "rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "48px",
                fontWeight: 900,
                lineHeight: 1,
                color: insight.color,
                textShadow: `0 0 25px ${insight.color}`,
              }}>
                {insight.letter}
              </span>
              <div>
                <div style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-label)", opacity: 0.6, marginBottom: "4px" }}>
                  Insight Lens — Part {step + 1} of {sections.length}
                </div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                  {cleanInsightName(insight.name)}
                </div>
              </div>
            </div>
          </div>

          {/* ── Content Area with Dynamic Sectioning ── */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
             <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -60, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ 
                    position: "absolute", 
                    inset: 0, 
                    padding: "30px 80px 40px 50px", // Refined padding
                    overflowY: "auto"
                  }}
                >
                  <div className="md-body ppt-mode" style={{ fontSize: "18px", lineHeight: 1.65 }}>
                    <ReactMarkdown
                      components={{
                        h2: ({ children }) => (
                          <h2 style={{ 
                            color: insight.color_secondary, 
                            fontSize: "28px", 
                            marginTop: 0,
                            marginBottom: "20px",
                            borderBottom: `2px solid ${insight.color}30`,
                            paddingBottom: "10px",
                            fontWeight: 800
                          }}>
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 style={{ color: insight.color_secondary, fontSize: "22px", marginBottom: "12px" }}>{children}</h3>
                        ),
                        p: ({ children }) => (
                          <p style={{ marginBottom: "1.2em" }}>{children}</p>
                        ),
                        li: ({ children }) => (
                          <li style={{ marginBottom: "0.8em" }}>{children}</li>
                        ),
                        strong: ({ children }) => (
                          <strong style={{ color: insight.color, fontWeight: 700 }}>{children}</strong>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote style={{ 
                            borderLeftWidth: "4px",
                            borderLeftColor: insight.color,
                            background: `${insight.color}0D`,
                            fontSize: "20px",
                            padding: "20px 28px",
                            margin: "1.5em 0",
                            borderRadius: "0 6px 6px 0"
                          }}>
                            {children}
                          </blockquote>
                        ),
                      }}
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {preprocessMarkdown(sections[step])}
                    </ReactMarkdown>
                  </div>
                </motion.div>
             </AnimatePresence>

             {/* ── Navigation Trigger (Large, Slick) ── */}
             <button
              onClick={nextStep}
              style={{
                position: "absolute",
                right: "24px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                border: `1px solid ${insight.color}40`,
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(10px)",
                color: insight.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                zIndex: 100,
                boxShadow: `0 0 15px rgba(0,0,0,0.5)`,
              }}
              className="slide-nav-btn"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${insight.color}25`;
                e.currentTarget.style.transform = "translateY(-50%) scale(1.15)";
                e.currentTarget.style.boxShadow = `0 0 30px ${insight.color}50`;
                e.currentTarget.style.borderColor = insight.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                e.currentTarget.style.shadowColor = "rgba(0,0,0,0.5)";
                e.currentTarget.style.borderColor = `${insight.color}40`;
              }}
             >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
             </button>

             {/* ── Slide Progress Indicators ── */}
             <div style={{
                position: "absolute",
                bottom: "24px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "12px",
                zIndex: 20,
             }}>
                {sections.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setStep(i)}
                    style={{
                      width: i === step ? "36px" : "10px",
                      height: "10px",
                      borderRadius: "5px",
                      background: i === step ? insight.color : "rgba(255,255,255,0.15)",
                      cursor: "pointer",
                      transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    }}
                  />
                ))}
             </div>
          </div>

          {/* Bottom decorative bar */}
          <div style={{ 
            height: "6px", 
            background: `linear-gradient(to right, ${insight.color}, transparent)`, 
            flexShrink: 0,
            opacity: 0.8 
          }} />
        </div>
      )}
    </DraggablePanel>
  );
}

function cleanInsightName(raw: string): string {
  return raw.replace(/^[^\w]+\s*/, "").trim();
}

/**
 * Splits the markdown body into logical sections (Core Idea, Related Papers, Inspiration)
 */
function splitInsightContent(md: string): string[] {
  if (!md) return [];
  
  // Use H2 headers as separators
  const sections: string[] = [];
  
  // 1. Split by H2 headers
  const parts = md.split(/\n## /);
  
  if (parts.length > 0) {
    sections.push(parts[0]); // First part (Intro / Core Idea)
    for (let i = 1; i < parts.length; i++) {
       sections.push("## " + parts[i]); // Append sections with their original header
    }
  }
  
  return sections;
}

function preprocessMarkdown(md: string): string {
  if (!md) return "";
  return md
    .replace(/>\s*\[!quote\]\s*Core Idea\s*\n/gi, `> **Core Idea**\n`)
    .replace(/>\s*\[!tip\]\s*/gi, "> 💡 ")
    .replace(/>\s*\[!(?:abstract|note|info)\]\s*/gi, "> ")
    // Convert Wikilinks to Bold - styling is handled by 'strong' component in ReactMarkdown
    .replace(/\[\[[^\]|]*\|([^\]]+)\]\]/g, "**$1**")
    .replace(/\[\[([^\]]+)\]\]/g, "**$1**");
}
