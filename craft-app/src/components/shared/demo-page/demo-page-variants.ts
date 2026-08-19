import { cva } from 'class-variance-authority'

export const demoPageStageVariants = cva('flex w-full flex-1 px-4 pb-20', {
  variants: {
    align: {
      center: 'items-center justify-center',
      start: 'items-start justify-center',
      stretch: 'items-stretch',
    },
  },
  defaultVariants: {
    align: 'center',
  },
})
