"use client";

import { useUIStore } from "@/store/uiStore";
import RoomSizePicker from "./RoomSizePicker";
import WallPanel from "./WallPanel";
import FurniturePanel from "./FurniturePanel";
import HangingFurniturePanel from "./HangingFurniturePanel";
import CanvasVisibilityControls from "./CanvasVisibilityControls";
import RoomCanvas from "./RoomCanvas";
import RightSidebar from "./RightSideBar";

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: "Rozmiar pokoju" },
  { number: 2, label: "Ściany" },
  { number: 3, label: "Meble" },
  { number: 4, label: "Meble wiszące" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0",
      }}
    >
      {STEPS.map((step, i) => {
        const isDone = current > step.number;
        const isActive = current === step.number;

        return (
          <div
            key={step.number}
            style={{ display: "flex", alignItems: "center" }}
          >
            {/* Connector line */}
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

            {/* Step pill */}
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

// ─── Canvas placeholder ───────────────────────────────────────────────────────

function CanvasPlaceholder() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#faf8f5",
        color: "#c4bdb4",
        fontSize: "13px",
        flexDirection: "column",
        gap: "8px",
        overflow: "auto",
      }}
    >
      {/* Replace with: <RoomCanvas /> */}
      <span style={{ fontSize: "28px" }}>🪑</span>
      <span>Tutaj pojawi się podgląd pokoju</span>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────

export default function AppShell() {
  const { step, setStep } = useUIStore();

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

        {/* Step indicator — hidden on step 1 */}
        {step > 1 && (
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <StepIndicator current={step} />
          </div>
        )}

        {/* Reset button — hidden on step 1 */}
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
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Step 1 — full screen, no sidebar */}
        {step === 1 && (
          <div
            style={{
              flex: 1,
              overflow: "auto",
            }}
          >
            <RoomSizePicker />
          </div>
        )}

        {/* Steps 2–4 — sidebar + canvas */}
        {step > 1 && (
          <>
            <Sidebar />

            <main
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                background: "#faf8f5",
              }}
            >
              {/* Canvas area */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "auto",
                  padding: "24px",
                }}
              >
                <RoomCanvas />
              </div>
            </main>
            <RightSidebar />
          </>
        )}
      </div>
    </div>
  );
}
