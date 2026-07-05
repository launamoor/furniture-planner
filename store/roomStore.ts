import { create } from "zustand";
import { WALL_THICKNESS } from "@/utils/scale";

export type FurnitureItem = {
  // Blueprint
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  colour: string;
  name: string;
  woodType?: string;
  heightCm: number;
  floorOffsetCm?: number;
};

export type HangingFurnitureItem = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  colour: string;
  name: string;
  woodType?: string;
  heightCm: number;
  ceilingOffsetCm?: number;
};

export type Room = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  roomHeightCm: number;
};

export type Wall = {
  id: string;
  x: number;
  y: number;
  length: number;
  orientation: "horizontal" | "vertical";
};

export type RoomStore = {
  // Blueprint
  room: Room;
  items: FurnitureItem[]; // Array of Furniture Items
  hangingItems: HangingFurnitureItem[];
  walls: Wall[];
  setRoom: (width: number, height: number, roomHeightCm: number) => void;
  setRoomHeight: (roomHeightCm: number) => void;
  addItem: (item: FurnitureItem) => void; // Function - Adds the Furniture Item to the Store
  addHangingItem: (item: HangingFurnitureItem) => void;
  removeHangingItem: (id: string) => void;
  rotateItem: (id: string) => void; // Function - Rotate the item
  rotateHangingItem: (id: string) => void;
  removeItem: (id: string) => void; // Function. Removes the item
  updateItemPosition: (id: string, x: number, y: number) => void; // Function - updates the Furniture Item's position
  updateHangingItemPosition: (id: string, x: number, y: number) => void;
  addWall: (wall: Wall) => void;
  removeWall: (id: string) => void;
  updateWallPosition: (id: string, x: number, y: number) => void;
  updateHangingItemOffset: (id: string, ceilingOffsetCm: number) => void;
};

export const useRoomStore = create<RoomStore>((set) => ({
  room: {
    id: "1",
    x: 0.2,
    y: 0.2,
    width: 7.6,
    height: 5.6,
    roomHeightCm: 250,
  },
  items: [],
  hangingItems: [],
  walls: [],
  setRoom: (width: number, height: number) =>
    set((state) => ({
      room: { ...state.room, width, height },
      walls: [],
      items: [],
      hangingItems: [],
    })),
  setRoomHeight: (roomHeightCm: number) =>
    set((state) => ({ room: { ...state.room, roomHeightCm } })),
  addItem: (item) =>
    set((state) => {
      if (state.items.length >= 50) return state;

      const newItem: FurnitureItem = {
        ...item,
        id: crypto.randomUUID(),
        x: state.room.width / 2 - item.width / 2,
        y: state.room.height / 2 - item.height / 2,
      };

      return { items: [...state.items, newItem] };
    }),
  addHangingItem: (hangingItem) =>
    set((state) => {
      if (state.hangingItems.length >= 50) return state;

      const newHangingItem: HangingFurnitureItem = {
        ...hangingItem,
        id: crypto.randomUUID(),
        x: state.room.width / 2 - hangingItem.width / 2,
        y: state.room.height / 2 - hangingItem.height / 2,
      };

      return { hangingItems: [...state.hangingItems, newHangingItem] };
    }),
  removeItem: (id: string) =>
    set((state) => ({
      items: [...state.items.filter((item) => item.id !== id)],
    })),
  removeHangingItem: (id: string) =>
    set((state) => ({
      hangingItems: [...state.hangingItems.filter((item) => item.id !== id)],
    })),
  updateItemPosition: (id, x, y) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, x, y } : item,
      ),
    })),
  updateHangingItemPosition: (id, x, y) =>
    set((state) => ({
      hangingItems: state.hangingItems.map((item) =>
        item.id === id ? { ...item, x, y } : item,
      ),
    })),
  rotateItem: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              width: item.height,
              height: item.width,
              x: Math.min(
                Math.max(item.x + (item.width - item.height) / 2, 0),
                state.room.width - item.height,
              ),
              y: Math.min(
                Math.max(item.y + (item.height - item.width) / 2, 0),
                state.room.height - item.width,
              ),
            }
          : item,
      ),
    })),
  rotateHangingItem: (id) =>
    set((state) => ({
      hangingItems: state.hangingItems.map((hangingItem) =>
        hangingItem.id === id
          ? {
              ...hangingItem,
              width: hangingItem.height,
              height: hangingItem.width,
              x: Math.min(
                Math.max(
                  hangingItem.x + (hangingItem.width - hangingItem.height) / 2,
                  0,
                ),
                state.room.width - hangingItem.height,
              ),
              y: Math.min(
                Math.max(
                  hangingItem.y + (hangingItem.height - hangingItem.width) / 2,
                  0,
                ),
                state.room.height - hangingItem.width,
              ),
            }
          : hangingItem,
      ),
    })),
  addWall: (wall) =>
    set((state) => {
      if (state.walls.length >= 20) return state;

      const newWall: Wall = {
        ...wall,
        id: crypto.randomUUID(),
        x:
          state.room.width / 2 -
          (wall.orientation === "horizontal"
            ? wall.length / 2
            : WALL_THICKNESS / 2),
        y:
          state.room.height / 2 -
          (wall.orientation === "vertical"
            ? wall.length / 2
            : WALL_THICKNESS / 2),
      };

      return { walls: [...state.walls, newWall] };
    }),
  removeWall: (id: string) =>
    set((state) => ({
      walls: [...state.walls.filter((wall) => wall.id !== id)],
    })),
  updateWallPosition: (id, x, y) =>
    set((state) => ({
      walls: state.walls.map((wall) =>
        wall.id === id ? { ...wall, x, y } : wall,
      ),
    })),
  updateHangingItemOffset: (id: string, ceilingOffsetCm: number) =>
    set((state) => ({
      hangingItems: state.hangingItems.map((item) =>
        item.id === id ? { ...item, ceilingOffsetCm } : item,
      ),
    })),
}));
