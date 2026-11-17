/**
 * The computed colour of any CSS colour or `var()`. A canvas cannot read custom
 * properties, so the value is resolved on a throwaway element inside `scope`,
 * where the theme variables apply.
 */
export function resolveCssColor(scope: HTMLElement, value: string): string {
  const probe = document.createElement('span')
  probe.style.color = value
  scope.appendChild(probe)
  const resolved = getComputedStyle(probe).color
  probe.remove()
  return resolved
}
