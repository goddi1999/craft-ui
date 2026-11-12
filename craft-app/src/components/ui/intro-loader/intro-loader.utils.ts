import type { GreetingItem } from './intro-loader.types'

export const toGreeting = (greeting: string | GreetingItem): GreetingItem =>
  typeof greeting === 'string' ? { text: greeting } : greeting

// zero or a negative speed would stall the timers, so it falls back to 1
export const toSpeed = (speed: number) => (Number.isFinite(speed) && speed > 0 ? speed : 1)
