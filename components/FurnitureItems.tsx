import type {
  Room,
  FurnitureItem,
  RoomStore,
  Wall,
  HangingFurnitureItem,
} from "@/store/roomStore";
import { Rect, Line, Group, Text } from "react-konva";
import { metersToPixels, pixelsToMeters, snapToGrid } from "@/utils/scale";
import Konva from "konva";
import { useUIStore } from "@/store/uiStore";
import { round } from "@/utils/scale";
import { floorVsHangingOverlap, rectsOverlap } from "@/utils/collision";
import { getWallRect } from "@/utils/wallUtils";

type FurnitureItemsProps = {
  room: Room;
  items: FurnitureItem[];
  hangingItems: HangingFurnitureItem[];
  walls: Wall[];
  updateItemPosition: RoomStore["updateItemPosition"];
};

export default function FurnitureItems({
  room,
  items,
  walls,
  hangingItems,
  updateItemPosition,
}: FurnitureItemsProps) {
  const handleCursor = (
    e: Konva.KonvaEventObject<MouseEvent>,
    cursor: string,
  ): void => {
    const stage = e.target.getStage();
    if (stage) stage.container().style.cursor = cursor;
  };

  const { setSelectedItem } = useUIStore();

  return (
    <>
      {items.map((item) => (
        <Group
          key={item.id}
          x={metersToPixels(room.x) + metersToPixels(item.x)}
          y={metersToPixels(room.y) + metersToPixels(item.y)}
          onClick={() => setSelectedItem(item.id, "floor")}
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
              metersToPixels(room.height) - metersToPixels(item.height) + roomY;

            const clampedX = Math.min(Math.max(e.target.x(), minX), maxX);
            const clampedY = Math.min(Math.max(e.target.y(), minY), maxY);
            const snappedX = snapToGrid(pixelsToMeters(clampedX - roomX));
            const snappedY = snapToGrid(pixelsToMeters(clampedY - roomY));

            const tryMove = (x: number, y: number): boolean => {
              const candidate = {
                x,
                y,
                width: item.width,
                height: item.height,
              };

              const itemCollision = items.some(
                (otherItem) =>
                  otherItem.id !== item.id &&
                  rectsOverlap(candidate, otherItem),
              );
              if (itemCollision) return false;

              const wallCollision = walls.some((wall) =>
                rectsOverlap(candidate, getWallRect(wall)),
              );
              if (wallCollision) return false;

              const hangingCollision = hangingItems.some((hangingItem) => {
                const footprintOverlap = rectsOverlap(candidate, hangingItem);
                if (!footprintOverlap) return false;
                return floorVsHangingOverlap(
                  item.floorOffsetCm ?? 0,
                  item.heightCm,
                  hangingItem.ceilingOffsetCm ?? 0,
                  hangingItem.heightCm,
                  room.roomHeightCm,
                );
              });
              if (hangingCollision) return false;

              return true;
            };

            let finalX = item.x;
            let finalY = item.y;

            if (tryMove(snappedX, snappedY)) {
              finalX = snappedX;
              finalY = snappedY;
            } else if (tryMove(snappedX, item.y)) {
              finalX = snappedX;
              finalY = item.y;
            } else if (tryMove(item.x, snappedY)) {
              finalX = item.x;
              finalY = snappedY;
            }

            e.target.x(metersToPixels(finalX) + roomX);
            e.target.y(metersToPixels(finalY) + roomY);
            if (finalX !== item.x || finalY !== item.y) {
              updateItemPosition(item.id, finalX, finalY);
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
            x={2}
            y={metersToPixels(item.height) - 12}
            text={item.name}
            width={metersToPixels(item.width) - 10}
            ellipsis
            fontSize={10}
            wrap="none"
          />
          <Text
            x={0}
            y={0}
            align="center"
            text={`${Math.round(item.width * 100)}cm`}
            width={metersToPixels(item.width)}
            height={metersToPixels(item.height)}
            ellipsis
            fontSize={10}
            wrap="none"
          />
          <Text
            x={0}
            y={item.height / 2}
            align="right"
            verticalAlign="middle"
            text={`${Math.round(item.height * 100)}cm`}
            width={metersToPixels(item.width)}
            height={metersToPixels(item.height)}
            ellipsis
            fontSize={10}
            wrap="none"
          />
          <Text
            x={2}
            y={metersToPixels(item.height) - 22}
            text={item.woodType ?? ""}
            width={metersToPixels(item.width) - 10}
            ellipsis
            fontSize={10}
            wrap="none"
          />
        </Group>
      ))}
    </>
  );
}
