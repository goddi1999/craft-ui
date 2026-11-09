import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'

import './infinite-cover-flow.css'

import { DEFAULT_COVERS, type CoverFlowItem } from './infinite-cover-flow.data'
import { useInfiniteCoverFlow } from './use-infinite-cover-flow'

const PLAY_ICON_PATH =
  'M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z'
const SCROLL_ICON_PATH =
  'M20 6H23L19 2L15 6H18V18H15L19 22L23 18H20V6M9 3.09C11.83 3.57 14 6.04 14 9H9V3.09M14 11V15C14 18.3 11.3 21 8 21S2 18.3 2 15V11H14M7 9H2C2 6.04 4.17 3.57 7 3.09V9Z'

export type InfiniteCoverFlowProps = {
  /** Covers to loop through. @default DEFAULT_COVERS (10 album covers) */
  items?: readonly CoverFlowItem[]
  /** Called with the centred cover's index each time the flow settles. */
  onIndexChange?: (index: number) => void
  /** Accessible name for the carousel region. @default 'Album covers' */
  label?: string
  /** Show the animated "scroll me" hint in the corner. @default true */
  showHint?: boolean
  className?: string
}

/**
 * An endless 3D cover flow. Each cover's trip across the stage is one GSAP
 * timeline; the covers are tripled in time (not in the DOM) so a scrubbed
 * playhead can wrap forever. Scrub with the wheel or a drag, click a cover to
 * centre it, or use the buttons / arrow keys.
 */
export function InfiniteCoverFlow({
  items = DEFAULT_COVERS,
  onIndexChange,
  label = 'Album covers',
  showHint = true,
  className,
}: InfiniteCoverFlowProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const itemsKey = items.map((item) => item.src).join('\n')

  const handleSettle = (index: number) => {
    setActiveIndex(index)
    onIndexChange?.(index)
  }

  const controllerRef = useInfiniteCoverFlow({
    stageRef,
    itemsKey,
    onSettle: handleSettle,
  })

  const handlePrevious = () => controllerRef.current?.step(-1)
  const handleNext = () => controllerRef.current?.step(1)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      event.preventDefault()
      handlePrevious()
    }
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      event.preventDefault()
      handleNext()
    }
  }

  const activeItem = items[activeIndex] as CoverFlowItem | undefined

  return (
    <div
      data-slot="infinite-cover-flow"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      className={cn(className)}
      onKeyDown={handleKeyDown}
    >
      <div ref={stageRef} className="infinite-cover-flow__stage">
        {items.map((item, i) => (
          <div
            key={item.src + i}
            data-slot="infinite-cover-flow-item"
            className="infinite-cover-flow__box"
            style={{ '--infinite-cover-flow-src': `url(${item.src})` } as CSSProperties}
          >
            <img src={item.src} alt={item.alt} draggable={false} />
          </div>
        ))}
      </div>

      <div className="infinite-cover-flow__controls">
        <button
          type="button"
          className="infinite-cover-flow__button"
          data-direction="previous"
          aria-label="Previous album"
          onClick={handlePrevious}
        >
          <svg viewBox="0 0 448 512" aria-hidden="true">
            <path d={PLAY_ICON_PATH} />
          </svg>
        </button>
        <button
          type="button"
          className="infinite-cover-flow__button"
          data-direction="next"
          aria-label="Next album"
          onClick={handleNext}
        >
          <svg viewBox="0 0 448 512" aria-hidden="true">
            <path d={PLAY_ICON_PATH} />
          </svg>
        </button>
      </div>

      {showHint && (
        <svg
          className="infinite-cover-flow__hint"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path fill="currentColor" d={SCROLL_ICON_PATH} />
        </svg>
      )}

      <p className="sr-only" aria-live="polite">
        {activeItem ? `${activeItem.alt}, ${activeIndex + 1} of ${items.length}` : ''}
      </p>
    </div>
  )
}
