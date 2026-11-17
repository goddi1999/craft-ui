/** A full-width read of the photo. Long enough that the beam meeting the pin is visible. */
export const SCAN_MS = 900;

const OPEN = "inset(0 0 0 0)";
const HIDDEN_RIGHT = "inset(0 100% 0 0)";
const HIDDEN_LEFT = "inset(0 0 0 100%)";

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Where the pin sits along the scan, as fractions of the image width. */
export function pinWindow(pinX: number, imageWidth: number, pinSize: number) {
  const half = pinSize / 2 / Math.max(imageWidth, 1);
  return {
    start: clamp01(pinX - half),
    end: clamp01(pinX + half),
  };
}

function at(width: number, t: number): string {
  return `translate3d(${(width * t).toFixed(2)}px, 0, 0)`;
}

/** Beam travel. Opacity only feathers the ends; position stays linear with time. */
export function beamFrames(width: number): Keyframe[] {
  return [
    { offset: 0, transform: at(width, 0), opacity: 0 },
    { offset: 0.06, transform: at(width, 0.06), opacity: 1 },
    { offset: 0.94, transform: at(width, 0.94), opacity: 1 },
    { offset: 1, transform: at(width, 1), opacity: 0 },
  ];
}

/** Result colour, uncovered from the left as the beam crosses the pin. */
export function revealFrames(start: number, end: number): Keyframe[] {
  return wipe(start, end, HIDDEN_RIGHT, OPEN);
}

/** Neutral colour, covered from the left over the same crossing. */
export function coverFrames(start: number, end: number): Keyframe[] {
  return wipe(start, end, OPEN, HIDDEN_LEFT);
}

function wipe(start: number, end: number, from: string, to: string): Keyframe[] {
  const openAt = clamp01(start);
  const shutAt = Math.min(1, Math.max(openAt + 0.0001, end));
  const frames: Keyframe[] = [
    { offset: 0, clipPath: from },
    { offset: openAt, clipPath: from },
    { offset: shutAt, clipPath: to },
    { offset: 1, clipPath: to },
  ];
  const kept: Keyframe[] = [];
  for (const frame of frames) {
    const prev = kept[kept.length - 1];
    const offset = Number(frame.offset);
    if (prev && Number(prev.offset) >= offset - 1e-6) {
      kept[kept.length - 1] = frame;
      continue;
    }
    kept.push(frame);
  }
  if (kept.length === 1) kept.push({ ...kept[0], offset: 1 });
  return kept;
}
