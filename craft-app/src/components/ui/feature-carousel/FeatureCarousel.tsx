import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'motion/react'
import type { MouseEvent } from 'react'

import { cn } from '@/lib/utils'

import { StepImage, Steps } from './feature-carousel-parts'
import {
  DEFAULT_IMAGE_CLASSES,
  DEFAULT_INTERVAL,
  EASE_OUT,
  FADE_ONLY,
  IMAGE_PRESETS,
  SPRING,
  STEPS,
} from './feature-carousel.constants'
import type { FeatureCarouselProps } from './feature-carousel.types'
import { useStepCycler } from './use-step-cycler'

export function FeatureCarousel({
  title,
  description,
  image,
  step1img1Class = DEFAULT_IMAGE_CLASSES.step1img1,
  step1img2Class = DEFAULT_IMAGE_CLASSES.step1img2,
  step2img1Class = DEFAULT_IMAGE_CLASSES.step2img1,
  step2img2Class = DEFAULT_IMAGE_CLASSES.step2img2,
  step3imgClass = DEFAULT_IMAGE_CLASSES.step3img,
  step4imgClass = DEFAULT_IMAGE_CLASSES.step4img,
  bgClass,
  interval = DEFAULT_INTERVAL,
  className,
}: FeatureCarouselProps) {
  const reduced = useReducedMotion()
  const { step, advance } = useStepCycler(STEPS.length, interval, Boolean(reduced))
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const glow = useMotionTemplate`radial-gradient(1000px circle at ${mouseX}px ${mouseY}px, #c9ee80 0, #eebbe2 10%, #adc0ec 25%, #c9ee80 35%, rgba(255,255,255,0) 50%, transparent 80%)`
  const current = STEPS[step]
  const stepMotion = reduced ? FADE_ONLY : IMAGE_PRESETS.fadeInScale

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  function renderStepImages() {
    switch (step) {
      case 0:
        return (
          <>
            <StepImage alt={image.alt} src={image.step1light1} className={step1img1Class} preset="slideInLeft" />
            <StepImage
              alt={image.alt}
              src={image.step1light2}
              className={step1img2Class}
              preset="slideInRight"
              delay={0.1}
            />
          </>
        )
      case 1:
        return (
          <>
            <StepImage alt={image.alt} src={image.step2light1} className={cn('rounded-2xl', step2img1Class)} />
            <StepImage
              alt={image.alt}
              src={image.step2light2}
              className={cn('rounded-2xl', step2img2Class)}
              delay={0.1}
            />
          </>
        )
      case 2:
        return <StepImage alt={image.alt} src={image.step3light} className={cn('rounded-2xl', step3imgClass)} />
      default:
        return (
          <StepImage alt={image.alt} src={image.step4light} className={cn('rounded-2xl', step4imgClass)} delay={0.1} />
        )
    }
  }

  return (
    <div className={cn('group/card relative isolate w-full rounded-3xl', className)} onMouseMove={handleMouseMove}>
      {reduced ? null : (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-px -z-10 rounded-3xl opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 max-md:hidden"
          style={{ background: glow }}
        />
      )}
      <div
        className={cn(
          'group relative w-full overflow-hidden rounded-3xl border border-border bg-card text-card-foreground transition duration-300 md:hover:border-transparent',
          bgClass,
        )}
      >
        <span className="sr-only">
          {title}. {description}
        </span>
        <div className="m-10 min-h-[450px] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className="flex w-4/6 flex-col gap-3"
              {...(reduced ? FADE_ONLY : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } })}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              <h2 className="text-xl font-bold tracking-tight md:text-2xl">{current.title}</h2>
              <p className="text-sm leading-5 text-balance opacity-70 sm:text-base sm:leading-5">
                {current.description}
              </p>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className="absolute inset-0"
              {...stepMotion}
              transition={reduced ? { duration: 0.2 } : SPRING}
            >
              {renderStepImages()}
            </motion.div>
          </AnimatePresence>
          <div className="absolute top-5 left-0 z-10 w-full">
            <Steps steps={STEPS} current={step} />
          </div>
          <motion.button
            type="button"
            aria-label={`Next feature (${current.name} of ${STEPS.length})`}
            className="absolute inset-0 z-20 cursor-pointer rounded-3xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            onClick={advance}
            whileHover={reduced ? undefined : { scale: 1.02 }}
            whileTap={reduced ? undefined : { scale: 0.98 }}
          />
        </div>
      </div>
    </div>
  )
}
