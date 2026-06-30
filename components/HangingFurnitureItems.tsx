import type { Room, HangingFurnitureItem, RoomStore } from "@/store/roomStore";
import { Rect, Line, Group, Text } from "react-konva";
import { metersToPixels, pixelsToMeters, snapToGrid } from "@/utils/scale";
import Konva from "konva";

type HangingFurnitureItemsProps = {
  room: Room;
  hangingItems: HangingFurnitureItem[];
  updateHangingItemPosition: RoomStore["updateHangingItemPosition"];
};

export default function HangingFurnitureItems({
  room,
  hangingItems,
  updateHangingItemPosition,
}: HangingFurnitureItemsProps) {
  const handleCursor = (
    e: Konva.KonvaEventObject<MouseEvent>,
    cursor: string,
  ): void => {
    const stage = e.target.getStage();
    if (stage) stage.container().style.cursor = cursor;
  };

  return (
    <>
      {hangingItems.map((item) => (
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
              metersToPixels(room.height) - metersToPixels(item.height) + roomY;

            const clampedX = Math.min(Math.max(e.target.x(), minX), maxX);
            const clampedY = Math.min(Math.max(e.target.y(), minY), maxY);
            const snappedX = snapToGrid(pixelsToMeters(clampedX - roomX));
            const snappedY = snapToGrid(pixelsToMeters(clampedY - roomY));

            let collided = false;

            hangingItems.forEach((otherItem) => {
              if (otherItem.id === item.id) return;
              const round = (n: number) => Math.round(n * 1000) / 1000; // round to millimetre precision

              const leftClear =
                round(snappedX + item.width) <= round(otherItem.x);
              const rightClear =
                round(snappedX) >= round(otherItem.x + otherItem.width);
              const topClear =
                round(snappedY + item.height) <= round(otherItem.y);
              const bottomClear =
                round(snappedY) >= round(otherItem.y + otherItem.height);

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
              updateHangingItemPosition(item.id, snappedX, snappedY);
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
