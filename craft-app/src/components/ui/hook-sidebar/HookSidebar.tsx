import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { cn } from '@/lib/utils'

import { HOOK_CORNER, HookSidebarRail } from './hook-sidebar-rail'
import type {
  HookSidebarColor,
  HookSidebarItem,
  HookSidebarProps,
} from './hook-sidebar.types'

// Theme tokens (with fallbacks, so the folder works copied elsewhere), mixed
// a quarter toward the text color so a 1px rail still reads on any theme.
const token = (name: string, fallback: string) =>
  `color-mix(in oklch, oklch(var(--oklch-${name}, ${fallback})) 75%, var(--foreground))`

const RAIL_COLOR: Record<HookSidebarColor, string> = {
  orange: token('orange', '0.7 0.2 45'),
  violet: token('violet', '0.76 0.18 305'),
  indigo: token('indigo', '0.74 0.15 275'),
  blue: token('blue', '0.78 0.14 245'),
  cyan: token('cyan', '0.8 0.13 215'),
  teal: token('teal', '0.78 0.14 185'),
  green: token('green', '0.8 0.16 150'),
  pink: token('pink', '0.8 0.17 10'),
  foreground: 'var(--foreground)',
}

const hrefOf = (item: HookSidebarItem) =>
  typeof item === 'string' ? undefined : item.href

const labelOf = (item: HookSidebarItem) =>
  typeof item === 'string' ? item : item.label

/**
 * A table-of-contents list whose active row is marked by a rail that springs
 * down the left edge and hooks into it; hovering draws a faint second rail.
 */
export function HookSidebar({
  items,
  label,
  value,
  defaultValue = 0,
  onChange,
  color = 'orange',
  dashed = true,
  className,
  ...props
}: HookSidebarProps) {
  const { pathname } = useLocation()
  const listRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLElement | null)[]>([])
  const [centers, setCenters] = useState<number[]>([])
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [pointerInside, setPointerInside] = useState(false)
  const [focusInside, setFocusInside] = useState(false)

  const routed = items.some((item) => hrefOf(item))
  const routeIndex = items.findIndex((item) => hrefOf(item) === pathname)
  const activeIndex = value ?? (routed ? routeIndex : internalValue)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const measure = () =>
      setCenters(
        itemRefs.current.map((el) => (el ? el.offsetTop + el.offsetHeight / 2 : 0)),
      )
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [items.length])

  const activeY = activeIndex < 0 ? null : (centers[activeIndex] ?? null)
  const hoverY = hoverIndex === null ? null : (centers[hoverIndex] ?? null)

  // above the active row the accent rail already covers the span, so draw only the hook
  const hoverFrom =
    activeY !== null && hoverY !== null && hoverY <= activeY
      ? Math.max(0, hoverY - HOOK_CORNER)
      : (activeY ?? 0)

  const handleSelect = (index: number) => {
    if (value === undefined) setInternalValue(index)
    onChange?.(index)
  }

  return (
    <nav
      data-slot="hook-sidebar"
      aria-label={label}
      className={cn('flex flex-col', className)}
      {...props}
    >
      {label ? (
        <span
          data-slot="hook-sidebar-label"
          className="pr-2 pb-3 pl-0.5 text-sm font-medium tracking-wide text-foreground uppercase"
        >
          {label}
        </span>
      ) : null}

      <div
        ref={listRef}
        onMouseLeave={() => setPointerInside(false)}
        className="relative flex flex-col gap-0.5"
      >
        <HookSidebarRail
          from={hoverFrom}
          y={hoverY}
          visible={(pointerInside || focusInside) && hoverIndex !== activeIndex}
          dashed={dashed}
          className="text-foreground/30"
        />
        <HookSidebarRail
          y={activeY}
          visible={activeY !== null}
          dashed={dashed}
          color={RAIL_COLOR[color]}
        />

        {items.map((item, index) => {
          const text = labelOf(item)
          const href = hrefOf(item)
          const isActive = index === activeIndex
          const setRef = (el: HTMLElement | null) => {
            itemRefs.current[index] = el
          }
          const rowProps = {
            'data-slot': 'hook-sidebar-item',
            'data-active': isActive,
            onMouseEnter: () => {
              setHoverIndex(index)
              setPointerInside(true)
            },
            onFocus: () => {
              setHoverIndex(index)
              setFocusInside(true)
            },
            onBlur: () => setFocusInside(false),
            onClick: () => handleSelect(index),
            className: cn(
              'rounded-lg py-1.5 pr-2 pl-5 text-left text-sm outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none',
              isActive ? 'text-foreground' : 'text-foreground/50 hover:text-foreground/80',
            ),
          }

          return href ? (
            <Link
              key={`${index}-${text}`}
              {...rowProps}
              ref={setRef}
              to={href}
              aria-current={isActive ? 'page' : undefined}
            >
              {text}
            </Link>
          ) : (
            <button
              key={`${index}-${text}`}
              {...rowProps}
              ref={setRef}
              type="button"
              aria-current={isActive ? 'true' : undefined}
            >
              {text}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
