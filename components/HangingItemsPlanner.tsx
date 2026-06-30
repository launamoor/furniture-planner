import RoomCanvas from "./RoomCanvas";
import HangingFurniturePanel from "./HangingFurniturePanel";
import { useRoomStore } from "@/store/roomStore";
import { useUIStore } from "@/store/uiStore";
import CanvasVisibilityControls from "./CanvasVisibilityControls";

export default function HangingItemsPlanner() {
  const { room } = useRoomStore();
  const {
    showFloorFurniture,
    showHangingFurniture,
    toggleFloorFurniture,
    toggleHangingFurniture,
  } = useUIStore();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: `${room.width > 5 ? "column" : "row"}`,
        gap: "1rem",
        minHeight: "70vh",
        width: "50vw",
      }}
    >
      <HangingFurniturePanel />
      <CanvasVisibilityControls
        showFloorFurniture={showFloorFurniture}
        showHangingFurniture={showHangingFurniture}
        onToggleFloor={toggleFloorFurniture}
        onToggleHanging={toggleHangingFurniture}
      />
      <RoomCanvas />
    </div>
  );
}
