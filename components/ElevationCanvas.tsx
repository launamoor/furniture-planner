"use client";

import { Stage, Layer, Rect, Line, Text, Group } from "react-konva";
import { FurnitureItem, HangingFurnitureItem, Room } from "@/store/roomStore";
import { metersToPixels } from "@/utils/scale";
import { WallKey } from "@/components/WallSelector";
import GridLines from "./GridLines";

// ─── Types ────────────────────────────────────────────────────────────────────

type ElevationCanvasProps = {
  wall: WallKey;
  room: Room;
  floorItems: FurnitureItem[];
  hangingItems: HangingFurnitureItem[];
  width: number; // canvas pixel width
  height: number; // canvas pixel height
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the wall length in metres depending on which wall is selected */
function getWallLengthM(wall: WallKey, room: Room): number {
  return wall === "left" || wall === "right" ? room.height : room.width;
}

/**
 * For a given wall, returns the item's horizontal position and size
 * in the elevation view (in metres).
 */
function getHorizontalLayout(
  wall: WallKey,
  item: FurnitureItem | HangingFurnitureItem,
): { posM: number; sizeM: number } {
  if (wall === "left" || wall === "right") {
    return { posM: item.y, sizeM: item.height };
  }
  return { posM: item.x, sizeM: item.width };
}

// ─── ElevationCanvas ──────────────────────────────────────────────────────────

export default function ElevationCanvas({
  wall,
  room,
  floorItems,
  hangingItems,
  width,
  height,
}: ElevationCanvasProps) {
  const PADDING = 20; // px padding inside canvas

  const roomHeightM = room.roomHeightCm / 100;
  const wallLengthM = getWallLengthM(wall, room);

  // Scale to fit the canvas with padding
  const scaleX = (width - PADDING * 2) / metersToPixels(wallLengthM);
  const scaleY = (height - PADDING * 2) / metersToPixels(roomHeightM);
  const scale = Math.min(scaleX, scaleY);

  const toPixels = (metres: number) => metersToPixels(metres) * scale;

  // Canvas origin — top left corner of the room face
  const originX = PADDING;
  const originY = PADDING;

  const roomPxWidth = toPixels(wallLengthM);
  const roomPxHeight = toPixels(roomHeightM);

  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* ── Room background ── */}
        <Rect
          x={originX}
          y={originY}
          width={roomPxWidth}
          height={roomPxHeight}
          fill="#f5f0eb"
          stroke="#2c2419"
          strokeWidth={1.5}
        />

        {/* Grid Lines */}
        {Array.from({ length: Math.ceil(roomHeightM / 0.1) }, (_, i) => {
          const y = originY + roomPxHeight - toPixels(i * 0.1);
          const isMajor = i % 10 === 0;
          return (
            <Line
              key={`h-${i}`}
              points={[originX, y, originX + roomPxWidth, y]}
              stroke="#999"
              strokeWidth={isMajor ? 0.3 : 0.1}
            />
          );
        })}

        {/* ── Floor line ── */}
        <Line
          points={[
            originX,
            originY + roomPxHeight,
            originX + roomPxWidth,
            originY + roomPxHeight,
          ]}
          stroke="#2c2419"
          strokeWidth={2}
        />

        {/* ── Floor furniture ── */}
        {floorItems.map((item) => {
          const { posM, sizeM } = getHorizontalLayout(wall, item);
          const floorOffsetM = (item.floorOffsetCm ?? 0) / 100;
          const heightM = item.heightCm / 100;

          const x = originX + toPixels(posM);
          const mirrorexX =
            wall === "left" || wall === "bottom"
              ? originX + roomPxWidth - toPixels(posM + sizeM)
              : x;
          const y = originY + roomPxHeight - toPixels(floorOffsetM + heightM);
          const w = toPixels(sizeM);
          const h = toPixels(heightM);

          return (
            <Group key={item.id}>
              <Rect
                x={mirrorexX}
                y={y}
                width={w}
                height={h}
                fill={item.colour}
                stroke="#2c2419"
                strokeWidth={0.5}
              />
              {/* Cross lines */}
              <Line
                points={[mirrorexX, y, mirrorexX + w, y + h]}
                stroke="#2c2419"
                strokeWidth={0.3}
              />
              <Line
                points={[mirrorexX + w, y, mirrorexX, y + h]}
                stroke="#2c2419"
                strokeWidth={0.3}
              />
              {/* Label */}
              <Text
                x={mirrorexX + 2}
                y={y + 2}
                width={w - 4}
                height={h - 4}
                text={item.name}
                fontSize={9}
                fill="#2c2419"
                align="center"
                verticalAlign="middle"
                ellipsis
                wrap="none"
              />
            </Group>
          );
        })}

        {/* ── Hanging furniture ── */}
        {hangingItems.map((item) => {
          const { posM, sizeM } = getHorizontalLayout(wall, item);
          const ceilingOffsetM = (item.ceilingOffsetCm ?? 0) / 100;
          const heightM = item.heightCm / 100;

          const x = originX + toPixels(posM);
          const mirroredX =
            wall === "left" || wall === "bottom"
              ? originX + roomPxWidth - toPixels(posM + sizeM)
              : x;
          const y = originY + toPixels(ceilingOffsetM);
          const w = toPixels(sizeM);
          const h = toPixels(heightM);

          return (
            <Group key={item.id}>
              <Rect
                x={mirroredX}
                y={y}
                width={w}
                height={h}
                fill={item.colour}
                stroke="#2c2419"
                strokeWidth={0.5}
                dash={[4, 2]}
              />
              {/* Cross lines */}
              <Line
                points={[mirroredX, y, mirroredX + w, y + h]}
                stroke="#2c2419"
                strokeWidth={0.3}
              />
              <Line
                points={[mirroredX + w, y, mirroredX, y + h]}
                stroke="#2c2419"
                strokeWidth={0.3}
              />
              {/* Label */}
              <Text
                x={mirroredX + 2}
                y={y + 2}
                width={w - 4}
                height={h - 4}
                text={item.name}
                fontSize={9}
                fill="#2c2419"
                align="center"
                verticalAlign="middle"
                ellipsis
                wrap="none"
              />
            </Group>
          );
        })}

        {/* ── Height label (left side) ── */}
        <Text
          x={0}
          y={originY}
          width={PADDING - 2}
          height={roomPxHeight}
          text={`${room.roomHeightCm}cm`}
          fontSize={8}
          fill="#9c8672"
          align="center"
          verticalAlign="middle"
          rotation={0}
        />

        {/* ── Width label (bottom) ── */}
        <Text
          x={originX}
          y={originY + roomPxHeight + 4}
          width={roomPxWidth}
          text={`${Math.round(wallLengthM * 100)}cm`}
          fontSize={8}
          fill="#9c8672"
          align="center"
        />
      </Layer>
    </Stage>
  );
}
