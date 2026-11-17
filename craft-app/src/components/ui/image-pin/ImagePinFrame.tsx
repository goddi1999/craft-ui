import { useRef, type CSSProperties, type ReactNode } from "react";

import { useElementSize } from "@/hooks";
import { cn } from "@/lib/utils";

import type { ImagePinSize } from "./image-pin.types";
import { containSize } from "./image-pin.utils";

export type ImagePinFrameProps = {
  imageSrc: string;
  /** Natural image size; `null` while loading. */
  natural: ImagePinSize | null;
  /** Rendered centred at the fitted size once both the frame and the image are measured. */
  children: (fitted: ImagePinSize) => ReactNode;
  /** Overlay shown instead of `children` (loading, error). */
  fallback?: ReactNode;
  /** Fade the image's edges into the blurred backdrop. Off = hard edge. */
  feather?: boolean;
  className?: string;
};

/** Edge fade width: grows with the image, never thinner than 16px or wider than 96px. */
const FEATHER = "clamp(16px, 9%, 96px)";
const fade = (direction: string) =>
  `linear-gradient(${direction}, transparent, #000 ${FEATHER}, #000 calc(100% - ${FEATHER}), transparent)`;

/** Two fades intersected so all four edges soften and the corners round off. */
const FEATHER_MASK: CSSProperties = {
  maskImage: `${fade("to right")}, ${fade("to bottom")}`,
  maskComposite: "intersect",
  WebkitMaskImage: `${fade("to right")}, ${fade("to bottom")}`,
  WebkitMaskComposite: "source-in",
};

/**
 * A viewport-sized box that always shows the whole image: it fits the sharp image
 * inside (`contain`), fades its edges out, and fills the rest with a heavily
 * blurred copy so the photo melts into its own colours.
 * The frame draws the image; `children` only draw what sits on top of it.
 * Size it with `className` — the default follows the screen height.
 */
export function ImagePinFrame({
  imageSrc,
  natural,
  children,
  fallback,
  feather = true,
  className,
}: ImagePinFrameProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const box = useElementSize(boxRef);
  const fitted = natural && box ? containSize(natural, box) : null;
  const showContent = fitted && fitted.width > 0 && !fallback;

  return (
    <div
      data-slot="image-pin-frame"
      className={cn(
        "relative isolate h-[min(70dvh,52rem)] min-h-72 w-full overflow-hidden rounded-xl bg-muted",
        className,
      )}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          aria-hidden
          draggable={false}
          className="pointer-events-none absolute inset-0 -z-10 size-full scale-125 object-cover blur-[48px] saturate-125 select-none"
        />
      ) : null}

      <div
        ref={boxRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        {showContent ? (
          <div className="relative" style={fitted}>
            <img
              src={imageSrc}
              alt=""
              draggable={false}
              className="pointer-events-none absolute inset-0 size-full select-none"
              style={feather ? FEATHER_MASK : undefined}
            />
            {children(fitted)}
          </div>
        ) : null}
      </div>

      {fallback ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 text-sm text-muted-foreground backdrop-blur-sm">
          {fallback}
        </div>
      ) : null}
    </div>
  );
}
