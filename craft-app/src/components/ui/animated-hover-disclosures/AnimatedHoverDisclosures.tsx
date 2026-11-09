import { useEffect, useRef, useState, type SyntheticEvent } from 'react'

import { cn } from '@/lib/utils'

import './animated-hover-disclosures.css'

import { HOVER_DISCLOSURE_ITEMS } from './animated-hover-disclosures.data'
import type { AnimatedHoverDisclosuresProps } from './animated-hover-disclosures.types'

/**
 * A row of columns where the one under the pointer (or focus) grows to reveal
 * its copy and image while the others collapse to slim rotated labels.
 */
export function AnimatedHoverDisclosures({
  items = HOVER_DISCLOSURE_ITEMS,
  defaultActiveIndex = 0,
  activeIndex,
  onActiveIndexChange,
  linkLabel = 'Watch now',
  className,
}: AnimatedHoverDisclosuresProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const [uncontrolledIndex, setUncontrolledIndex] = useState(defaultActiveIndex)
  const current = activeIndex ?? uncontrolledIndex

  // Articles are sized to the widest column so copy never reflows mid-transition.
  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const syncArticleWidth = () => {
      const widths = Array.from(list.children, (child) =>
        child instanceof HTMLElement ? child.offsetWidth : 0,
      )
      list.style.setProperty('--article-width', String(Math.max(...widths)))
    }

    const observer = new ResizeObserver(syncArticleWidth)
    observer.observe(list)
    return () => observer.disconnect()
  }, [items.length])

  const handleActivate = (event: SyntheticEvent<HTMLUListElement>) => {
    if (!(event.target instanceof Element)) return
    const item = event.target.closest<HTMLLIElement>('li[data-index]')
    if (!item || !listRef.current?.contains(item)) return

    const index = Number(item.dataset.index)
    if (index === current) return
    if (activeIndex === undefined) setUncontrolledIndex(index)
    onActiveIndexChange?.(index)
  }

  const columns = items
    .map((_, index) => (index === current ? '10fr' : '1fr'))
    .join(' ')

  return (
    <ul
      ref={listRef}
      data-slot="animated-hover-disclosures"
      className={cn(className)}
      style={{ gridTemplateColumns: columns }}
      onPointerMove={handleActivate}
      onClick={handleActivate}
      onFocus={handleActivate}
    >
      {items.map((item, index) => (
        <li
          key={item.title}
          data-index={index}
          data-active={index === current}
        >
          <article>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            {item.icon}
            {item.href ? (
              <a href={item.href}>
                <span>{linkLabel}</span>
              </a>
            ) : null}
            {item.image ? <img src={item.image} alt="" /> : null}
          </article>
        </li>
      ))}
    </ul>
  )
}
