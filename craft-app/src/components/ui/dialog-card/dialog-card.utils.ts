const rootFontSize = (node: Element) =>
  parseFloat(getComputedStyle(node.ownerDocument.documentElement).fontSize) || 16

/** A computed length in px; rem values are read against the root font size. */
export function toPx(node: Element, value: string) {
  const amount = parseFloat(value)
  if (!Number.isFinite(amount)) return undefined
  return value.trim().endsWith('rem') ? amount * rootFontSize(node) : amount
}

export const remToPx = (node: Element, rem: number) => rem * rootFontSize(node)
