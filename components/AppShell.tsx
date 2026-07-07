"use client";

import { useRef, useState } from "react";
import Konva from "konva";
import { useUIStore } from "@/store/uiStore";
import RoomSizePicker from "./RoomSizePicker";
import WallPanel from "./WallPanel";
import FurniturePanel from "./FurniturePanel";
import HangingFurniturePanel from "./HangingFurniturePanel";
import CanvasVisibilityControls from "./CanvasVisibilityControls";
import RoomCanvas from "./RoomCanvas";
import RightSidebar from "./RightSideBar";
import WallSelector, { WallKey } from "./WallSelector";
import ElevationCanvas from "./ElevationCanvas";
import { getItemsOnWall, getWallsOnWall } from "@/utils/elevationUtils";
import {
  useRoomStore,
  FurnitureItem,
  HangingFurnitureItem,
} from "@/store/roomStore";
import { metersToPixels } from "@/utils/scale";
import { useViewportWidth } from "@/hooks/useViewportWidth";

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: "Rozmiar pokoju" },
  { number: 2, label: "Ściany" },
  { number: 3, label: "Meble" },
  { number: 4, label: "Meble wiszące" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
      {STEPS.map((step, i) => {
        const isDone = current > step.number;
        const isActive = current === step.number;

        return (
          <div
            key={step.number}
            style={{ display: "flex", alignItems: "center" }}
          >
            {i > 0 && (
              <div
                style={{
                  width: "24px",
                  height: "1px",
                  background: isDone || isActive ? "#c4a882" : "#4a3d2e",
                  transition: "background 0.2s",
                }}
              />
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                borderRadius: "20px",
                background: isActive
                  ? "#c4a882"
                  : isDone
                    ? "transparent"
                    : "transparent",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: isActive
                    ? "#2c1f0e"
                    : isDone
                      ? "#c4a882"
                      : "#4a3d2e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "9px",
                  fontWeight: 800,
                  color: isActive ? "#c4a882" : isDone ? "#2c1f0e" : "#7a6a5a",
                  flexShrink: 0,
                  transition: "all 0.2s",
                }}
              >
                {isDone ? "✓" : step.number}
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#2c1f0e" : isDone ? "#c4a882" : "#7a6a5a",
                  whiteSpace: "nowrap",
                  transition: "color 0.2s",
                }}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Sidebar placeholder ──────────────────────────────────────────────────────

function Sidebar() {
  const {
    showFloorFurniture,
    showHangingFurniture,
    toggleFloorFurniture,
    toggleHangingFurniture,
    step,
  } = useUIStore();

  const renderStep = () => {
    if (step === 1) return <RoomSizePicker />;
    if (step === 2) return <WallPanel />;
    if (step === 3) return <FurniturePanel />;
    if (step === 4) return <HangingFurniturePanel />;
  };

  return (
    <aside
      style={{
        width: "20%",
        flexShrink: 0,
        background: "#f5f1eb",
        borderRight: "1px solid #e0d9cf",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        color: "#b0a898",
        fontSize: "12px",
        fontStyle: "italic",
        paddingTop: "2rem",
      }}
    >
      <CanvasVisibilityControls
        showFloorFurniture={showFloorFurniture}
        showHangingFurniture={showHangingFurniture}
        onToggleFloor={toggleFloorFurniture}
        onToggleHanging={toggleHangingFurniture}
      />
      {renderStep()}
    </aside>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────

export default function AppShell() {
  const {
    step,
    setStep,
    selectedWall,
    setSelectedWall,
    toggleFloorFurniture,
    toggleHangingFurniture,
  } = useUIStore();
  const { room, items, hangingItems, walls } = useRoomStore();

  const viewportWidth = useViewportWidth();
  const isCompact = viewportWidth < 1336;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const itemsOnWall =
    selectedWall && getItemsOnWall(selectedWall, items, hangingItems, room);
  const wallsOnWall = selectedWall && getWallsOnWall(selectedWall, walls, room);

  const roomStageRef = useRef<Konva.Stage>(null);
  const elevationStageRef = useRef<Konva.Stage>(null);

  const handleReset = () => {
    if (
      window.confirm(
        "Czy na pewno chcesz zacząć od nowa? Wszystkie dane zostaną utracone.",
      )
    ) {
      setStep(1);
      // Also reset your room store here:
      // useRoomStore.getState().setRoom(0, 0) or a dedicated reset action
    }
  };

  const waitForRender = () =>
    new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );

  const WALL_KEYS: WallKey[] = ["top", "bottom", "left", "right"];

  async function generatePdf() {
    const {
      showFloorFurniture: originalShowFloor,
      showHangingFurniture: originalShowHanging,
    } = useUIStore.getState();
    const originalWall = useUIStore.getState().selectedWall;

    try {
      // Overview: both visible
      if (!useUIStore.getState().showFloorFurniture) toggleFloorFurniture();
      if (!useUIStore.getState().showHangingFurniture) toggleHangingFurniture();
      await waitForRender();
      const overviewImage = roomStageRef.current?.toDataURL();

      // Floor only
      if (useUIStore.getState().showHangingFurniture) toggleHangingFurniture();
      await waitForRender();
      const floorImage = roomStageRef.current?.toDataURL();

      // Hanging only
      if (!useUIStore.getState().showHangingFurniture) toggleHangingFurniture();
      if (useUIStore.getState().showFloorFurniture) toggleFloorFurniture();
      await waitForRender();
      const hangingImage = roomStageRef.current?.toDataURL();

      // Elevations
      const elevations: Record<
        string,
        {
          image: string;
          floorItems: FurnitureItem[];
          hangingItems: HangingFurnitureItem[];
        }
      > = {};

      for (const wall of WALL_KEYS) {
        const onWall = getItemsOnWall(wall, items, hangingItems, room);
        if (onWall.floorItems.length === 0 && onWall.hangingItems.length === 0)
          continue;

        setSelectedWall(wall);
        await waitForRender();
        const image = elevationStageRef.current?.toDataURL();
        if (image) {
          elevations[wall] = {
            image,
            floorItems: onWall.floorItems,
            hangingItems: onWall.hangingItems,
          };
        }
      }

      const payload = {
        room,
        overviewImage,
        floorImage,
        hangingImage,
        floorItems: items,
        hangingItems,
        elevations,
      };

      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bejger-manufaktura-plan.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      const current = useUIStore.getState();
      if (current.showFloorFurniture !== originalShowFloor)
        toggleFloorFurniture();
      if (current.showHangingFurniture !== originalShowHanging)
        toggleHangingFurniture();
      setSelectedWall(originalWall);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Georgia, 'Times New Roman', serif",
        background: "#faf8f5",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          flexShrink: 0,
          background: "#2c1f0e",
          borderBottom: "3px solid #c4a882",
          padding: "0 24px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1px",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#f5f1eb",
              letterSpacing: "0.04em",
              lineHeight: 1,
              fontFamily: "Georgia, serif",
            }}
          >
            Bejger Manufaktura
          </span>
          <span
            style={{
              fontSize: "10px",
              color: "#c4a882",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontWeight: 500,
            }}
          >
            Planuj z nami
          </span>
        </div>

        {step > 1 && (
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <StepIndicator current={step} />
          </div>
        )}

        {step > 1 && (
          <button
            onClick={handleReset}
            style={{
              flexShrink: 0,
              padding: "6px 14px",
              background: "transparent",
              color: "#7a6a5a",
              border: "1px solid #4a3d2e",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.03em",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#c4a882";
              e.currentTarget.style.color = "#c4a882";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#4a3d2e";
              e.currentTarget.style.color = "#7a6a5a";
            }}
          >
            ↺ Zacznij od nowa
          </button>
        )}
      </header>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {step === 1 && (
          <div style={{ flex: 1, overflow: "auto" }}>
            <RoomSizePicker />
          </div>
        )}

        {step > 1 && (
          <>
            {isCompact ? (
              <>
                <button
                  onClick={() => setSidebarOpen((v) => !v)}
                  style={{
                    position: "fixed",
                    top: "70px",
                    left: sidebarOpen ? "calc(20% - 1px)" : "0",
                    zIndex: 20,
                    background: "#2c1f0e",
                    color: "#f5f1eb",
                    border: "none",
                    borderRadius: "0 4px 4px 0",
                    padding: "10px 6px",
                    cursor: "pointer",
                    transition: "left 0.2s",
                  }}
                >
                  {sidebarOpen ? "‹" : "›"}
                </button>
                <div
                  style={{
                    position: "fixed",
                    top: "56px",
                    left: sidebarOpen ? 0 : "-20%",
                    width: "100%",
                    height: "calc(100% - 56px)",
                    zIndex: 15,
                    transition: "left 0.2s",
                    boxShadow: sidebarOpen
                      ? "2px 0 8px rgba(0,0,0,0.15)"
                      : "none",
                  }}
                >
                  <Sidebar />
                </div>
              </>
            ) : (
              <Sidebar />
            )}

            <main
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                background: "#faf8f5",
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  overflow: "auto",
                  padding: "24px",
                }}
              >
                <RoomCanvas ref={roomStageRef} />
                <WallSelector />
                {itemsOnWall && (
                  <div style={{ textAlign: "center", position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "-2.3rem",
                        transform: "translate(0, -50%)",
                        fontSize: "11px",
                        fontFamily: "sans-serif",
                      }}
                    >
                      {room.roomHeightCm}cm
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-1.2rem",
                        left: "50%",
                        fontSize: "11px",
                        fontFamily: "sans-serif",
                        transform: "translate(-50%, 0)",
                      }}
                    >
                      {room.width * 100}cm
                    </div>
                    <ElevationCanvas
                      ref={elevationStageRef}
                      wall={selectedWall!}
                      room={room}
                      floorItems={itemsOnWall.floorItems}
                      hangingItems={itemsOnWall.hangingItems}
                      wallsOnWall={wallsOnWall || []}
                      width={
                        selectedWall === "top" || selectedWall === "bottom"
                          ? metersToPixels(room.width)
                          : metersToPixels(room.height)
                      }
                      height={room.roomHeightCm}
                    />
                  </div>
                )}
              </div>
            </main>
            <RightSidebar onGeneratePdf={generatePdf} />
          </>
        )}
      </div>
    </div>
  );
}
