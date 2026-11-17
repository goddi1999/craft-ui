import type { Rect as KonvaRect } from 'konva/lib/shapes/Rect'

/** Blue wash. Idle is strong enough to read on water and on a white wall. */
export const REGION_FILL = 'rgba(37, 99, 235, 0.46)'
export const REGION_FILL_HOVER = 'rgba(37, 99, 235, 0.56)'
export const REGION_FILL_SELECTED = 'rgba(29, 78, 216, 0.66)'

export const REGION_STROKE_IDLE = '#1D4ED8'
export const REGION_STROKE_HOVER = '#1E40AF'
export const REGION_STROKE_SELECTED = '#1E3A8A'

/** Screen pixels. The stage divides by its fit-scale; the board stroke does not scale. */
export const REGION_STROKE_WIDTH_IDLE = 3
export const REGION_STROKE_WIDTH_ACTIVE = 4

/** Screen pixels, same split as the stroke widths. */
export const REGION_DASH: number[] = [12, 8]
export const REGION_CORNER_RADIUS = 8

/** Navy on the blue wash, with a white edge so it survives dark cliffs and bright water. */
export const REGION_LABEL_COLOR = '#1E3A8A'
export const REGION_LABEL_HALO = '#FFFFFF'

/** Scene pixels for a length that should stay `screenPx` on the fitted image. */
export function scenePixels(screenPx: number, stageScale: number): number {
  const scale = stageScale > 0 ? stageScale : 1
  return screenPx / scale
}

/**
 * Digit height tracks the region. Rectangles use the full height; circles stop
 * inside the curve. A wide label shrinks so it stays inside the width.
 */
export function regionLabelFontSize(
  text: string,
  width: number,
  height: number,
  shape: 'rectangle' | 'circle',
): number {
  const heightShare = shape === 'circle' ? 0.7 : 0.82
  const widthShare = shape === 'circle' ? 0.7 : 0.9
  const chars = Math.max(text.length, 1)
  const byHeight = height * heightShare
  const byWidth = (width * widthShare) / (chars * 0.62)
  return Math.max(1, Math.min(byHeight, byWidth))
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
