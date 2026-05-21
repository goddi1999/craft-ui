import { useEffect, type RefObject } from 'react'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useLinePathAnimation(
  scrollerRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const hero = scroller.querySelector<HTMLElement>(
      '.line-path-animation__hero h1',
    )
    const content = scroller.querySelector<HTMLElement>(
      '.line-path-animation__content',
    )
    const fillers = Array.from(
      scroller.querySelectorAll<SVGPathElement>('.fillers path'),
    )
    if (!hero || !content || fillers.length === 0) return

    fillers.forEach((path) => {
      const length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
    })

    const ctx = gsap.context(() => {
      gsap.fromTo(
        hero,
        { scale: 1 },
        {
          scale: 0.75,
          ease: 'none',
          scrollTrigger: {
            scroller,
            trigger: hero,
            start: 'top top',
            end: '+=50%',
            scrub: true,
          },
        },
      )

      gsap.fromTo(
        content,
        { scale: 0.95 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            scroller,
            trigger: content,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          },
        },
      )

      fillers.forEach((path) => {
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            scroller,
            trigger: content,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
          },
        })
      })
    }, scroller)

    return () => ctx.revert()
  }, [scrollerRef])
}
