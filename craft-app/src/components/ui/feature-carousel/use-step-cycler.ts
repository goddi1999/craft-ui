import { useEffect, useState } from 'react'

/** Advances through `total` steps every `interval` ms; a manual advance restarts the timer. */
export function useStepCycler(total: number, interval: number, paused: boolean) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (paused) return
    const timer = setTimeout(() => setStep((prev) => (prev + 1) % total), interval)
    return () => clearTimeout(timer)
  }, [step, total, interval, paused])

  const advance = () => setStep((prev) => (prev + 1) % total)

  return { step, advance }
}
