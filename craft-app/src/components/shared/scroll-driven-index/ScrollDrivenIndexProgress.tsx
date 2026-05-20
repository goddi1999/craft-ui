import { cn } from '@/lib/utils'

type ScrollDrivenIndexProgressProps = {
  className?: string
}

export function ScrollDrivenIndexProgress({
  className,
}: ScrollDrivenIndexProgressProps) {
  return (
    <span
      data-slot="scroll-driven-index-progress"
      className={cn('scroll-driven-index__progress', className)}
    />
  )
}
