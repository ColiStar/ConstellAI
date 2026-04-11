"use client";

/**
 * DraggablePanel — react-rnd powered floating window wrapper.
 *
 * Wraps any panel content in a draggable + resizable window.
 * The drag handle is any child element with className="panel-drag-handle".
 *
 * AnimatePresence entry/exit:  uses a fixed-inset motion.div overlay
 * (pointerEvents:none) so the Rnd can position itself in viewport space
 * while still benefiting from framer-motion fade-in/out.
 */

import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rnd } from "react-rnd";

interface DraggablePanelProps {
  /** Unique key — also controls show/hide and resets position on change */
  panelKey: string | null;
  defaultX: number;
  defaultY: number;
  defaultWidth: number;
  defaultHeight: number;
  minWidth?: number;
  minHeight?: number;
  zIndex?: number;
  className?: string;
  children: ReactNode;
}

export default function DraggablePanel({
  panelKey,
  defaultX,
  defaultY,
  defaultWidth,
  defaultHeight,
  minWidth = 280,
  minHeight = 160,
  zIndex = 40,
  className = "glass-panel",
  children,
}: DraggablePanelProps) {
  return (
    <AnimatePresence>
      {panelKey && (
        /* Fullscreen invisible overlay so Rnd's x,y is in viewport coords */
        <motion.div
          key={panelKey}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex,
            pointerEvents: "none",
          }}
        >
          <Rnd
            key={panelKey}
            default={{ x: defaultX, y: defaultY, width: defaultWidth, height: defaultHeight }}
            minWidth={minWidth}
            minHeight={minHeight}
            dragHandleClassName="panel-drag-handle"
            bounds="window"
            style={{ pointerEvents: "all" }}
            enableResizing={{
              top: true, right: true, bottom: true, left: true,
              topRight: true, topLeft: true, bottomRight: true, bottomLeft: true,
            }}
          >
            <div
              className={className}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "16px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {children}
            </div>
          </Rnd>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
