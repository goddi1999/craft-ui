import { motion, useTransform, type MotionValue } from 'motion/react'

import { cn } from '@/lib/utils'

import { CARD_GAP, PAGE_GAP, RADIUS } from './history-overview.constants'
import type { HistoryPage } from './history-overview.types'

type Geometry = { width: number; height: number; scale: number }

/** Where card `index` sits for a given zoom (0 page, 1 strip) and focus (centred index). */
function placement(index: number, zoom: number, focus: number, { width, scale }: Geometry) {
  const size = 1 + (scale - 1) * zoom
  const spacing = (width + PAGE_GAP) * (1 - zoom) + (width * scale + CARD_GAP) * zoom
  return { x: (index - focus) * spacing, size }
}

/** One page: full size on screen, a scaled card in the strip, and everything between. */
export function HistoryCard({
  page,
  index,
  zoom,
  focus,
  geometry,
  overview,
  current,
  onOpen,
}: {
  page: HistoryPage
  index: number
  zoom: MotionValue<number>
  focus: MotionValue<number>
  geometry: Geometry
  overview: boolean
  current: boolean
  onOpen: () => void
}) {
  const transform = useTransform(() => {
    const { x, size } = placement(index, zoom.get(), focus.get(), geometry)
    return `translateX(${x}px) scale(${size})`
  })
  // the title bar is drawn at its real size above the card, not scaled with it
  const labelTransform = useTransform(() => {
    const { x, size } = placement(index, zoom.get(), focus.get(), geometry)
    const left = x - (geometry.width * size) / 2
    const top = -(geometry.height * size) / 2 - 24
    return `translate(${left}px, ${top}px)`
  })
  const labelOpacity = useTransform(zoom, [0.6, 1], [0, 1])
  const radius = useTransform(() => RADIUS / placement(index, zoom.get(), focus.get(), geometry).size)

  return (
    <>
      <motion.div
        aria-hidden={!overview && !current}
        inert={!overview && !current}
        className="absolute top-0 left-0 overflow-hidden bg-background shadow-[0_20px_50px_-20px_rgb(0_0_0/0.6)]"
        style={{
          width: geometry.width,
          height: geometry.height,
          transform,
          borderRadius: radius,
          willChange: 'transform',
        }}
      >
        <div className={cn('size-full', overview && 'pointer-events-none select-none')}>{page.content}</div>
        {overview && (
          <button
            type="button"
            onClick={onOpen}
            aria-label={`Open ${page.title}`}
            className="absolute inset-0 cursor-pointer outline-none focus-visible:ring-[6px] focus-visible:ring-white/80 focus-visible:ring-inset"
          />
        )}
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 flex max-w-48 items-center gap-1.5 text-[11px] font-medium whitespace-nowrap text-white/75"
        style={{ transform: labelTransform, opacity: labelOpacity }}
      >
        {page.icon && <span className="grid size-3.5 shrink-0 place-items-center">{page.icon}</span>}
        <span className="truncate">{page.title}</span>
      </motion.div>
    </>
  )
}
