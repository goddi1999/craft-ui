import {
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from 'motion/react'
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { cn } from '@/lib/utils'

import { RailTocPlane, RailTocRail } from './rail-toc-parts'
import type { RailTocGeometry, RailTocProps } from './rail-toc.types'
import {
  LABEL_GAP,
  RAIL_X,
  TRAVEL_SPRING,
  TURN_SLACK,
  TURN_SPRING,
  buildPath,
  getRailTarget,
  lengthAtY,
} from './rail-toc.utils'

const RAIL_COLOR =
  '[--rail:color-mix(in_oklab,var(--foreground)_45%,var(--background))]'

/**
 * A table of contents with a paper plane that flies along a dashed rail to
 * the section being read. The rail behind the plane turns solid, each
 * heading it passes fills in, and the plane turns around when scrolling back.
 */
export function RailToc({
  className,
  items,
  containerRef,
  offset = 96,
  indent = 14,
  title = 'On this page',
  ...props
}: RailTocProps) {
  const reduceMotion = useReducedMotion()
  const maskId = `rail-toc-${useId().replace(/[^\w-]/g, '')}`

  const listRef = useRef<HTMLUListElement>(null)
  const rowRefs = useRef<(HTMLLIElement | null)[]>([])
  const pathRef = useRef<SVGPathElement>(null)
  const holeRefs = useRef<(SVGCircleElement | null)[]>([])

  const [geometry, setGeometry] = useState<RailTocGeometry>()
  const [reached, setReached] = useState(1)

  const lengths = useRef<number[]>([])
  const total = useRef(0)
  const placed = useRef(false)
  const pinned = useRef<number | null>(null)
  const userScrolled = useRef(false)
  const facing = useRef<1 | -1>(1)
  const turnFrom = useRef(0)

  const target = useMotionValue(0)
  const travel = useSpring(target, TRAVEL_SPRING)
  const distance = reduceMotion ? target : travel

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const heading = useMotionValue(180)
  const turn = useSpring(heading, TURN_SPRING)
  const filled = useMotionValue(0)

  const pose = useCallback(
    (l: number) => {
      const path = pathRef.current
      const length = total.current
      if (!path || !length) return
      const at = path.getPointAtLength(l)
      const behind = path.getPointAtLength(Math.max(0, l - 1))
      const ahead = path.getPointAtLength(Math.min(length, l + 1))
      x.set(at.x)
      holeRefs.current.forEach((hole) => {
        hole?.setAttribute('cx', `${at.x}`)
        hole?.setAttribute('cy', `${at.y}`)
      })
      y.set(at.y)
      const angle =
        (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI +
        90 +
        (facing.current < 0 ? 180 : 0)
      // unwrapped against the current heading so the turn spring takes the short way round
      const prev = heading.get()
      heading.set(angle + 360 * Math.round((prev - angle) / 360))
      filled.set(l / length)
      setReached(lengths.current.filter((n) => n <= l + 0.5).length)
    },
    [x, y, heading, filled],
  )

  useMotionValueEvent(distance, 'change', pose)

  const aim = useCallback(
    (next: number) => {
      const from = turnFrom.current
      if ((next - from) * facing.current > 0) turnFrom.current = next
      else if (Math.abs(next - from) > TURN_SLACK) {
        facing.current = facing.current > 0 ? -1 : 1
        turnFrom.current = next
      }
      target.set(next)
    },
    [target],
  )

  const sync = useCallback(() => {
    const nodes = lengths.current
    if (!nodes.length) return

    // a clicked heading holds the plane until the reader scrolls, since headings near the end can't scroll up to the anchor
    if (pinned.current !== null) {
      aim(nodes[pinned.current] ?? nodes[0])
      return
    }

    const next = getRailTarget(items, nodes, containerRef?.current, offset)
    aim(next)
    if (!placed.current) {
      placed.current = true
      travel.jump(next)
      pose(next)
      turn.jump(heading.get())
    }
  }, [containerRef, items, offset, aim, travel, turn, heading, pose])

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list || !items.length) return

    const measure = () => {
      const nodes = items.map((item, i) => {
        const row = rowRefs.current[i]
        return {
          x: RAIL_X + (item.depth ?? 0) * indent,
          y: row ? row.offsetTop + row.offsetHeight / 2 : 0,
        }
      })
      setGeometry({
        nodes,
        d: buildPath(nodes),
        width: Math.max(...nodes.map((n) => n.x)) + RAIL_X + 4,
        height: list.offsetHeight,
      })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(list)
    document.fonts?.ready.then(measure).catch(() => {})
    return () => ro.disconnect()
  }, [items, indent])

  useLayoutEffect(() => {
    const path = pathRef.current
    if (!path || !geometry) return
    total.current = path.getTotalLength()
    lengths.current = geometry.nodes.map((n) => lengthAtY(path, total.current, n.y))
    sync()
    pose(distance.get())
  }, [geometry, sync, pose, distance])

  useEffect(() => {
    const scroller = containerRef?.current ?? window
    const handleIntent = () => {
      userScrolled.current = true
    }
    const handleScroll = () => {
      if (pinned.current !== null && userScrolled.current) pinned.current = null
      sync()
    }
    scroller.addEventListener('scroll', handleScroll, { passive: true })
    scroller.addEventListener('wheel', handleIntent, { passive: true })
    scroller.addEventListener('touchstart', handleIntent, { passive: true })
    scroller.addEventListener('pointerdown', handleIntent)
    window.addEventListener('keydown', handleIntent)
    window.addEventListener('resize', sync)
    return () => {
      scroller.removeEventListener('scroll', handleScroll)
      scroller.removeEventListener('wheel', handleIntent)
      scroller.removeEventListener('touchstart', handleIntent)
      scroller.removeEventListener('pointerdown', handleIntent)
      window.removeEventListener('keydown', handleIntent)
      window.removeEventListener('resize', sync)
    }
  }, [containerRef, sync])

  const handleSelect = (index: number) => {
    const el = document.getElementById(items[index].id)
    if (!el) return
    pinned.current = index
    userScrolled.current = false
    sync()
    const scroller = containerRef?.current
    const top = scroller
      ? el.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top +
        scroller.scrollTop
      : el.getBoundingClientRect().top + window.scrollY
    const behavior = reduceMotion ? 'auto' : 'smooth'
    ;(scroller ?? window).scrollTo({ top: top - offset, behavior })
  }

  const active = Math.max(0, reached - 1)

  return (
    <nav
      data-slot="rail-toc"
      aria-label={title}
      className={cn('w-max text-sm', RAIL_COLOR, className)}
      {...props}
    >
      <p
        data-slot="rail-toc-title"
        className="mb-3 flex items-center gap-2 font-medium text-foreground/70"
      >
        <svg
          viewBox="0 0 16 16"
          className="-ml-0.5 size-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M2 4h12M2 8h8M2 12h10" />
        </svg>
        {title}
      </p>

      <ul ref={listRef} data-slot="rail-toc-list" className="relative">
        {geometry ? (
          <>
            <RailTocRail
              geometry={geometry}
              items={items}
              maskId={maskId}
              reached={reached}
              filled={filled}
              pathRef={pathRef}
              holeRefs={holeRefs}
            />
            <RailTocPlane x={x} y={y} rotate={reduceMotion ? heading : turn} />
          </>
        ) : null}

        {items.map((item, i) => {
          const isActive = i === active
          return (
            <li
              key={item.id}
              ref={(el) => {
                rowRefs.current[i] = el
              }}
            >
              <button
                type="button"
                onClick={() => handleSelect(i)}
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  'block w-full rounded-md py-1.5 pr-2 text-left leading-5 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none',
                  isActive
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground hover:text-foreground/80',
                )}
                style={{ paddingLeft: RAIL_X + (item.depth ?? 0) * indent + LABEL_GAP }}
              >
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
