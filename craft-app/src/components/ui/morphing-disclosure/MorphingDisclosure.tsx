import { Plus } from 'lucide-react'
import { useId, useLayoutEffect, useRef, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import './morphing-disclosure.css'

import { MORPHING_DISCLOSURE_ITEMS } from './morphing-disclosure.data'
import type { MorphingDisclosureProps } from './morphing-disclosure.types'
import { measureContentHeights } from './morphing-disclosure.utils'

/**
 * An exclusive `<details name>` group whose open row detaches from the stack,
 * morphing its corners and borders while the panel springs open.
 */
export function MorphingDisclosure({
  items = MORPHING_DISCLOSURE_ITEMS,
  defaultOpenIndex,
  bordered = true,
  translate = true,
  highlight = true,
  depth = false,
  borderStyle = 'border',
  borderWidth = 2,
  blur = 4,
  contentOpacity = 0.4,
  contentOffset = 1,
  gap = 1.5,
  depthAmount = 0.5,
  speed = 1,
  className,
}: MorphingDisclosureProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const groupName = useId()

  // Browsers without interpolate-size can't animate to `height: auto`, so
  // they get each panel's measured height as a fixed target instead.
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || CSS.supports('interpolate-size: allow-keywords')) return

    let measuredWidth = root.offsetWidth
    measureContentHeights(root)

    // Only a width change can rewrap the copy; opening a row changes height.
    const observer = new ResizeObserver(() => {
      if (root.offsetWidth === measuredWidth) return
      measuredWidth = root.offsetWidth
      measureContentHeights(root)
    })
    observer.observe(root)
    return () => observer.disconnect()
  }, [items])

  const style = {
    '--border-width': `${borderWidth}px`,
    '--blur': blur,
    '--opacity': contentOpacity,
    '--translate-y': contentOffset,
    '--translate-margin': gap,
    '--translate-depth': depthAmount,
    '--speed': speed,
  } as CSSProperties

  return (
    <div
      ref={rootRef}
      data-slot="morphing-disclosure"
      data-bordered={bordered}
      data-translate={translate}
      data-highlight={highlight}
      data-depth={depth}
      data-style={borderStyle}
      className={cn(className)}
      style={style}
    >
      {items.map((item, index) => (
        <details
          key={item.title}
          name={groupName}
          open={index === defaultOpenIndex}
        >
          <summary>
            {item.icon}
            <span>{item.title}</span>
            <Plus aria-hidden="true" />
          </summary>
          <div data-slot="morphing-disclosure-content">
            <p>{item.content}</p>
          </div>
        </details>
      ))}
    </div>
  )
}
