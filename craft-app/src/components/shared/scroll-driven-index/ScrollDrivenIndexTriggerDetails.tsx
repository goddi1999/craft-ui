import { ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'

import { ScrollDrivenIndexIcon } from './ScrollDrivenIndexIcon'
import { ScrollDrivenIndexProgress } from './ScrollDrivenIndexProgress'

type ScrollDrivenIndexTriggerDetailsProps = {
  label: string
  className?: string
}

export function ScrollDrivenIndexTriggerDetails({
  label,
  className,
}: ScrollDrivenIndexTriggerDetailsProps) {
  return (
    <div className={cn('scroll-driven-index__trigger-details', className)}>
      <ScrollDrivenIndexIcon />
      <span className="scroll-driven-index__trigger-label">
        <span>{label}</span>
        <ChevronsUpDown aria-hidden="true" />
      </span>
      <ScrollDrivenIndexProgress />
    </div>
  )
}
