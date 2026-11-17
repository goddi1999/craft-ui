import type { Rect as KonvaRect } from 'konva/lib/shapes/Rect'

/** Light wash: the photo stays visible, the outline carries the shape. */
export const REGION_FILL = 'rgba(99, 102, 241, 0.12)'
export const REGION_FILL_HOVER = 'rgba(99, 102, 241, 0.2)'
export const REGION_FILL_SELECTED = 'rgba(37, 99, 235, 0.26)'

export const REGION_STROKE_IDLE = '#6366F1'
export const REGION_STROKE_HOVER = '#4F46E5'
export const REGION_STROKE_SELECTED = '#2563EB'

/** Screen pixels. The stage divides by its fit-scale; the board stroke does not scale. */
export const REGION_STROKE_WIDTH_IDLE = 1.5
export const REGION_STROKE_WIDTH_ACTIVE = 1.5

/** Screen pixels, same split as the stroke widths. */
export const REGION_DASH: number[] = [6, 4]
export const REGION_CORNER_RADIUS = 6

/** Navy with a faint white edge so it survives dark cliffs and bright water. */
export const REGION_LABEL_COLOR = '#1E3A8A'
export const REGION_LABEL_HALO = '#FFFFFF'
/** Screen pixels. A number never grows past this, however big the region. */
export const REGION_LABEL_MAX_SIZE = 16

/** Scene pixels for a length that should stay `screenPx` on the fitted image. */
export function scenePixels(screenPx: number, stageScale: number): number {
  const scale = stageScale > 0 ? stageScale : 1
  return screenPx / scale
}

/**
 * Digit height tracks the region but stops at `maxSize`, so a large region
 * gets a quiet number. A wide label shrinks to stay inside the width.
 */
export function regionLabelFontSize(
  text: string,
  width: number,
  height: number,
  shape: 'rectangle' | 'circle',
  maxSize = Infinity,
): number {
  const heightShare = shape === 'circle' ? 0.5 : 0.6
  const widthShare = shape === 'circle' ? 0.7 : 0.9
  const chars = Math.max(text.length, 1)
  const byHeight = height * heightShare
  const byWidth = (width * widthShare) / (chars * 0.62)
  return Math.max(1, Math.min(byHeight, byWidth, maxSize))
}

/** Corner drag thumbs — circles, same footprint as before. */
export const ANCHOR_CORNER_SIZE = 12
/** Edge drag thumbs — pill / badge: long × short. */
export const ANCHOR_BADGE_LONG = 20
export const ANCHOR_BADGE_SHORT = 8

export const ANCHOR_FILL = '#FFFFFF'
export const ANCHOR_STROKE = REGION_STROKE_SELECTED
export const ANCHOR_STROKE_WIDTH = 2
/** Hover grow on thumbs (transform only; tens/day → keep snappy). */
export const ANCHOR_HOVER_SCALE = 1.12
/** Press feedback on thumbs. */
export const ANCHOR_ACTIVE_SCALE = 0.97

export type RegionVisualState = 'idle' | 'hover' | 'selected'

export function resolveRegionVisualState(
  regionId: string,
  selectedRegionId: string | null,
  hoveredRegionId: string | null,
): RegionVisualState {
  if (selectedRegionId === regionId) return 'selected'
  if (hoveredRegionId === regionId) return 'hover'
  return 'idle'
}

export function regionStrokeFor(state: RegionVisualState) {
  if (state === 'selected') return REGION_STROKE_SELECTED
  if (state === 'hover') return REGION_STROKE_HOVER
  return REGION_STROKE_IDLE
}

export function regionStrokeWidthFor(state: RegionVisualState) {
  return state === 'idle' ? REGION_STROKE_WIDTH_IDLE : REGION_STROKE_WIDTH_ACTIVE
}

export function regionFillFor(state: RegionVisualState) {
  if (state === 'selected') return REGION_FILL_SELECTED
  if (state === 'hover') return REGION_FILL_HOVER
  return REGION_FILL
}

/**
 * Konva Transformer anchors: corners → circles; edge mids → badge pills
 * oriented to the side they sit on.
 */
export function styleImagePinAnchor(anchor: KonvaRect) {
  const name = anchor.name()
  if (name.includes('rotater')) return

  const isHorizontalBadge =
    name.includes('top-center') || name.includes('bottom-center')
  const isVerticalBadge =
    name.includes('middle-left') || name.includes('middle-right')

  if (isHorizontalBadge) {
    const width = ANCHOR_BADGE_LONG
    const height = ANCHOR_BADGE_SHORT
    anchor.setAttrs({
      width,
      height,
      offsetX: width / 2,
      offsetY: height / 2,
      cornerRadius: height / 2,
      fill: ANCHOR_FILL,
      stroke: ANCHOR_STROKE,
      strokeWidth: ANCHOR_STROKE_WIDTH,
      hitStrokeWidth: 12,
    })
    bindAnchorPressFeedback(anchor)
    return
  }

  if (isVerticalBadge) {
    const width = ANCHOR_BADGE_SHORT
    const height = ANCHOR_BADGE_LONG
    anchor.setAttrs({
      width,
      height,
      offsetX: width / 2,
      offsetY: height / 2,
      cornerRadius: width / 2,
      fill: ANCHOR_FILL,
      stroke: ANCHOR_STROKE,
      strokeWidth: ANCHOR_STROKE_WIDTH,
      hitStrokeWidth: 12,
    })
    bindAnchorPressFeedback(anchor)
    return
  }

  const size = ANCHOR_CORNER_SIZE
  anchor.setAttrs({
    width: size,
    height: size,
    offsetX: size / 2,
    offsetY: size / 2,
    cornerRadius: size / 2,
    fill: ANCHOR_FILL,
    stroke: ANCHOR_STROKE,
    strokeWidth: ANCHOR_STROKE_WIDTH,
    hitStrokeWidth: 12,
  })
  bindAnchorPressFeedback(anchor)
}

const ANCHOR_FEEDBACK_NS = 'imagePinAnchorFeedback'

function bindAnchorPressFeedback(anchor: KonvaRect) {
  if (anchor.getAttr('data-feedback-bound')) return
  anchor.setAttr('data-feedback-bound', true)

  const redraw = () => {
    anchor.getLayer()?.batchDraw()
  }

  // Hover feedback is frequent — scale only, no duration (Emil: tens/day → snappy).
  anchor.on(`mouseenter.${ANCHOR_FEEDBACK_NS}`, () => {
    anchor.scale({ x: ANCHOR_HOVER_SCALE, y: ANCHOR_HOVER_SCALE })
    redraw()
  })
  anchor.on(`mouseleave.${ANCHOR_FEEDBACK_NS}`, () => {
    anchor.scale({ x: 1, y: 1 })
    redraw()
  })
  anchor.on(
    `mousedown.${ANCHOR_FEEDBACK_NS} touchstart.${ANCHOR_FEEDBACK_NS}`,
    () => {
      anchor.scale({ x: ANCHOR_ACTIVE_SCALE, y: ANCHOR_ACTIVE_SCALE })
      redraw()
    },
  )
  anchor.on(
    `mouseup.${ANCHOR_FEEDBACK_NS} touchend.${ANCHOR_FEEDBACK_NS}`,
    () => {
      anchor.scale({ x: ANCHOR_HOVER_SCALE, y: ANCHOR_HOVER_SCALE })
      redraw()
    },
  )
}
