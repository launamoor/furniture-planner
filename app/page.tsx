"use client";
import RoomPlanner from "@/components/RoomPlanner";
import { useUIStore } from "@/store/uiStore";
import RoomSizePicker from "@/components/RoomSizePicker";
import WallPanel from "@/components/WallPanel";
import HangingItemsPlanner from "@/components/HangingItemsPlanner";
import CanvasVisibilityControls from "@/components/CanvasVisibilityControls";

export default function Home() {
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
    if (step === 3) return <RoomPlanner />;
    if (step === 4) return <HangingItemsPlanner />;
  };

  return (
    <>
      <CanvasVisibilityControls
        showFloorFurniture={showFloorFurniture}
        showHangingFurniture={showHangingFurniture}
        onToggleFloor={toggleFloorFurniture}
        onToggleHanging={toggleHangingFurniture}
      />
      <div className="h-full w-full flex items-center justify-center mt-[10rem]">
        {renderStep()}
      </div>
    </>
  );
}
