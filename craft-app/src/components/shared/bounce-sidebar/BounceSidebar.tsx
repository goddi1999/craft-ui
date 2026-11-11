import { useAnimate, useReducedMotion } from 'motion/react'
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
} from 'react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

export type BounceSidebarItem = string | { label: string; href?: string }

export type BounceSidebarProps = Omit<ComponentProps<'ul'>, 'onChange'> & {
  items: BounceSidebarItem[]
  value?: number
  defaultValue?: number
  onChange?: (index: number) => void
  dotColor?: string
}

const DOT_SIZE = 6

/** Snap to the device pixel grid so the dot never renders blurry. */
const toDevicePixels = (value: number) => {
  const dpr = window.devicePixelRatio || 1
  return Math.round(value * dpr) / dpr
}

/**
 * A contents rail whose marker dot curves out and back as it travels between
 * items, instead of sliding in a straight line.
 */
export function BounceSidebar({
  items,
  value,
  defaultValue = 0,
  onChange,
  dotColor = '#fcd601',
  className,
  ...props
}: BounceSidebarProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const activeIndex = value ?? internalValue
  const reducedMotion = useReducedMotion()

  const [dot, animate] = useAnimate<HTMLSpanElement>()
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const prevY = useRef<number | null>(null)
  const [ready, setReady] = useState(false)

  const dotYFor = (index: number) => {
    const item = itemRefs.current[index]
    if (!item) return null
    const size = toDevicePixels(DOT_SIZE)
    return toDevicePixels(item.offsetTop + item.offsetHeight / 2 - size / 2)
  }

  // Place the dot without animating on mount, and again once fonts settle.
  useLayoutEffect(() => {
    let cancelled = false
    const snap = () => {
      const toY = dotYFor(activeIndex)
      if (cancelled || toY === null || !dot.current) return
      animate(dot.current, { x: 0, y: toY }, { duration: 0 })
      prevY.current = toY
      setReady(true)
    }

    snap()
    const raf = requestAnimationFrame(snap)
    document.fonts?.ready.then(snap)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
    // Mount only — later moves animate in the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const toY = dotYFor(activeIndex)
    if (toY === null || !dot.current) return

    const fromY = prevY.current
    prevY.current = toY
    if (fromY === null || reducedMotion) {
      animate(dot.current, { x: 0, y: toY }, { duration: 0 })
      return
    }

    const delta = toY - fromY
    if (delta === 0) return

    const bulgeX = -Math.min(14, Math.abs(delta) * 0.8)
    animate(
      dot.current,
      { x: [0, bulgeX, 0], y: toY },
      { duration: 0.25, ease: 'easeOut' },
    )
  }, [activeIndex, animate, dot, reducedMotion, items.length])

  const handleSelect = (index: number) => {
    if (value === undefined) setInternalValue(index)
    onChange?.(index)
  }

  const dotSize = ready ? toDevicePixels(DOT_SIZE) : DOT_SIZE

  return (
    <ul
      data-slot="bounce-sidebar"
      className={cn('relative flex flex-col gap-1 pl-6', className)}
      {...props}
    >
      <span
        ref={dot}
        aria-hidden
        className="absolute top-0 left-2 rounded-full transition-opacity duration-150"
        style={{
          width: dotSize,
          height: dotSize,
          backgroundColor: dotColor,
          opacity: ready ? 1 : 0,
        }}
      />

      {items.map((item, index) => {
        const label = typeof item === 'string' ? item : item.label
        const href = typeof item === 'string' ? undefined : item.href
        const isActive = index === activeIndex
        const itemClassName = cn(
          'flex w-full cursor-pointer items-center rounded-lg p-1 text-left text-sm transition-colors duration-200 ease-out',
          isActive
            ? 'text-foreground'
            : 'text-foreground/50 [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground/80',
        )

        return (
          <li
            key={label}
            ref={(element) => {
              itemRefs.current[index] = element
            }}
          >
            {href ? (
              <Link
                to={href}
                data-slot="bounce-sidebar-item"
                data-active={isActive}
                aria-current={isActive ? 'location' : undefined}
                onClick={() => handleSelect(index)}
                className={itemClassName}
              >
                {label}
              </Link>
            ) : (
              <button
                type="button"
                data-slot="bounce-sidebar-item"
                data-active={isActive}
                aria-current={isActive ? 'location' : undefined}
                onClick={() => handleSelect(index)}
                className={itemClassName}
              >
                {label}
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}
