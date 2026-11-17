import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Konva from "konva";
import {
  Circle,
  Image as KonvaImage,
  Layer,
  Rect,
  Stage,
  Text,
  Transformer,
} from "react-konva";
import useImage from "use-image";

import { Spinner } from "@/components/ui/spinner";

import { ImagePinFrame } from "./ImagePinFrame";
import type {
  ImagePinRegion,
  ImagePinShape,
  ImagePinSize,
} from "./image-pin.types";
import {
  IMAGE_PIN_REGION_MIN_SIZE,
  clampCircleToImage,
  clampRectToImage,
  resolveImagePinShape,
} from "./image-pin.utils";

const RECT_FILL = "rgba(186, 213, 228, 0.18)";
const RECT_STROKE_SELECTED = "#0000FF";
const RECT_STROKE = "#4D4DFF";
const RECT_CORNER_RADIUS = 8;
const RECT_DASH = [6, 6];
const LABEL_FONT_SIZE = 20;
const LABEL_FONT_COLOR = "#0000FF";

type DraftBox = { sx: number; sy: number; cx: number; cy: number };

/** Calculate text position to center it inside a rectangle */
function getCenteredTextPosition(
  rectX: number,
  rectY: number,
  rectWidth: number,
  rectHeight: number,
  fontSize: number,
): { x: number; y: number } {
  const textWidth = fontSize * 0.6; // Approximate character width
  const x = rectX + (rectWidth - textWidth) / 2;
  const y = rectY + (rectHeight - fontSize) / 2;
  return { x, y };
}

export type ImagePinRegionStageProps = {
  imageSrc: string;
  regions: ImagePinRegion[];
  onRegionsChange: (next: ImagePinRegion[]) => void;
  selectedRegionId: string | null;
  onSelectedRegionIdChange: (id: string | null) => void;
  /** Shape drawn by the next click-drag; absent = rectangle. */
  drawMode?: ImagePinShape;
  onSceneMetrics?: (metrics: ImagePinSize) => void;
  onImageLoadFailed?: (imageSrc: string) => void;
  /** Round X on the frame that removes the image. */
  onImageRemove?: () => void;
  /** Sizes the image frame; defaults to a screen-height box. */
  className?: string;
};

function getScenePointer(stage: Konva.Stage): { x: number; y: number } | null {
  const pos = stage.getPointerPosition();
  if (!pos) return null;
  const scale = stage.scaleX();
  return { x: pos.x / scale, y: pos.y / scale };
}

function pointerToScene(stage: Konva.Stage, clientX: number, clientY: number) {
  const rect = stage.container().getBoundingClientRect();
  const scale = stage.scaleX();
  return {
    x: (clientX - rect.left) / scale,
    y: (clientY - rect.top) / scale,
  };
}

function normalizeDraft(d: DraftBox) {
  const x = Math.min(d.sx, d.cx);
  const y = Math.min(d.sy, d.cy);
  const width = Math.abs(d.cx - d.sx);
  const height = Math.abs(d.cy - d.sy);
  return { x, y, width, height };
}

export function ImagePinRegionStage({
  imageSrc,
  regions,
  onRegionsChange,
  selectedRegionId,
  onSelectedRegionIdChange,
  drawMode = "rectangle",
  onSceneMetrics,
  onImageLoadFailed,
  onImageRemove,
  className,
}: ImagePinRegionStageProps) {
  const [image, status] = useImage(imageSrc);
  const [draft, setDraft] = useState<DraftBox | null>(null);
  const [draftImageSrc, setDraftImageSrc] = useState(imageSrc);
  // Drop an in-progress draft when the image changes (adjust state during render).
  if (draftImageSrc !== imageSrc) {
    setDraftImageSrc(imageSrc);
    setDraft(null);
  }
  /** Last src we reported as failed, so each broken image is reported once. */
  const reportedFailureRef = useRef<string | null>(null);

  const hasImage = image && status === "loaded";
  const isImageLoading = Boolean(imageSrc) && status === "loading";
  const isImageFailed = status === "failed";

  useEffect(() => {
    if (status === "loaded") reportedFailureRef.current = null;
    if (!isImageFailed || !onImageLoadFailed) return;
    if (reportedFailureRef.current === imageSrc) return;
    reportedFailureRef.current = imageSrc;
    const src = imageSrc;
    queueMicrotask(() => onImageLoadFailed(src));
  }, [status, isImageFailed, onImageLoadFailed, imageSrc]);

  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const regionRefs = useRef<Record<string, Konva.Node | null>>({});
  const regionsRef = useRef(regions);

  useEffect(() => {
    regionsRef.current = regions;
  }, [regions]);

  const sceneSize = useMemo(
    () => ({
      width: image?.naturalWidth ?? 1000,
      height: image?.naturalHeight ?? 700,
    }),
    [image],
  );

  useEffect(() => {
    if (!onSceneMetrics) return;
    if (!image?.naturalWidth || !image?.naturalHeight) return;
    const metrics = { width: image.naturalWidth, height: image.naturalHeight };
    queueMicrotask(() => onSceneMetrics(metrics));
  }, [image, onSceneMetrics]);

  useEffect(() => {
    if (!selectedRegionId || !transformerRef.current) return;
    const selectedNode = regionRefs.current[selectedRegionId];
    if (!selectedNode) return;
    transformerRef.current.nodes([selectedNode]);
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedRegionId, regions]);

  const notifyRegionsChange = useCallback(
    (next: ImagePinRegion[]) => {
      queueMicrotask(() => onRegionsChange(next));
    },
    [onRegionsChange],
  );

  const notifySelectedRegionIdChange = useCallback(
    (id: string | null) => {
      queueMicrotask(() => onSelectedRegionIdChange(id));
    },
    [onSelectedRegionIdChange],
  );

  const patchRegion = useCallback(
    (id: string, patch: Partial<ImagePinRegion>) => {
      notifyRegionsChange(
        regions.map((rect) => {
          if (rect.id !== id) return rect;
          const merged = { ...rect, ...patch };
          const c =
            resolveImagePinShape(merged) === "circle"
              ? clampCircleToImage(
                  merged.x,
                  merged.y,
                  merged.width,
                  sceneSize.width,
                  sceneSize.height,
                )
              : clampRectToImage(
                  merged.x,
                  merged.y,
                  merged.width,
                  merged.height,
                  sceneSize.width,
                  sceneSize.height,
                );
          return { ...merged, ...c };
        }),
      );
    },
    [notifyRegionsChange, regions, sceneSize.height, sceneSize.width],
  );

  const draftShape = useMemo(
    () => (draft ? normalizeDraft(draft) : null),
    [draft],
  );

  const selectedShape = useMemo<ImagePinShape>(() => {
    const selected = regions.find((rect) => rect.id === selectedRegionId);
    return selected ? resolveImagePinShape(selected) : "rectangle";
  }, [regions, selectedRegionId]);
  const isCircleSelected = selectedShape === "circle";

  const handleStageMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const target = e.target;
      if (target.getClassName() !== "Image") return;

      const stage = e.target.getStage();
      if (!stage || !image) return;

      const pos = getScenePointer(stage);
      if (!pos) return;
      if (
        pos.x < 0 ||
        pos.x > sceneSize.width ||
        pos.y < 0 ||
        pos.y > sceneSize.height
      )
        return;

      const sx = Math.max(0, Math.min(pos.x, sceneSize.width));
      const sy = Math.max(0, Math.min(pos.y, sceneSize.height));
      notifySelectedRegionIdChange(null);

      const onMove = (ev: MouseEvent) => {
        const st = stageRef.current;
        if (!st) return;
        const p = pointerToScene(st, ev.clientX, ev.clientY);
        const cx = Math.max(0, Math.min(p.x, sceneSize.width));
        const cy = Math.max(0, Math.min(p.y, sceneSize.height));
        setDraft({ sx, sy, cx, cy });
      };

      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        setDraft((current) => {
          if (!current) return null;
          const norm = normalizeDraft(current);
          const isCircle = drawMode === "circle";
          // A circle's diameter is the longer drag axis, so a mostly-1D drag can
          // still yield a valid region — gate on that longer edge, not both.
          const dragExtent = isCircle
            ? Math.max(norm.width, norm.height)
            : null;
          if (isCircle ? dragExtent! < 8 : norm.width < 8 || norm.height < 8)
            return null;
          const clamped = isCircle
            ? clampCircleToImage(
                norm.x,
                norm.y,
                dragExtent!,
                sceneSize.width,
                sceneSize.height,
              )
            : clampRectToImage(
                norm.x,
                norm.y,
                norm.width,
                norm.height,
                sceneSize.width,
                sceneSize.height,
              );
          const id = crypto.randomUUID();
          const newRect: ImagePinRegion = { id, ...clamped };
          queueMicrotask(() => {
            notifyRegionsChange([...regionsRef.current, newRect]);
            notifySelectedRegionIdChange(id);
          });
          return null;
        });
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      setDraft({ sx, sy, cx: sx, cy: sy });
    },
    [
      drawMode,
      image,
      notifyRegionsChange,
      notifySelectedRegionIdChange,
      sceneSize.height,
      sceneSize.width,
    ],
  );

  const fallback = isImageLoading ? (
    <Spinner variant="gray" size="sm" speed={1750} />
  ) : isImageFailed ? (
    "Image could not be loaded"
  ) : null;

  return (
    <ImagePinFrame
      imageSrc={imageSrc}
      natural={hasImage ? sceneSize : null}
      fallback={fallback}
      onRemove={onImageRemove}
      className={className}
    >
      {(fitted) => {
        const stageScale = fitted.width / sceneSize.width;
        return (
          <Stage
            data-slot="image-pin-region-stage"
            ref={stageRef}
            width={fitted.width}
            height={fitted.height}
            scaleX={stageScale}
            scaleY={stageScale}
            onMouseDown={handleStageMouseDown}
          >
            <Layer>
              {hasImage ? (
                <KonvaImage
                  image={image}
                  x={0}
                  y={0}
                  width={sceneSize.width}
                  height={sceneSize.height}
                  // The frame paints the feathered photo; this layer only catches draw clicks.
                  opacity={0}
                />
              ) : null}

              {regions.map((rect, index) => {
                const regionNumber = index + 1;
                const labelPos = getCenteredTextPosition(
                  rect.x,
                  rect.y,
                  rect.width,
                  rect.height,
                  LABEL_FONT_SIZE,
                );

                const shape = resolveImagePinShape(rect);
                const stroke =
                  selectedRegionId === rect.id
                    ? RECT_STROKE_SELECTED
                    : RECT_STROKE;
                const radius = rect.width / 2;

                return (
                  <Fragment key={rect.id}>
                    {shape === "circle" ? (
                      <Circle
                        ref={(node) => {
                          regionRefs.current[rect.id] = node;
                        }}
                        x={rect.x + radius}
                        y={rect.y + radius}
                        radius={radius}
                        fill={RECT_FILL}
                        stroke={stroke}
                        strokeWidth={2}
                        dash={RECT_DASH}
                        draggable
                        onClick={() => notifySelectedRegionIdChange(rect.id)}
                        onTap={() => notifySelectedRegionIdChange(rect.id)}
                        onDragEnd={(event) => {
                          const node = event.target;
                          // Konva Circle is positioned by its centre; convert back to bbox.
                          patchRegion(rect.id, {
                            x: node.x() - radius,
                            y: node.y() - radius,
                          });
                        }}
                        onTransformEnd={() => {
                          const node = regionRefs.current[
                            rect.id
                          ] as Konva.Circle | null;
                          if (!node) return;
                          const scale = node.scaleX();
                          node.scaleX(1);
                          node.scaleY(1);
                          const diameter = Math.max(
                            IMAGE_PIN_REGION_MIN_SIZE,
                            node.radius() * 2 * scale,
                          );
                          // centeredScaling keeps the centre fixed during the transform.
                          const c = clampCircleToImage(
                            node.x() - diameter / 2,
                            node.y() - diameter / 2,
                            diameter,
                            sceneSize.width,
                            sceneSize.height,
                          );
                          patchRegion(rect.id, {
                            x: c.x,
                            y: c.y,
                            width: c.width,
                            height: c.height,
                          });
                        }}
                      />
                    ) : (
                      <Rect
                        ref={(node) => {
                          regionRefs.current[rect.id] = node;
                        }}
                        x={rect.x}
                        y={rect.y}
                        width={rect.width}
                        height={rect.height}
                        cornerRadius={RECT_CORNER_RADIUS}
                        fill={RECT_FILL}
                        stroke={stroke}
                        strokeWidth={2}
                        dash={RECT_DASH}
                        draggable
                        onClick={() => notifySelectedRegionIdChange(rect.id)}
                        onTap={() => notifySelectedRegionIdChange(rect.id)}
                        onDragEnd={(event) => {
                          const node = event.target;
                          const c = clampRectToImage(
                            node.x(),
                            node.y(),
                            node.width(),
                            node.height(),
                            sceneSize.width,
                            sceneSize.height,
                          );
                          patchRegion(rect.id, { x: c.x, y: c.y });
                        }}
                        onTransformEnd={() => {
                          const node = regionRefs.current[rect.id];
                          if (!node) return;
                          const scaleX = node.scaleX();
                          const scaleY = node.scaleY();
                          node.scaleX(1);
                          node.scaleY(1);
                          const rawW = Math.max(
                            IMAGE_PIN_REGION_MIN_SIZE,
                            node.width() * scaleX,
                          );
                          const rawH = Math.max(
                            IMAGE_PIN_REGION_MIN_SIZE,
                            node.height() * scaleY,
                          );
                          const c = clampRectToImage(
                            node.x(),
                            node.y(),
                            rawW,
                            rawH,
                            sceneSize.width,
                            sceneSize.height,
                          );
                          patchRegion(rect.id, {
                            x: c.x,
                            y: c.y,
                            width: c.width,
                            height: c.height,
                          });
                        }}
                      />
                    )}

                    {/* Question number label centered in the region */}
                    <Text
                      x={labelPos.x}
                      y={labelPos.y}
                      text={rect.label || String(regionNumber)}
                      fontSize={LABEL_FONT_SIZE}
                      fontFamily="Arial, sans-serif"
                      fontStyle="bold"
                      fill={LABEL_FONT_COLOR}
                      align="center"
                      pointerEvents="none"
                    />
                  </Fragment>
                );
              })}

              {draftShape ? (
                drawMode === "circle" ? (
                  (() => {
                    const diameter = Math.max(
                      IMAGE_PIN_REGION_MIN_SIZE,
                      Math.max(draftShape.width, draftShape.height),
                    );
                    return (
                      <Circle
                        x={draftShape.x + diameter / 2}
                        y={draftShape.y + diameter / 2}
                        radius={diameter / 2}
                        fill="rgba(0, 0, 255, 0.08)"
                        stroke={RECT_STROKE_SELECTED}
                        strokeWidth={1}
                        dash={RECT_DASH}
                        listening={false}
                      />
                    );
                  })()
                ) : (
                  <Rect
                    x={draftShape.x}
                    y={draftShape.y}
                    width={Math.max(
                      IMAGE_PIN_REGION_MIN_SIZE,
                      draftShape.width,
                    )}
                    height={Math.max(
                      IMAGE_PIN_REGION_MIN_SIZE,
                      draftShape.height,
                    )}
                    cornerRadius={RECT_CORNER_RADIUS}
                    fill="rgba(0, 0, 255, 0.08)"
                    stroke={RECT_STROKE_SELECTED}
                    strokeWidth={1}
                    dash={RECT_DASH}
                    listening={false}
                  />
                )
              ) : null}

              {selectedRegionId ? (
                <Transformer
                  ref={transformerRef}
                  flipEnabled={false}
                  rotateEnabled={false}
                  keepRatio={isCircleSelected}
                  centeredScaling={isCircleSelected}
                  boundBoxFunc={(oldBox, newBox) => {
                    if (isCircleSelected) {
                      // Enforce the min diameter and keep the bbox square so the region
                      // stays a true circle regardless of which anchor is dragged.
                      const size = Math.max(
                        Math.abs(newBox.width),
                        Math.abs(newBox.height),
                      );
                      if (size < IMAGE_PIN_REGION_MIN_SIZE) return oldBox;
                      return { ...newBox, width: size, height: size };
                    }
                    if (
                      Math.abs(newBox.width) < IMAGE_PIN_REGION_MIN_SIZE ||
                      Math.abs(newBox.height) < IMAGE_PIN_REGION_MIN_SIZE
                    ) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                />
              ) : null}
            </Layer>
          </Stage>
        );
      }}
    </ImagePinFrame>
  );
}
