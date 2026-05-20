import { useEffect, type RefObject } from 'react'

import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

let isScrollTriggerRegistered = false

const HAS_SCROLL_TIMELINE_SUPPORT = CSS.supports(
  '(animation-timeline: view()) and (animation-range: 0 100%)',
)

export function usePlaybookScrollAnimationFallback(
  rootRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const root = rootRef.current
    if (!root || !enabled || HAS_SCROLL_TIMELINE_SUPPORT) return

    if (!isScrollTriggerRegistered) {
      gsap.registerPlugin(ScrollTrigger)
      isScrollTriggerRegistered = true
    }

    const scene = root.querySelector<HTMLElement>(
      '.content-wrap > main section:first-of-type',
    )
    const scalerImage = root.querySelector<HTMLImageElement>('.scaler img')
    const layers = root.querySelectorAll<HTMLElement>(
      '.grid > .layer',
    )

    if (!scene || !scalerImage || layers.length === 0) return

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: scene,
            start: 'top -10%',
            end: 'bottom 80%',
            scrub: true,
          },
        })
        .from(
          scalerImage,
          {
            height: window.innerHeight - 32,
            ease: 'power1.inOut',
          },
          0,
        )
        .from(
          scalerImage,
          {
            width: window.innerWidth - 32,
            ease: 'power2.inOut',
          },
          0,
        )

      gsap
        .timeline({
          scrollTrigger: {
            trigger: scene,
            start: 'top -40%',
            end: 'bottom bottom',
            scrub: true,
          },
        })
        .from(
          layers[0],
          {
            opacity: 0,
            ease: 'sine.out',
          },
          0,
        )
        .from(
          layers[0],
          {
            scale: 0,
            ease: 'power1.inOut',
          },
          0,
        )
        .from(
          layers[1],
          {
            opacity: 0,
            ease: 'sine.out',
          },
          0,
        )
        .from(
          layers[1],
          {
            scale: 0,
            ease: 'power3.inOut',
          },
          0,
        )
        .from(
          layers[2],
          {
            opacity: 0,
            ease: 'sine.out',
          },
          0,
        )
        .from(
          layers[2],
          {
            scale: 0,
            ease: 'power4.inOut',
          },
          0,
        )
    }, root)

    return () => {
      ctx.revert()
    }
  }, [enabled, rootRef])
}
