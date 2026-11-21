import { Check } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import { FADE_ONLY, IMAGE_PRESETS, SPRING } from './feature-carousel.constants'
import type { FeatureCarouselStep, StepImagePreset } from './feature-carousel.types'

type StepImageProps = {
  src: string
  alt: string
  className?: string
  preset?: StepImagePreset
  delay?: number
}

export function StepImage({ src, alt, className, preset = 'fadeInScale', delay = 0 }: StepImageProps) {
  const reduced = useReducedMotion()
  const motionProps = reduced ? FADE_ONLY : IMAGE_PRESETS[preset]

  return (
    <motion.img
      src={src}
      alt={alt}
      draggable={false}
      className={cn('absolute max-w-none select-none', className)}
      {...motionProps}
      transition={reduced ? { duration: 0.2 } : { ...SPRING, delay }}
    />
  )
}

type StepsProps = {
  steps: readonly FeatureCarouselStep[]
  current: number
}

export function Steps({ steps, current }: StepsProps) {
  const reduced = useReducedMotion()

  return (
    <nav aria-label="Progress" className="flex justify-center px-4">
      <ol className="flex w-full flex-wrap items-start justify-start gap-2 sm:justify-center md:w-10/12">
        {steps.map((step, index) => {
          const isCompleted = current > index
          const isCurrent = current === index

          return (
            <motion.li
              key={step.id}
              aria-current={isCurrent ? 'step' : undefined}
              animate={reduced ? undefined : { scale: isCurrent ? 1 : 0.8, opacity: isCurrent ? 1 : 0.5 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'relative rounded-full px-3 py-1 transition-colors duration-300',
                isCompleted ? 'bg-muted-foreground/20' : 'bg-muted-foreground/10',
              )}
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <span
                  className={cn(
                    'flex size-4 shrink-0 items-center justify-center rounded-full text-xs transition-colors duration-300',
                    isCompleted && 'bg-primary text-primary-foreground',
                    isCurrent && 'bg-primary/60 text-primary-foreground',
                    !isCompleted && !isCurrent && 'bg-muted-foreground/20 text-primary',
                  )}
                >
                  {isCompleted ? <Check className="size-3" strokeWidth={3} aria-hidden /> : index + 1}
                </span>
                <span
                  className={cn(
                    'transition-colors duration-300',
                    isCurrent ? 'text-primary' : 'text-muted-foreground',
                  )}
                >
                  {step.name}
                </span>
              </span>
            </motion.li>
          )
        })}
      </ol>
    </nav>
  )
}
