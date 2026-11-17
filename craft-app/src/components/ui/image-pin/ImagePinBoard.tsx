import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import useImage from "use-image";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

import { ImagePin } from "./ImagePin";
import { ImagePinFrame } from "./ImagePinFrame";
import type { ImagePinPoint, ImagePinRegion } from "./image-pin.types";
import {
  clamp01,
  findHitRegion,
  resolveImagePinShape,
} from "./image-pin.utils";

export type ImagePinBoardProps = {
  imageSrc: string;
  regions: readonly ImagePinRegion[];
  /** Pin centre in 0..1 image space; null = the pin waits in the dock. */
  pin: ImagePinPoint | null;
  onPinChange: (next: ImagePinPoint | null) => void;
  /** Draw the target regions over the image (a debug view; learners never see them). */
  showRegions?: boolean;
  /** Colour the pin blue on a hit, red on a miss. Off = neutral pin. */
  showResult?: boolean;
  /** Hint next to the docked pin. */
  dockLabel?: string;
  /** Sizes the image frame; defaults to a screen-height box. */
  frameClassName?: string;
  /** Round X on the frame that removes the image. */
  onImageRemove?: () => void;
  className?: string;
};

const PIN_SIZE = 24;
/** On touch the pin rides above the finger so the learner can see where it lands. */
const TOUCH_LIFT_PX = 36;
const KEY_STEP = 0.01;
const KEY_STEP_LARGE = 0.05;

type Drag = {
  clientX: number;
  clientY: number;
  lift: number;
  /** Whether the lifted pin is over the image right now. */
  overImage: boolean;
};

/** Client point → 0..1 point inside `element`, or null when it falls outside. */
function toElementPoint(
  element: HTMLElement | null,
  clientX: number,
  clientY: number,
): ImagePinPoint | null {
  const box = element?.getBoundingClientRect();
  if (!box || box.width === 0 || box.height === 0) return null;
  const x = (clientX - box.left) / box.width;
  const y = (clientY - box.top) / box.height;
  if (x < 0 || x > 1 || y < 0 || y > 1) return null;
  return { x, y };
}

/**
 * Play surface: drag the pin from the dock and drop it on the image. Drag a placed
 * pin to move it, or drop it outside the image to send it back to the dock.
 * Keyboard: Enter on the docked pin places it in the centre; arrows nudge
 * (Shift = bigger steps); Escape or Delete returns it to the dock.
 * Hit testing uses the pin centre against each region's real shape.
 */
export function ImagePinBoard({
  imageSrc,
  regions,
  pin,
  onPinChange,
  showRegions = false,
  showResult = true,
  dockLabel = "Drag the pin onto the image",
  frameClassName,
  onImageRemove,
  className,
}: ImagePinBoardProps) {
  const [image, status] = useImage(imageSrc);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<Drag | null>(null);

  const natural = image
    ? { width: image.naturalWidth, height: image.naturalHeight }
    : null;
  const hit = pin && natural ? findHitRegion(pin, regions, natural) : null;
  const variant =
    !pin || !showResult || drag ? "default" : hit ? "correct" : "wrong";

  const overImage = drag?.overImage ?? false;
  const lift = drag?.lift ?? 0;
  const isDragging = drag !== null;

  // Window listeners keep the drag alive after the dock pin swaps out from under the pointer.
  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (event: globalThis.PointerEvent) =>
      setDrag({
        clientX: event.clientX,
        clientY: event.clientY,
        lift,
        overImage:
          toElementPoint(
            surfaceRef.current,
            event.clientX,
            event.clientY - lift,
          ) !== null,
      });
    const handleUp = (event: globalThis.PointerEvent) => {
      onPinChange(
        toElementPoint(surfaceRef.current, event.clientX, event.clientY - lift),
      );
      setDrag(null);
    };
    const handleCancel = () => setDrag(null);
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleCancel);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleCancel);
    };
  }, [isDragging, lift, onPinChange]);

  const handlePinPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.focus();
    setDrag({
      clientX: event.clientX,
      clientY: event.clientY,
      lift: event.pointerType === "touch" ? TOUCH_LIFT_PX : 0,
      overImage: pin !== null,
    });
  };

  const handlePinKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!pin) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onPinChange({ x: 0.5, y: 0.5 });
      }
      return;
    }
    if (
      event.key === "Escape" ||
      event.key === "Delete" ||
      event.key === "Backspace"
    ) {
      event.preventDefault();
      onPinChange(null);
      return;
    }
    const step = event.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const move = delta[event.key];
    if (!move) return;
    event.preventDefault();
    onPinChange({ x: clamp01(pin.x + move[0]), y: clamp01(pin.y + move[1]) });
  };

  const pinButtonProps = {
    type: "button" as const,
    onPointerDown: handlePinPointerDown,
    onKeyDown: handlePinKeyDown,
    className:
      "touch-none rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  };

  const fallback =
    status === "loading" ? (
      <Spinner variant="gray" size="sm" speed={1750} />
    ) : status === "failed" ? (
      "Image could not be loaded"
    ) : null;

  return (
    <div
      data-slot="image-pin-board"
      className={cn("flex w-full flex-col gap-3", className)}
    >
      <ImagePinFrame
        imageSrc={imageSrc}
        natural={natural}
        fallback={fallback}
        onRemove={onImageRemove}
        className={cn(
          "transition-[box-shadow] duration-150",
          overImage &&
            "ring-2 ring-primary ring-offset-2 ring-offset-background",
          frameClassName,
        )}
      >
        {() => (
          <div ref={surfaceRef} className="absolute inset-0 select-none">
            {showRegions && natural ? (
              <svg
                aria-hidden
                className="pointer-events-none absolute inset-0 size-full"
                viewBox={`0 0 ${natural.width} ${natural.height}`}
                preserveAspectRatio="none"
              >
                {regions.map((region) => {
                  const isHit = hit?.id === region.id;
                  const common = {
                    fill: isHit
                      ? "rgba(96, 165, 250, 0.25)"
                      : "rgba(186, 213, 228, 0.18)",
                    stroke: isHit ? "#2563EB" : "#4D4DFF",
                    strokeWidth: 2,
                    strokeDasharray: "6 6",
                    vectorEffect: "non-scaling-stroke" as const,
                  };
                  return resolveImagePinShape(region) === "circle" ? (
                    <circle
                      key={region.id}
                      cx={region.x + region.width / 2}
                      cy={region.y + region.width / 2}
                      r={region.width / 2}
                      {...common}
                    />
                  ) : (
                    <rect
                      key={region.id}
                      x={region.x}
                      y={region.y}
                      width={region.width}
                      height={region.height}
                      rx={8}
                      {...common}
                    />
                  );
                })}
              </svg>
            ) : null}

            {pin && !drag ? (
              <button
                {...pinButtonProps}
                aria-label="Pin on the image. Arrow keys move it, Escape returns it to the dock."
                className={cn(pinButtonProps.className, "absolute cursor-grab")}
                style={{
                  left: `${pin.x * 100}%`,
                  top: `${pin.y * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <ImagePin variant={variant} size={PIN_SIZE} />
              </button>
            ) : null}
          </div>
        )}
      </ImagePinFrame>

      {imageSrc ? (
        <div
          data-slot="image-pin-dock"
          className="flex items-center gap-3 self-center rounded-full border border-dashed border-muted-foreground/30 bg-muted/40 py-2 pr-4 pl-2"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-background shadow-sm">
            {!pin && !drag ? (
              <button
                {...pinButtonProps}
                aria-label="Pin. Drag it onto the image, or press Enter to place it in the centre."
                className={cn(pinButtonProps.className, "cursor-grab")}
              >
                <ImagePin size={PIN_SIZE} />
              </button>
            ) : null}
          </span>
          <span className="text-sm text-muted-foreground">
            {pin ? "Drag the pin off the image to return it here" : dockLabel}
          </span>
        </div>
      ) : null}

      {drag ? (
        <div
          aria-hidden
          className="pointer-events-none fixed z-50 cursor-grabbing"
          style={{
            left: drag.clientX,
            top: drag.clientY - drag.lift,
            transform: "translate(-50%, -50%) scale(1.15)",
          }}
        >
          <ImagePin
            size={PIN_SIZE}
            className={cn(!overImage && "opacity-70")}
          />
        </div>
      ) : null}
    </div>
  );
}
