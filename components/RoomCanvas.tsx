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

export default function RoomCanvas() {
  const { room, items, updateItemPosition, addItem, removeItem, setRoom } =
    useRoomStore();

  return (
    <Stage width={800} height={600}>
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
          addItem={addItem}
          removeItem={removeItem}
          setRoom={setRoom}
          updateItemPosition={updateItemPosition}
        />
        {/* Furniture - End */}
      </Layer>
    </Stage>
  );
}
