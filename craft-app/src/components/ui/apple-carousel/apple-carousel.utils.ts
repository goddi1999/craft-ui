export function getSlides(viewport: HTMLElement) {
  return Array.from(viewport.firstElementChild?.children ?? []) as HTMLElement[]
}

export function getSnapLeft(viewport: HTMLElement, slide: HTMLElement) {
  let left: number
  if (getComputedStyle(slide).scrollSnapAlign.startsWith('start')) {
    const padding = parseFloat(getComputedStyle(viewport).scrollPaddingInlineStart)
    left = slide.offsetLeft - (padding || 0)
  } else {
    left = slide.offsetLeft - (viewport.clientWidth - slide.offsetWidth) / 2
  }

  // Without loop clones, the last cards can sit past the end of the track,
  // and a spring aimed there would hit the wall mid-flight.
  const maxLeft = viewport.scrollWidth - viewport.clientWidth
  return Math.min(Math.max(left, 0), maxLeft)
}

export function getNearestSlide(viewport: HTMLElement, currentIndex: number) {
  let nearest: HTMLElement | undefined
  let minDistance = Infinity

  for (const slide of getSlides(viewport)) {
    const distance = Math.abs(getSnapLeft(viewport, slide) - viewport.scrollLeft)
    // Cards clamped to the end share a snap; keep the current one so its dot
    // doesn't jump back once the scroll settles.
    const isTie = Math.abs(distance - minDistance) < 1
    if (
      (distance < minDistance && !isTie) ||
      (isTie && slide.dataset.index === String(currentIndex))
    ) {
      minDistance = distance
      nearest = slide
    }
  }

  return nearest
}

export function getRealSlide(viewport: HTMLElement, index: number) {
  return getSlides(viewport).find(
    (slide) => !slide.hasAttribute('data-clone') && slide.dataset.index === String(index),
  )
}
