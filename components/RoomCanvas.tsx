"use client";

import {
  Stage,
  Layer,
  Rect,
  Line,
  Group,
  Text,
  KonvaNodeEvents,
  KonvaNodeComponent,
} from "react-konva";
import { useRoomStore } from "@/store/roomStore";
import {
  metersToPixels,
  pixelsToMeters,
  snapToGrid,
  GRID_STEP,
} from "@/utils/scale";
import Konva from "konva";

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

  const handleCursor = (
    e: Konva.KonvaEventObject<MouseEvent>,
    cursor: string,
  ): void => {
    const stage = e.target.getStage();
    if (stage) stage.container().style.cursor = cursor;
  };

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
        {horizontalLines.map((line, i) => {
          const currentHeight = line[1];
          if ((currentHeight - metersToPixels(room.y)) % 100 === 0) {
            return (
              <Line
                stroke={"#999"}
                points={line}
                strokeWidth={0.3}
                key={`horizontal: ${i}`}
              />
            );
          } else {
            return (
              <Line
                stroke={"#999"}
                points={line}
                strokeWidth={0.1}
                key={`horizontal: ${i}`}
              />
            );
          }
        })}
        {verticalLines.map((line, i) => {
          const currentWidth = line[0];
          if ((currentWidth - metersToPixels(room.x)) % 100 === 0) {
            return (
              <Line
                stroke={"#999"}
                points={line}
                strokeWidth={0.3}
                key={`vertical: ${i}`}
              />
            );
          } else {
            return (
              <Line
                stroke={"#999"}
                points={line}
                strokeWidth={0.1}
                key={`vertical: ${i}`}
              />
            );
          }
        })}

        <Group x={metersToPixels(room.x)} y={metersToPixels(room.y)}>
          <Line
            points={[0, 0, metersToPixels(room.width), 0]}
            stroke={"black"}
            strokeWidth={2}
          />
          <Text
            x={metersToPixels(room.width) / 2 - 20}
            y={-20}
            text={`Width: ${room.width}m`}
          />
        </Group>
        <Group x={metersToPixels(room.x)} y={metersToPixels(room.y)}>
          <Line
            points={[0, 0, 0, metersToPixels(room.height)]}
            stroke={"brown"}
            strokeWidth={2}
          />
          <Text x={0} y={-20} text={`Height: ${room.height}m`} fill={"brown"} />
        </Group>

        {/* Furniture */}
        {items.map((item) => (
          <Group
            key={item.id}
            x={metersToPixels(room.x) + metersToPixels(item.x)}
            y={metersToPixels(room.y) + metersToPixels(item.y)}
            onMouseEnter={(e) => handleCursor(e, "grab")}
            onMouseLeave={(e) => handleCursor(e, "default")}
            onMouseDown={(e) => handleCursor(e, "grabbing")}
            onMouseUp={(e) => handleCursor(e, "grab")}
            draggable
            onDragMove={(e) => {
              const roomX = metersToPixels(room.x);
              const roomY = metersToPixels(room.y);
              const minX = roomX;
              const maxX =
                metersToPixels(room.width) - metersToPixels(item.width) + roomX;
              const minY = roomY;
              const maxY =
                metersToPixels(room.height) -
                metersToPixels(item.height) +
                roomY;

              const clampedX = Math.min(Math.max(e.target.x(), minX), maxX);
              const clampedY = Math.min(Math.max(e.target.y(), minY), maxY);
              const snappedX = snapToGrid(pixelsToMeters(clampedX - roomX));
              const snappedY = snapToGrid(pixelsToMeters(clampedY - roomY));

              let collided = false;

              items.forEach((otherItem) => {
                if (otherItem.id === item.id) return;
                const leftClear = snappedX + item.width <= otherItem.x;
                const rightClear = snappedX >= otherItem.x + otherItem.width;
                const topClear = snappedY + item.height <= otherItem.y;
                const bottomClear = snappedY >= otherItem.y + otherItem.height;

                if (!leftClear && !rightClear && !topClear && !bottomClear) {
                  collided = true;
                }
              });

              if (collided) {
                e.target.x(snapToGrid(metersToPixels(item.x) + roomX));
                e.target.y(snapToGrid(metersToPixels(item.y) + roomY));
              } else {
                e.target.x(metersToPixels(snappedX) + roomX);
                e.target.y(metersToPixels(snappedY) + roomY);
                updateItemPosition(item.id, snappedX, snappedY);
              }
            }}
          >
            <Rect
              x={0}
              y={0}
              width={metersToPixels(item.width)}
              height={metersToPixels(item.height)}
              fill={item.colour}
            />

            <Line
              x={0}
              y={0}
              strokeWidth={0.5}
              stroke={"black"}
              points={[
                0,
                0,
                metersToPixels(item.width),
                0,
                metersToPixels(item.width),
                metersToPixels(item.height),
                0,
                metersToPixels(item.height),
                0,
                0,
              ]}
            />
            <Line
              x={0}
              y={0}
              strokeWidth={0.1}
              stroke={"black"}
              points={[
                0,
                0,
                metersToPixels(item.width),
                metersToPixels(item.height),
              ]}
            />
            <Line
              x={0}
              y={0}
              strokeWidth={0.1}
              stroke={"black"}
              points={[
                metersToPixels(item.width),
                0,
                0,
                metersToPixels(item.height),
              ]}
            />
            <Text
              x={5}
              y={metersToPixels(item.height) - 15}
              text={item.name}
              width={metersToPixels(item.width) - 10}
              ellipsis
            />
          </Group>
        ))}
      </Layer>
    </Stage>
  );
}
