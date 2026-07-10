"use client";

// Drop this inside RightSidebar.tsx, at the bottom of the aside, after the selected item section.
// Import useUIStore and pull in selectedWall and setSelectedWall.

import { useUIStore } from "@/store/uiStore";

export type WallKey = "left" | "right" | "top" | "bottom";

const WALL_LABELS: Record<WallKey, string> = {
  top: "Górna",
  bottom: "Dolna",
  left: "Lewa",
  right: "Prawa",
};

function WallButton({
  wall,
  selected,
  onClick,
  style,
}: {
  wall: WallKey;
  selected: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      title={`Elewacja — ściana ${WALL_LABELS[wall].toLowerCase()}`}
      style={{
        padding: "5px 10px",
        background: selected ? "#2A2622" : "#fff",
        color: selected ? "#F5F2EE" : "#928B82",
        border: selected ? "1px solid #2A2622" : "1px solid #EDE8DF",
        borderRadius: "4px",
        fontSize: "10px",
        fontWeight: 600,
        cursor: "pointer",
        letterSpacing: "0.02em",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "#A0614A";
          e.currentTarget.style.color = "#2A2622";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "#EDE8DF";
          e.currentTarget.style.color = "#928B82";
        }
      }}
    >
      {WALL_LABELS[wall]}
    </button>
  );
}

export default function WallSelector() {
  const { selectedWall, setSelectedWall } = useUIStore();

  const handleClick = (wall: WallKey) => {
    // Toggle off if already selected
    setSelectedWall(selectedWall === wall ? null : wall);
  };

  return (
    <div
      style={{
        borderTop: "1px solid #EDE8DF",
        padding: "14px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        fontFamily: "var(--font-dmsans), 'DM Sans', system-ui, sans-serif",
      }}
    >
      <span
        style={{
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.28em",
          color: "#928B82",
          textTransform: "uppercase",
        }}
      >
        Widok elewacji
      </span>

      {/* Cross layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "auto auto auto",
          gap: "4px",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {/* Top */}
        <div />
        <WallButton
          wall="top"
          selected={selectedWall === "top"}
          onClick={() => handleClick("top")}
        />
        <div />

        {/* Left + spacer + Right */}
        <WallButton
          wall="left"
          selected={selectedWall === "left"}
          onClick={() => handleClick("left")}
        />
        <div
          style={{
            width: "28px",
            height: "28px",
            border: "1px solid #EDE8DF",
            borderRadius: "3px",
            background: "#F5F2EE",
          }}
        />
        <WallButton
          wall="right"
          selected={selectedWall === "right"}
          onClick={() => handleClick("right")}
        />

        {/* Bottom */}
        <div />
        <WallButton
          wall="bottom"
          selected={selectedWall === "bottom"}
          onClick={() => handleClick("bottom")}
        />
        <div />
      </div>

      <p
        style={{
          fontSize: "10px",
          color: "#b0a898",
          margin: 0,
          lineHeight: 1.5,
          textAlign: "center",
        }}
      >
        Wybierz ścianę aby zobaczyć widok elewacji
      </p>
    </div>
  );
}
