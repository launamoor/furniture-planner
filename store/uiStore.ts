import { create } from "zustand";

export type UIStore = {
  step: 1 | 2 | 3;
  setStep: (step: 1 | 2 | 3) => void;
};

export const useUIStore = create<UIStore>((set) => ({
  step: 1,
  setStep: (step) => set({ step }),
}));
