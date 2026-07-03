import { FurnitureItem, HangingFurnitureItem, Room } from "@/store/roomStore";
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
