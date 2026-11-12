import { motion, type MotionValue } from 'motion/react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { GRID_STYLE, QR_CELLS } from './parallax-ticket.constants'
import type { ParallaxTicketDetail } from './parallax-ticket.types'
import { QR_FINDERS, qrPath } from './parallax-ticket.utils'

const SIDE = 'absolute inset-0 overflow-hidden rounded-3xl bg-muted backface-hidden'
const QR_PATH = qrPath()

export function TicketFront({
  title,
  subtitle,
  code,
  image,
  hidden,
  imageX,
  imageY,
  textX,
  textY,
  glareImage,
  glareOpacity,
}: {
  title: ReactNode
  subtitle?: ReactNode
  code?: ReactNode
  image?: string
  hidden: boolean
  imageX: MotionValue<number>
  imageY: MotionValue<number>
  textX: MotionValue<number>
  textY: MotionValue<number>
  glareImage: MotionValue<string>
  glareOpacity: MotionValue<number>
}) {
  return (
    <div aria-hidden={hidden} className={SIDE}>
      {/* 20px of bleed so the edges never show while it slides */}
      <motion.div
        className={cn('pointer-events-none absolute -inset-5 will-change-transform', image && 'bg-black')}
        style={{ x: imageX, y: imageY, ...(image ? undefined : GRID_STYLE) }}
      >
        {image ? (
          <img src={image} alt="" draggable={false} className="size-full object-cover" />
        ) : null}
      </motion.div>
      {/* keeps white text readable on any picture */}
      {image ? (
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent from-45% to-black/50" />
      ) : null}
      <motion.div
        className="pointer-events-none absolute inset-0 will-change-transform"
        style={{ x: textX, y: textY }}
      >
        <div
          className={cn(
            'absolute right-6 bottom-[62px] left-6 text-[44px] leading-[0.95] font-semibold tracking-[-0.04em]',
            image ? 'text-white' : 'text-foreground',
          )}
        >
          {title}
        </div>
        {subtitle || code ? (
          <div
            className={cn(
              'absolute inset-x-6 bottom-[26px] flex items-center justify-between gap-3 text-[13px]',
              image ? 'text-white/75' : 'text-muted-foreground',
            )}
          >
            <span>{subtitle}</span>
            <span
              className={cn('font-medium tabular-nums', image ? 'text-white' : 'text-foreground')}
            >
              {code}
            </span>
          </div>
        ) : null}
      </motion.div>
      <motion.div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{ backgroundImage: glareImage, opacity: glareOpacity }}
      />
    </div>
  )
}

// black on white in both themes, a code has to scan
function TicketCode() {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${QR_CELLS} ${QR_CELLS}`}
      shapeRendering="crispEdges"
      className="block size-full"
    >
      <path d={QR_PATH} fill="#000" />
      {QR_FINDERS.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width={7} height={7} fill="#000" />
          <rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" />
          <rect x={x + 2} y={y + 2} width={3} height={3} fill="#000" />
        </g>
      ))}
    </svg>
  )
}

export function TicketBack({
  details,
  hint,
  hidden,
}: {
  details: readonly ParallaxTicketDetail[]
  hint?: ReactNode
  hidden: boolean
}) {
  return (
    <div
      aria-hidden={hidden}
      className={cn(SIDE, 'flex rotate-y-180 flex-col items-center justify-center gap-4 p-6')}
    >
      <div className="size-42 rounded-2xl bg-white p-3">
        <TicketCode />
      </div>
      {details.length > 0 ? (
        <dl className="flex gap-[22px] text-center">
          {details.map((detail) => (
            <div key={detail.label}>
              <dt className="text-[11px] text-muted-foreground">{detail.label}</dt>
              <dd className="mt-0.5 text-base font-semibold text-foreground">{detail.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </div>
  )
}
