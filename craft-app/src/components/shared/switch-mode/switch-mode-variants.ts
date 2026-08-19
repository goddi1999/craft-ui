import { cva } from 'class-variance-authority'

export const switchModeVariants = cva(
  'relative flex items-center rounded-full border-2 border-[#D8D6E0] bg-white transition-colors dark:border-[#4C4C50] dark:bg-[#0B0B0B]',
  {
    variants: {
      size: {
        sm: 'h-14 w-28',
        default: 'h-18 w-36',
        lg: 'h-22 w-44',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

export const switchModeKnobVariants = cva(
  'absolute -inset-y-0.5 aspect-square rounded-full border-2 border-[#D8D6E0] bg-[#F3F2F7] dark:border-[#4C4C50] dark:bg-[#2A2A2E]',
  {
    variants: {
      side: {
        left: '-left-0.5',
        right: '-right-0.5',
      },
    },
    defaultVariants: {
      side: 'left',
    },
  },
)

export const switchModeIconVariants = cva(
  'relative z-30 flex h-full items-center justify-center',
  {
    variants: {
      size: {
        sm: 'w-14 [&_svg]:size-6',
        default: 'w-18 [&_svg]:size-8',
        lg: 'w-22 [&_svg]:size-10',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)
