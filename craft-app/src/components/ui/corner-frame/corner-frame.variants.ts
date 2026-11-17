import { cva, type VariantProps } from 'class-variance-authority'

export const cornerFrameVariants = cva(
  'pointer-events-none absolute inset-0 text-foreground/25',
  {
    variants: {
      size: {
        sm: '',
        default: '',
        lg: '',
      },
    },
    defaultVariants: { size: 'default' },
  },
)

export type CornerFrameVariantProps = VariantProps<typeof cornerFrameVariants>
