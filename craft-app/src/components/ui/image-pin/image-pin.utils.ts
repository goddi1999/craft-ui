import type {
  ImagePinLibraryImage,
  ImagePinPoint,
  ImagePinRegion,
  ImagePinShape,
  ImagePinSize,
} from "./image-pin.types";

export const IMAGE_PIN_REGION_MIN_SIZE = 24;

/** Region shape with the rectangle default applied — use at every read site. */
export function resolveImagePinShape(region: {
  shape?: ImagePinShape;
}): ImagePinShape {
  return region.shape === "circle" ? "circle" : "rectangle";
}

export function clampRectToImage(
  x: number,
  y: number,
  width: number,
  height: number,
  sceneWidth: number,
  sceneHeight: number,
): Pick<ImagePinRegion, "x" | "y" | "width" | "height"> {
  const w = Math.max(IMAGE_PIN_REGION_MIN_SIZE, Math.min(width, sceneWidth));
  const h = Math.max(IMAGE_PIN_REGION_MIN_SIZE, Math.min(height, sceneHeight));
  const nx = Math.max(0, Math.min(x, sceneWidth - w));
  const ny = Math.max(0, Math.min(y, sceneHeight - h));
  return { x: nx, y: ny, width: w, height: h };
}

/**
 * Clamp a circle's SQUARE bbox inside the scene: enforce the min diameter, cap it
 * at the shorter scene edge so a square always fits, then keep it fully in bounds.
 */
export function clampCircleToImage(
  x: number,
  y: number,
  diameter: number,
  sceneWidth: number,
  sceneHeight: number,
): Pick<ImagePinRegion, "x" | "y" | "width" | "height" | "shape"> {
  const maxDiameter = Math.max(
    IMAGE_PIN_REGION_MIN_SIZE,
    Math.min(sceneWidth, sceneHeight),
  );
  const d = Math.max(
    IMAGE_PIN_REGION_MIN_SIZE,
    Math.min(diameter, maxDiameter),
  );
  const nx = Math.max(0, Math.min(x, sceneWidth - d));
  const ny = Math.max(0, Math.min(y, sceneHeight - d));
  return { x: nx, y: ny, width: d, height: d, shape: "circle" };
}

/** Whether a point in natural pixel space falls inside the region's shape. */
export function isPointInRegion(
  px: number,
  py: number,
  region: ImagePinRegion,
): boolean {
  if (resolveImagePinShape(region) === "circle") {
    const r = region.width / 2;
    const dx = px - (region.x + r);
    const dy = py - (region.y + r);
    return dx * dx + dy * dy <= r * r;
  }
  return (
    px >= region.x &&
    px <= region.x + region.width &&
    py >= region.y &&
    py <= region.y + region.height
  );
}

/** The topmost (last drawn) region under a pin, or null for a miss. */
export function findHitRegion(
  pin: ImagePinPoint,
  regions: readonly ImagePinRegion[],
  image: ImagePinSize,
): ImagePinRegion | null {
  const px = pin.x * image.width;
  const py = pin.y * image.height;
  for (let i = regions.length - 1; i >= 0; i -= 1) {
    if (isPointInRegion(px, py, regions[i])) return regions[i];
  }
  return null;
}

/** Largest size with the image's aspect ratio that fits inside `box` (CSS `object-fit: contain`). */
export function containSize(
  image: ImagePinSize,
  box: ImagePinSize,
): ImagePinSize {
  if (image.width <= 0 || image.height <= 0) return { width: 0, height: 0 };
  const scale = Math.min(box.width / image.width, box.height / image.height);
  return { width: image.width * scale, height: image.height * scale };
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * Turn an image file into a library entry backed by an object URL.
 * The caller owns the URL and revokes it with `URL.revokeObjectURL` when done.
 */
export function readImageFile(file: File): Promise<ImagePinLibraryImage> {
  const src = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () =>
      resolve({
        id: crypto.randomUUID(),
        src,
        alt: file.name,
        caption: file.name,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    image.onerror = () => {
      URL.revokeObjectURL(src);
      reject(new Error(`${file.name} is not a readable image`));
    };
    image.src = src;
  });
}
