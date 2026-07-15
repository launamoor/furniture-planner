import type {
  Room,
  HangingFurnitureItem,
  RoomStore,
  FurnitureItem,
} from "@/store/roomStore";
import { Rect, Line, Group, Text } from "react-konva";
import {
  metersToPixels,
  pixelsToMeters,
  round,
  snapToGrid,
} from "@/utils/scale";
import Konva from "konva";
import { useUIStore } from "@/store/uiStore";
import {
  floorVsHangingOverlap,
  rectsOverlap,
  verticalRangesOverlap,
} from "@/utils/collision";

type HangingFurnitureItemsProps = {
  room: Room;
  hangingItems: HangingFurnitureItem[];
  items: FurnitureItem[];
  updateHangingItemPosition: RoomStore["updateHangingItemPosition"];
};

export default function HangingFurnitureItems({
  room,
  hangingItems,
  items,
  updateHangingItemPosition,
}: HangingFurnitureItemsProps) {
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
      {hangingItems.map((item) => (
        <Group
          key={item.id}
          x={metersToPixels(room.x) + metersToPixels(item.x)}
          y={metersToPixels(room.y) + metersToPixels(item.y)}
          onClick={() => setSelectedItem(item.id, "hanging")}
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

              const hangingCollision = hangingItems.some((otherItem) => {
                if (otherItem.id === item.id) return false;
                const footprintOverlap = rectsOverlap(candidate, otherItem);
                if (!footprintOverlap) return false;
                return verticalRangesOverlap(
                  item.ceilingOffsetCm ?? 0,
                  item.heightCm,
                  otherItem.ceilingOffsetCm ?? 0,
                  otherItem.heightCm,
                );
              });
              if (hangingCollision) return false;

              const floorCollision = items.some((floorItem) => {
                const footprintOverlap = rectsOverlap(candidate, floorItem);
                if (!footprintOverlap) return false;
                return floorVsHangingOverlap(
                  floorItem.floorOffsetCm ?? 0,
                  floorItem.heightCm,
                  item.ceilingOffsetCm ?? 0,
                  item.heightCm,
                  room.roomHeightCm,
                );
              });
              if (floorCollision) return false;

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
              updateHangingItemPosition(item.id, finalX, finalY);
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
