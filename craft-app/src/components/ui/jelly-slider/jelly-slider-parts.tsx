import { useMotionValueEvent, useTransform, type MotionValue } from 'motion/react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { GOO_BLUR, GOO_MATRIX, MAJOR_EVERY, MARK_COUNT, THUMB_RADIUS } from './jelly-slider.constants'
import { litMarks, type Range } from './jelly-slider.utils'

export function GooFilter({ id }: { id: string }) {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation={GOO_BLUR} result="blur" />
        <feColorMatrix in="blur" mode="matrix" values={GOO_MATRIX} result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </svg>
  )
}

// each mark sits under the thumb centre for its value, so the scale lines up with the thumb
const markLeft = (fraction: number) =>
  `calc(${THUMB_RADIUS}px + (100% - ${THUMB_RADIUS * 2}px) * ${fraction})`

const MARKS = Array.from({ length: MARK_COUNT }, (_, index) => ({
  index,
  fraction: index / (MARK_COUNT - 1),
  major: index % MAJOR_EVERY === 0,
}))

/** Marks the value has passed light up, so the scale reads like the fill. */
export function JellyScale({
  shown,
  range,
  format,
}: {
  shown: MotionValue<number>
  range: Range
  format: (value: number) => string
}) {
  const lit = useTransform(shown, (value) => litMarks(value, range))
  // only changes when the thumb crosses a mark, at most 21 times a sweep
  const [passed, setPassed] = useState(() => lit.get())
  useMotionValueEvent(lit, 'change', setPassed)

  return (
    <div aria-hidden className="mt-2">
      <div className="relative h-2">
        {MARKS.map(({ index, fraction, major }) => {
          const on = index <= passed
          return (
            <span
              key={index}
              className={cn(
                'absolute top-0 -ml-[0.75px] w-[1.5px] rounded-[1px] transition-colors duration-200',
                major ? 'h-2 bg-muted-foreground' : 'h-1 bg-foreground/[0.14]',
                on && (major ? 'bg-foreground' : 'bg-foreground/80'),
              )}
              style={{ left: markLeft(fraction) }}
            />
          )
        })}
      </div>
      <div className="relative mt-1.5 h-3.5 text-[11px] leading-[14px] font-medium tracking-[0.01em] text-muted-foreground tabular-nums">
        {MARKS.filter((mark) => mark.major).map(({ index, fraction }) => (
          <span
            key={index}
            className={cn(
              'absolute top-0 -translate-x-1/2 transition-colors duration-200',
              index <= passed && 'text-foreground/80',
            )}
            style={{ left: markLeft(fraction) }}
          >
            {format(range.min + (range.max - range.min) * fraction)}
          </span>
        ))}
      </div>
    </div>
  )
}
