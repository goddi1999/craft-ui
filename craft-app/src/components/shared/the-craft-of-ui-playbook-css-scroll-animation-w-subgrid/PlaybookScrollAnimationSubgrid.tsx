import { useRef } from 'react'

import { cn } from '@/lib/utils'

import './playbook-scroll-animation-subgrid.css'

import { PLAYBOOK_DEFAULT_IMAGES } from './playbook-scroll-animation-subgrid.data'
import type { PlaybookScrollAnimationSubgridProps } from './playbook-scroll-animation-subgrid.types'
import { usePlaybookScrollAnimationFallback } from './use-playbook-scroll-animation-fallback'

/** Photos per layer, outermost first; the next one is the centre photo. */
const LAYER_SIZES = [6, 6, 2]
const IMAGE_SLOTS = LAYER_SIZES.reduce((sum, size) => sum + size, 0) + 1

export function PlaybookScrollAnimationSubgrid({
  theme = 'system',
  enhanced = true,
  stick = true,
  center = true,
  layers = true,
  stagger = 'range',
  images = PLAYBOOK_DEFAULT_IMAGES,
  className,
  style,
}: PlaybookScrollAnimationSubgridProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  usePlaybookScrollAnimationFallback(rootRef, enhanced)

  // Cycle through the given photos so a short list still fills every slot.
  const slots = Array.from(
    { length: IMAGE_SLOTS },
    (_, index) => images[index % images.length],
  )
  const layerPhotos = LAYER_SIZES.map((size, layer) => {
    const start = LAYER_SIZES.slice(0, layer).reduce((sum, n) => sum + n, 0)
    return slots.slice(start, start + size)
  })
  const centre = slots[IMAGE_SLOTS - 1]

  return (
    <div
      ref={rootRef}
      data-slot="playbook-scroll-animation-subgrid"
      data-theme={theme}
      data-enhanced={enhanced ? 'true' : 'false'}
      data-stick={stick ? 'true' : 'false'}
      data-center={center ? 'true' : 'false'}
      data-layers={layers ? 'true' : 'false'}
      data-stagger={stagger}
      className={cn(className)}
      style={style}
    >
      <div className="content-wrap">
        <header>
          <h1 className="fluid">let&apos;s<br />scroll.</h1>
        </header>

        <main>
          <section>
            <div className="content">
              <div className="grid">
                {layerPhotos.map((photos, layer) => (
                  <div key={layer} className="layer">
                    {photos.map((photo, index) => (
                      <div key={index}>
                        <img src={photo.src} alt={photo.alt} loading="lazy" />
                      </div>
                    ))}
                  </div>
                ))}
                <div className="scaler">
                  <img src={centre.src} alt={centre.alt} loading="eager" />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="fluid">fin.</h2>
          </section>
        </main>
      </div>

      <footer>
        <span aria-hidden="true">
          ʕ<span className="arm">ノ</span>•ᴥ•ʔ<span className="arm">ノ</span>
          <span className="spring">
            <span>︵</span>
          </span>
          <span className="table">┻━┻</span>
        </span>
        &nbsp;&copy; jhey &apos;24
      </footer>
    </div>
  )
}
