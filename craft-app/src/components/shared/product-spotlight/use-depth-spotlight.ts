import { useEffect, useRef, type RefObject } from 'react'

import { SpotlightInstance } from './depth-spotlight-gl'
import { SPOTLIGHT_PRESETS } from './depth-spotlight-presets'
import type { ProductSpotlightPreset } from './product-spotlight.types'
import { useSpotlightPointerGroup } from './spotlight-pointer-context'

/**
 * Binds a canvas to the shared depth-map renderer. Pointer state comes from
 * the nearest `SpotlightPointerProvider` when there is one, so slides in a
 * carousel share a light source; otherwise the canvas tracks its own cursor.
 */
export function useDepthSpotlight(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  {
    src,
    depth,
    preset = 'default',
  }: { src: string; depth: string; preset?: ProductSpotlightPreset },
) {
  const group = useSpotlightPointerGroup()
  const instanceRef = useRef<SpotlightInstance | null>(null)
  const params = SPOTLIGHT_PRESETS[preset]

  // Keep the live instance's params in step without tearing down the GL setup.
  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.params = params
      instanceRef.current.wake()
    }
  }, [params])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const instance = new SpotlightInstance(canvas, params)
    instanceRef.current = instance

    void instance.drawPlaceholder(src)

    // Only spin up WebGL once the card is actually on screen.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void instance.setup({ src, depth })
            instance.wake()
          } else {
            instance.sleep()
          }
        }
      },
      { threshold: 0 },
    )
    observer.observe(canvas)

    const resizeObserver = new ResizeObserver(() => instance.resize())
    resizeObserver.observe(canvas)

    const unregister = group?.register(() => {
      instance.setPointer(group.pointer.x, group.pointer.y)
      instance.setActive(group.pointer.active)
      instance.wake()
    })

    // Standalone fallback: no provider, so listen on the canvas itself.
    let detachLocal: (() => void) | undefined
    if (!group) {
      const hoverDelay = params.hoverDelay
      let timer: number | null = null
      const onMove = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) return
        instance.setPointer(
          (event.clientX - rect.left) / rect.width,
          (event.clientY - rect.top) / rect.height,
        )
        instance.wake()
        if (timer === null) {
          timer = window.setTimeout(() => {
            timer = null
            instance.setActive(true)
            instance.wake()
          }, hoverDelay)
        }
      }
      const onLeave = () => {
        if (timer !== null) {
          window.clearTimeout(timer)
          timer = null
        }
        instance.setActive(false)
        instance.wake()
      }
      canvas.addEventListener('pointermove', onMove)
      canvas.addEventListener('pointerleave', onLeave)
      detachLocal = () => {
        if (timer !== null) window.clearTimeout(timer)
        canvas.removeEventListener('pointermove', onMove)
        canvas.removeEventListener('pointerleave', onLeave)
      }
    }

    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
      unregister?.()
      detachLocal?.()
      instance.destroy()
      instanceRef.current = null
    }
    // `params` is intentionally excluded: preset changes are applied above
    // rather than by rebuilding the instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, src, depth, group])
}
