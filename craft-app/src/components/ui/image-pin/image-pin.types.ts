export type ImagePinShape = "rectangle" | "circle";

/**
 * A target region in the image's natural pixel space.
 *
 * A `'circle'` is stored as the inscribed circle of a SQUARE bbox (`width === height`);
 * its centre is `(x + width / 2, y + height / 2)` and its radius is `width / 2`.
 */
export type ImagePinRegion = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  /** Absent = rectangle. */
  shape?: ImagePinShape;
  /** Text drawn in the region. Defaults to its 1-based number. */
  label?: string;
};

/** Pin centre in 0..1 image coordinates. */
export type ImagePinPoint = { x: number; y: number };

export type ImagePinSize = { width: number; height: number };

/** One image in `ImagePinLibrary`. */
export type ImagePinLibraryImage = {
  id: string;
  src: string;
  /** Smaller file for the strip; falls back to `src`. */
  thumbnail?: string;
  alt: string;
  caption?: string;
  /** Intrinsic size; the preview uses it to fit the image. */
  width: number;
  height: number;
};
