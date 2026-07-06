"use client";

import { Stage, Layer, Rect } from "react-konva";
import { useRoomStore } from "@/store/roomStore";
import { metersToPixels } from "@/utils/scale";
import GridLines from "./GridLines";
import FurnitureItems from "./FurnitureItems";
import HangingFurnitureItems from "./HangingFurnitureItems";
import WallItems from "./WallItems";
import { useUIStore } from "@/store/uiStore";
import { forwardRef } from "react";
import Konva from "konva";

const RoomCanvas = forwardRef<Konva.Stage>(function RoomCanvas(_, ref) {
  const {
    room,
    items,
    hangingItems,
    walls,
    updateItemPosition,
    updateHangingItemPosition,
    updateWallPosition,
  } = useRoomStore();

  const { showFloorFurniture, showHangingFurniture } = useUIStore();

  return (
    <Stage
      ref={ref}
      width={metersToPixels(room.width) + metersToPixels(room.x) * 2}
      height={metersToPixels(room.height) + metersToPixels(room.y) * 2}
    >
      <Layer>
        {/* Room */}
        <Rect
          x={metersToPixels(room.x)}
          y={metersToPixels(room.y)}
          width={metersToPixels(room.width)}
          height={metersToPixels(room.height)}
          stroke={"black"}
          strokeWidth={1}
          fill={"#f5f0eb"}
        />
        {/* Room - End */}

        {/* Grid lines */}
        <GridLines room={room} />
        {/* Grid lines - End */}

        {/* Furniture */}
        {showFloorFurniture && (
          <FurnitureItems
            room={room}
            items={items}
            hangingItems={hangingItems}
            walls={walls}
            updateItemPosition={updateItemPosition}
          />
        )}
        {/* Furniture - End */}

        {/* Walls */}
        <WallItems
          room={room}
          walls={walls}
          updateWallPosition={updateWallPosition}
        />
        {/* Walls - End */}

        {/* Hanging Furniture */}
        {showHangingFurniture && (
          <HangingFurnitureItems
            room={room}
            items={items}
            hangingItems={hangingItems}
            updateHangingItemPosition={updateHangingItemPosition}
          />
        )}
        {/* Hanging Furniture - End */}
      </Layer>
    </Stage>
  );
});

export default RoomCanvas;
