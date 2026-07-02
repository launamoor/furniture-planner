"use client";

import { useState } from "react";
import { useRoomStore } from "@/store/roomStore";
import { useUIStore } from "@/store/uiStore";
import { roomPresets } from "@/constants/roomPresets";

// Icons representing room sizes visually
const SIZE_ICONS: Record<string, string> = {
  small: "▪",
  medium: "◾",
  large: "⬛",
  "extra large": "🟫",
};

export default function RoomSizePicker() {
  const { setRoom } = useRoomStore();
  const { setStep } = useUIStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [roomHeight, setRoomHeight] = useState<number>(250);
  const [selectedWidth, setSelectedWidth] = useState<number>(0);
  const [selectedHeight, setSelectedHeight] = useState<number>(0);

  const handleSelect = (name: string, width: number, height: number) => {
    setSelected(name);
    setSelectedWidth(width);
    setSelectedHeight(height);
  };

  const handleContinue = () => {
    if (!selected) return;
    setRoom(selectedWidth, selectedHeight, roomHeight);
    setStep(2);
  };

  return (
    <div
      style={{
        background: "#faf8f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "40px 20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "48px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "#9c8672",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          Krok 1 z 4
        </div>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "#2c2419",
            margin: "0 0 10px",
            letterSpacing: "-0.02em",
          }}
        >
          Wybierz rozmiar pomieszczenia
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#7a6a5a",
            margin: 0,
            maxWidth: "360px",
            textAlign: "center",
            marginInline: "auto",
          }}
        >
          Wybierz rozmiar najblizszy do Twojego pomieszczenia. Bedziesz go
          mogl/mogla edytowac w nastepnym kroku.
        </p>
      </div>

      {/* Preset cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
          width: "100%",
          maxWidth: "560px",
          marginBottom: "36px",
        }}
      >
        {roomPresets.map((preset) => {
          const isSelected = selected === preset.name;
          return (
            <button
              key={preset.name}
              onClick={() =>
                handleSelect(preset.name, preset.width, preset.height)
              }
              style={{
                background: isSelected ? "#2c2419" : "#fff",
                border: isSelected ? "2px solid #2c2419" : "2px solid #e5e0d8",
                borderRadius: "10px",
                padding: "24px 20px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                boxShadow: isSelected
                  ? "0 4px 16px rgba(44,36,25,0.15)"
                  : "0 1px 4px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "#8B6F47";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "#e5e0d8";
                  e.currentTarget.style.boxShadow =
                    "0 1px 4px rgba(0,0,0,0.04)";
                }
              }}
            >
              {/* Visual size indicator */}
              <div
                style={{
                  width: "100%",
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isSelected ? "rgba(255,255,255,0.08)" : "#faf8f5",
                  borderRadius: "6px",
                  marginBottom: "4px",
                }}
              >
                <div
                  style={{
                    background: isSelected ? "#f5f1eb" : "#8B6F47",
                    opacity: isSelected ? 0.9 : 0.25,
                    borderRadius: "3px",
                    width: `${(preset.width / 9) * 80}%`,
                    height: `${(preset.height / 7) * 70}%`,
                    transition: "all 0.15s",
                  }}
                />
              </div>

              {/* Name */}
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: isSelected ? "#f5f1eb" : "#2c2419",
                  textTransform: "capitalize",
                  letterSpacing: "0.01em",
                }}
              >
                {preset.name}
              </span>

              {/* Dimensions */}
              <span
                style={{
                  fontSize: "12px",
                  color: isSelected ? "#c4bdb4" : "#9c8672",
                  fontWeight: 500,
                }}
              >
                {preset.width * 100} × {preset.height * 100} cm
              </span>
            </button>
          );
        })}
      </div>

      {/* Room height input */}
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          marginBottom: "24px",
        }}
      >
        <label
          style={{
            display: "block",
            fontSize: "12px",
            fontWeight: 600,
            color: "#7a6a5a",
            marginBottom: "6px",
            letterSpacing: "0.02em",
          }}
        >
          Wysokość pomieszczenia (cm)
        </label>
        <input
          type="number"
          min="100"
          placeholder="np. 250"
          value={roomHeight}
          onChange={(e) => setRoomHeight(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "10px 14px",
            border: "2px solid #e5e0d8",
            borderRadius: "8px",
            fontSize: "14px",
            color: "#2c2419",
            background: "#fff",
            boxSizing: "border-box",
            outline: "none",
            fontFamily: "inherit",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#2c2419")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e0d8")}
        />
      </div>

      {/* Continue button */}
      <button
        onClick={handleContinue}
        disabled={!selected}
        style={{
          padding: "12px 40px",
          background: selected ? "#2c2419" : "#e5e0d8",
          color: selected ? "#f5f1eb" : "#b0a898",
          border: "none",
          borderRadius: "6px",
          fontSize: "13px",
          fontWeight: 700,
          cursor: selected ? "pointer" : "not-allowed",
          letterSpacing: "0.04em",
          transition: "all 0.15s",
          boxShadow: selected ? "0 2px 8px rgba(44,36,25,0.2)" : "none",
        }}
        onMouseEnter={(e) => {
          if (selected) e.currentTarget.style.background = "#3d3425";
        }}
        onMouseLeave={(e) => {
          if (selected) e.currentTarget.style.background = "#2c2419";
        }}
      >
        Kontynuuj →
      </button>
    </div>
  );
}
