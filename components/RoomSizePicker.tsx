"use client";

import { useState } from "react";
import { useRoomStore } from "@/store/roomStore";
import { useUIStore } from "@/store/uiStore";
import { roomPresets } from "@/constants/roomPresets";

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
        background: "#F5F2EE",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-dmsans), 'DM Sans', system-ui, sans-serif",
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
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.28em",
            color: "#928B82",
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
            color: "#2A2622",
            margin: "0 0 10px",
            letterSpacing: "-0.02em",
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
          }}
        >
          Wybierz rozmiar pomieszczenia
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#928B82",
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
                background: isSelected ? "#2A2622" : "#fff",
                border: isSelected ? "2px solid #2A2622" : "2px solid #EDE8DF",
                borderRadius: "10px",
                padding: "24px 20px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                boxShadow: isSelected
                  ? "0 4px 16px rgba(42,38,34,0.15)"
                  : "0 1px 4px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "#A0614A";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "#EDE8DF";
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
                  background: isSelected ? "rgba(255,255,255,0.08)" : "#F5F2EE",
                  borderRadius: "6px",
                  marginBottom: "4px",
                }}
              >
                <div
                  style={{
                    background: isSelected ? "#F5F2EE" : "#A0614A",
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
                  color: isSelected ? "#F5F2EE" : "#2A2622",
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
                  color: isSelected ? "#928B82" : "#928B82",
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
            color: "#928B82",
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
            border: "2px solid #EDE8DF",
            borderRadius: "8px",
            fontSize: "14px",
            color: "#2A2622",
            background: "#fff",
            boxSizing: "border-box",
            outline: "none",
            fontFamily: "inherit",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#2A2622")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#EDE8DF")}
        />
      </div>

      {/* Continue button */}
      <button
        onClick={handleContinue}
        disabled={!selected}
        style={{
          padding: "12px 40px",
          background: selected ? "#2A2622" : "#EDE8DF",
          color: selected ? "#F5F2EE" : "#b0a898",
          border: "none",
          borderRadius: "6px",
          fontSize: "13px",
          fontWeight: 700,
          cursor: selected ? "pointer" : "not-allowed",
          letterSpacing: "0.04em",
          transition: "all 0.15s",
          boxShadow: selected ? "0 2px 8px rgba(42,38,34,0.2)" : "none",
        }}
        onMouseEnter={(e) => {
          if (selected) e.currentTarget.style.background = "#3D3733";
        }}
        onMouseLeave={(e) => {
          if (selected) e.currentTarget.style.background = "#2A2622";
        }}
      >
        Kontynuuj →
      </button>
    </div>
  );
}
