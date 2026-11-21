import { cva } from 'class-variance-authority'

export const loadingCarouselSlideVariants = cva('relative w-full overflow-hidden', {
  variants: {
    aspectRatio: {
      video: 'aspect-video',
      wide: 'aspect-[2/1]',
      square: 'aspect-square',
    },
  },
  defaultVariants: { aspectRatio: 'video' },
})
