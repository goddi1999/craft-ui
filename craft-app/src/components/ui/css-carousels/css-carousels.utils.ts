export type CssCarouselVariant = 'fade' | 'slide' | 'thumbnails' | 'scale'

export type CssCarouselSlide = {
  /** Big caption drawn over the slide. */
  label: string
  /** Background image URL. */
  image: string
}

/** Build a set of lettered slides backed by stable remote photos. */
export function createCarouselSlides(letters: readonly string[]) {
  return letters.map<CssCarouselSlide>((letter, index) => ({
    label: letter,
    image: `https://picsum.photos/seed/css-carousel-${letter.toLowerCase()}${index}/800/600`,
  }))
}

export const DEFAULT_CAROUSEL_SLIDES = createCarouselSlides([
  'A',
  'B',
  'C',
  'D',
  'E',
])

/** Wrap an index into the range [0, length). */
export function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length
}
