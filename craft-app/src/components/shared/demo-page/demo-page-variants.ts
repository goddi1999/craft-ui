import { cva } from 'class-variance-authority'

export const demoPagePreviewVariants = cva(
  'relative flex w-full min-h-[22rem]',
  {
    variants: {
      bleed: {
        false: 'p-6 sm:p-10',
        true: 'p-0',
      },
      align: {
        center: 'items-center justify-center',
        start: 'items-start justify-center',
        stretch: 'flex-col items-stretch justify-center',
      },
    },
    defaultVariants: {
      bleed: false,
      align: 'center',
    },
  },
)

/** @deprecated Use `demoPagePreviewVariants`. */
export const demoPageStageVariants = demoPagePreviewVariants
