import { create } from "zustand";

export type UIStore = {
  step: 1 | 2 | 3 | 4;
  setStep: (step: 1 | 2 | 3 | 4) => void;
  showFloorFurniture: boolean;
  showHangingFurniture: boolean;
  toggleFloorFurniture: () => void;
  toggleHangingFurniture: () => void;
  selectedItemId: string | null;
  selectedItemType: "floor" | "hanging" | "wall" | null;
  setSelectedItem: (
    id: string | null,
    type: "floor" | "hanging" | "wall" | null,
  ) => void;
  selectedWall: "left" | "right" | "top" | "bottom" | null;
  setSelectedWall: (wall: "left" | "right" | "top" | "bottom" | null) => void;
};

export const useUIStore = create<UIStore>((set) => ({
  step: 1,
  setStep: (step) => set({ step }),
  showFloorFurniture: true,
  showHangingFurniture: true,
  toggleFloorFurniture: () =>
    set((state) => ({
      showFloorFurniture: !state.showFloorFurniture,
    })),
  toggleHangingFurniture: () =>
    set((state) => ({
      showHangingFurniture: !state.showHangingFurniture,
    })),
  selectedItemId: null,
  selectedItemType: null,
  setSelectedItem: (id, type) =>
    set({ selectedItemId: id, selectedItemType: type }),
  selectedWall: "top",
  setSelectedWall: (wall) => set({ selectedWall: wall }),
}));
