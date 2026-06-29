"use client";

import { Stage, Layer, Rect, Line, Group, Text } from "react-konva";
import { useRoomStore } from "@/store/roomStore";
import {
  metersToPixels,
  pixelsToMeters,
  snapToGrid,
  GRID_STEP,
} from "@/utils/scale";
import GridLines from "./GridLines";
import FurnitureItems from "./FurnitureItems";
import WallItems from "./WallItems";

export default function RoomCanvas() {
  const {
    room,
    items,
    walls,
    updateItemPosition,
    addItem,
    removeItem,
    setRoom,
    rotateItem,
    addWall,
    removeWall,
    updateWallPosition,
  } = useRoomStore();

  return (
    <Stage width={1000} height={800}>
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
        <FurnitureItems
          room={room}
          items={items}
          walls={walls}
          addItem={addItem}
          removeItem={removeItem}
          setRoom={setRoom}
          rotateItem={rotateItem}
          updateItemPosition={updateItemPosition}
          addWall={addWall}
          removeWall={removeWall}
          updateWallPosition={updateWallPosition}
        />
        {/* Furniture - End */}

        {/* Walls */}
        <WallItems
          room={room}
          items={items}
          walls={walls}
          addItem={addItem}
          removeItem={removeItem}
          setRoom={setRoom}
          rotateItem={rotateItem}
          updateItemPosition={updateItemPosition}
          addWall={addWall}
          removeWall={removeWall}
          updateWallPosition={updateWallPosition}
        />
        {/* Walls - End */}
      </Layer>
    </Stage>
  );
}
