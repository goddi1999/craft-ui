import { Plus } from 'lucide-react'
import { useId, useLayoutEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import './shimmer-accordion.css'

import { SHIMMER_ACCORDION_ITEMS } from './shimmer-accordion.data'
import type { ShimmerAccordionProps } from './shimmer-accordion.types'
import { buildShimmerStyle, SHIMMER_PRESETS } from './shimmer-accordion.utils'

const DEFAULTS = SHIMMER_PRESETS.Default

/**
 * An exclusive FAQ accordion whose answers are revealed by a coloured
 * shimmer band travelling through the text at a fixed characters-per-second
 * rate, so long and short answers read at the same pace.
 */
export function ShimmerAccordion({
  items = SHIMMER_ACCORDION_ITEMS,
  mode = DEFAULTS.mode,
  cps = DEFAULTS.cps,
  textAlpha = DEFAULTS.textAlpha,
  angle = DEFAULTS.angle,
  offset = DEFAULTS.offset,
  stops = DEFAULTS.stops,
  showIcons = true,
  defaultOpenIndex,
  className,
}: ShimmerAccordionProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState<number | null>(
    defaultOpenIndex ?? null,
  )

  // The reveal duration scales with each answer's length.
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    for (const answer of Array.from(
      root.querySelectorAll<HTMLElement>('[data-slot="shimmer-accordion-answer"]'),
    )) {
      const length = answer.textContent?.trim().length ?? 0
      answer.style.setProperty('--char-count', String(length))
    }
  }, [items])

  const handleToggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <div
      ref={rootRef}
      data-slot="shimmer-accordion"
      data-icons={showIcons}
      className={cn(className)}
      style={buildShimmerStyle({ mode, cps, textAlpha, angle, offset, stops })}
    >
      <ul>
        {items.map((item, index) => {
          const isOpen = openIndex === index
          const panelId = `${baseId}-panel-${index}`

          return (
            <li key={item.question} data-open={isOpen || undefined}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => handleToggle(index)}
              >
                {item.icon ? (
                  <span data-slot="shimmer-accordion-label">
                    <span data-slot="shimmer-accordion-icon">{item.icon}</span>
                    <span>{item.question}</span>
                  </span>
                ) : (
                  <span>{item.question}</span>
                )}
                <Plus
                  data-slot="shimmer-accordion-plus"
                  aria-hidden="true"
                  strokeWidth={1.5}
                />
              </button>
              <div
                id={panelId}
                role="region"
                aria-label={item.question}
                data-slot="shimmer-accordion-panel"
                inert={!isOpen}
              >
                <div data-slot="shimmer-accordion-content">
                  <div data-slot="shimmer-accordion-body">
                    <p data-slot="shimmer-accordion-answer">{item.answer}</p>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
