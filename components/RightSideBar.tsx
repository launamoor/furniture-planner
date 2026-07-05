"use client";

import { useRoomStore } from "@/store/roomStore";
import { useUIStore } from "@/store/uiStore";
import { getItemsOnWall } from "@/utils/elevationUtils";
import { useState } from "react";
import { verticalRangesOverlap } from "@/utils/collision";

// ─── Section header ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        color: "#9c8672",
        textTransform: "uppercase",
        padding: "0 14px 6px",
        display: "block",
      }}
    >
      {children}
    </span>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "5px 14px",
        gap: "8px",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          color: "#7a6a5a",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: "#2c2419",
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div
      style={{
        height: "1px",
        background: "#e5e0d8",
        margin: "10px 0",
      }}
    />
  );
}

// ─── RightSidebar ─────────────────────────────────────────────────────────────

export default function RightSidebar() {
  const { room, items, hangingItems, updateHangingItemOffset } = useRoomStore();
  const { selectedItemId, selectedItemType, selectedWall } = useUIStore();

  const [offsetError, setOffsetError] = useState<string | null>(null);

  // Find selected item across both arrays
  const selectedItem =
    selectedItemType === "floor"
      ? items.find((i) => i.id === selectedItemId)
      : selectedItemType === "hanging"
        ? hangingItems.find((i) => i.id === selectedItemId)
        : null;

  const itemsOnWall =
    selectedWall && getItemsOnWall(selectedWall, items, hangingItems, room);

  return (
    <aside
      style={{
        width: "20%",
        flexShrink: 0,
        background: "#f5f1eb",
        borderLeft: "1px solid #e5e0d8",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* ── Room info ── */}
      <div style={{ padding: "16px 0 10px" }}>
        <SectionLabel>Pomieszczenie</SectionLabel>
        <InfoRow
          label="Szerokość"
          value={`${Math.round(room.width * 100)} cm`}
        />
        <InfoRow
          label="Głębokość"
          value={`${Math.round(room.height * 100)} cm`}
        />
        <InfoRow label="Wysokość" value={`${room.roomHeightCm} cm`} />
        <InfoRow
          label="Powierzchnia"
          value={`${(room.width * room.height).toFixed(2)} m²`}
        />
      </div>

      <Divider />

      {/* ── Selected item ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {!selectedItem ? (
          <p
            style={{
              fontSize: "11px",
              color: "#b0a898",
              textAlign: "center",
              padding: "20px 14px",
              lineHeight: 1.6,
            }}
          >
            Kliknij element aby zobaczyć szczegóły
          </p>
        ) : (
          <div style={{ padding: "6px 0" }}>
            <SectionLabel>
              {selectedItemType === "floor" ? "Mebel" : "Mebel wiszący"}
            </SectionLabel>

            {/* Colour + name */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px 10px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "3px",
                  background: selectedItem.colour,
                  flexShrink: 0,
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
              />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#2c2419",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {selectedItem.name}
              </span>
            </div>

            <InfoRow
              label="Szerokość"
              value={`${Math.round(selectedItem.width * 100)} cm`}
            />
            <InfoRow
              label="Głębokość"
              value={`${Math.round(selectedItem.height * 100)} cm`}
            />
            <InfoRow label="Wysokość" value={`${selectedItem.heightCm} cm`} />

            {selectedItem.woodType && (
              <InfoRow label="Drewno" value={selectedItem.woodType} />
            )}

            {selectedItemType === "floor" &&
              "floorOffsetCm" in selectedItem &&
              selectedItem.floorOffsetCm !== undefined && (
                <InfoRow
                  label="Od podłogi"
                  value={`${selectedItem.floorOffsetCm} cm`}
                />
              )}

            {selectedItemType === "hanging" &&
              "ceilingOffsetCm" in selectedItem && (
                <div style={{ padding: "5px 14px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "#7a6a5a" }}>
                      Od sufitu
                    </span>
                    <input
                      type="number"
                      value={selectedItem.ceilingOffsetCm ?? 0}
                      onChange={(e) => {
                        const newOffset = Number(e.target.value);
                        if (Number.isNaN(newOffset)) return;

                        if (
                          newOffset < 0 ||
                          newOffset + selectedItem.heightCm > room.roomHeightCm
                        ) {
                          setOffsetError("Poza zasięgiem pomieszczenia");
                          return;
                        }

                        const collision = hangingItems.some((other) => {
                          if (other.id === selectedItem.id) return false;
                          const footprintOverlap =
                            selectedItem.x < other.x + other.width &&
                            other.x < selectedItem.x + selectedItem.width &&
                            selectedItem.y < other.y + other.height &&
                            other.y < selectedItem.y + selectedItem.height;
                          if (!footprintOverlap) return false;
                          return verticalRangesOverlap(
                            newOffset,
                            selectedItem.heightCm,
                            other.ceilingOffsetCm ?? 0,
                            other.heightCm,
                          );
                        });

                        if (collision) {
                          setOffsetError("Kolizja z innym meblem");
                          return;
                        }
                        setOffsetError(null);
                        updateHangingItemOffset(selectedItem.id, newOffset);
                      }}
                      style={{
                        width: "60px",
                        fontSize: "12px",
                        fontWeight: 600,
                        textAlign: "right",
                        border: "1px solid #999",
                        borderRadius: "4px",
                        padding: "2px 6px",
                        backgroundColor: "#faf8f5",
                      }}
                    />
                  </div>
                  {offsetError && (
                    <span style={{ fontSize: "10px", color: "#b5442e" }}>
                      {offsetError}
                    </span>
                  )}
                </div>
              )}

            {/* Position in room */}
            <Divider />
            <SectionLabel>Pozycja</SectionLabel>
            <InfoRow
              label="X"
              value={`${Math.round(selectedItem.x * 100)} cm`}
            />
            <InfoRow
              label="Y"
              value={`${Math.round(selectedItem.y * 100)} cm`}
            />
          </div>
        )}
      </div>
      {/* <WallSelector />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          marginBottom: "2rem",
        }}
      >
        {itemsOnWall && (
          <ElevationCanvas
            wall={selectedWall!}
            room={room}
            floorItems={itemsOnWall.floorItems}
            hangingItems={itemsOnWall.hangingItems}
            width={metersToPixels(room.width)}
            height={room.roomHeightCm}
          />
        )}
      </div> */}
    </aside>
  );
}
