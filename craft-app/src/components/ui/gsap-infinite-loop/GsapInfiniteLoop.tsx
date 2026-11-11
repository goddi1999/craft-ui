import gsap from 'gsap'
import { useEffect, useRef, type HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

import './gsap-infinite-loop.css'

const DEFAULT_ITEMS = [
  'Infinite',
  'loops',
  'without',
  'repeating',
  'or',
  'shuffling',
  'elements',
  'using',
  'GSAP',
  '🤙',
] as const

export type GsapInfiniteLoopProps = {
  /** Words shown in the vertical carousel. */
  items?: string[]
  className?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

function isEmojiOnly(value: string) {
  return !/\p{L}|\p{N}/u.test(value)
}

export function GsapInfiniteLoop({
  items = [...DEFAULT_ITEMS],
  className,
  ...props
}: GsapInfiniteLoopProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const itemsKey = items.join('\0')

  useEffect(() => {
    const list = listRef.current
    const indicator = indicatorRef.current
    const root = rootRef.current
    if (!list || !indicator || !root) return

    const lines = gsap.utils.toArray<HTMLElement>(
      list.querySelectorAll('[data-slot="gsap-infinite-loop-item"]'),
    )
    if (lines.length === 0) return

    gsap.set(lines, { yPercent: 300 })

    const master = gsap.timeline({ paused: true })
    // Triple the node references (not the DOM) so the scrubber can loop
    // forever without cloning or shuffling elements.
    const paddedLines = [...lines, ...lines, ...lines]
    paddedLines.forEach((line, index) => {
      const lineTl = gsap
        .timeline()
        .set(line, { yPercent: 300 })
        .to(
          line,
          {
            yPercent: '-=600',
            repeatRefresh: true,
            immediateRender: false,
            ease: 'none',
            duration: 6,
          },
          0,
        )
      master.add(lineTl, index)
    })

    const scrubber = gsap.timeline({ paused: true }).fromTo(
      master,
      { totalTime: lines.length + 1 },
      {
        totalTime: lines.length * 2 + 1,
        ease: 'none',
        duration: lines.length,
        repeat: -1,
      },
    )
    gsap.set(scrubber, { totalTime: lines.length + 2 })

    let index = 0
    gsap.set(indicator, {
      '--width': lines[index].getBoundingClientRect().width,
    })

    const syncIndicator = () => {
      index += 1
      gsap.set(indicator, {
        '--width': lines[index % lines.length].getBoundingClientRect().width,
        '--h': gsap.utils.random(0, 359),
      })
    }

    // Reduced motion: hold on the first word instead of stepping forever.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return () => {
        scrubber.kill()
        master.kill()
        gsap.set(lines, { clearProps: 'transform' })
      }
    }

    const stepper = gsap.to(scrubber, {
      delay: 1,
      totalTime: '+=1',
      duration: 1,
      repeat: -1,
      repeatDelay: 1,
      repeatRefresh: true,
      onStart: syncIndicator,
      onRepeat: syncIndicator,
      ease: 'elastic.out(1, 0.875)',
    })

    return () => {
      stepper.kill()
      scrubber.kill()
      master.kill()
      gsap.killTweensOf([scrubber, ...lines, indicator])
      gsap.set(lines, { clearProps: 'transform' })
    }
  }, [itemsKey])

  return (
    <div
      ref={rootRef}
      data-slot="gsap-infinite-loop"
      className={cn(className)}
      {...props}
    >
      <div
        ref={indicatorRef}
        data-slot="gsap-infinite-loop-indicator"
        aria-hidden
      />
      <ul ref={listRef} data-slot="gsap-infinite-loop-list">
        {items.map((item, i) => (
          <li
            key={`${item}-${i}`}
            data-slot="gsap-infinite-loop-item"
            data-emoji={isEmojiOnly(item) ? 'true' : undefined}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
