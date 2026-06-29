import type { RoomStore } from "@/store/roomStore";
import { WALL_THICKNESS } from "@/utils/scale";
import { Rect, Line, Group, Text } from "react-konva";
import { metersToPixels, pixelsToMeters, snapToGrid } from "@/utils/scale";
import Konva from "konva";

export default function WallItems({
  room,
  walls,
  updateWallPosition,
}: RoomStore) {
  const handleCursor = (
    e: Konva.KonvaEventObject<MouseEvent>,
    cursor: string,
  ): void => {
    const stage = e.target.getStage();
    if (stage) stage.container().style.cursor = cursor;
  };

  return (
    <>
      {walls.map((wall) => (
        <Group
          key={wall.id}
          x={metersToPixels(room.x) + metersToPixels(wall.x)}
          y={metersToPixels(room.y) + metersToPixels(wall.y)}
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
              metersToPixels(room.width) -
              metersToPixels(
                wall.orientation === "horizontal"
                  ? wall.length
                  : WALL_THICKNESS,
              ) +
              roomX;
            const minY = roomY;
            const maxY =
              metersToPixels(room.height) -
              metersToPixels(
                wall.orientation === "vertical" ? wall.length : WALL_THICKNESS,
              ) +
              roomY;

            const clampedX = Math.min(Math.max(e.target.x(), minX), maxX);
            const clampedY = Math.min(Math.max(e.target.y(), minY), maxY);
            const snappedX = snapToGrid(pixelsToMeters(clampedX - roomX));
            const snappedY = snapToGrid(pixelsToMeters(clampedY - roomY));

            e.target.x(metersToPixels(snappedX) + roomX);
            e.target.y(metersToPixels(snappedY) + roomY);
            updateWallPosition(wall.id, snappedX, snappedY);
          }}
        >
          <Rect
            x={0}
            y={0}
            width={
              wall.orientation === "horizontal"
                ? metersToPixels(wall.length)
                : metersToPixels(WALL_THICKNESS)
            }
            height={
              wall.orientation === "vertical"
                ? metersToPixels(wall.length)
                : metersToPixels(WALL_THICKNESS)
            }
            fill={"#9c8672"}
          />
          <Text
            x={
              wall.orientation === "horizontal"
                ? metersToPixels(wall.length) / 2 - 10
                : 10
            }
            y={
              wall.orientation === "horizontal"
                ? wall.y + 10
                : metersToPixels(wall.length) / 2
            }
            text={`${Math.round(metersToPixels(wall.length))}cm`}
            width={
              metersToPixels(
                wall.orientation === "horizontal" ? wall.length / 2 : 10,
              ) - 10
            }
            ellipsis
            fontSize={10}
            wrap="none"
          />
        </Group>
      ))}
    </>
  );
}
