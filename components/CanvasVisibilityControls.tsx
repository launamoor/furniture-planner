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
        background: active ? "#2A2622" : "#fff",
        color: active ? "#F5F2EE" : "#928B82",
        border: active ? "1px solid #2A2622" : "1px solid #EDE8DF",
        borderRadius: "6px",
        fontSize: "11px",
        fontWeight: 600,
        cursor: "pointer",
        letterSpacing: "0.02em",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.borderColor = "#A0614A";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.borderColor = "#EDE8DF";
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
        fontFamily: "var(--font-dmsans), 'DM Sans', system-ui, sans-serif",
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
