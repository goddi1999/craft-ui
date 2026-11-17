import { useEffect, useRef, useState } from 'react'
import { RotateCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import {
  BLUR_LOAD_DEFAULT_BLUR,
  BLUR_LOAD_DEFAULT_DURATION_MS,
  BLUR_LOAD_DEMO_IMAGES,
} from './blur-load.constants'
import {
  BlurLoadLayerStack,
  BlurLoadPanel,
  BlurLoadScenePicker,
  StandardSlowLoad,
} from './blur-load-parts'
import type {
  BlurLoadComparisonProps,
  BlurLoadLayerId,
  BlurLoadLayerView,
} from './blur-load.types'
import { BlurLoad } from './BlurLoad'

import './blur-load.css'

const ALL_LAYERS_VISIBLE: Record<BlurLoadLayerId, boolean> = { 1: true, 2: true, 3: true }

/**
 * Side-by-side walkthrough of the blur-load pattern: the three layers (3D stack
 * or flat composite), a standard top-to-bottom scanline reveal, and the
 * blurred placeholder + pulse + fade.
 */
export function BlurLoadComparison({
  images = BLUR_LOAD_DEMO_IMAGES,
  durationMs = BLUR_LOAD_DEFAULT_DURATION_MS,
  blur = BLUR_LOAD_DEFAULT_BLUR,
  defaultView = 'exploded',
  className,
  ref,
  ...props
}: BlurLoadComparisonProps) {
  const [sceneIndex, setSceneIndex] = useState(0)
  const [view, setView] = useState<BlurLoadLayerView>(defaultView)
  const [visible, setVisible] = useState(ALL_LAYERS_VISIBLE)
  const [progress, setProgress] = useState(0)
  const [runId, setRunId] = useState(0)
  const frameRef = useRef<number | null>(null)

  const image = images[Math.min(sceneIndex, images.length - 1)]

  // Any new run (replay, scene, duration) starts from 0 — set during render, not in the effect.
  const runKey = `${runId}-${sceneIndex}-${durationMs}`
  const [progressKey, setProgressKey] = useState(runKey)
  if (progressKey !== runKey) {
    setProgressKey(runKey)
    setProgress(0)
  }

  useEffect(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
    }

    const start = performance.now()

    const tick = (now: number) => {
      const next = Math.min((now - start) / durationMs, 1)
      setProgress(next)
      if (next < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        frameRef.current = null
      }
    }

    frameRef.current = requestAnimationFrame(tick)

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [durationMs, runId, sceneIndex])

  if (!image) return null

  const done = progress >= 1
  const percent = Math.round(progress * 100)

  const handleReplay = () => {
    setRunId((id) => id + 1)
  }

  const standardStatus = done ? 'Loaded' : 'Downloading scanlines…'
  const blurStatus = done ? 'Faded in (200ms)' : 'Pulsing preview…'
  const layersStatus = view === 'exploded' ? '3D stack' : 'Flat composite'

  return (
    <div
      ref={ref}
      data-slot="blur-load-comparison"
      className={cn('flex w-full flex-col gap-5', className)}
      {...props}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Simulated download{' '}
            <span className="font-medium text-foreground">
              {(durationMs / 1000).toFixed(1)}s
            </span>
            <span className="mx-2 text-border">·</span>
            <span className="font-mono text-xs tabular-nums text-foreground">
              {percent}%
            </span>
          </p>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleReplay}
            className="gap-2 transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            <RotateCw
              className="size-3.5 transition-transform duration-500 ease-out"
              style={{ transform: `rotate(${runId * 360}deg)` }}
              aria-hidden
            />
            Replay
          </Button>
        </div>
        {images.length > 1 ? (
          <BlurLoadScenePicker
            images={images}
            value={sceneIndex}
            onValueChange={setSceneIndex}
          />
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <BlurLoadPanel
          title="How the 3 Layers Work Together"
          status={layersStatus}
          tone="sky"
          footer="Blurred placeholder, pulsing overlay, then the high-res image on top. Click the stage or the tabs to switch views; tap a chip to hide a layer."
        >
          <BlurLoadLayerStack
            image={image}
            progress={progress}
            view={view}
            onViewChange={setView}
            visible={visible}
            onVisibleChange={(layer, next) =>
              setVisible((current) => ({ ...current, [layer]: next }))
            }
            blur={blur}
          />
        </BlurLoadPanel>

        <BlurLoadPanel
          title="Standard Slow Load"
          status={standardStatus}
          tone={done ? 'emerald' : 'rose'}
          footer="Without a placeholder, users stare at a blank box while bytes trickle in top-to-bottom."
        >
          <StandardSlowLoad image={image} progress={progress} />
        </BlurLoadPanel>

        <BlurLoadPanel
          title="Blurry Placeholder + Pulse + Fade"
          status={blurStatus}
          tone={done ? 'emerald' : 'amber'}
          footer={`The tiny placeholder paints at once under a ${blur}px CSS blur. The high-res image stays at opacity 0 until ready, then fades in over 200ms.`}
        >
          <BlurLoad
            key={`${runId}-${sceneIndex}`}
            src={image.src}
            placeholderSrc={image.placeholderSrc}
            alt={image.alt}
            loaded={done}
            loading="eager"
            blur={blur}
            className="aspect-[16/10] w-full rounded-xl border border-border shadow-inner"
          />
        </BlurLoadPanel>
      </div>
    </div>
  )
}
