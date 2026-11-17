import { useState, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import { BLUR_LOAD_DEFAULT_BLUR } from './blur-load.constants'
import type { BlurLoadProps } from './blur-load.types'

import './blur-load.css'

/**
 * Progressive blur loader: a placeholder paints immediately with a real CSS
 * `filter: blur()`, a soft pulse overlays while waiting, and the high-res
 * `<img>` fades in once ready.
 */
export function BlurLoad({
  src,
  placeholderSrc,
  alt,
  loaded: loadedProp,
  loading = 'lazy',
  objectFit = 'cover',
  blur = BLUR_LOAD_DEFAULT_BLUR,
  className,
  style,
  ref,
  ...props
}: BlurLoadProps) {
  const isControlled = loadedProp !== undefined
  const [uncontrolledLoaded, setUncontrolledLoaded] = useState(false)
  const [loadedSrc, setLoadedSrc] = useState(src)
  // A new src starts unloaded again (adjust state during render, not in an effect).
  if (loadedSrc !== src) {
    setLoadedSrc(src)
    setUncontrolledLoaded(false)
  }
  const loaded = isControlled ? loadedProp : uncontrolledLoaded

  // Cached images can finish before React attaches onLoad; catch them on mount.
  const catchCached = (img: HTMLImageElement | null) => {
    if (!isControlled && img?.complete && img.naturalWidth > 0) {
      setUncontrolledLoaded(true)
    }
  }

  const rootStyle = {
    ...style,
    '--blur-load-amount': `${blur}px`,
  } as CSSProperties

  const imgStyle = { objectFit } as CSSProperties

  return (
    <div
      ref={ref}
      data-slot="blur-load"
      data-loaded={loaded}
      className={cn(className)}
      style={rootStyle}
      {...props}
    >
      <img
        data-slot="blur-load-placeholder"
        src={placeholderSrc}
        alt=""
        aria-hidden
        decoding="async"
        draggable={false}
        style={imgStyle}
      />
      <img
        ref={catchCached}
        data-slot="blur-load-full"
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        style={imgStyle}
        onLoad={() => {
          if (!isControlled) setUncontrolledLoaded(true)
        }}
      />
    </div>
  )
}
