import { BOTTOM_ROOM, GAP, PANEL_PAD, PILL_HEIGHT, ROW_HEIGHT } from './gooey-menu.constants'

/** Where the panel sits when open, how tall it is, and how much room the menu keeps. */
export function panelMetrics(count: number) {
  const height = count * ROW_HEIGHT + PANEL_PAD * 2
  const top = PILL_HEIGHT + GAP
  return {
    height,
    top,
    // closed, the panel squashes to the pill's height and hides under it
    closedScale: PILL_HEIGHT / height,
    total: top + height + BOTTOM_ROOM,
  }
}

/** Steps an index through a list, wrapping at both ends. */
export const wrapIndex = (index: number, step: number, count: number) =>
  (index + step + count) % count
