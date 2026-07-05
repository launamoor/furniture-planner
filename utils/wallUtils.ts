import { Wall } from "@/store/roomStore";
import { WALL_THICKNESS } from "./scale";
import { Rect } from "./collision";

export function getWallRect(wall: Wall): Rect {
  return wall.orientation === "horizontal"
    ? { x: wall.x, y: wall.y, width: wall.length, height: WALL_THICKNESS }
    : { x: wall.x, y: wall.y, width: WALL_THICKNESS, height: wall.length };
}
