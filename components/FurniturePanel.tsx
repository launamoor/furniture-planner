"use client";

import { useState } from "react";
import { useRoomStore, FurnitureItem } from "@/store/roomStore";
import { useUIStore } from "@/store/uiStore";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormState = {
  name: string;
  width: string;
  depth: string;
  woodType: string;
  heightCm: string;
  floorOffsetCm: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  width: "",
  depth: "",
  woodType: "",
  heightCm: "",
  floorOffsetCm: "",
};

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "7px 9px",
  border: "1px solid #e5e0d8",
  borderRadius: "4px",
  fontSize: "12px",
  color: "#2c2419",
  background: "#fff",
  boxSizing: "border-box",
  outline: "none",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 600,
  color: "#7a6a5a",
  marginBottom: "4px",
  letterSpacing: "0.02em",
};

// ─── Generate random color ────────────────────────────────────────────────────

const generateRandomBrownColor = (): string => {
  // AI GENERATED
  // 1. Keep the warm orange/brown hue spectrum
  const h: number = Math.floor(Math.random() * (45 - 20 + 1)) + 20;

  // 2. Keep saturation moderate so it looks like beige/tan instead of bright pastel orange
  const s: number = (Math.floor(Math.random() * (50 - 25 + 1)) + 25) / 100;

  // 3. Force high lightness (70% to 85%) to guarantee high contrast with black text
  const l: number = (Math.floor(Math.random() * (85 - 70 + 1)) + 70) / 100;

  const a: number = s * Math.min(l, 1 - l);
  const f = (n: number): string => {
    const k: number = (n + h / 30) % 12;
    const color: number = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${f(0)}${f(8)}${f(4)}`;
};

// ─── PlacedItemRow ────────────────────────────────────────────────────────────

function PlacedItemRow({
  item,
  onRemove,
  onRotate,
}: {
  item: FurnitureItem;
  onRemove: (id: string) => void;
  onRotate: (id: string) => void;
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
        background: hovered ? "#f0ebe3" : "transparent",
        transition: "background 0.12s",
        gap: "8px",
      }}
    >
      {/* Colour dot */}
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "2px",
          background: item.colour,
          flexShrink: 0,
        }}
      />

      {/* Name + dimensions */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#2c2419",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.name}
        </div>
        <div style={{ fontSize: "10px", color: "#9c8672" }}>
          {Math.round(item.width * 100)}cm × {Math.round(item.height * 100)}cm x{" "}
          {Math.round(item.heightCm)}cm
          {item.woodType ? ` · ${item.woodType}` : ""}
        </div>
      </div>

      {/* Remove button */}
      <button
        onClick={() => onRotate(item.id)}
        title="Rotate"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: hovered ? "#9c8672" : "#c4bdb4",
          fontSize: "14px",
          lineHeight: 1,
          padding: "2px 4px",
          borderRadius: "3px",
          transition: "color 0.12s",
          flexShrink: 0,
        }}
      >
        ↻
      </button>
      {/* Remove button */}
      <button
        onClick={() => onRemove(item.id)}
        title="Remove from room"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: hovered ? "#c0392b" : "#c4bdb4",
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

// ─── FurniturePanel ───────────────────────────────────────────────────────────

export default function FurniturePanel() {
  const { room, items, addItem, removeItem, rotateItem } = useRoomStore();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const { setStep } = useUIStore();

  const set =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = "Required";
    if (
      !form.width ||
      isNaN(Number(form.width)) ||
      Number(form.width) <= 0 ||
      Number(form.width) % 10 !== 0
    )
      next.width = "Podaj szerokość do 10cm";
    if (
      !form.depth ||
      isNaN(Number(form.depth)) ||
      Number(form.depth) <= 0 ||
      Number(form.depth) % 10 !== 0
    )
      next.depth = "Podaj głębokość do 10cm";
    if (
      !form.heightCm ||
      isNaN(Number(form.heightCm)) ||
      Number(form.heightCm) <= 0
    )
      next.heightCm = "Podaj wysokość";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;

    addItem({
      id: crypto.randomUUID(),
      name: form.name.trim(),
      width: Number(form.width) / 100, // cm → metres
      height: Number(form.depth) / 100, // cm → metres
      woodType: form.woodType.trim() || undefined,
      colour: generateRandomBrownColor(),
      x: 0,
      y: 0,
      heightCm: Number(form.heightCm),
      floorOffsetCm: form.floorOffsetCm
        ? Number(form.floorOffsetCm)
        : undefined,
    });

    setForm(EMPTY_FORM);
  };

  return (
    <div
      style={{
        flexShrink: 0,
        background: "#f5f1eb",
        borderRight: "1px solid #e5e0d8",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        order: `${room.width > 5 ? "1" : ""}`,
      }}
    >
      {/* ── Add item form ── */}
      <div
        style={{
          padding: "16px 14px",
          borderBottom: "1px solid #e5e0d8",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#9c8672",
            textTransform: "uppercase",
          }}
        >
          Dodaj Mebel
        </span>

        {/* Name */}
        <div>
          <label style={labelStyle}>Nazwa</label>
          <input
            style={{
              ...inputStyle,
              borderColor: errors.name ? "#c0392b" : "#e5e0d8",
            }}
            placeholder="np. Szafa"
            value={form.name}
            onChange={set("name")}
          />
          {errors.name && (
            <span style={{ fontSize: "10px", color: "#c0392b" }}>
              {errors.name}
            </span>
          )}
        </div>

        {/* Width + Depth */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Szerokość (cm)</label>
            <input
              style={{
                ...inputStyle,
                borderColor: errors.width ? "#c0392b" : "#e5e0d8",
              }}
              type="number"
              min="1"
              placeholder="200"
              value={form.width}
              onChange={set("width")}
            />
            {errors.width && (
              <span style={{ fontSize: "10px", color: "#c0392b" }}>
                {errors.width}
              </span>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Głębokość (cm)</label>
            <input
              style={{
                ...inputStyle,
                borderColor: errors.depth ? "#c0392b" : "#e5e0d8",
              }}
              type="number"
              min="1"
              placeholder="60"
              value={form.depth}
              onChange={set("depth")}
            />
            {errors.depth && (
              <span style={{ fontSize: "10px", color: "#c0392b" }}>
                {errors.depth}
              </span>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Wysokość (cm)</label>
            <input
              style={{
                ...inputStyle,
                borderColor: errors.heightCm ? "#c0392b" : "#e5e0d8",
              }}
              type="number"
              min="1"
              placeholder="60"
              value={form.heightCm}
              onChange={set("heightCm")}
            />
            {errors.heightCm && (
              <span style={{ fontSize: "10px", color: "#c0392b" }}>
                {errors.heightCm}
              </span>
            )}
          </div>
          {/* Floor offset */}
        </div>
        <div>
          <label style={labelStyle}>
            Odległość od podłogi (cm, opcjonalnie)
          </label>
          <input
            style={inputStyle}
            type="number"
            min="0"
            placeholder="0"
            value={form.floorOffsetCm}
            onChange={set("floorOffsetCm")}
          />
        </div>

        {/* Wood type */}
        <div>
          <label style={labelStyle}>Rodzaj drewna (opcjonalnie)</label>
          <input
            style={inputStyle}
            placeholder="np. Dąb"
            value={form.woodType}
            onChange={set("woodType")}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleAdd}
          style={{
            padding: "8px",
            background: "#2c2419",
            color: "#f5f1eb",
            border: "none",
            borderRadius: "5px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.03em",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#3d3425")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#2c2419")}
        >
          Dodaj do pomieszczenia
        </button>
        {/* ── Footer ── */}
        <div
          style={{
            padding: "12px 14px",
            borderTop: "1px solid #e5e0d8",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <button
            onClick={() => setStep(4)}
            style={{
              width: "100%",
              padding: "9px",
              background: "#2c2419",
              color: "#f5f1eb",
              border: "none",
              borderRadius: "5px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.03em",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#3d3425")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2c2419")}
          >
            Kontynuuj do mebli wiszących →
          </button>
          <button
            onClick={() => setStep(2)}
            style={{
              width: "100%",
              padding: "7px",
              background: "transparent",
              color: "#7a6a5a",
              border: "1px solid #e5e0d8",
              borderRadius: "5px",
              fontSize: "11px",
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#8B6F47")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#e5e0d8")
            }
          >
            ← Wroc do edycji scian
          </button>
        </div>
      </div>

      {/* ── Placed items list ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px 4px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {items.length === 0 ? (
          <p
            style={{
              fontSize: "11px",
              color: "#b0a898",
              textAlign: "center",
              padding: "20px 14px",
              lineHeight: 1.5,
            }}
          >
            Brak mebli w pomieszczeniu. Dodaj meble powyżej.
          </p>
        ) : (
          <>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "#9c8672",
                textTransform: "uppercase",
                padding: "0 10px 8px",
              }}
            >
              W pomieszczeniu · {items.length}
            </span>
            {items.map((item) => (
              <PlacedItemRow
                key={item.id}
                item={item}
                onRemove={removeItem}
                onRotate={rotateItem}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
