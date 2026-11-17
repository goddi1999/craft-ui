import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { useReducedMotion } from "motion/react";
import useImage from "use-image";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

import { ImagePin } from "./ImagePin";
import {
  ZOOM_EASING,
  ZOOM_RELEASE_MS,
  beamFrames,
  coverFrames,
  pinWindow,
  resolveScan,
  revealFrames,
  scanTimeline,
  zoomFrames,
  type ImagePinScanOptions,
} from "./image-pin-scan";
import { ImagePinDock } from "./ImagePinDock";
import { ImagePinFrame } from "./ImagePinFrame";
import {
  REGION_CORNER_RADIUS,
  REGION_DASH,
  REGION_FILL,
  REGION_FILL_SELECTED,
  REGION_STROKE_IDLE,
  REGION_STROKE_SELECTED,
  REGION_STROKE_WIDTH_ACTIVE,
  REGION_STROKE_WIDTH_IDLE,
} from "./image-pin.region-style";
import type { ImagePinPoint, ImagePinRegion } from "./image-pin.types";
import {
  clamp01,
  findHitRegion,
  resolveImagePinShape,
  toElementPoint,
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
  /**
   * Bump to sweep a beam left to right. The pin stays neutral until the beam
   * crosses it, then turns blue on a hit and red on a miss. Omit to colour at once.
   */
  checkSignal?: number;
  /** Fires when the beam reaches the pin. */
  onChecked?: () => void;
  /** Fires when the beam has left the image. */
  onScanEnd?: () => void;
  /** Beam look, timing and the blur-zoom around the pin; see `ImagePinScanOptions`. */
  scan?: ImagePinScanOptions;
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

/** Cuts a running zoom short: settles from wherever it is back to the resting size. */
function releaseZoom(node: HTMLElement, running: Animation[]) {
  const from = getComputedStyle(node).transform;
  running.forEach((anim) => anim.cancel());
  if (from === "none") return;
  node.animate([{ transform: from }, { transform: "none" }], {
    duration: ZOOM_RELEASE_MS,
    easing: "ease-out",
  });
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
  checkSignal,
  onChecked,
  onScanEnd,
  scan,
  dockLabel = "Drag the pin onto the image",
  frameClassName,
  onImageRemove,
  className,
}: ImagePinBoardProps) {
  const [image, status] = useImage(imageSrc);
  const reduced = useReducedMotion() ?? false;
  const surfaceRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLSpanElement>(null);
  const neutralRef = useRef<HTMLSpanElement>(null);
  const pinRef = useRef(pin);
  const onCheckedRef = useRef(onChecked);
  const onScanEndRef = useRef(onScanEnd);
  const options = resolveScan(scan);
  const optionsRef = useRef(options);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [run, setRun] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const seenPin = useRef<string | null>(null);
  const seenSignal = useRef(checkSignal ?? 0);

  pinRef.current = pin;
  onCheckedRef.current = onChecked;
  onScanEndRef.current = onScanEnd;
  optionsRef.current = options;

  const natural = image
    ? { width: image.naturalWidth, height: image.naturalHeight }
    : null;
  const hit = pin && natural ? findHitRegion(pin, regions, natural) : null;
  const waits = checkSignal !== undefined;
  const scanning = run > 0 && !revealed && !reduced;
  const variant =
    !pin || !showResult || drag || (waits && !revealed)
      ? "default"
      : hit
        ? "correct"
        : "wrong";

  const pinKey = pin ? `${pin.x}:${pin.y}` : "";

  useEffect(() => {
    if (seenPin.current === null) {
      seenPin.current = pinKey;
      return;
    }
    if (seenPin.current === pinKey) return;
    seenPin.current = pinKey;
    setRevealed(false);
    setRun(0);
  }, [pinKey]);

  useEffect(() => {
    if (checkSignal === undefined || checkSignal === seenSignal.current) return;
    seenSignal.current = checkSignal;
    if (!pinRef.current || checkSignal === 0) return;
    setRevealed(false);
    setRun(checkSignal);
  }, [checkSignal]);

  useLayoutEffect(() => {
    if (!run) return;
    const point = pinRef.current;
    const surface = surfaceRef.current;
    let cancelled = false;
    const tell = (fn: (() => void) | undefined) => {
      if (!cancelled) fn?.();
    };

    if (!point || !surface) {
      tell(onScanEndRef.current);
      return;
    }

    if (reduced) {
      if (showResult) setRevealed(true);
      tell(onCheckedRef.current);
      tell(onScanEndRef.current);
      return;
    }

    const beam = beamRef.current;
    const width = surface.clientWidth;
    if (!beam || width <= 0) {
      if (showResult) setRevealed(true);
      tell(onCheckedRef.current);
      tell(onScanEndRef.current);
      return;
    }

    const o = optionsRef.current;
    const timeline = scanTimeline(point.x, o.slowMo, o.slowZone);
    const content = o.zoom ? zoomRef.current : null;
    const zoomIn = content ? o.zoomInMs : 0;
    // The pass waits just long enough that the zoom-in ends as the beam reaches the slow stretch.
    const lead = Math.max(0, zoomIn - timeline.timeAt(timeline.slow.from) * o.duration);
    const timing: KeyframeAnimationOptions = {
      duration: o.duration,
      delay: lead,
      easing: "linear",
      fill: "both",
    };

    const beamAnim = beam.animate(beamFrames(width, timeline), timing);
    const band = pinWindow(point.x, width, PIN_SIZE);
    const resultAnim = resultRef.current?.animate(
      revealFrames(band.start, band.end, timeline),
      timing,
    );
    const neutralAnim = neutralRef.current?.animate(
      coverFrames(band.start, band.end, timeline),
      timing,
    );
    if (beamAnim.startTime != null) {
      if (resultAnim) resultAnim.startTime = beamAnim.startTime;
      if (neutralAnim) neutralAnim.startTime = beamAnim.startTime;
    }

    const zoomAnims: Animation[] = [];
    if (content) {
      content.style.transformOrigin = `${point.x * 100}% ${point.y * 100}%`;
      zoomAnims.push(
        content.animate(zoomFrames(1, o.zoomScale, o.zoomBlur), {
          duration: o.zoomInMs,
          delay: lead + timeline.timeAt(timeline.slow.from) * o.duration - o.zoomInMs,
          easing: ZOOM_EASING,
          fill: "both",
        }),
      );
    }

    const timer = window.setTimeout(
      () => tell(onCheckedRef.current),
      lead + timeline.timeAt(point.x) * o.duration,
    );
    beamAnim.onfinish = () => {
      if (cancelled) return;
      if (showResult) setRevealed(true);
      tell(onScanEndRef.current);
      if (!content) return;
      const out = content.animate(zoomFrames(o.zoomScale, 1, o.zoomBlur), {
        duration: o.zoomOutMs,
        easing: ZOOM_EASING,
      });
      zoomAnims.forEach((anim) => anim.cancel());
      zoomAnims.length = 0;
      zoomAnims.push(out);
      out.onfinish = () => out.cancel();
    };

    return () => {
      cancelled = true;
      beamAnim.cancel();
      resultAnim?.cancel();
      neutralAnim?.cancel();
      window.clearTimeout(timer);
      if (content) releaseZoom(content, zoomAnims);
    };
  }, [run, reduced, showResult]);

  useEffect(() => {
    if (!drag || run === 0) return;
    setRun(0);
    setRevealed(false);
    onScanEndRef.current?.();
  }, [drag, run]);

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
        contentRef={zoomRef}
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
                      ? REGION_FILL_SELECTED
                      : REGION_FILL,
                    stroke: isHit ? REGION_STROKE_SELECTED : REGION_STROKE_IDLE,
                    strokeWidth: isHit
                      ? REGION_STROKE_WIDTH_ACTIVE
                      : REGION_STROKE_WIDTH_IDLE,
                    strokeDasharray: REGION_DASH.join(" "),
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
                      rx={REGION_CORNER_RADIUS}
                      {...common}
                    />
                  );
                })}
              </svg>
            ) : null}

            {pin && !drag ? (
              <button
                {...pinButtonProps}
                aria-label={
                  revealed && showResult
                    ? hit
                      ? "Pin on the image, on a region. Arrow keys move it, Escape returns it to the dock."
                      : "Pin on the image, outside every region. Arrow keys move it, Escape returns it to the dock."
                    : "Pin on the image. Arrow keys move it, Escape returns it to the dock."
                }
                className={cn(pinButtonProps.className, "absolute cursor-grab")}
                style={{
                  left: `${pin.x * 100}%`,
                  top: `${pin.y * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {scanning && showResult ? (
                  <>
                    <span ref={neutralRef} className="relative block">
                      <ImagePin pulse={false} size={PIN_SIZE} />
                    </span>
                    <span
                      ref={resultRef}
                      className="absolute inset-0"
                      style={{ clipPath: "inset(0 100% 0 0)" }}
                    >
                      <ImagePin
                        pulse={false}
                        variant={hit ? "correct" : "wrong"}
                        size={PIN_SIZE}
                      />
                    </span>
                  </>
                ) : (
                  <ImagePin variant={variant} size={PIN_SIZE} />
                )}
              </button>
            ) : null}

            {scanning ? (
              <div
                ref={beamRef}
                aria-hidden
                data-slot="image-pin-scan"
                className="pointer-events-none absolute top-0 left-0 z-10 h-full"
                style={{
                  opacity: 0,
                  width: options.thickness,
                  marginLeft: -options.thickness / 2,
                  background: `linear-gradient(to bottom, transparent 8%, ${options.color} 28%, ${options.color} 72%, transparent 92%)`,
                  boxShadow:
                    options.glow > 0 ? `0 0 ${options.glow}px ${options.color}` : undefined,
                }}
              />
            ) : null}
          </div>
        )}
      </ImagePinFrame>

      {imageSrc ? (
        <ImagePinDock
          label={
            pin ? "Drag the pin off the image to return it here" : dockLabel
          }
          pin={
            !pin && !drag ? (
              <button
                {...pinButtonProps}
                aria-label="Pin. Drag it onto the image, or press Enter to place it in the centre."
                className={cn(pinButtonProps.className, "cursor-grab")}
              >
                <ImagePin size={PIN_SIZE} />
              </button>
            ) : null
          }
        />
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
