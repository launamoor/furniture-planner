import { create } from "zustand";
import { WALL_THICKNESS } from "@/utils/scale";

export type FurnitureItem = {
  // Blueprint
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  colour: string;
  name: string;
  woodType?: string;
};

export type Room = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
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
  walls: Wall[];
  setRoom: (width: number, height: number) => void;
  addItem: (item: FurnitureItem) => void; // Function - Adds the Furniture Item to the Store
  rotateItem: (id: string) => void; // Function - Rotate the item
  removeItem: (id: string) => void; // Function. Removes the item
  updateItemPosition: (id: string, x: number, y: number) => void; // Function - updates the Furniture Item's position
  addWall: (wall: Wall) => void;
  removeWall: (id: string) => void;
  updateWallPosition: (id: string, x: number, y: number) => void;
};

export const useRoomStore = create<RoomStore>((set) => ({
  room: {
    id: "1",
    x: 0.2,
    y: 0.2,
    width: 7.6,
    height: 5.6,
  },
  items: [],
  walls: [],
  setRoom: (width: number, height: number) =>
    set((state) => ({
      room: { ...state.room, width, height },
    })),
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
  removeItem: (id: string) =>
    set((state) => ({
      items: [...state.items.filter((item) => item.id !== id)],
    })),
  updateItemPosition: (id, x, y) =>
    set((state) => ({
      items: state.items.map((item) =>
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
}));
