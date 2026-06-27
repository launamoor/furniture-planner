import { create } from "zustand";

export type CatalogueItem = {
  id: string;
  width: number;
  height: number;
  name: string;
  colour: string;
  woodType?: string;
};
