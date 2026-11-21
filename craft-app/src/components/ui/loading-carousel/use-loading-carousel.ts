import { useEffect, useState } from 'react'

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

type UseLoadingCarouselOptions<T> = {
  items: T[]
  interval: number
  shuffleItems: boolean
  paused: boolean
  onChange?: (index: number) => void
}

/** Index, direction and autoplay for a looping carousel. */
export function useLoadingCarousel<T>({
  items,
  interval,
  shuffleItems,
  paused,
  onChange,
}: UseLoadingCarouselOptions<T>) {
  const [order] = useState(() => (shuffleItems ? shuffle(items) : items))
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const count = order.length

  const goTo = (index: number, nextDirection: number) => {
    const next = (index + count) % count
    setDirection(nextDirection)
    setCurrent(next)
    onChange?.(next)
  }

  const goNext = () => goTo(current + 1, 1)
  const goPrev = () => goTo(current - 1, -1)
  const select = (index: number) => goTo(index, index >= current ? 1 : -1)

  useEffect(() => {
    if (paused || count < 2) return
    const id = window.setTimeout(() => {
      const next = (current + 1) % count
      setDirection(1)
      setCurrent(next)
      onChange?.(next)
    }, interval)
    return () => window.clearTimeout(id)
  }, [current, paused, interval, count, onChange])

  return { items: order, current, direction, goNext, goPrev, select }
}
