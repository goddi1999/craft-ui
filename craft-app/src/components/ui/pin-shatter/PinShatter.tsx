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
} from './pin-shatter.constants'
import { PinDropRipple } from './PinDropRipple'
import { useImageWave } from './use-image-wave'
import { usePinDrag } from './use-pin-drag'
import { usePinShatter } from './use-pin-shatter'

export type PinShatterProps = {
  imageSrc: string
  /** Pin diameter in px. */
  pinSize?: number
  /** Hint beside the docked pin. */
  dockLabel?: string
  /** Outer radius in px of the rings that leave a dropped pin. */
  dropRadius?: number
  /** 0..1 share of the ripple that bends the image itself; 0 keeps only the rings. */
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

const pinButtonClass =
  'touch-none rounded-full transition-transform duration-150 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

/**
 * Drag the pin from the dock onto the image: it lands with a pop and a flash,
 * two shock rings leave it and the image ripples around it. Then click it: it pops into small
 * matte rubber balls that fall, bounce off the image's edges and each other, and
 * fade out. The pin then returns to the dock for another go. Drop it off the
 * image to send it back. Keyboard: Enter on the docked pin places it in the
 * centre; Enter on the placed pin pops it; Escape returns it to the dock.
 * With reduced motion the pin lands and returns without ripple or balls.
 */
export function PinShatter({
  imageSrc,
  pinSize = DEFAULT_PIN_SIZE,
  dockLabel = 'Drag the pin onto the image',
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
  const [landing, setLanding] = useState(0)

  const finish = useCallback(() => {
    setPopping(false)
    setRound((current) => current + 1)
    onShatterEnd?.()
  }, [onShatterEnd])
  const { canvasRef, shatter } = usePinShatter(finish)
  const { canvasRef: waveRef, ripple } = useImageWave(imageSrc)

  const place = useCallback(
    (point: ImagePinPoint | null) => {
      setPin(point)
      const surface = surfaceRef.current
      if (!point || !surface) return
      setLanding((current) => current + 1)
      if (reduced) return
      ripple(point.x * surface.clientWidth, point.y * surface.clientHeight, {
        radius: dropRadius,
        strength: dropStrength,
        duration: dropDuration,
      })
    },
    [reduced, ripple, dropRadius, dropStrength, dropDuration],
  )
  const { drag, start } = usePinDrag(surfaceRef, place)

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
    if (reduced || !shatter(origin, pinSize / 2, fill)) {
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

            {pin && !drag && !reduced ? (
              <PinDropRipple
                key={landing}
                x={pin.x}
                y={pin.y}
                radius={dropRadius}
                duration={dropDuration}
              />
            ) : null}

            {pin && !drag ? (
              <button
                type="button"
                aria-label="Pin on the image. Press Enter to pop it, Escape to return it to the dock."
                onClick={handleShatter}
                onKeyDown={handlePinKeyDown}
                className={cn(pinButtonClass, 'absolute cursor-pointer')}
                style={{
                  left: `${pin.x * 100}%`,
                  top: `${pin.y * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <motion.span
                  key={landing}
                  className="relative flex"
                  initial={false}
                  animate={
                    reduced
                      ? undefined
                      : {
                          transform: ['scale(1.72)', 'scale(0.84)', 'scale(1.07)', 'scale(1)'],
                          filter: [
                            'brightness(2.2)',
                            'brightness(1.45)',
                            'brightness(1.12)',
                            'brightness(1)',
                          ],
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
        <div
          aria-hidden
          className="pointer-events-none fixed z-50 cursor-grabbing"
          style={{
            left: drag.clientX,
            top: drag.clientY - drag.lift,
            transform: 'translate(-50%, -50%) scale(1.15)',
          }}
        >
          <ImagePin size={pinSize} className={cn(!drag.overSurface && 'opacity-70')} />
        </div>
      ) : null}
    </div>
  )
}
