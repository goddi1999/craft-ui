// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type AccordionItem = {
  id: string
  title: ReactNode
  icon?: LucideIcon
  meta?: ReactNode
  content: ReactNode
  disabled?: boolean
}

type AccordionProps = {
  items: AccordionItem[]
  /** `single` keeps at most one item open; `multiple` lets any number open. */
  type?: 'single' | 'multiple'
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (open: string[]) => void
  className?: string
}

type CollapsibleProps = {
  title: ReactNode
  icon?: LucideIcon
  meta?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  className?: string
  children: ReactNode
}

type SectionProps = {
  title: ReactNode
  /** Optional leading icon. */
  icon?: LucideIcon
  /** Right-aligned secondary text, e.g. a count or a time. */
  meta?: ReactNode
  open: boolean
  onToggle: (fromKeyboard: boolean) => void
  disabled?: boolean
  /** Skip the height animation (keyboard toggles). */
  instant: boolean
  className?: string
  children: ReactNode
}

export type { AccordionItem, AccordionProps, CollapsibleProps, SectionProps }
