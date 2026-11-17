import { useCallback, useEffect, useRef } from 'react'

import { MAX_WAVES, WAVE_REACH } from './pin-shatter.constants'
import { createWaveRenderer, type Wave, type WaveRenderer } from './pin-shatter.wave'

export type WaveOptions = {
  /** Outer ring radius in px. */
  radius: number
  /** 0..1 share of the warp. */
  strength: number
  duration: number
}

/**
 * A ripple that bends the image's own pixels around a point. The image loads a
 * second time with CORS on, because WebGL cannot read a tainted texture; when
 * that fails the hook does nothing and the caller still has its rings.
 * The canvas is shown only while a wave runs, so the plain image is what rests.
 */
export function useImageWave(imageSrc: string) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const rendererRef = useRef<WaveRenderer | null>(null)
  const wavesRef = useRef<Wave[]>([])
  const frameRef = useRef(0)

  useEffect(() => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      imageRef.current = image
    }
    image.src = imageSrc

    return () => {
      image.onload = null
      imageRef.current = null
      cancelAnimationFrame(frameRef.current)
      wavesRef.current = []
      rendererRef.current?.dispose()
      rendererRef.current = null
    }
  }, [imageSrc])

  const ripple = useCallback((x: number, y: number, options: WaveOptions) => {
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!canvas || !image || options.strength <= 0) return

    if (rendererRef.current?.canvas !== canvas) {
      rendererRef.current?.dispose()
      rendererRef.current = createWaveRenderer(canvas, image)
    }
    const renderer = rendererRef.current
    if (!renderer) return

    wavesRef.current = [
      ...wavesRef.current,
      {
        x,
        y,
        start: performance.now(),
        duration: options.duration * 1.12,
        maxRadius: options.radius * WAVE_REACH,
        strength: options.strength,
      },
    ].slice(-MAX_WAVES)

    if (frameRef.current !== 0) return
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    const tick = (now: number) => {
      wavesRef.current = wavesRef.current.filter(
        (wave) => now - wave.start < wave.duration,
      )
      if (wavesRef.current.length === 0) {
        canvas.style.opacity = '0'
        frameRef.current = 0
        return
      }
      renderer.draw(wavesRef.current, now, ratio)
      canvas.style.opacity = '1'
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
  }, [])

  return { canvasRef, ripple }
}
