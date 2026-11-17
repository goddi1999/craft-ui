import type { Rect as KonvaRect } from 'konva/lib/shapes/Rect'

/** Soft fill shared by idle / hover / selected regions. */
export const REGION_FILL = 'rgba(186, 213, 228, 0.18)'
export const REGION_FILL_HOVER = 'rgba(186, 213, 228, 0.28)'
export const REGION_FILL_SELECTED = 'rgba(96, 165, 250, 0.22)'

export const REGION_STROKE_IDLE = '#6366F1'
export const REGION_STROKE_HOVER = '#4F46E5'
export const REGION_STROKE_SELECTED = '#2563EB'

/** Idle outline — readable without shouting. */
export const REGION_STROKE_WIDTH_IDLE = 2.5
/** Hover / selected outline — thicker so the hit target feels intentional. */
export const REGION_STROKE_WIDTH_ACTIVE = 3.5

export const REGION_DASH: number[] = [8, 6]
export const REGION_CORNER_RADIUS = 8

export const REGION_LABEL_SIZE = 20
export const REGION_LABEL_COLOR = '#2563EB'

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
