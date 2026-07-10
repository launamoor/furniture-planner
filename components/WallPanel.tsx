"use client";

import { useState } from "react";
import { useRoomStore, Wall } from "@/store/roomStore";
import { useUIStore } from "@/store/uiStore";
import RoomCanvas from "./RoomCanvas";
import CanvasVisibilityControls from "@/components/CanvasVisibilityControls";

// ─── Types ────────────────────────────────────────────────────────────────────

type Orientation = "horizontal" | "vertical";

type FormState = {
  length: string;
  orientation: Orientation;
};

const EMPTY_FORM: FormState = {
  length: "",
  orientation: "horizontal",
};

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "7px 9px",
  border: "1px solid #EDE8DF",
  borderRadius: "4px",
  fontSize: "12px",
  color: "#2A2622",
  background: "#fff",
  boxSizing: "border-box",
  outline: "none",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 600,
  color: "#928B82",
  marginBottom: "4px",
  letterSpacing: "0.02em",
};

// ─── WallRow ──────────────────────────────────────────────────────────────────

function WallRow({
  wall,
  onRemove,
}: {
  wall: Wall;
  onRemove: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "7px 10px",
        borderRadius: "5px",
        background: hovered ? "#EDE8DF" : "transparent",
        transition: "background 0.12s",
        gap: "8px",
      }}
    >
      {/* Orientation icon */}
      <div
        style={{
          width: "18px",
          height: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {wall.orientation === "horizontal" ? (
          <div
            style={{
              width: "14px",
              height: "3px",
              background: "#2A2622",
              borderRadius: "1px",
            }}
          />
        ) : (
          <div
            style={{
              width: "3px",
              height: "14px",
              background: "#2A2622",
              borderRadius: "1px",
            }}
          />
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#2A2622",
          }}
        >
          {wall.orientation === "horizontal" ? "Horyzontalna" : "Wertykalna"}{" "}
          ściana
        </div>
        <div style={{ fontSize: "10px", color: "#928B82" }}>
          Długość: {wall.length * 100}cm
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(wall.id)}
        title="Remove wall"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: hovered ? "#c0392b" : "#928B82",
          fontSize: "14px",
          lineHeight: 1,
          padding: "2px 4px",
          borderRadius: "3px",
          transition: "color 0.12s",
          flexShrink: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}

// ─── WallPanel ────────────────────────────────────────────────────────────────

export default function WallPanel() {
  const { room, walls, addWall, removeWall } = useRoomStore();
  const {
    showFloorFurniture,
    showHangingFurniture,
    toggleFloorFurniture,
    toggleHangingFurniture,
    setStep,
  } = useUIStore();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const maxLength =
    form.orientation === "horizontal" ? room.width : room.height;

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, length: e.target.value }));
    setError(null);
  };

  const handleAddWithCurrentOrientation = (orientation: Orientation) => {
    const len = Number(form.length);
    const max = orientation === "horizontal" ? room.width : room.height;

    if (!form.length || isNaN(len) || len <= 0) {
      setError("Wprowadź odpowiednią długość");
      return;
    }
    if (len % 10 !== 0) {
      setError("Length must be a multiple of 10cm");
      return;
    }
    if (len / 100 > max) {
      setError(`Too long — max ${max * 100}cm for a ${orientation} wall`);
      return;
    }

    setError(null);
    addWall({
      id: crypto.randomUUID(),
      length: len / 100,
      orientation,
      x: 0,
      y: 0,
    });
    setForm(EMPTY_FORM);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        width: "100%",
      }}
    >
      {/* <CanvasVisibilityControls
        showFloorFurniture={showFloorFurniture}
        showHangingFurniture={showHangingFurniture}
        onToggleFloor={toggleFloorFurniture}
        onToggleHanging={toggleHangingFurniture}
      /> */}
      <div
        style={{
          width: "100%",
          flexShrink: 0,
          background: "#F5F2EE",
          borderRight: "1px solid #EDE8DF",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          fontFamily: "var(--font-dmsans), 'DM Sans', system-ui, sans-serif",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            padding: "16px 14px 12px",
            borderBottom: "1px solid #EDE8DF",
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
            Dodaj ściany
          </span>
          <p
            style={{
              fontSize: "11px",
              color: "#928B82",
              margin: "6px 0 0",
              lineHeight: 1.5,
            }}
          >
            Dodaj wewnętrzne ściany by podzielić swoje pomieszczenie. Przesuń po
            we właściwe miejsca.
          </p>
        </div>

        {/* ── Form ── */}
        <div
          style={{
            padding: "14px",
            borderBottom: "1px solid #EDE8DF",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {/* Length input */}
          <div>
            <label style={labelStyle}>Długość ściany (cm)</label>
            <input
              style={{
                ...inputStyle,
                borderColor: error ? "#c0392b" : "#EDE8DF",
              }}
              type="number"
              min="10"
              step="10"
              placeholder="np. 150"
              value={form.length}
              onChange={handleLengthChange}
            />
            {error && (
              <span
                style={{
                  fontSize: "10px",
                  color: "#c0392b",
                  marginTop: "3px",
                  display: "block",
                }}
              >
                {error}
              </span>
            )}
          </div>

          {/* Orientation buttons */}
          <div>
            <label style={labelStyle}>Orientacja</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => handleAddWithCurrentOrientation("horizontal")}
                style={{
                  flex: 1,
                  padding: "8px 6px",
                  background: "#2A2622",
                  color: "#F5F2EE",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#3D3733")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#2A2622")
                }
              >
                <div
                  style={{
                    width: "12px",
                    height: "2px",
                    background: "#F5F2EE",
                    borderRadius: "1px",
                  }}
                />
                Horyzontalna
              </button>
              <button
                onClick={() => handleAddWithCurrentOrientation("vertical")}
                style={{
                  flex: 1,
                  padding: "8px 6px",
                  background: "#2A2622",
                  color: "#F5F2EE",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#3D3733")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#2A2622")
                }
              >
                <div
                  style={{
                    width: "2px",
                    height: "12px",
                    background: "#F5F2EE",
                    borderRadius: "1px",
                  }}
                />
                Wertykalna
              </button>
            </div>
          </div>
        </div>

        {/* ── Placed walls list ── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "10px 4px",
            display: "flex",
            flexDirection: "column",
          }}
        ></div>

        {/* ── Footer — continue ── */}
        <div
          style={{
            padding: "12px 14px",
            borderTop: "1px solid #EDE8DF",
          }}
        >
          <button
            onClick={() => setStep(3)}
            style={{
              width: "100%",
              padding: "9px",
              background: "#2A2622",
              color: "#F5F2EE",
              border: "none",
              borderRadius: "5px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.03em",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#3D3733")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2A2622")}
          >
            Kontynuuj do mebli →
          </button>
          <button
            onClick={() => setStep(1)}
            style={{
              width: "100%",
              marginTop: "6px",
              padding: "7px",
              background: "transparent",
              color: "#928B82",
              border: "1px solid #EDE8DF",
              borderRadius: "5px",
              fontSize: "11px",
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#A0614A")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#EDE8DF")
            }
          >
            ← Wróć do rozmiaru pomieszczenia
          </button>
        </div>
        {walls.length === 0 ? (
          <p
            style={{
              fontSize: "11px",
              color: "#b0a898",
              textAlign: "center",
              padding: "20px 14px",
              lineHeight: 1.5,
            }}
          >
            Jeszcze nie dodano żadnych ścian. Dodaj ściany lub kontynuuj.
          </p>
        ) : (
          <>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.28em",
                color: "#928B82",
                textTransform: "uppercase",
                padding: "0 10px 8px",
              }}
            >
              Ściany · {walls.length}
            </span>
            {walls.map((wall) => (
              <WallRow key={wall.id} wall={wall} onRemove={removeWall} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
