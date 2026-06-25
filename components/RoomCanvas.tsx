"use client";

import { Stage, Layer, Rect, Line, Group, Text } from "react-konva";
import { useRoomStore } from "@/store/roomStore";
import {
  metersToPixels,
  pixelsToMeters,
  snapToGrid,
  GRID_STEP,
} from "@/utils/scale";

export default function RoomCanvas() {
  const { room, items, updateItemPosition } = useRoomStore();

  const horizontalLines: number[][] = [];
  const verticalLines: number[][] = [];

  const generateGridLines = (): void => {
    let canvasHorizontalStart = metersToPixels(room.x);
    let canvasHorizontalEnd = metersToPixels(room.x);

    let canvasVerticalStart = metersToPixels(room.y);
    let canvasVerticalEnd = metersToPixels(room.y);

    while (
      canvasHorizontalStart - metersToPixels(room.y) <
        metersToPixels(room.height) &&
      canvasHorizontalEnd - metersToPixels(room.y) < metersToPixels(room.height)
    ) {
      horizontalLines.push([
        metersToPixels(room.x),
        canvasHorizontalStart,
        metersToPixels(room.width) + metersToPixels(room.x),
        canvasHorizontalEnd,
      ]);
      canvasHorizontalStart += GRID_STEP;
      canvasHorizontalEnd += GRID_STEP;
    }

    while (
      canvasVerticalStart - metersToPixels(room.x) <
        metersToPixels(room.width) &&
      canvasHorizontalEnd - metersToPixels(room.x) < metersToPixels(room.width)
    ) {
      verticalLines.push([
        canvasVerticalStart,
        metersToPixels(room.y),
        canvasVerticalEnd,
        metersToPixels(room.height) + metersToPixels(room.y),
      ]);
      canvasVerticalStart += GRID_STEP;
      canvasVerticalEnd += GRID_STEP;
    }
  };
  generateGridLines();

  return (
    <Stage width={800} height={600}>
      <Layer>
        <Rect
          x={metersToPixels(room.x)}
          y={metersToPixels(room.y)}
          width={metersToPixels(room.width)}
          height={metersToPixels(room.height)}
          stroke={"black"}
          strokeWidth={1}
          fill={"#f5f0eb"}
        />
        {horizontalLines.map((line, i) => (
          <Line
            stroke={"#999"}
            points={line}
            strokeWidth={0.1}
            key={`horizontal: ${i}`}
          />
        ))}
        {verticalLines.map((line, i) => (
          <Line
            stroke={"#999"}
            points={line}
            strokeWidth={0.1}
            key={`vertical: ${i}`}
          />
        ))}

        {/* Furniture */}
        {items.map((item) => (
          <Rect
            key={item.id}
            x={metersToPixels(room.x) + metersToPixels(item.x)}
            y={metersToPixels(room.y) + metersToPixels(item.y)}
            width={metersToPixels(item.width)}
            height={metersToPixels(item.height)}
            fill={item.colour}
            draggable
            onDragMove={(e) => {
              const snappedX = snapToGrid(
                pixelsToMeters(e.target.x() - metersToPixels(room.x)),
              );
              const snappedY = snapToGrid(
                pixelsToMeters(e.target.y() - metersToPixels(room.y)),
              );
              e.target.x(metersToPixels(snappedX) + metersToPixels(room.x));
              e.target.y(metersToPixels(snappedY) + metersToPixels(room.y));
              updateItemPosition(item.id, snappedX, snappedY);
            }}
          />
        ))}
      </Layer>
    </Stage>
  );
}
