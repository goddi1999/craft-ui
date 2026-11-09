import gsap from 'gsap'
import { useEffect, useRef, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import './canvas-snow-banner.css'

export type CanvasSnowBannerProps = {
  /** Banner height in CSS pixels. @default 120 */
  height?: number
  /** Number of snowflakes. @default 200 */
  amount?: number
  /** Horizontal wind drift (px). @default 200 */
  sway?: number
  /** Target ticker framerate. @default 60 */
  framerate?: number
  /** Extra classes for the root. */
  className?: string
}

type Flake = {
  c: HTMLCanvasElement
  x: number
  y: number
  w: number
  f: number
}

export function CanvasSnowBanner({
  height = 120,
  amount = 200,
  sway = 200,
  framerate = 60,
  className,
}: CanvasSnowBannerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const snowdrop = canvasRef.current
    if (!snowdrop) return

    const snowctx = snowdrop.getContext('2d')
    if (!snowctx) return

    const dpr = window.devicePixelRatio || 1
    const tweens: gsap.core.Tween[] = []
    let flakes: Flake[] = []
    let cssWidth = 0

    const killTweens = () => {
      for (const tween of tweens) tween.kill()
      tweens.length = 0
    }

    const generateFlakes = () => {
      killTweens()
      cssWidth = snowdrop.getBoundingClientRect().width
      snowdrop.width = cssWidth * dpr
      snowdrop.height = height * dpr
      snowctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      flakes = []
      for (let f = 0; f < amount; f++) {
        const size = gsap.utils.random(6, 14, 1)
        const snowflake = document.createElement('canvas')
        const flakectx = snowflake.getContext('2d')
        if (!flakectx) continue

        snowflake.width = size * dpr
        snowflake.height = size * dpr
        flakectx.setTransform(dpr, 0, 0, dpr, 0, 0)
        flakectx.font = `${size}px monospace`
        flakectx.textAlign = 'center'
        flakectx.textBaseline = 'middle'
        flakectx.globalAlpha = gsap.utils.random(0.6, 1)
        flakectx.fillStyle = 'hsl(0 0% 80%)'
        flakectx.fillText('*', size * 0.5, size * 0.5)

        const flake: Flake = {
          c: snowflake,
          f: size,
          x: gsap.utils.random(0, 100, 1),
          // Seed mid-fall so the banner is never empty on first paint.
          y: gsap.utils.random(-size, height),
          w: gsap.utils.random(0, sway * 0.35),
        }

        const tween = gsap.fromTo(
          flake,
          { y: flake.y, w: flake.w },
          {
            y: height + size * 2,
            w: flake.w + gsap.utils.random(
              0,
              Math.random() > 0.98 ? sway * -0.25 : sway,
            ),
            duration: gsap.utils.random(2, 8),
            delay: gsap.utils.random(0, 1.5),
            ease: 'none',
            repeat: -1,
          },
        )
        tweens.push(tween)
        flakes.push(flake)
      }
    }

    const render = () => {
      if (cssWidth <= 0) return
      snowctx.clearRect(0, 0, cssWidth, height)
      for (let f = 0; f < amount; f++) {
        const flake = flakes[f]
        if (!flake) continue
        snowctx.drawImage(
          flake.c,
          cssWidth * (flake.x / 100) + flake.w,
          flake.y,
          flake.f,
          flake.f,
        )
      }
    }

    // Wait a frame so layout has a real width (flex/absolute parents).
    const startId = requestAnimationFrame(() => {
      generateFlakes()
      render()
    })
    window.addEventListener('resize', generateFlakes)
    gsap.ticker.fps(framerate)
    gsap.ticker.add(render)

    return () => {
      cancelAnimationFrame(startId)
      window.removeEventListener('resize', generateFlakes)
      gsap.ticker.remove(render)
      killTweens()
      gsap.ticker.fps(60)
    }
  }, [amount, framerate, height, sway])

  return (
    <div
      data-slot="canvas-snow-banner"
      className={cn(className)}
      style={{ '--banner-height': height } as CSSProperties}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
