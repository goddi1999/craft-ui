import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

import { cn } from '@/lib/utils'

export type OptionWheelSide = 'left' | 'right'

export type OptionWheelProps = Omit<ComponentProps<'div'>, 'onChange'> & {
  items?: string[]
  defaultSelected?: number
  selectedIndex?: number
  onChange?: (index: number, item: string) => void
  textColor?: string
  activeColor?: string
  side?: OptionWheelSide
  fontSize?: number
  spacing?: number
  curve?: number
  tilt?: number
  blur?: number
  fade?: number
  minOpacity?: number
  smoothing?: number
  inset?: number
  loop?: boolean
  draggable?: boolean
  soundUrl?: string
  soundVolume?: number
}

type WheelConfig = {
  count: number
  items: string[]
  rowH: number
  curve: number
  tilt: number
  blur: number
  fade: number
  minOpacity: number
  side: OptionWheelSide
  loop: boolean
  smoothing: number
  draggable: boolean
  soundUrl: string
  soundVolume: number
}

const DEFAULT_ITEMS = [
  'Ambient',
  'House',
  'Techno',
  'Jazz',
  'Lo-Fi',
  'Synthwave',
  'Trance',
  'Funk',
  'Disco',
  'Hip-Hop',
  'Chillwave',
  'Drum & Bass',
]

/** Room kept between the longest label and the far edge, in px. */
const EDGE_GAP = 8

const getRemPx = () =>
  typeof window === 'undefined'
    ? 16
    : parseFloat(getComputedStyle(document.documentElement).fontSize) || 16

/**
 * A curved, draggable picker that bends its options along an arc and blurs
 * them as they fall away from the centre. Labels shrink to fit when the wheel
 * is narrower than the longest one.
 */
export function OptionWheel({
  items = DEFAULT_ITEMS,
  defaultSelected = 3,
  selectedIndex: selectedIndexProp,
  onChange,
  textColor = '#a6a6a6',
  activeColor = '#ffffff',
  side = 'left',
  fontSize = 3,
  spacing = 1.4,
  curve = 1,
  tilt = 6,
  blur = 2,
  fade = 0.25,
  minOpacity = 0.05,
  smoothing = 200,
  inset = 80,
  loop = false,
  draggable = true,
  soundUrl = '',
  soundVolume = 0.5,
  className,
  style,
  ...props
}: OptionWheelProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const posRef = useRef(defaultSelected)
  const targetRef = useRef(defaultSelected)
  const rafRef = useRef<number | null>(null)
  const lastRef = useRef(0)
  const cfgRef = useRef<WheelConfig | null>(null)
  const onChangeRef = useRef(onChange)
  const selectedRef = useRef(defaultSelected)
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dragRef = useRef<{ y: number; start: number; id: number } | null>(null)
  const dragMovedRef = useRef(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef('')
  const lastTickRef = useRef(0)
  const [selectedIndex, setSelectedIndex] = useState(defaultSelected)
  const [isDragging, setIsDragging] = useState(false)
  /** 0–1: how much the labels shrink so the longest still fits. */
  const [fit, setFit] = useState(1)

  const fontPx = fontSize * getRemPx() * fit
  const config: WheelConfig = {
    count: items.length,
    items,
    rowH: Math.max(fontPx * spacing, 1),
    curve,
    tilt,
    blur,
    fade,
    minOpacity,
    side,
    loop,
    smoothing,
    draggable,
    soundUrl,
    soundVolume,
  }

  useLayoutEffect(() => {
    cfgRef.current = config
    onChangeRef.current = onChange
  })

  // Measure the widest label at full size against the room beside the inset.
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || typeof ResizeObserver === 'undefined') return

    const measure = () => {
      const fullPx = fontSize * getRemPx()
      const widest = Math.max(
        0,
        ...itemRefs.current.map((el) => {
          if (!el) return 0
          const shown = parseFloat(getComputedStyle(el).fontSize) || fullPx
          return (el.scrollWidth / shown) * fullPx
        }),
      )
      const room = root.clientWidth - inset - EDGE_GAP
      setFit(widest > 0 && room > 0 ? Math.min(1, room / widest) : 1)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [items, fontSize, inset])

  const runFrame = useCallback(function frame(now: number) {
    const cfg = cfgRef.current
    if (!cfg) return
    const dt = Math.min((now - lastRef.current) / 1000, 0.05)
    lastRef.current = now
    const tau = Math.max(cfg.smoothing, 1) / 1000
    const k = 1 - Math.exp(-dt / tau)

    const target = targetRef.current
    const cur = posRef.current
    let next = cur + (target - cur) * k
    const settled = Math.abs(target - next) < 0.001
    if (settled) next = target
    posRef.current = next

    const els = itemRefs.current
    const n = cfg.count
    const mirror = cfg.side === 'right' ? -1 : 1
    const tiltRad = (cfg.tilt * Math.PI) / 180
    const R = tiltRad > 0.0005 ? cfg.rowH / tiltRad : 0

    for (let i = 0; i < n; i++) {
      const el = els[i]
      if (!el) continue
      let d = i - next
      if (cfg.loop && n > 1) {
        d = ((d % n) + n) % n
        if (d > n / 2) d -= n
      }
      const dist = Math.abs(d)
      let x = 0
      let y = d * cfg.rowH
      let rot = 0
      if (R > 0) {
        const ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad))
        y = R * Math.sin(ang)
        x = -mirror * R * (1 - Math.cos(ang)) * cfg.curve
        rot = (mirror * ang * 180) / Math.PI
      }
      el.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rot.toFixed(3)}deg)`
      el.style.opacity = String(Math.max(cfg.minOpacity, 1 - dist * cfg.fade))
      el.style.filter =
        cfg.blur > 0 ? `blur(${(dist * cfg.blur).toFixed(2)}px)` : 'none'
      el.style.setProperty('--ow-p', Math.max(0, 1 - Math.min(dist, 1)).toFixed(4))
    }

    rafRef.current = settled ? null : requestAnimationFrame(frame)
  }, [])

  const startLoop = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    lastRef.current = performance.now()
    rafRef.current = requestAnimationFrame(runFrame)
  }, [runFrame])

  const playTick = useCallback(() => {
    const cfg = cfgRef.current
    if (!cfg?.soundUrl) return
    const now = performance.now()
    if (now - lastTickRef.current < 70) return
    lastTickRef.current = now
    if (!audioRef.current || audioUrlRef.current !== cfg.soundUrl) {
      audioRef.current = new Audio(cfg.soundUrl)
      audioRef.current.preload = 'auto'
      audioUrlRef.current = cfg.soundUrl
    }
    const audio = audioRef.current
    audio.volume = Math.min(Math.max(cfg.soundVolume, 0), 1)
    audio.currentTime = 0
    audio.play()?.catch(() => {})
  }, [])

  const applyTarget = useCallback(
    (value: number, snap: boolean) => {
      const cfg = cfgRef.current
      if (!cfg || cfg.count === 0) return
      let v = value
      if (!cfg.loop) v = Math.min(Math.max(v, 0), Math.max(cfg.count - 1, 0))
      if (snap) v = Math.round(v)
      targetRef.current = v
      const idx = ((Math.round(v) % cfg.count) + cfg.count) % cfg.count
      if (idx !== selectedRef.current) {
        selectedRef.current = idx
        setSelectedIndex(idx)
        onChangeRef.current?.(idx, cfg.items[idx])
        playTick()
      }
      startLoop()
    },
    [startLoop, playTick],
  )

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const handleWheel = (e: WheelEvent) => {
      const cfg = cfgRef.current
      if (!cfg) return
      e.preventDefault()
      const delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY
      const step = Math.max(-1, Math.min(1, delta / cfg.rowH))
      applyTarget(targetRef.current + step, false)
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current)
      wheelTimerRef.current = setTimeout(
        () => applyTarget(targetRef.current, true),
        140,
      )
    }
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', handleWheel)
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current)
    }
  }, [applyTarget])

  const handlePointerDown = (e: PointerEvent) => {
    if (!cfgRef.current?.draggable) return
    dragRef.current = { y: e.clientY, start: targetRef.current, id: e.pointerId }
    dragMovedRef.current = false
    setIsDragging(true)
  }

  const handlePointerMove = (e: PointerEvent) => {
    const drag = dragRef.current
    const cfg = cfgRef.current
    if (!drag || !cfg) return
    const dy = e.clientY - drag.y
    if (!dragMovedRef.current && Math.abs(dy) > 4) {
      dragMovedRef.current = true
      rootRef.current?.setPointerCapture(drag.id)
    }
    if (dragMovedRef.current) applyTarget(drag.start - dy / cfg.rowH, false)
  }

  const handlePointerEnd = () => {
    if (!dragRef.current) return
    dragRef.current = null
    setIsDragging(false)
    if (dragMovedRef.current) applyTarget(targetRef.current, true)
  }

  const handleItemClick = (index: number) => {
    const cfg = cfgRef.current
    if (dragMovedRef.current || !cfg) return
    const cur = targetRef.current
    let d = index - (((cur % cfg.count) + cfg.count) % cfg.count)
    if (cfg.loop && cfg.count > 1) {
      if (d > cfg.count / 2) d -= cfg.count
      else if (d < -cfg.count / 2) d += cfg.count
    }
    applyTarget(cur + d, true)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    let delta: number | null = null
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') delta = -1
    else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') delta = 1
    if (delta == null) return
    e.preventDefault()
    applyTarget(Math.round(targetRef.current) + delta, true)
  }

  // Re-lay the items whenever anything that shapes the wheel changes.
  useEffect(() => {
    applyTarget(targetRef.current, false)
  }, [
    items,
    fontPx,
    spacing,
    curve,
    tilt,
    blur,
    fade,
    minOpacity,
    side,
    loop,
    smoothing,
    applyTarget,
  ])

  useEffect(() => {
    if (selectedIndexProp == null) return
    if (selectedIndexProp === selectedRef.current) return
    applyTarget(selectedIndexProp, true)
  }, [selectedIndexProp, applyTarget])

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      audioRef.current?.pause()
    },
    [],
  )

  const rootStyle = {
    ...style,
    '--ow-text-color': textColor,
    '--ow-active-color': activeColor,
    '--ow-font-size': `${fontPx}px`,
    '--ow-inset': `${inset}px`,
  } as CSSProperties

  return (
    <div
      ref={rootRef}
      role="listbox"
      tabIndex={0}
      aria-label="Option wheel"
      className={cn(
        'relative h-full w-full touch-none overflow-hidden outline-none select-none',
        isDragging ? 'cursor-grabbing' : 'cursor-grab',
        className,
      )}
      style={rootStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {items.map((label, index) => (
        <div
          key={`${label}-${index}`}
          ref={(el) => {
            itemRefs.current[index] = el
          }}
          role="option"
          aria-selected={selectedIndex === index}
          className={cn(
            'absolute top-1/2 cursor-pointer leading-none whitespace-nowrap will-change-[transform,opacity,filter]',
            side === 'right'
              ? 'right-[var(--ow-inset)] origin-right'
              : 'left-[var(--ow-inset)] origin-left',
            selectedIndex === index ? 'font-medium' : 'font-extralight',
          )}
          style={{
            fontSize: 'var(--ow-font-size)',
            color:
              'color-mix(in srgb, var(--ow-active-color) calc(var(--ow-p, 0) * 100%), var(--ow-text-color))',
          }}
          onClick={() => handleItemClick(index)}
        >
          {label}
        </div>
      ))}
    </div>
  )
}
