"use client";
import { Line, Group, Text } from "react-konva";
import { metersToPixels, pixelsToMeters, GRID_STEP } from "@/utils/scale";
import type { Room } from "@/store/roomStore";

export default function GridLines({ room }: { room: Room }) {
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
      canvasVerticalEnd - metersToPixels(room.x) < metersToPixels(room.width)
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
    <>
      {horizontalLines.map((line, i) => {
        const currentHeight = line[1];
        if ((currentHeight - metersToPixels(room.y)) % 100 === 0) {
          return (
            <Group key={`horizontal: ${i}`}>
              <Line stroke={"#999"} points={line} strokeWidth={0.3} />
              <Text
                x={metersToPixels(room.width) + metersToPixels(room.x) + 2}
                y={line[1] - 5}
                text={`${pixelsToMeters(line[1] - metersToPixels(room.y))}m`}
              />
            </Group>
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
            <Group key={`vertical: ${i}`}>
              <Line stroke={"#999"} points={line} strokeWidth={0.3} />
              <Text
                x={line[0] - 5}
                y={metersToPixels(room.height) + metersToPixels(room.y) + 5}
                text={`${pixelsToMeters(line[0] - metersToPixels(room.x))}m`}
              />
            </Group>
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
    </>
  );
}
