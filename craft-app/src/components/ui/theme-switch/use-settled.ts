import { useEffect, useState } from 'react'

/**
 * False for the first two painted frames. A stored theme often reaches the `theme` prop just
 * after mount; that correction swaps the icon in place, so a page that loads dark never spins.
 */
export function useSettled() {
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    let second = 0
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setSettled(true))
    })
    return () => {
      cancelAnimationFrame(first)
      cancelAnimationFrame(second)
    }
  }, [])

  return settled
}
