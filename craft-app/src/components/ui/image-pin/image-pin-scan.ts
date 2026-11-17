/** Everything about the check scan that a caller may tune. */
export type ImagePinScanOptions = {
  /** Length of the beam's pass over the image, in ms. Zoom time comes on top. */
  duration?: number;
  /** Beam width in px. */
  thickness?: number;
  /** CSS colour or `var()` of the beam. Neutral grey by default. */
  color?: string;
  /** Beam glow radius in px; 0 for a hard line. */
  glow?: number;
  /** Beam speed next to the pin, as a share of normal. 1 = no slow motion. */
  slowMo?: number;
  /** Half-width of the slow stretch around the pin, as a share of the image width. */
  slowZone?: number;
  /** Blur-zoom into the pin just before the beam reaches it, out again after the pass. */
  zoom?: boolean;
  /** How far the image scales around the pin. */
  zoomScale?: number;
  /** Peak blur in px while the image zooms, either way. */
  zoomBlur?: number;
  /** Zoom-in time in ms; it ends as the beam enters the slow stretch. */
  zoomInMs?: number;
  /** Zoom-out time in ms; it starts as the beam leaves the image. */
  zoomOutMs?: number;
};

export const IMAGE_PIN_SCAN_DEFAULTS: Required<ImagePinScanOptions> = {
  duration: 1400,
  thickness: 4,
  color: "var(--color-neutral-400)",
  glow: 8,
  slowMo: 0.25,
  slowZone: 0.12,
  zoom: true,
  zoomScale: 1.5,
  zoomBlur: 4,
  zoomInMs: 380,
  zoomOutMs: 420,
};

export function resolveScan(options?: ImagePinScanOptions): Required<ImagePinScanOptions> {
  return { ...IMAGE_PIN_SCAN_DEFAULTS, ...options };
}

/** Strong ease-in-out for a camera move across the image. */
export const ZOOM_EASING = "cubic-bezier(0.77, 0, 0.175, 1)";
/** Time to settle back when a scan is cut short. */
export const ZOOM_RELEASE_MS = 160;

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

export type ScanTimeline = {
  /** How far through the pass (0..1) the beam is when it sits at image position `x` (0..1). */
  timeAt: (x: number) => number;
  /** Image positions where the slow stretch starts and ends. */
  slow: { from: number; to: number };
};

/**
 * The beam moves at full speed, slows to `slowMo` around the pin, then speeds
 * up again. The whole pass still takes the same total time.
 */
export function scanTimeline(pinX: number, slowMo: number, slowZone: number): ScanTimeline {
  const from = clamp01(pinX - slowZone);
  const to = clamp01(pinX + slowZone);
  const speed = Math.min(1, Math.max(0.05, slowMo));
  const weights = [from, (to - from) / speed, 1 - to];
  const total = weights[0] + weights[1] + weights[2];
  const xs = [0, from, to, 1];
  const ts = [0, weights[0] / total, (weights[0] + weights[1]) / total, 1];

  const timeAt = (x: number) => {
    const at = clamp01(x);
    for (let i = 0; i < 3; i++) {
      if (at > xs[i + 1]) continue;
      const length = xs[i + 1] - xs[i];
      return length > 0 ? ts[i] + ((ts[i + 1] - ts[i]) * (at - xs[i])) / length : ts[i + 1];
    }
    return 1;
  };

  return { timeAt, slow: { from, to } };
}

function at(width: number, t: number): string {
  return `translate3d(${(width * t).toFixed(2)}px, 0, 0)`;
}

/** Beam travel. Opacity only feathers the ends; speed follows the timeline. */
export function beamFrames(width: number, timeline: ScanTimeline): Keyframe[] {
  const stops = [0, 0.06, timeline.slow.from, timeline.slow.to, 0.94, 1]
    .map(clamp01)
    .sort((a, b) => a - b);
  const frames: Keyframe[] = [];
  for (const x of stops) {
    const offset = timeline.timeAt(x);
    const prev = frames[frames.length - 1];
    if (prev && Number(prev.offset) >= offset - 1e-6) continue;
    frames.push({
      offset,
      transform: at(width, x),
      opacity: x > 0 && x < 1 ? 1 : 0,
    });
  }
  frames[frames.length - 1] = { ...frames[frames.length - 1], offset: 1 };
  return frames;
}

/** Result colour, uncovered from the left as the beam crosses the pin. */
export function revealFrames(start: number, end: number, timeline: ScanTimeline): Keyframe[] {
  return wipe(start, end, HIDDEN_RIGHT, OPEN, timeline);
}

/** Neutral colour, covered from the left over the same crossing. */
export function coverFrames(start: number, end: number, timeline: ScanTimeline): Keyframe[] {
  return wipe(start, end, OPEN, HIDDEN_LEFT, timeline);
}

function wipe(
  start: number,
  end: number,
  from: string,
  to: string,
  timeline: ScanTimeline,
): Keyframe[] {
  const openAt = timeline.timeAt(start);
  const shutAt = Math.min(1, Math.max(openAt + 0.0001, timeline.timeAt(end)));
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

/** Scale between two sizes; the blur peaks mid-move and is gone on arrival. */
export function zoomFrames(from: number, to: number, blur: number): Keyframe[] {
  return [
    { offset: 0, transform: `scale(${from})`, filter: "blur(0px)" },
    { offset: 0.4, filter: `blur(${blur}px)` },
    { offset: 1, transform: `scale(${to})`, filter: "blur(0px)" },
  ];
}
