import { useCallback, useRef, useState, type KeyboardEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import useImage from 'use-image'

import { CornerFrame } from '@/components/ui/corner-frame'
import {
  IMAGE_PIN_FEATHER_MASK,
  ImagePin,
  ImagePinDock,
  ImagePinFrame,
  type ImagePinPoint,
} from '@/components/ui/image-pin'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

import {
  DEFAULT_PIN_SIZE,
  DROP_DURATION_MS,
  DROP_RADIUS,
  DROP_STRENGTH,
  MOVE_DRAG_SCALE,
  MOVE_DRAG_SCALE_MS,
  PIN_SHATTER_IMAGE_SRC,
  SHATTER_FADE_COLOR,
} from './pin-shatter.constants'
import { PinDropLens } from './PinDropLens'
import { PinDropRipple } from './PinDropRipple'
import { useImageWave } from './use-image-wave'
import { resolveCssColor } from './pin-shatter.utils'
import { usePinDrag, type PinDragSource } from './use-pin-drag'
import { usePinShatter } from './use-pin-shatter'

export type PinShatterProps = {
  /** Leave unset: the component is built around `PIN_SHATTER_IMAGE_SRC`. */
  imageSrc?: string
  /** Pin diameter in px. */
  pinSize?: number
  /** Hint beside the docked pin. */
  dockLabel?: string
  /** Turn the balls from the pin's colour to `fadeColor` as they fly. Off by default. */
  fadeToColor?: boolean
  /** CSS colour or `var()` the balls fade to; red-400 by default. */
  fadeColor?: string
  /** Outer radius in px of the rings that leave a dropped pin. */
  dropRadius?: number
  /**
   * 0..1 share of the ripple that bends the image itself; 0 keeps only the rings.
   * Warps pixels with WebGL when the image allows CORS, else swells it with a lens ring.
   */
  dropStrength?: number
  /** Ring travel time in ms. */
  dropDuration?: number
  /** Fires when the placed pin is clicked, with its 0..1 position on the image. */
  onShatter?: (point: ImagePinPoint) => void
  /** Fires once the last ball has faded and the pin is back in the dock. */
  onShatterEnd?: () => void
  /** Round X on the frame that removes the image. */
  onImageRemove?: () => void
  /** Sizes the image frame; defaults to a screen-height box. */
  frameClassName?: string
  className?: string
}

/** Scale keyframes for a pin landing: a big pop from the dock, a springy settle after a move. */
const LANDING_SCALE: Record<PinDragSource, string[]> = {
  dock: ['scale(1.72)', 'scale(0.84)', 'scale(1.07)', 'scale(1)'],
  move: [`scale(${MOVE_DRAG_SCALE})`, 'scale(1.18)', 'scale(0.95)', 'scale(1)'],
}
const LANDING_BRIGHTNESS: Record<PinDragSource, string[]> = {
  dock: ['brightness(2.2)', 'brightness(1.45)', 'brightness(1.12)', 'brightness(1)'],
  move: ['brightness(1.35)', 'brightness(1.25)', 'brightness(1.08)', 'brightness(1)'],
}

const pinButtonClass =
  'touch-none rounded-full transition-transform duration-150 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

/**
 * Drag the pin from the dock onto the image: it lands with a pop and a flash,
 * two shock rings leave it and the image ripples around it. Drag it again to
 * move it: it shrinks a little while held and springs back on drop, with the
 * same effect at the new spot. Click it and it pops into small
 * matte rubber balls that fall, bounce off the image's edges and each other, and
 * fade out. The pin then returns to the dock for another go. Drop it off the
 * image to send it back. Keyboard: Enter on the docked pin places it in the
 * centre; Enter on the placed pin pops it; Escape returns it to the dock.
 * With reduced motion the pin lands and returns without ripple or balls.
 */
export function PinShatter({
  imageSrc = PIN_SHATTER_IMAGE_SRC,
  pinSize = DEFAULT_PIN_SIZE,
  dockLabel = 'Drag the pin onto the image',
  fadeToColor = false,
  fadeColor = SHATTER_FADE_COLOR,
  dropRadius = DROP_RADIUS,
  dropStrength = DROP_STRENGTH,
  dropDuration = DROP_DURATION_MS,
  onShatter,
  onShatterEnd,
  onImageRemove,
  frameClassName,
  className,
}: PinShatterProps) {
  const reduced = useReducedMotion() ?? false
  const [image, status] = useImage(imageSrc)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const [pin, setPin] = useState<ImagePinPoint | null>(null)
  const [popping, setPopping] = useState(false)
  const [round, setRound] = useState(0)
  const [landing, setLanding] = useState<{ key: number; from: PinDragSource }>({
    key: 0,
    from: 'dock',
  })
  const [lens, setLens] = useState<{ key: number; x: number; y: number } | null>(null)

  const finish = useCallback(() => {
    setPopping(false)
    setRound((current) => current + 1)
    onShatterEnd?.()
  }, [onShatterEnd])
  const { canvasRef, shatter } = usePinShatter(finish)
  const { canvasRef: waveRef, ripple } = useImageWave(imageSrc)

  const place = useCallback(
    (point: ImagePinPoint | null, from: PinDragSource = 'dock') => {
      setPin(point)
      const surface = surfaceRef.current
      if (!point || !surface) return
      const key = landing.key + 1
      setLanding({ key, from })
      setLens(null)
      if (reduced) return
      const x = point.x * surface.clientWidth
      const y = point.y * surface.clientHeight
      const played = ripple(x, y, {
        radius: dropRadius,
        strength: dropStrength,
        duration: dropDuration,
      })
      if (!played) setLens({ key, x, y })
    },
    [landing, reduced, ripple, dropRadius, dropStrength, dropDuration],
  )
  const { drag, start, startMove } = usePinDrag(surfaceRef, place)

  const natural = image
    ? { width: image.naturalWidth, height: image.naturalHeight }
    : null

  const handleShatter = () => {
    const surface = surfaceRef.current
    const node = pinRef.current
    if (!pin || !surface || !node) return

    const area = surface.getBoundingClientRect()
    const box = node.getBoundingClientRect()
    const origin = {
      x: box.left - area.left + box.width / 2,
      y: box.top - area.top + box.height / 2,
    }
    const fill = getComputedStyle(node).backgroundColor

    setPin(null)
    onShatter?.(pin)
    const tint = fadeToColor ? resolveCssColor(surface, fadeColor) : undefined
    if (reduced || !shatter(origin, pinSize / 2, fill, tint)) {
      finish()
      return
    }
    setPopping(true)
  }

  const handlePinKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!pin) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        place({ x: 0.5, y: 0.5 })
      }
      return
    }
    if (event.key === 'Escape' || event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault()
      setPin(null)
    }
  }

  const fallback =
    status === 'loading' ? (
      <Spinner variant="gray" size="sm" speed={1750} />
    ) : status === 'failed' ? (
      'Image could not be loaded'
    ) : null

  const dockLabelText = popping
    ? 'Watch them bounce'
    : pin
      ? 'Click the pin to pop it'
      : dockLabel

  return (
    <div
      data-slot="pin-shatter"
      className={cn('flex w-full flex-col gap-3', className)}
    >
      <ImagePinFrame
        imageSrc={imageSrc}
        natural={natural}
        fallback={fallback}
        onRemove={onImageRemove}
        className={frameClassName}
      >
        {() => (
          <div ref={surfaceRef} className="absolute inset-0">
            <CornerFrame
              size="sm"
              className={cn(
                'transition-[opacity,color] duration-150 ease-out',
                drag ? 'opacity-100' : 'opacity-0',
                drag?.overSurface ? 'text-primary' : 'text-foreground/40',
              )}
            />

            <canvas
              ref={waveRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 size-full opacity-0"
              style={IMAGE_PIN_FEATHER_MASK}
            />

            {lens ? (
              <PinDropLens
                key={`lens-${lens.key}`}
                src={imageSrc}
                x={lens.x}
                y={lens.y}
                radius={dropRadius}
                strength={dropStrength}
                duration={dropDuration}
                onDone={() => setLens(null)}
              />
            ) : null}

            {pin && !drag && !reduced ? (
              <PinDropRipple
                key={landing.key}
                x={pin.x}
                y={pin.y}
                radius={dropRadius}
                duration={dropDuration}
              />
            ) : null}

            {pin && !drag ? (
              <button
                type="button"
                aria-label="Pin on the image. Click to pop it, drag to move it. Press Enter to pop it, Escape to return it to the dock."
                onClick={handleShatter}
                onPointerDown={startMove}
                onKeyDown={handlePinKeyDown}
                className={cn(pinButtonClass, 'absolute cursor-pointer')}
                style={{
                  left: `${pin.x * 100}%`,
                  top: `${pin.y * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <motion.span
                  key={landing.key}
                  className="relative flex"
                  initial={false}
                  animate={
                    reduced
                      ? undefined
                      : {
                          transform: LANDING_SCALE[landing.from],
                          filter: LANDING_BRIGHTNESS[landing.from],
                        }
                  }
                  transition={{
                    duration: (dropDuration * 0.76) / 1000,
                    times: [0, 0.38, 0.72, 1],
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <ImagePin ref={pinRef} size={pinSize} />
                  {reduced ? null : (
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-white"
                      initial={{ opacity: 0.96, transform: 'scale(0.88)' }}
                      animate={{ opacity: 0, transform: 'scale(1.75)' }}
                      transition={{
                        duration: (dropDuration * 0.56) / 1000,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  )}
                </motion.span>
              </button>
            ) : null}

            <canvas
              ref={canvasRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 size-full"
            />
          </div>
        )}
      </ImagePinFrame>

      {imageSrc ? (
        <ImagePinDock
          label={dockLabelText}
          pin={
            !pin && !drag && !popping ? (
              <motion.span
                key={round}
                className="flex"
                initial={round === 0 || reduced ? false : { opacity: 0, transform: 'scale(0.9)' }}
                animate={{ opacity: 1, transform: 'scale(1)' }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                <button
                  type="button"
                  aria-label="Pin. Drag it onto the image, or press Enter to place it in the centre."
                  onPointerDown={start}
                  onKeyDown={handlePinKeyDown}
                  className={cn(pinButtonClass, 'cursor-grab')}
                >
                  <ImagePin size={pinSize} />
                </button>
              </motion.span>
            ) : null
          }
        />
      ) : null}

      {drag ? (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed z-50 cursor-grabbing"
          style={{
            left: drag.clientX - drag.grabX,
            top: drag.clientY - drag.grabY - drag.lift,
          }}
          initial={{ transform: `translate(-50%, -50%) scale(${drag.source === 'move' ? 1 : 1.15})` }}
          animate={{
            transform: `translate(-50%, -50%) scale(${drag.source === 'move' ? MOVE_DRAG_SCALE : 1.15})`,
          }}
          transition={{ duration: reduced ? 0 : MOVE_DRAG_SCALE_MS / 1000, ease: [0.23, 1, 0.32, 1] }}
        >
          <ImagePin size={pinSize} className={cn(!drag.overSurface && 'opacity-70')} />
        </motion.div>
      ) : null}
    </div>
  )
}
