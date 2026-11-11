import { useCallback, useEffect, useRef, useState } from 'react'

export type ActiveMonth = { key: string; direction: 1 | -1 }

/**
 * Tracks the month group under the sticky bar as the window scrolls.
 * `direction` is 1 when moving to an older month, so the label can roll the right way.
 */
export function useActiveMonth(keys: string[]) {
  const groups = useRef(new Map<string, HTMLElement>())
  const bar = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<ActiveMonth>({
    key: keys[0] ?? '',
    direction: 1,
  })

  const register = useCallback(
    (key: string) => (element: HTMLElement | null) => {
      if (element) groups.current.set(key, element)
      else groups.current.delete(key)
    },
    [],
  )

  useEffect(() => {
    let frame = 0
    const sync = () => {
      frame = 0
      const line = (bar.current?.getBoundingClientRect().bottom ?? 0) + 24
      let key = keys[0] ?? ''
      for (const candidate of keys) {
        const top = groups.current.get(candidate)?.getBoundingClientRect().top
        if (top !== undefined && top <= line) key = candidate
      }
      // at the very bottom the last month may never reach the line
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atEnd && window.scrollY > 0) key = keys[keys.length - 1] ?? key
      setActive((previous) =>
        previous.key === key
          ? previous
          : {
              key,
              direction: keys.indexOf(key) > keys.indexOf(previous.key) ? 1 : -1,
            },
      )
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync)
    }
    sync()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [keys])

  const jumpTo = (key: string, reduce: boolean) =>
    groups.current.get(key)?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    })

  return { active, bar, register, jumpTo }
}
