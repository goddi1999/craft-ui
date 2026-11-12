import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

import { cn } from '@/lib/utils'

import {
  FADE,
  NARROW,
  PAD,
  REVEAL,
  SCRUB_SPRING,
  TIP_WIDTH,
} from './interactive-area-chart.constants'
import type { InteractiveAreaChartProps } from './interactive-area-chart.types'
import {
  DEFAULT_AREA_CHART_DATA,
  areaPath,
  clamp,
  curveY,
  formatValue,
  indexToX,
  linePath,
  plotBottom,
  plotWidth,
  toSeries,
} from './interactive-area-chart.utils'
import { ChartGrid, ChartHeader, ChartTooltip, RangeTabs } from './interactive-area-chart-parts'
import { useCurveMorph } from './use-curve-morph'
import { useWidth } from './use-width'

/**
 * A hand-drawn SVG area chart. Switching ranges morphs the curve point for point, and
 * scrubbing with a pointer or the arrow keys moves a spring-tracked crosshair and tooltip
 * while the header shows the value under it. Adapted from EasyUI.
 */
export function InteractiveAreaChart({
  data = DEFAULT_AREA_CHART_DATA,
  defaultRange = '30D',
  title = 'Revenue',
  height = 280,
  className,
  ...props
}: InteractiveAreaChartProps) {
  // svg ids can't hold the colons or guillemets useId may return
  const id = `iac${useId().replace(/[^\w-]/g, '')}`
  const reduced = useReducedMotion() ?? false
  const model = useMemo(() => toSeries(data), [data])
  const ranges = Object.keys(model)

  const [range, setRange] = useState(() =>
    ranges.includes(defaultRange) ? defaultRange : ranges[0],
  )
  const [hover, setHover] = useState<number | null>(null)
  // the tooltip keeps showing the last point while it fades out
  const [tipIndex, setTipIndex] = useState(0)
  const [chartRef, width] = useWidth<HTMLDivElement>()

  // new data might not have the range that was picked
  const active = model[range] ? range : ranges[0]
  const series = model[active]
  const { points } = series
  const length = points.length
  const plot = plotWidth(width)

  const curve = useCurveMorph(series.normalized, reduced)
  const reveal = useMotionValue(reduced ? 1 : 0)
  const scrubX = useMotionValue(0)
  const scrub = useSpring(scrubX, SCRUB_SPRING)
  const started = useRef(false)

  // every motion value is read before any early return, so all of them stay subscribed
  const line = useTransform(() => {
    const samples = curve.get()
    return width ? linePath(samples, width, height) : 'M0 0'
  })
  const area = useTransform(() => {
    const samples = curve.get()
    return width ? areaPath(samples, width, height) : 'M0 0'
  })
  const clipWidth = useTransform(() => {
    const r = reveal.get()
    return r >= 0.999 ? width : PAD.left + Math.max(0, width - PAD.left - PAD.right) * r
  })
  const leadX = useTransform(
    () => PAD.left + Math.max(0, width - PAD.left - PAD.right) * reveal.get(),
  )
  const leadY = useTransform(() => curveY(curve.get(), reveal.get(), height))
  const leadOpacity = useTransform(reveal, [0, 0.02, 0.96, 1], [0, 1, 1, 0])
  const dotY = useTransform(() => curveY(curve.get(), (scrub.get() - PAD.left) / plot, height))
  const tipX = useTransform(() =>
    clamp(scrub.get() - TIP_WIDTH / 2, 0, Math.max(0, width - TIP_WIDTH)),
  )

  // draw the line in once the width is known
  useEffect(() => {
    if (!width || started.current) return
    started.current = true
    if (reduced) reveal.set(1)
    else animate(reveal, 1, REVEAL)
  }, [width, reduced, reveal])

  const changeRange = (next: string) => {
    if (next === active) return
    setRange(next)
    setHover(null)
  }

  // snap to the nearest real point, the spring smooths the visuals
  const moveTo = (index: number) => {
    const x = indexToX(index, length, width)
    scrubX.set(x)
    // jump on the first hover, so the crosshair does not sweep in from the left
    if (hover === null || reduced) scrub.jump(x)
    setTipIndex(index)
    setHover(index)
  }

  const onScrub = (event: PointerEvent<SVGRectElement>) => {
    const box = event.currentTarget.ownerSVGElement?.getBoundingClientRect()
    if (!box) return
    const fraction = clamp((event.clientX - box.left - PAD.left) / plot, 0, 1)
    moveTo(Math.round(fraction * (length - 1)))
  }

  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      const step = event.key === 'ArrowRight' ? 1 : -1
      moveTo(clamp((hover ?? length - 1) + step, 0, length - 1))
    } else if (event.key === 'Escape') setHover(null)
  }

  const scrubbing = hover !== null
  const shown = points[Math.min(hover ?? length - 1, length - 1)]
  const tipPoint = points[Math.min(tipIndex, length - 1)]
  const bottom = plotBottom(height)
  const summary = `${title}, last ${active}: from ${formatValue(points[0].value)} to ${formatValue(points[length - 1].value)}.`

  return (
    <div data-slot="interactive-area-chart" className={cn('w-full', className)} {...props}>
      <div className="mb-4 flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <ChartHeader
          title={title}
          shown={shown}
          first={points[0]}
          range={active}
          scrubbing={scrubbing}
        />
        <RangeTabs
          id={id}
          ranges={ranges}
          active={active}
          reduced={reduced}
          onChange={changeRange}
        />
      </div>

      <div ref={chartRef} className="relative" style={{ height }}>
        {width > 0 && (
          <>
            <svg
              width={width}
              height={height}
              role="img"
              tabIndex={0}
              aria-label={`${summary} Use left and right arrow keys to inspect values.`}
              className="block rounded-md text-foreground outline-none select-none focus-visible:ring-2 focus-visible:ring-ring"
              onKeyDown={onKeyDown}
              onBlur={() => setHover(null)}
            >
              <defs>
                <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
                </linearGradient>
                <clipPath id={`${id}-clip`}>
                  <motion.rect x={0} y={0} height={height} width={clipWidth} />
                </clipPath>
              </defs>

              <AnimatePresence>
                <ChartGrid
                  key={active}
                  series={series}
                  width={width}
                  height={height}
                  narrow={width < NARROW}
                />
              </AnimatePresence>

              {/* drawn in from the left on load */}
              <g clipPath={`url(#${id}-clip)`}>
                <motion.path d={area} fill={`url(#${id}-fill)`} />
                <motion.path
                  d={line}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <motion.circle
                cx={leadX}
                cy={leadY}
                r={3.5}
                fill="currentColor"
                style={{ opacity: leadOpacity }}
              />

              <motion.g
                initial={false}
                animate={{ opacity: scrubbing ? 1 : 0 }}
                transition={FADE}
                pointerEvents="none"
              >
                <motion.line
                  x1={scrub}
                  x2={scrub}
                  y1={PAD.top - 6}
                  y2={bottom}
                  stroke="currentColor"
                  strokeOpacity={0.3}
                  strokeDasharray="3 3"
                />
                <motion.circle
                  cx={scrub}
                  cy={dotY}
                  r={4.5}
                  stroke="currentColor"
                  strokeWidth={2}
                  className="fill-background"
                />
              </motion.g>

              <rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill="transparent"
                style={{ touchAction: 'pan-y', cursor: 'crosshair' }}
                onPointerMove={onScrub}
                onPointerDown={onScrub}
                onPointerLeave={() => setHover(null)}
              />
            </svg>

            <ChartTooltip point={tipPoint} x={tipX} visible={scrubbing} />
          </>
        )}
      </div>
    </div>
  )
}
