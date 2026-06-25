import { create } from "zustand";

type FurnitureItem = {
  // Blueprint
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  colour: string;
  name: string;
};

type Room = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type RoomStore = {
  // Blueprint
  room: Room;
  items: FurnitureItem[]; // Array of Furniture Items
  addItem: (item: FurnitureItem) => void; // Function - Adds the Furniture Item to the Store
  updateItemPosition: (id: string, x: number, y: number) => void; // Function - updates the Furniture Item's position
};

export const useRoomStore = create<RoomStore>((set) => ({
  room: {
    id: "1",
    x: 0.2,
    y: 0.2,
    width: 7.6,
    height: 5.6,
  },
  items: [
    {
      id: "1",
      x: 1.5,
      y: 1.5,
      width: 0.8,
      height: 0.4,
      colour: "#8B6F47",
      name: "Wardrobe",
    },
    {
      id: "2",
      x: 2.5,
      y: 2,
      width: 0.6,
      height: 0.6,
      colour: "#6F8B47",
      name: "Desk",
    },
    {
      id: "3",
      x: 3.5,
      y: 3,
      width: 1,
      height: 1,
      colour: "#6F8B47",
      name: "Desk",
    },
  ],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItemPosition: (id, x, y) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, x, y } : item,
      ),
    })),
}));
