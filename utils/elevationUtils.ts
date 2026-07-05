import {
  FurnitureItem,
  HangingFurnitureItem,
  Room,
  Wall,
} from "@/store/roomStore";
import { WallKey } from "@/components/WallSelector";
import { round } from "./scale";

export function getItemsOnWall(
  wall: WallKey,
  items: FurnitureItem[],
  hangingItems: HangingFurnitureItem[],
  room: Room,
): { floorItems: FurnitureItem[]; hangingItems: HangingFurnitureItem[] } {
  const furnitureOnWall = items.filter((item) => {
    if (wall === "left") return round(item.x) === 0;
    if (wall === "right")
      return round(item.x + item.width) === round(room.width);
    if (wall === "top") return round(item.y) === 0;
    if (wall === "bottom")
      return round(item.y + item.height) === round(room.height);
  });

  const hangingFurnitureOnWall = hangingItems.filter((item) => {
    if (wall === "left") return round(item.x) === 0;
    if (wall === "right")
      return round(item.x + item.width) === round(room.width);
    if (wall === "top") return round(item.y) === 0;
    if (wall === "bottom")
      return round(item.y + item.height) === round(room.height);
  });

  return {
    floorItems: furnitureOnWall,
    hangingItems: hangingFurnitureOnWall,
  };
}

export function getWallsOnWall(
  wall: WallKey,
  walls: Wall[],
  room: Room,
): Wall[] {
  const wallsOnWall = walls.filter((walll) => {
    if (wall === "top")
      return round(walll.y) === 0 && walll.orientation === "vertical";
    if (wall === "bottom")
      return (
        round(walll.y + walll.length) === round(room.height) &&
        walll.orientation === "vertical"
      );
    if (wall === "left")
      return round(walll.x) === 0 && walll.orientation === "horizontal";
    if (wall === "right")
      return (
        round(walll.x + walll.length) === round(room.width) &&
        walll.orientation === "horizontal"
      );

    return false;
  });

  return wallsOnWall;
}
