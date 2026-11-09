import gsap from 'gsap'
import { useEffect, useRef, type RefObject } from 'react'

const STAGGER = 0.1
const DURATION = 1
/** Pixels of wheel travel for one full lap of the covers. */
const WHEEL_PER_LAP = 2000
/** Pointer drag sensitivity, in laps per pixel. */
const DRAG_PER_PX = 0.001
/** Movement under this many pixels counts as a click, not a drag. */
const CLICK_SLOP = 5
const WHEEL_SETTLE_MS = 150

export const COVER_FLOW_ITEM_SELECTOR = '[data-slot="infinite-cover-flow-item"]'

export type CoverFlowController = {
  step: (direction: 1 | -1) => void
}

type Options = {
  stageRef: RefObject<HTMLElement | null>
  /** Changes whenever the rendered covers change, to rebuild the timeline. */
  itemsKey: string
  onSettle: (index: number) => void
}

/** One cover's trip across the stage: fade/scale in, pan, swing, lift. */
function createCoverTimeline(box: HTMLElement, count: number) {
  return gsap
    .timeline()
    .set(box, { xPercent: 250, rotateY: -50, opacity: 0, scale: 0.5 })
    .to(box, { opacity: 1, scale: 1, duration: 0.1 }, 0)
    .to(box, { opacity: 0, scale: 0.5, duration: 0.1 }, 0.9)
    .fromTo(
      box,
      { xPercent: 250 },
      {
        xPercent: -350,
        duration: 1,
        immediateRender: false,
        ease: 'power1.inOut',
      },
      0,
    )
    .fromTo(
      box,
      { rotateY: -50 },
      {
        rotateY: 50,
        immediateRender: false,
        duration: 1,
        ease: 'power4.inOut',
      },
      0,
    )
    .to(
      box,
      { z: 100, scale: 1.25, duration: 0.1, repeat: 1, yoyo: true },
      0.4,
    )
    .fromTo(
      box,
      { zIndex: 1 },
      {
        zIndex: count,
        repeat: 1,
        yoyo: true,
        ease: 'none',
        duration: 0.5,
        immediateRender: false,
      },
      0,
    )
}

/**
 * Builds the seamless GSAP loop (covers tripled in time, not in the DOM) and
 * wires wheel, drag and click scrubbing on the stage. Returns a controller
 * ref for stepping from buttons / keys.
 */
export function useInfiniteCoverFlow({
  stageRef,
  itemsKey,
  onSettle,
}: Options) {
  const controllerRef = useRef<CoverFlowController | null>(null)
  const onSettleRef = useRef(onSettle)

  useEffect(() => {
    onSettleRef.current = onSettle
  })

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const boxes = gsap.utils.toArray<HTMLElement>(
      stage.querySelectorAll(COVER_FLOW_ITEM_SELECTOR),
    )
    const count = boxes.length
    if (count === 0) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const snap = gsap.utils.snap(1 / count)
    const wrapIndex = gsap.utils.wrap(0, count)
    let settleTimer: ReturnType<typeof setTimeout> | undefined
    let scrubTo: (position: number) => void = () => {}
    let readPosition = () => 0

    const ctx = gsap.context(() => {
      gsap.set(boxes, { yPercent: -50 })

      const loop = gsap.timeline({ paused: true, repeat: -1 })
      const shifts = [...boxes, ...boxes, ...boxes]
      shifts.forEach((box, index) => {
        loop.add(createCoverTimeline(box, count), index * STAGGER)
      })

      const cycle = STAGGER * count
      const loopHead = gsap.fromTo(
        loop,
        { totalTime: cycle + DURATION * 0.5 },
        {
          totalTime: `+=${cycle}`,
          duration: 1,
          ease: 'none',
          repeat: -1,
          paused: true,
        },
      )

      const playhead = { position: 0 }
      const wrapPosition = gsap.utils.wrap(0, loopHead.duration())
      const scrub = gsap.to(playhead, {
        position: 0,
        onUpdate: () => {
          loopHead.totalTime(wrapPosition(playhead.position))
        },
        paused: true,
        duration: reduceMotion ? 0.01 : 0.25,
        ease: 'power3',
      })

      scrubTo = (position) => {
        scrub.vars.position = position
        scrub.invalidate().restart()
      }
      readPosition = () => scrub.vars.position as number
    }, stage)

    const settleAt = (position: number) => {
      const snapped = snap(position)
      scrubTo(snapped)
      onSettleRef.current(wrapIndex(Math.round(snapped * count)))
    }

    const goToIndex = (target: number) => {
      const position = readPosition()
      const current = wrapIndex(Math.round(count * position))
      let bump = target - current
      if (target > current && target - current > count * 0.5) {
        bump = (count - bump) * -1
      }
      if (current > target && current - target > count * 0.5) {
        bump = count + bump
      }
      settleAt(position + bump / count)
    }

    controllerRef.current = {
      step: (direction) => settleAt(readPosition() + direction / count),
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      scrubTo(readPosition() + (event.deltaY + event.deltaX) / WHEEL_PER_LAP)
      clearTimeout(settleTimer)
      settleTimer = setTimeout(() => settleAt(readPosition()), WHEEL_SETTLE_MS)
    }

    let drag: {
      id: number
      startX: number
      startPosition: number
      moved: boolean
      target: HTMLElement | null
    } | null = null

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      stage.setPointerCapture(event.pointerId)
      drag = {
        id: event.pointerId,
        startX: event.clientX,
        startPosition: readPosition(),
        moved: false,
        target: (event.target as HTMLElement).closest<HTMLElement>(
          COVER_FLOW_ITEM_SELECTOR,
        ),
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return
      const dx = drag.startX - event.clientX
      if (Math.abs(dx) > CLICK_SLOP) drag.moved = true
      if (!drag.moved) return
      scrubTo(drag.startPosition + dx * DRAG_PER_PX)
    }

    const handlePointerUp = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return
      const { moved, target } = drag
      drag = null
      if (stage.hasPointerCapture(event.pointerId)) {
        stage.releasePointerCapture(event.pointerId)
      }
      if (!moved && target) {
        goToIndex(boxes.indexOf(target))
        return
      }
      settleAt(readPosition())
    }

    stage.addEventListener('wheel', handleWheel, { passive: false })
    stage.addEventListener('pointerdown', handlePointerDown)
    stage.addEventListener('pointermove', handlePointerMove)
    stage.addEventListener('pointerup', handlePointerUp)
    stage.addEventListener('pointercancel', handlePointerUp)

    return () => {
      clearTimeout(settleTimer)
      stage.removeEventListener('wheel', handleWheel)
      stage.removeEventListener('pointerdown', handlePointerDown)
      stage.removeEventListener('pointermove', handlePointerMove)
      stage.removeEventListener('pointerup', handlePointerUp)
      stage.removeEventListener('pointercancel', handlePointerUp)
      controllerRef.current = null
      ctx.revert()
    }
  }, [stageRef, itemsKey])

  return controllerRef
}
