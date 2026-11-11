// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { MotionConfig } from 'motion/react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { AccordionSection } from './tuff-accordion-parts'
import type { AccordionProps, CollapsibleProps } from './tuff-accordion.types'

/** A list of collapsible sections. Items separate by spacing, not dividers. */
export function Accordion({
  items,
  type = 'single',
  value: valueProp,
  defaultValue = [],
  onValueChange,
  className,
}: AccordionProps) {
  const [inner, setInner] = useState(defaultValue)
  const open = valueProp ?? inner
  const [instant, setInstant] = useState(false)

  const toggle = (id: string, fromKeyboard: boolean) => {
    setInstant(fromKeyboard)
    const isOpen = open.includes(id)
    const next = isOpen
      ? open.filter((o) => o !== id)
      : type === 'single'
        ? [id]
        : [...open, id]
    if (valueProp === undefined) setInner(next)
    onValueChange?.(next)
  }

  return (
    <MotionConfig reducedMotion="user">
      <div data-slot="tuff-accordion" className={cn('flex flex-col gap-0.5', className)}>
        {items.map((item) => (
          <AccordionSection
            key={item.id}
            title={item.title}
            icon={item.icon}
            meta={item.meta}
            disabled={item.disabled}
            open={open.includes(item.id)}
            instant={instant}
            onToggle={(fromKeyboard) => toggle(item.id, fromKeyboard)}
            className={open.includes(item.id) ? 'bg-foreground/[0.03]' : undefined}
          >
            {item.content}
          </AccordionSection>
        ))}
      </div>
    </MotionConfig>
  )
}

/** A single collapsible section, e.g. reasoning or details under an answer. */
export function Collapsible({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: CollapsibleProps) {
  const [inner, setInner] = useState(defaultOpen)
  const open = openProp ?? inner
  const [instant, setInstant] = useState(false)

  return (
    <MotionConfig reducedMotion="user">
      <AccordionSection
        {...props}
        open={open}
        instant={instant}
        onToggle={(fromKeyboard) => {
          setInstant(fromKeyboard)
          if (openProp === undefined) setInner(!open)
          onOpenChange?.(!open)
        }}
        className={cn('bg-foreground/[0.03]', props.className)}
      />
    </MotionConfig>
  )
}
