import { useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import '@/components/shared/styleable-select/styleable-select.css'

import type { StyleableSelectProps } from './styleable-select.types'

const DEFAULT_OPTIONS = [
  'select',
  'design',
  'prototype',
  'solve',
  'build',
  'develop',
  'debug',
  'learn',
  'cook',
  'ship',
  'prompt',
  'collaborate',
  'create',
  'inspire',
  'follow',
  'innovate',
  'test',
  'optimize',
  'teach',
  'visualize',
  'transform',
  'scale',
  'do it',
]

export function StyleableSelect({
  options = DEFAULT_OPTIONS,
  value,
  onValueChange,
  labelPrefix = 'you',
  theme = 'system',
  className,
  fullPage = false,
}: StyleableSelectProps) {
  const normalizedOptions = useMemo(
    () => (options.length ? options : DEFAULT_OPTIONS),
    [options],
  )
  const [internalValue, setInternalValue] = useState(
    value ?? normalizedOptions[0] ?? 'select',
  )
  const [isOpen, setIsOpen] = useState(false)
  const [isCentered, setIsCentered] = useState(true)
  const scrollerRef = useRef<HTMLUListElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const resolvedValue = value ?? internalValue
  const selectedIndex = Math.max(normalizedOptions.indexOf(resolvedValue), 0)

  const handleSelect = (next: string) => {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
    setIsOpen(false)
  }

  const centerIndex = (index: number, behavior: ScrollBehavior) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const item = scroller.querySelector<HTMLElement>(`[data-index='${index}']`)
    if (!item) return

    const target = item.offsetTop - (scroller.clientHeight - item.offsetHeight) / 2
    scroller.scrollTo({
      top: Math.max(0, target),
      behavior,
    })

    const itemRect = item.getBoundingClientRect()
    const scrollerRect = scroller.getBoundingClientRect()
    const itemCenter = itemRect.top + itemRect.height / 2
    const scrollerCenter = scrollerRect.top + scrollerRect.height / 2
    setIsCentered(Math.abs(itemCenter - scrollerCenter) <= 1)
  }

  useEffect(() => {
    centerIndex(selectedIndex, 'auto')
  }, [selectedIndex])

  useEffect(() => {
    if (!isOpen) return
    centerIndex(selectedIndex, 'smooth')
  }, [isOpen, selectedIndex])

  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (event: PointerEvent) => {
      const root = rootRef.current
      if (root && !root.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen])

  return (
    <div
      data-slot="styleable-select"
      data-theme={theme}
      data-fullpage={fullPage ? 'true' : undefined}
      className={cn(className)}
    >
      <div ref={rootRef} className="styleable-select__line">
        <span className="styleable-select__prefix">{labelPrefix}</span>
        <div
          className="custom-select"
          data-open={isOpen ? 'true' : 'false'}
          data-centered={isCentered ? 'true' : 'false'}
        >
          <button
            type="button"
            className="custom-select__trigger"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className="custom-select__value">{resolvedValue}</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                className="chevron-top"
                d="M7 9L12 4"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                className="chevron-top--left"
                d="M17 9L12 4"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                className="chevron-bottom"
                d="M7 15L12 20"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                className="chevron-bottom--right"
                d="M17 15L12 20"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="custom-select__picker" aria-hidden={isOpen ? 'false' : 'true'}>
            <ul ref={scrollerRef} className="scroller" role="listbox">
              {normalizedOptions.map((option, index) => {
                const proximity = Math.min(3, Math.abs(index - selectedIndex))
                const isSelected = resolvedValue === option

                return (
                  <li
                    key={option}
                    data-index={index}
                    role="option"
                    aria-selected={isSelected}
                    data-selected={isSelected ? 'true' : 'false'}
                    style={{ ['--proximity' as string]: proximity }}
                  >
                    <button
                      type="button"
                      className="custom-select__option"
                      onClick={() => handleSelect(option)}
                    >
                      {option}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
