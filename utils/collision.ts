import { round } from "./scale";

export type Rect = { x: number; y: number; width: number; height: number };

export function rectsOverlap(a: Rect, b: Rect): boolean {
  const leftClear = round(a.x + a.width) <= round(b.x);
  const rightClear = round(a.x) >= round(b.x + b.width);
  const topClear = round(a.y + a.height) <= round(b.y);
  const bottomClear = round(a.y) >= round(b.y + b.height);
  return !(leftClear || rightClear || topClear || bottomClear);
}

export function verticalRangesOverlap(
  aOffset: number,
  aHeight: number,
  bOffset: number,
  bHeight: number,
): boolean {
  return aOffset < bOffset + bHeight && bOffset < aOffset + aHeight;
}
