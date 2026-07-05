"use client";

import { Stage, Layer, Rect, Line, Text, Group } from "react-konva";
import {
  FurnitureItem,
  HangingFurnitureItem,
  Room,
  Wall,
} from "@/store/roomStore";
import { metersToPixels, WALL_THICKNESS } from "@/utils/scale";
import { WallKey } from "@/components/WallSelector";

// ─── Types ────────────────────────────────────────────────────────────────────

type ElevationCanvasProps = {
  wall: WallKey;
  room: Room;
  floorItems: FurnitureItem[];
  hangingItems: HangingFurnitureItem[];
  wallsOnWall: Wall[];
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

function getWallHorizontalLayout(
  wall: WallKey,
  item: Wall,
): { posM: number; sizeM: number } {
  return wall === "left" || wall === "right"
    ? { posM: item.y, sizeM: WALL_THICKNESS }
    : { posM: item.x, sizeM: WALL_THICKNESS };
}

// ─── ElevationCanvas ──────────────────────────────────────────────────────────

export default function ElevationCanvas({
  wall,
  room,
  wallsOnWall,
  floorItems,
  hangingItems,
  width,
  height,
}: ElevationCanvasProps) {
  const PADDING = 0; // px padding

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

        {Array.from({ length: Math.ceil(wallLengthM / 0.1) }, (_, i) => {
          const x = originX + toPixels(i * 0.1);
          const isMajor = i % 10 === 0;
          return (
            <Line
              key={`v-${i}`}
              points={[x, originY, x, originY + roomPxHeight]}
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

        {wallsOnWall.map((wallItem) => {
          const { posM, sizeM } = getWallHorizontalLayout(wall, wallItem);
          const x = originX + toPixels(posM);
          const mirroredX =
            wall === "left" || wall === "bottom"
              ? originX + roomPxWidth - toPixels(posM + sizeM)
              : x;
          const w = toPixels(sizeM);

          return (
            <Rect
              key={wallItem.id}
              x={mirroredX}
              y={originY}
              width={w}
              height={roomPxHeight}
              fill="#2c2419"
            />
          );
        })}

        {/* ── Floor furniture ── */}
        {floorItems.map((item) => {
          const { posM, sizeM } = getHorizontalLayout(wall, item);
          const floorOffsetM = (item.floorOffsetCm ?? 0) / 100;
          const heightM = item.heightCm / 100;

          const x = originX + toPixels(posM);
          const mirroredX =
            wall === "left" || wall === "bottom"
              ? originX + roomPxWidth - toPixels(posM + sizeM)
              : x;
          const y = originY + roomPxHeight - toPixels(floorOffsetM + heightM);
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
                verticalAlign="bottom"
                ellipsis
                wrap="none"
              />
              <Text
                x={mirroredX}
                y={y + 1}
                width={w - 4}
                height={h - 4}
                text={`${metersToPixels(item.width)}cm`}
                fontSize={9}
                fill="#2c2419"
                align="center"
                verticalAlign="top"
                ellipsis
                wrap="none"
              />
              <Text
                x={mirroredX + 1}
                y={y}
                width={w - 4}
                height={h - 4}
                text={`${item.heightCm}cm`}
                fontSize={9}
                fill="#2c2419"
                align="left"
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
                verticalAlign="bottom"
                ellipsis
                wrap="none"
              />
              <Text
                x={mirroredX}
                y={y + 1}
                width={w - 4}
                height={h - 4}
                text={`${metersToPixels(item.width)}cm`}
                fontSize={9}
                fill="#2c2419"
                align="center"
                verticalAlign="top"
                ellipsis
                wrap="none"
              />
              <Text
                x={mirroredX + 1}
                y={y}
                width={w - 4}
                height={h - 4}
                text={`${item.heightCm}cm`}
                fontSize={9}
                fill="#2c2419"
                align="left"
                verticalAlign="middle"
                ellipsis
                wrap="none"
              />
            </Group>
          );
        })}

        {/* ── Height label (left side) ── */}
        {/* <Text
          x={0}
          y={originY}
          width={PADDING + 30}
          height={roomPxHeight}
          text={`${room.roomHeightCm}cm`}
          fontSize={8}
          fill="#9c8672"
          align="center"
          verticalAlign="middle"
          rotation={0}
          wrap="nowrap"
        /> */}

        {/* ── Width label (bottom) ── */}
        {/* <Text
          x={originX}
          y={originY + roomPxHeight - 10}
          width={roomPxWidth}
          text={`${Math.round(wallLengthM * 100)}cm`}
          fontSize={8}
          fill="#9c8672"
          align="center"
        /> */}
      </Layer>
    </Stage>
  );
}
