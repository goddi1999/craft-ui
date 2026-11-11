import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { GridRevealCaption } from './grid-reveal-caption'
import { drawScene, type Scene } from './grid-reveal.scene'
import { buildTree, readAverages } from './grid-reveal.tree'
import type { GridRevealProps } from './grid-reveal.types'
import { COLOR_MS, HOLD, WAIT_CAP, clamp01, selfPaced, smoothstep } from './grid-reveal.utils'

/**
 * A loading state for generated images: the frame opens as four cells and
 * keeps splitting the biggest one in two while the work runs. When `src`
 * arrives the cells take the image's average colours, the busiest regions
 * split first, and the photo fades in on top.
 */
export function GridReveal({
  src,
  alt = '',
  progress,
  aspect = 1,
  caption,
  estimatedDuration = 6000,
  onRevealComplete,
  onError,
  className,
  style,
  ...props
}: GridRevealProps) {
  const reduce = useReducedMotion() ?? false
  const ratio = Number.isFinite(aspect) && aspect > 0 ? aspect : 1
  const frameRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [loaded, setLoaded] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const [lastSrc, setLastSrc] = useState(src)
  if (src !== lastSrc) {
    setLastSrc(src)
    setLoaded(false)
    setRevealed(false)
  }

  const progressRef = useRef(progress)
  const durationRef = useRef(estimatedDuration)
  const doneRef = useRef(onRevealComplete)
  const errorRef = useRef(onError)

  useEffect(() => {
    progressRef.current = progress
    durationRef.current = estimatedDuration
    doneRef.current = onRevealComplete
    errorRef.current = onError
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const frame = frameRef.current
    if (!canvas || !frame) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { root, branches } = buildTree(ratio)

    const scene: Scene = {
      ctx,
      root,
      width: 0,
      height: 0,
      scale: 1,
      dark: false,
      clock: 0,
      split: 0,
      fade: 0,
      hasColors: false,
      image: null,
    }

    let loadedAt = -1
    let cancelled = false

    const render = (split: number, now: number) => {
      scene.dark = document.documentElement.classList.contains('dark')
      scene.split = split
      scene.fade = loadedAt < 0 ? 0 : smoothstep(0, COLOR_MS, now - loadedAt)
      drawScene(scene)
    }

    const repaint = () => {
      if (!reduce) return render(scene.split, performance.now())
      // reduced motion has no loop, so jump straight to the settled frame
      const settled = loadedAt < 0 ? performance.now() : loadedAt + COLOR_MS
      render(scene.image ? 1 : WAIT_CAP, settled)
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = frame.getBoundingClientRect()
      const w = Math.max(1, Math.round(rect.width * dpr))
      const h = Math.max(1, Math.round(rect.height * dpr))
      scene.scale = dpr
      if (w === scene.width && h === scene.height) return
      scene.width = w
      scene.height = h
      canvas.width = w
      canvas.height = h
      // resizing the canvas clears it, so always paint again
      repaint()
    }

    resize()
    // jsdom and older browsers lack these, so the component degrades instead of throwing
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null
    observer?.observe(frame)

    const load = (url: string, withCors: boolean) => {
      const el = new Image()
      if (withCors) el.crossOrigin = 'anonymous'
      el.decoding = 'async'
      el.onload = () => {
        if (cancelled) return
        if (!el.naturalWidth || !el.naturalHeight) {
          errorRef.current?.()
          return
        }
        scene.image = el
        loadedAt = performance.now()
        scene.hasColors = readAverages(el, root, branches, scene.split)
        setLoaded(true)
        if (reduce) repaint()
      }
      // hosts without CORS headers reject the request, so retry plainly
      el.onerror = () => {
        if (cancelled) return
        if (withCors) load(url, false)
        else errorRef.current?.()
      }
      el.src = url
    }

    if (src) load(src, true)

    if (reduce) {
      repaint()
      return () => {
        cancelled = true
        observer?.disconnect()
      }
    }

    let frameId = 0
    let last = 0
    let elapsed = 0
    let eased = 0
    let split = 0
    let fired = false
    let stopped = false
    let visible = true

    const tick = (now: number) => {
      frameId = requestAnimationFrame(tick)
      if (!last) last = now
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      elapsed += dt
      scene.clock = elapsed

      const ready = scene.image !== null
      const paced = progressRef.current === undefined
      let target: number

      // the image landing is what finishes the run, not the number
      if (ready) {
        target = 1
      } else if (paced) {
        target = selfPaced(elapsed * 1000, durationRef.current)
      } else {
        target = Math.min(clamp01(progressRef.current as number), HOLD)
      }

      eased += (target - eased) * (1 - Math.exp(-dt * 5.5))
      const wanted = Math.min(eased, ready ? 1 : WAIT_CAP)
      split += (wanted - split) * (1 - Math.exp(-dt * 4))
      render(split, now)

      if (!fired && ready && eased > 0.995 && now - loadedAt > COLOR_MS) {
        fired = true
        setRevealed(true)
        doneRef.current?.()
      }

      // nothing moves after this, so stop burning frames
      if (fired && split > 0.9995) {
        render(1, now)
        stopped = true
        cancelAnimationFrame(frameId)
      }
    }

    const start = () => {
      if (stopped) return
      last = 0
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(tick)
    }

    // no reason to animate a frame nobody is looking at
    const visibility =
      typeof IntersectionObserver === 'function'
        ? new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting === visible) return
              visible = entry.isIntersecting
              if (visible) start()
              else cancelAnimationFrame(frameId)
            },
            { rootMargin: '150px' },
          )
        : null
    visibility?.observe(frame)

    start()

    return () => {
      cancelled = true
      cancelAnimationFrame(frameId)
      observer?.disconnect()
      visibility?.disconnect()
    }
  }, [reduce, src, ratio])

  useEffect(() => {
    if (reduce && loaded) doneRef.current?.()
  }, [reduce, loaded])

  const finished = reduce ? loaded : revealed

  return (
    <div
      ref={frameRef}
      data-slot="grid-reveal"
      className={cn(
        'relative w-full overflow-hidden rounded-2xl bg-muted [corner-shape:squircle]',
        className,
      )}
      style={{ aspectRatio: ratio, ...style }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        {...(alt ? { role: 'img', 'aria-label': alt } : { 'aria-hidden': true })}
      />

      {caption ? <GridRevealCaption caption={caption} finished={finished} reduce={reduce} /> : null}
    </div>
  )
}
