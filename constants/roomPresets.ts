export type RoomPreset = {
  name: string;
  width: number;
  height: number;
};

export const roomPresets: RoomPreset[] = [
  { name: "small", width: 3, height: 3 },
  { name: "medium", width: 5, height: 4 },
  { name: "large", width: 7, height: 6 },
  { name: "extra large", width: 9, height: 7 },
];
