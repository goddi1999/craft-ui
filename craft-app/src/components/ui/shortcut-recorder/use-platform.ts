import { useSyncExternalStore } from 'react'

import type { Platform } from './shortcut-recorder.types'
import { detectPlatform } from './shortcut-recorder.utils'

const subscribe = () => () => {}
const serverPlatform = (): Platform => 'mac'

/** The viewer's platform. Server renders assume a Mac and settle on the first client render. */
export function usePlatform(override?: Platform): Platform {
  const detected = useSyncExternalStore(subscribe, detectPlatform, serverPlatform)
  return override ?? detected
}
