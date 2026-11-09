/**
 * Writes each panel's natural height to `--content-height` on its `<details>`.
 * Panels are opened one at a time with the exclusive `name` lifted so measuring
 * never closes a sibling; everything happens before paint.
 */
export function measureContentHeights(root: HTMLElement) {
  for (const detail of Array.from(root.querySelectorAll('details'))) {
    const content = detail.querySelector<HTMLElement>(
      '[data-slot="morphing-disclosure-content"]',
    )
    if (!content) continue

    const wasOpen = detail.open
    const name = detail.getAttribute('name')
    if (name) detail.removeAttribute('name')
    detail.open = true

    const height = Math.ceil(content.getBoundingClientRect().height)
    detail.style.setProperty('--content-height', `${height}px`)

    detail.open = wasOpen
    if (name) detail.setAttribute('name', name)
  }
}
