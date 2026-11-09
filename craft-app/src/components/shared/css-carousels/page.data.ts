import type { CssCarouselVariant } from '@/components/ui/css-carousels'

export const DEMO_CAROUSELS: {
  variant: CssCarouselVariant
  title: string
  letters: string[]
}[] = [
  { variant: 'fade', title: 'Fade in / out', letters: ['A', 'B', 'C', 'D', 'E'] },
  { variant: 'slide', title: 'Slider', letters: ['F', 'G', 'H', 'I', 'J'] },
  {
    variant: 'thumbnails',
    title: 'Thumbnail indicators',
    letters: ['K', 'L', 'M', 'N', 'O'],
  },
  { variant: 'scale', title: 'Scale', letters: ['P', 'Q', 'R', 'S', 'T'] },
]
