import { useEffect } from 'react'

import {
  BOT_COLOR_NAMES,
  BOT_FACE_NAMES,
  BOT_SHAPES,
  type BotColor,
  type BotFace,
  type BotShape,
} from '@/components/ui/agent-computer-icon'

export type StudioLook = { shape: BotShape; face: BotFace; color: BotColor }

const pick = <T extends string>(list: readonly T[], value: string | null, fallback: T) =>
  value !== null && (list as readonly string[]).includes(value) ? (value as T) : fallback

/** The look in `?shape=&face=&color=`, keeping `fallback` for anything missing or unknown. */
export function readStudioLook(fallback: StudioLook): StudioLook {
  if (typeof window === 'undefined') return fallback
  const params = new URLSearchParams(window.location.search)
  return {
    shape: pick(BOT_SHAPES, params.get('shape'), fallback.shape),
    face: pick(BOT_FACE_NAMES, params.get('face'), fallback.face),
    color: pick(BOT_COLOR_NAMES, params.get('color'), fallback.color),
  }
}

/** Mirrors the look into the URL without a navigation, so the address always opens this bot. */
export function useStudioUrl({ shape, face, color }: StudioLook) {
  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('shape', shape)
    url.searchParams.set('face', face)
    url.searchParams.set('color', color)
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url)
  }, [shape, face, color])
}
