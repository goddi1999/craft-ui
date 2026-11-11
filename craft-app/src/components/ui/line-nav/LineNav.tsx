import { useEffect, useRef, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import { LINE_WIDTH } from './line-nav.constants'
import type { LineNavProps } from './line-nav.types'
import { LineNavLink } from './LineNavLink'

/** Inspired by Devouring Details and Skiper UI. */
export function LineNav({
  className,
  style,
  items,
  activeHref,
  scrollActiveIntoView = true,
  onItemClick,
  ...props
}: LineNavProps) {
  const activeItemRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    if (scrollActiveIntoView) {
      activeItemRef.current?.scrollIntoView({ block: 'center' })
    }
  }, [scrollActiveIntoView])

  return (
    <nav
      data-slot="line-nav"
      className={cn('flex flex-col gap-2 py-5.25', className)}
      style={
        { '--line-nav-width': `${LINE_WIDTH.normal}px`, ...style } as CSSProperties
      }
      {...props}
    >
      {items.map((item, index) => {
        const isActive = item.href === activeHref

        return (
          <LineNavLink
            key={item.href}
            ref={isActive ? activeItemRef : undefined}
            title={item.title}
            href={item.href}
            active={isActive}
            isLast={index === items.length - 1}
            onClick={onItemClick ? (event) => onItemClick(item, event) : undefined}
          />
        )
      })}
    </nav>
  )
}
