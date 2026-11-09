import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'

import { cn } from '@/lib/utils'

import {
  HOUR_LABELS,
  LINE,
  MINUTE_LABELS,
  PERIODS,
  PERSPECTIVE,
  RADIUS,
  STEP_DEG,
  TOTAL,
  hourFromIndex,
  isSameTime,
  minuteFromIndex,
  nearestIndex,
  pad2,
  periodFromIndex,
  periodIndex,
  toTimeString,
  type BarrelTimeValue,
} from './barrel-time-input.utils'
import {
  useBarrelColumn,
  type BarrelColumnController,
} from './use-barrel-column'

import './barrel-time-input.css'

export type BarrelTimeInputProps = {
  /** Controlled time. */
  value?: BarrelTimeValue
  /** Initial time when uncontrolled. @default { hours: 7, minutes: 30, period: 'AM' } */
  defaultValue?: BarrelTimeValue
  /** Called whenever a barrel lands on a new row. */
  onChange?: (value: BarrelTimeValue) => void
  /** Accessible name for the group. @default 'Time' */
  label?: string
  /** Submits a hidden `HH:MM` (24-hour) field under this name. */
  name?: string
  /** Tilt the barrels and outline the hours ring to show how it is built. @default false */
  reveal?: boolean
  /** Extra classes for the root element. */
  className?: string
}

const DEFAULT_VALUE: BarrelTimeValue = { hours: 7, minutes: 30, period: 'AM' }
const HOUR_FACES = HOUR_LABELS.slice(0, TOTAL)
const MINUTE_FACES = MINUTE_LABELS.slice(0, TOTAL)

type BarrelColumnProps = {
  kind: 'hours' | 'minutes' | 'period'
  columnRef: BarrelColumnController['columnRef']
  wheelRef: BarrelColumnController['wheelRef']
  trackRef: BarrelColumnController['trackRef']
  pointerHandlers: BarrelColumnController['pointerHandlers']
  faces: readonly string[]
  track: readonly string[]
  ariaLabel: string
  valueNow: number
  valueText: string
  valueMin: number
  valueMax: number
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void
}

function BarrelColumn({
  kind,
  columnRef,
  wheelRef,
  trackRef,
  pointerHandlers,
  faces,
  track,
  ariaLabel,
  valueNow,
  valueText,
  valueMin,
  valueMax,
  onKeyDown,
}: BarrelColumnProps) {
  return (
    <div
      ref={columnRef}
      role="spinbutton"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuenow={valueNow}
      aria-valuetext={valueText}
      aria-valuemin={valueMin}
      aria-valuemax={valueMax}
      data-barrel-column=""
      data-kind={kind}
      onKeyDown={onKeyDown}
      {...pointerHandlers}
    >
      <div ref={wheelRef} data-barrel-wheel="" aria-hidden="true">
        {faces.map((face, index) => (
          <div
            key={index}
            data-barrel-face=""
            style={{ '--index': index } as CSSProperties}
          >
            {face}
          </div>
        ))}
      </div>
      <div data-barrel-visor="" aria-hidden="true">
        <div ref={trackRef} data-barrel-track="">
          {track.map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * An iOS-alarm style time picker: three 3D barrels (hours, minutes, AM/PM)
 * you can drag with inertia, scroll, tap, or drive from the keyboard. Rolling
 * hours past 11 ↔ 12 flips the period, like the real thing.
 */
export function BarrelTimeInput({
  value,
  defaultValue = DEFAULT_VALUE,
  onChange,
  label = 'Time',
  name,
  reveal = false,
  className,
}: BarrelTimeInputProps) {
  const isControlled = value !== undefined
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const current = isControlled ? value : uncontrolled
  const [initial] = useState(current)

  const valueRef = useRef(current)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  })

  const commit = (next: BarrelTimeValue) => {
    if (isSameTime(next, valueRef.current)) return
    valueRef.current = next
    if (!isControlled) setUncontrolled(next)
    onChangeRef.current?.(next)
  }

  const period = useBarrelColumn({
    initialIndex: periodIndex(initial.period),
    wrap: false,
    max: 1,
    onIndexChange: (index, _previous, driver) => {
      if (driver !== 'user') return
      commit({ ...valueRef.current, period: periodFromIndex(index) })
    },
  })

  const hours = useBarrelColumn({
    initialIndex: initial.hours % 12,
    wrap: true,
    max: TOTAL - 1,
    onIndexChange: (index, previous, driver) => {
      if (driver !== 'user') return
      const crossings = Math.floor(index / 12) - Math.floor(previous / 12)
      const flips = Math.abs(crossings) % 2 === 1
      const prev = valueRef.current
      const nextPeriod = flips ? (prev.period === 'AM' ? 'PM' : 'AM') : prev.period
      commit({ ...prev, hours: hourFromIndex(index), period: nextPeriod })
      if (flips) period.moveTo(periodIndex(nextPeriod))
    },
  })

  const minutes = useBarrelColumn({
    initialIndex: initial.minutes,
    wrap: true,
    max: TOTAL - 1,
    onIndexChange: (index, _previous, driver) => {
      if (driver !== 'user') return
      commit({ ...valueRef.current, minutes: minuteFromIndex(index) })
    },
  })

  // Mirror controlled values that did not come from the barrels themselves.
  useEffect(() => {
    if (!value || isSameTime(value, valueRef.current)) return
    valueRef.current = value
    hours.moveTo(nearestIndex(hours.getPosition(), value.hours % 12, 12))
    minutes.moveTo(nearestIndex(minutes.getPosition(), value.minutes, TOTAL))
    period.moveTo(periodIndex(value.period))
  }, [value, hours, minutes, period])

  /** Jump straight to a value (Home / End) without rolling through the rest. */
  const jump = (next: BarrelTimeValue) => {
    commit(next)
    hours.moveTo(nearestIndex(hours.getPosition(), next.hours % 12, 12))
    minutes.moveTo(nearestIndex(minutes.getPosition(), next.minutes, TOTAL))
  }

  const handleHoursKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keyMap: Record<string, () => void> = {
      ArrowUp: () => hours.step(1),
      ArrowDown: () => hours.step(-1),
      PageUp: () => hours.step(3),
      PageDown: () => hours.step(-3),
      Home: () => jump({ ...valueRef.current, hours: 1 }),
      End: () => jump({ ...valueRef.current, hours: 12 }),
    }
    const action = keyMap[event.key]
    if (!action) return
    event.preventDefault()
    action()
  }

  const handleMinutesKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keyMap: Record<string, () => void> = {
      ArrowUp: () => minutes.step(1),
      ArrowDown: () => minutes.step(-1),
      PageUp: () => minutes.step(5),
      PageDown: () => minutes.step(-5),
      Home: () => jump({ ...valueRef.current, minutes: 0 }),
      End: () => jump({ ...valueRef.current, minutes: 59 }),
    }
    const action = keyMap[event.key]
    if (!action) return
    event.preventDefault()
    action()
  }

  const handlePeriodKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = periodIndex(valueRef.current.period)
    const toAm = () => period.step(-currentIndex)
    const toPm = () => period.step(1 - currentIndex)
    const keyMap: Record<string, () => void> = {
      ArrowUp: toPm,
      ArrowDown: toAm,
      PageUp: toPm,
      PageDown: toAm,
      Home: toAm,
      End: toPm,
      a: toAm,
      A: toAm,
      p: toPm,
      P: toPm,
    }
    const action = keyMap[event.key]
    if (!action) return
    event.preventDefault()
    action()
  }

  const rootStyle = {
    '--barrel-line': `${LINE}px`,
    '--barrel-radius': `${RADIUS}px`,
    '--barrel-step': `${STEP_DEG}deg`,
    '--barrel-perspective': `${PERSPECTIVE}px`,
  } as CSSProperties

  return (
    <div
      data-slot="barrel-time-input"
      data-reveal={reveal || undefined}
      role="group"
      aria-label={label}
      className={cn(className)}
      style={rootStyle}
    >
      <div data-barrel-columns="">
        <BarrelColumn
          kind="hours"
          columnRef={hours.columnRef}
          wheelRef={hours.wheelRef}
          trackRef={hours.trackRef}
          pointerHandlers={hours.pointerHandlers}
          faces={HOUR_FACES}
          track={HOUR_LABELS}
          ariaLabel="Hours"
          valueNow={current.hours}
          valueText={String(current.hours)}
          valueMin={1}
          valueMax={12}
          onKeyDown={handleHoursKeyDown}
        />
        <BarrelColumn
          kind="minutes"
          columnRef={minutes.columnRef}
          wheelRef={minutes.wheelRef}
          trackRef={minutes.trackRef}
          pointerHandlers={minutes.pointerHandlers}
          faces={MINUTE_FACES}
          track={MINUTE_LABELS}
          ariaLabel="Minutes"
          valueNow={current.minutes}
          valueText={pad2(current.minutes)}
          valueMin={0}
          valueMax={59}
          onKeyDown={handleMinutesKeyDown}
        />
        <BarrelColumn
          kind="period"
          columnRef={period.columnRef}
          wheelRef={period.wheelRef}
          trackRef={period.trackRef}
          pointerHandlers={period.pointerHandlers}
          faces={PERIODS}
          track={PERIODS}
          ariaLabel="AM or PM"
          valueNow={periodIndex(current.period)}
          valueText={current.period}
          valueMin={0}
          valueMax={1}
          onKeyDown={handlePeriodKeyDown}
        />
      </div>
      {name ? (
        <input type="hidden" name={name} value={toTimeString(current)} />
      ) : null}
    </div>
  )
}
