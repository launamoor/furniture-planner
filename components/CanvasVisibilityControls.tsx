"use client";

import { useViewportWidth } from "@/hooks/useViewportWidth";
import { useState } from "react";

// Drop this above or alongside your RoomCanvas. Wire onClick handlers to
// useUIStore's toggleFloorFurniture / toggleHangingFurniture, and pass
// showFloorFurniture / showHangingFurniture as the `active` props.

type VisibilityToggleProps = {
  active: boolean;
  onClick: () => void;
  label: string;
};

function VisibilityToggle({ active, onClick, label }: VisibilityToggleProps) {
  return (
    <button
      onClick={onClick}
      title={
        active ? `Ukryj ${label.toLowerCase()}` : `Pokaż ${label.toLowerCase()}`
      }
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        background: active ? "#2c2419" : "#fff",
        color: active ? "#f5f1eb" : "#7a6a5a",
        border: active ? "1px solid #2c2419" : "1px solid #e5e0d8",
        borderRadius: "6px",
        fontSize: "11px",
        fontWeight: 600,
        cursor: "pointer",
        letterSpacing: "0.02em",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.borderColor = "#8B6F47";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.borderColor = "#e5e0d8";
      }}
    >
      {/* eye / eye-slash icon */}
      <span style={{ fontSize: "12px", lineHeight: 1 }}>
        {active ? "👁" : "🚫"}
      </span>
      {label}
    </button>
  );
}

export default function CanvasVisibilityControls({
  showFloorFurniture,
  showHangingFurniture,
  onToggleFloor,
  onToggleHanging,
}: {
  showFloorFurniture: boolean;
  showHangingFurniture: boolean;
  onToggleFloor: () => void;
  onToggleHanging: () => void;
}) {
  const viewportWidth = useViewportWidth();
  const isCompact = viewportWidth < 1336;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: `${isCompact ? "column" : "row"}`,
        gap: "8px",
        padding: "10px 0",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <VisibilityToggle
        active={showFloorFurniture}
        onClick={onToggleFloor}
        label="Meble stojące"
      />
      <VisibilityToggle
        active={showHangingFurniture}
        onClick={onToggleHanging}
        label="Meble wiszące"
      />
    </div>
  );
}
