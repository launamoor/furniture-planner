const SCALE = 100;

const GRID_SIZE = 0.1;

export const WALL_THICKNESS = 0.1;

export const GRID_STEP = 10;

export const round = (n: number) => Math.round(n * 1000) / 1000; // round to millimetre precision

export function metersToPixels(meters: number): number {
  return meters * SCALE;
}

export function pixelsToMeters(pixels: number): number {
  return pixels / SCALE;
}

export function snapToGrid(position: number): number {
  const newPosition = Math.round(position / GRID_SIZE) * GRID_SIZE;
  return newPosition;
}
