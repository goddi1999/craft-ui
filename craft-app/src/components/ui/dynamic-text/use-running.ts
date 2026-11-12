import { useEffect, useState, type RefObject } from 'react'

/** True while the element is on screen and the tab is visible. */
export function useRunning(ref: RefObject<HTMLElement | null>) {
  const [running, setRunning] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let inView = false
    const sync = () => setRunning(inView && document.visibilityState === 'visible')
    const observer = new IntersectionObserver((entries) => {
      inView = entries.some((entry) => entry.isIntersecting)
      sync()
    })
    observer.observe(el)
    document.addEventListener('visibilitychange', sync)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [ref])

  return running
}
