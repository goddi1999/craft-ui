import type { CSSProperties, ReactNode } from 'react'
import { motion, type MotionValue } from 'motion/react'

import { cn } from '@/lib/utils'

import { H2, S, TAPE_W } from './package-box.constants'
import type { ResolvedSlip } from './package-box.types'
import { FACE, mix } from './package-box.utils'

const BOX = 'var(--box)'

const fill: CSSProperties = {
  position: 'absolute',
  inset: 0,
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  pointerEvents: 'auto',
}

const preserve: CSSProperties = { transformStyle: 'preserve-3d' }

export function Sticker() {
  return (
    <div
      className="h-full w-full rounded-[2px] bg-[#f6f4ef] p-[5%]"
      style={{ boxShadow: '0 1px 2px rgba(40,20,5,0.35)' }}
      aria-hidden
    >
      <div className="h-[8%] w-[70%] rounded-[1px] bg-neutral-700/80" />
      <div className="mt-[7%] flex h-[52%] gap-[8%]">
        <div
          className="w-[46%]"
          style={{
            background:
              'repeating-linear-gradient(90deg,#26231f 0 1px,transparent 1px 2px,#26231f 2px 4px,transparent 4px 5px)',
          }}
        />
        <div className="flex flex-1 flex-col justify-between py-[3%]">
          <span className="block h-[10%] w-full rounded-[1px] bg-neutral-400/80" />
          <span className="block h-[10%] w-[80%] rounded-[1px] bg-neutral-400/80" />
          <span className="block h-[10%] w-full rounded-[1px] bg-neutral-400/80" />
          <span className="block h-[10%] w-[60%] rounded-[1px] bg-neutral-400/80" />
        </div>
      </div>
      <div className="mt-[6%] h-[14%] w-full rounded-[1px] bg-neutral-300/90" />
    </div>
  )
}

export function Symbols() {
  const ink = mix(BOX, '#24130a', 72)
  return (
    <svg
      viewBox="0 0 100 64"
      className="h-full w-full"
      aria-hidden
      style={{ color: ink, opacity: 0.85 }}
    >
      <path d="M8 6h38c0 15-8 23-19 23S8 21 8 6Z" fill="currentColor" />
      <path
        d="M17 6l5 8-6 5 6 6"
        fill="none"
        stroke={mix(BOX, 'black', 26)}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M27 29v22M15 53h24"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g fill="currentColor">
        <rect x="66" y="22" width="5" height="28" rx="1" />
        <path d="M68.5 8l8 15h-16Z" />
        <rect x="84" y="22" width="5" height="28" rx="1" />
        <path d="M86.5 8l8 15h-16Z" />
      </g>
      <path d="M62 56h36" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}

export function Slip({ data }: { data: ResolvedSlip }) {
  const soft: CSSProperties = {
    color: 'color-mix(in srgb, var(--ink) 52%, transparent)',
  }
  const rule = (
    <div
      className="my-3 border-t"
      style={{ borderColor: 'color-mix(in srgb, var(--ink) 14%, transparent)' }}
    />
  )

  return (
    <div className="flex h-full flex-col px-6 pt-6 pb-5">
      <div
        className="flex items-center justify-between text-[8.5px] font-medium tracking-[0.18em] uppercase"
        style={soft}
      >
        <span>{data.eyebrow}</span>
        <span className="font-mono tracking-normal">{data.reference}</span>
      </div>

      <h3 className="mt-4 font-serif text-[22px] leading-[1.08] tracking-[-0.02em]">
        {data.title}
      </h3>
      <p className="mt-1.5 text-[10.5px] leading-snug" style={soft}>
        {data.subtitle}
      </p>

      {rule}

      <div className="grid grid-cols-[1fr_auto] gap-x-4 text-[10px] leading-snug">
        <div>
          <p style={soft}>Ship to</p>
          <p className="mt-0.5 font-medium">{data.recipient}</p>
          <p style={soft}>{data.address}</p>
        </div>
        <div className="text-right">
          <p style={soft}>Date</p>
          <p className="mt-0.5 font-medium tabular-nums">{data.date}</p>
        </div>
      </div>

      {rule}

      <ul className="space-y-1.5 text-[10.5px]">
        {data.items.map((it, i) => (
          <li key={i} className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 truncate">
              {it.qty && it.qty > 1 ? `${it.qty}× ` : ''}
              {it.name}
            </span>
            {it.price && <span className="shrink-0 tabular-nums">{it.price}</span>}
          </li>
        ))}
      </ul>

      <div
        className="mt-3 flex items-baseline justify-between border-t pt-2.5"
        style={{ borderColor: 'color-mix(in srgb, var(--ink) 14%, transparent)' }}
      >
        <span
          className="text-[8.5px] font-medium tracking-[0.18em] uppercase"
          style={soft}
        >
          Total
        </span>
        <span className="font-serif text-[18px] leading-none tracking-[-0.02em] tabular-nums">
          {data.total}
        </span>
      </div>

      <div className="mt-auto flex items-end justify-between">
        <svg
          viewBox="0 0 70 26"
          className="h-6 w-[68px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          style={{ opacity: 0.7 }}
        >
          <path d="M2 20c7-14 12-17 14-8s-5 13 0 11 9-17 14-13-3 11 2 9 9-9 14-7 6 6 11 2" />
        </svg>
        {data.stamp && (
          <span
            className="grid h-[46px] w-[46px] -rotate-[10deg] place-items-center rounded-full border-[1.5px] text-[7.5px] font-semibold tracking-[0.16em] uppercase"
            style={{
              color: 'var(--accent)',
              borderColor: 'var(--accent)',
              opacity: 0.85,
              mixBlendMode: 'multiply',
            }}
          >
            {data.stamp}
          </span>
        )}
      </div>
    </div>
  )
}

export function Wall({
  transform,
  outer,
  outerStyle,
  inner = FACE.inside,
  children,
  flap,
}: {
  transform: string
  outer: string
  outerStyle?: CSSProperties
  inner?: string
  children?: ReactNode
  flap?: ReactNode
}) {
  return (
    <div style={{ position: 'absolute', inset: 0, transform, ...preserve }}>
      <div style={{ ...fill, background: outer, borderRadius: 5, ...outerStyle }}>
        {children}
      </div>
      <div
        style={{
          ...fill,
          background: inner,
          borderRadius: 5,
          transform: 'rotateY(180deg)',
        }}
      />
      {flap}
    </div>
  )
}

export function Flap({
  angle,
  minor,
  tapeHalf,
}: {
  angle: MotionValue<number>
  minor?: boolean
  tapeHalf?: ReactNode
}) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0,
        top: minor ? 1.5 : 0,
        width: S,
        height: H2,
        transformOrigin: '50% 0%',
        rotateX: angle,
        ...preserve,
      }}
    >
      <div
        style={{
          ...fill,
          background: FACE.underside,
          borderRadius: '0 0 4px 4px',
        }}
      />
      <div
        style={{
          ...fill,
          background: FACE.top,
          borderRadius: '0 0 4px 4px',
          transform: 'rotateY(180deg)',
          boxShadow: 'inset 0 -1px 0 rgba(60,30,5,0.28)',
        }}
      >
        {tapeHalf}
      </div>
    </motion.div>
  )
}

/** Tape that wraps down the side of the box and gets cut along the seam. */
export function TapeTail({
  cut,
  style,
}: {
  cut: MotionValue<number>
  style: CSSProperties
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `calc(50% - ${TAPE_W / 2}px)`,
        top: 0,
        width: TAPE_W,
        height: S * 0.3,
        borderRadius: '0 0 2px 2px',
        ...style,
      }}
    >
      <motion.span
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: 1,
          background: 'rgba(70,40,15,0.5)',
          opacity: cut,
        }}
      />
    </div>
  )
}

export function HintButton({
  hint,
  isOpen,
  openLabel,
  closeLabel,
  paperId,
  onToggle,
}: {
  hint: boolean
  isOpen: boolean
  openLabel: string
  closeLabel: string
  paperId: string
  onToggle: () => void
}) {
  return (
    <div className="mt-1 flex justify-center">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={paperId}
        className={
          hint
            ? cn(
                'inline-flex h-9 touch-manipulation items-center rounded-full px-4 text-[12.5px] font-medium text-muted-foreground outline-none transition-[color,background-color,transform] duration-150 select-none',
                '[-webkit-tap-highlight-color:transparent] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring motion-reduce:active:scale-100',
                '[@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/5 [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground',
              )
            : 'sr-only'
        }
      >
        {isOpen ? closeLabel : openLabel}
      </button>
    </div>
  )
}
