import gsap from 'gsap'
import {
  useEffect,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
} from 'react'

import { cn } from '@/lib/utils'

import './canvas-pointer-lines.css'

type Cell = {
  x: number
  y: number
  a: number
  t: number
}

export type CanvasPointerLinesProps = {
  /** Grid cell size in CSS pixels. @default 28 */
  cell?: number
  /** Line length as a fraction of `cell` (0–1). @default 0.75 */
  lineLength?: number
  /** Canvas stroke width in CSS pixels. @default 3 */
  strokeWidth?: number
  /** Stroke opacity (0–1). @default 1 */
  alpha?: number
  /** How quickly lines ease toward the pointer (0–1). @default 0.15 */
  speed?: number
  /** Snap to target when rotation delta is below this. @default 0.01 */
  threshold?: number
  /** Radial spotlight mask that follows the pointer. @default true */
  spotlight?: boolean
  /** Spotlight radius in CSS pixels. @default 100 */
  maskSize?: number
  /** Spotlight falloff power (0–1); higher = tighter. @default 0.9 */
  intensity?: number
  /** Linear mask stop one (%). @default 100 */
  stopOne?: number
  /** Linear mask stop two (%). @default 100 */
  stopTwo?: number
  /** Linear mask angle in degrees. @default 0 */
  maskAngle?: number
  /** Frame width (CSS length or number of px). @default '100%' */
  width?: number | string
  /** Frame height (CSS length or number of px). @default 160 */
  height?: number | string
  className?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

type Config = {
  cell: number
  lineLength: number
  strokeWidth: number
  alpha: number
  speed: number
  threshold: number
}

const DEFAULTS: Config = {
  cell: 28,
  lineLength: 0.75,
  strokeWidth: 3,
  alpha: 1,
  speed: 0.15,
  threshold: 0.01,
}

function toCssSize(value: number | string | undefined, fallback: string) {
  if (value === undefined) return fallback
  return typeof value === 'number' ? `${value}px` : value
}

function shortestRotation(current: number, target: number) {
  let diff = target - current
  if (diff > Math.PI) diff -= 2 * Math.PI
  if (diff < -Math.PI) diff += 2 * Math.PI
  return diff
}

export function CanvasPointerLines({
  cell = DEFAULTS.cell,
  lineLength = DEFAULTS.lineLength,
  strokeWidth = DEFAULTS.strokeWidth,
  alpha = DEFAULTS.alpha,
  speed = DEFAULTS.speed,
  threshold = DEFAULTS.threshold,
  spotlight = true,
  maskSize = 100,
  intensity = 0.9,
  stopOne = 100,
  stopTwo = 100,
  maskAngle = 0,
  width = '100%',
  height = 160,
  className,
  style,
  ...props
}: CanvasPointerLinesProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cellsRef = useRef<Cell[]>([])
  const configRef = useRef<Config>({
    cell,
    lineLength,
    strokeWidth,
    alpha,
    speed,
    threshold,
  })

  configRef.current = {
    cell,
    lineLength,
    strokeWidth,
    alpha,
    speed,
    threshold,
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1

    const drawLines = () => {
      const { cell: c, lineLength: len, strokeWidth: sw, alpha: a } =
        configRef.current
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const stroke = getComputedStyle(root).color || 'canvasText'
      for (const cellItem of cellsRef.current) {
        ctx.save()
        ctx.translate(cellItem.x, cellItem.y)
        ctx.rotate(cellItem.a)
        ctx.beginPath()
        ctx.globalAlpha = a
        ctx.lineWidth = sw
        ctx.strokeStyle = stroke
        ctx.moveTo((c * len * -1) / 2, 0)
        ctx.lineTo((c * len) / 2, 0)
        ctx.stroke()
        ctx.restore()
      }
    }

    const initializeLines = () => {
      const { width: w, height: h } = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const next: Cell[] = []
      const size = configRef.current.cell
      for (let x = 0; x < w; x += size) {
        for (let y = 0; y < h; y += size) {
          next.push({
            x: x + size * 0.5,
            y: y + size * 0.5,
            a: 0,
            t: 0,
          })
        }
      }
      cellsRef.current = next
    }

    const syncLines = (event: PointerEvent) => {
      const { left, top } = canvas.getBoundingClientRect()
      const { x, y } = event
      root.style.setProperty('--mx', String(Math.floor(x - left)))
      root.style.setProperty('--my', String(Math.floor(y - top)))

      const { speed: s, threshold: thr } = configRef.current
      for (const cellItem of cellsRef.current) {
        const dx = x - (cellItem.x + left)
        const dy = y - (cellItem.y + top)
        const newAngle = Math.atan2(dy, dx)
        const diff = shortestRotation(cellItem.a, newAngle)

        if (Math.abs(diff) > thr) {
          cellItem.a += diff * s
          cellItem.a = ((cellItem.a + Math.PI) % (2 * Math.PI)) - Math.PI
        } else {
          cellItem.a = newAngle
        }
        cellItem.t = newAngle
      }
    }

    initializeLines()
    gsap.ticker.add(drawLines)

    const sizeObserver = new ResizeObserver(initializeLines)
    sizeObserver.observe(canvas)
    window.addEventListener('pointermove', syncLines)

    return () => {
      gsap.ticker.remove(drawLines)
      sizeObserver.disconnect()
      window.removeEventListener('pointermove', syncLines)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const { width: w, height: h } = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = Math.max(1, Math.floor(w * dpr))
    canvas.height = Math.max(1, Math.floor(h * dpr))
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const next: Cell[] = []
    for (let x = 0; x < w; x += cell) {
      for (let y = 0; y < h; y += cell) {
        next.push({
          x: x + cell * 0.5,
          y: y + cell * 0.5,
          a: 0,
          t: 0,
        })
      }
    }
    cellsRef.current = next
  }, [cell, width, height])

  const cssVars = {
    '--intensity': String(1 - intensity),
    '--mask-size': String(maskSize),
    '--mask-s1': String(stopOne),
    '--mask-s2': String(stopTwo),
    '--mask-angle': String(maskAngle),
    width: toCssSize(width, '100%'),
    height: toCssSize(height, '160px'),
  } as CSSProperties

  return (
    <div
      ref={rootRef}
      data-slot="canvas-pointer-lines"
      data-spotlight={spotlight ? 'true' : 'false'}
      className={cn(className)}
      style={{ ...cssVars, ...style }}
      {...props}
    >
      <div data-slot="canvas-pointer-lines-frame">
        <canvas ref={canvasRef} aria-hidden />
      </div>
    </div>
  )
}
