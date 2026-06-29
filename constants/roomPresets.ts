export type RoomPreset = {
  name: string;
  width: number;
  height: number;
};

export const roomPresets: RoomPreset[] = [
  { name: "mały", width: 3, height: 3 },
  { name: "średni", width: 5, height: 4 },
  { name: "duży", width: 7, height: 6 },
  { name: "XL", width: 9, height: 7 },
];
