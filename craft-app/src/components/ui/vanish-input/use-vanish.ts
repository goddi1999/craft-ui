import { useCallback, useEffect, useRef, useState } from 'react'

import { FADE_MS, JITTER, LIFE_MS, SWEEP_MS, SWEEP_PAD } from './vanish-input.constants'
import { snapshotText, type TextSnapshot } from './vanish-input.utils'

type Frame = (
  ctx: CanvasRenderingContext2D,
  snap: TextSnapshot,
  elapsed: number,
  frames: number,
  now: number,
) => boolean

type Run = { snap: TextSnapshot; frame: Frame; start: number; last: number }

/**
 * Plays the dissolve on a canvas laid over the input. A sweep runs right to left; text
 * still ahead of it is drawn as is, everything behind it breaks into drifting grain.
 * Every dissolve still on screen shares one loop, so a quick second Enter joins the first
 * instead of wiping it.
 */
export function useVanish(reduced: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const raf = useRef(0)
  const runs = useRef<Run[]>([])
  const [vanishing, setVanishing] = useState(false)

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const vanish = useCallback(
    (input: HTMLInputElement, text: string) => {
      const canvas = canvasRef.current
      if (!canvas || !text.trim()) return

      const snap = snapshotText(input, text)
      const ctx = canvas.getContext('2d')
      if (!snap || !ctx) return

      // resizing a canvas wipes it, so only do it when the field itself changed size
      if (canvas.width !== snap.image.width || canvas.height !== snap.image.height) {
        canvas.width = snap.image.width
        canvas.height = snap.image.height
      }
      canvas.style.width = `${snap.width}px`
      canvas.style.height = `${snap.height}px`
      ctx.setTransform(snap.dpr, 0, 0, snap.dpr, 0, 0)

      const now = performance.now()
      runs.current.push({ snap, frame: reduced ? fadeFrame : grainFrame, start: now, last: now })
      setVanishing(true)
      if (raf.current) return

      const tick = (time: number) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        runs.current = runs.current.filter((run) => {
          const frames = Math.max(0, time - run.last) / (1000 / 60)
          const done = run.frame(ctx, run.snap, Math.max(0, time - run.start), frames, time)
          run.last = time
          return !done
        })
        if (runs.current.length > 0) {
          raf.current = requestAnimationFrame(tick)
        } else {
          raf.current = 0
          setVanishing(false)
        }
      }
      raf.current = requestAnimationFrame(tick)
    },
    [reduced],
  )

  return { canvasRef, vanish, vanishing }
}

function fadeFrame(ctx: CanvasRenderingContext2D, snap: TextSnapshot, elapsed: number) {
  const left = 1 - elapsed / FADE_MS
  if (left <= 0) return true
  ctx.globalAlpha = left
  ctx.drawImage(snap.image, 0, 0, snap.width, snap.height)
  ctx.globalAlpha = 1
  return false
}

function grainFrame(
  ctx: CanvasRenderingContext2D,
  snap: TextSnapshot,
  elapsed: number,
  frames: number,
  now: number,
) {
  const span = snap.right - snap.left + SWEEP_PAD * 2
  const sweep = snap.right + SWEEP_PAD - span * Math.min(1, elapsed / SWEEP_MS)

  // untouched text ahead of the sweep stays crisp
  if (sweep > snap.left) {
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, sweep, snap.height)
    ctx.clip()
    ctx.drawImage(snap.image, 0, 0, snap.width, snap.height)
    ctx.restore()
  }

  ctx.fillStyle = snap.color
  let alive = false
  for (const grain of snap.grains) {
    if (grain.home < sweep) {
      alive = true
      continue
    }
    if (grain.born === 0) grain.born = now
    const age = (now - grain.born) / LIFE_MS
    if (age >= 1) continue
    alive = true
    grain.x += (grain.vx + (Math.random() - 0.5) * JITTER) * frames
    grain.y += (grain.vy + (Math.random() - 0.5) * JITTER) * frames
    // grain stays bright for most of its life, like the reference, then thins out
    ctx.globalAlpha = grain.alpha * (1 - age * age)
    const size = 1.5 - age * 0.7
    ctx.fillRect(grain.x, grain.y, size, size)
  }
  ctx.globalAlpha = 1
  return !alive && elapsed >= SWEEP_MS
}
