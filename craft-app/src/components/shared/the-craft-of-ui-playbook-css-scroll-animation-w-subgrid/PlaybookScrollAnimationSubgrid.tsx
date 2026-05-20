import { useRef, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import './playbook-scroll-animation-subgrid.css'

import type { PlaybookScrollAnimationSubgridProps } from './playbook-scroll-animation-subgrid.types'
import { usePlaybookScrollAnimationFallback } from './use-playbook-scroll-animation-fallback'

const FASHION_IMAGES = [
  'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGZhc2hpb258ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1556304044-0699e31c6a34?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTJ8fGZhc2hpb258ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1590330297626-d7aff25a0431?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA3fHxmYXNoaW9ufGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTk1fHxmYXNoaW9ufGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzR8fG1vZGVsJTIwZmFzaGlvbiUyMHN0cmVldHxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1565321590372-09331b9dd1eb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGFpciUyMGpvcmRhbnxlbnwwfHwwfHx8MA%3D%3D',
]

const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjM4fHxwcm9kdWN0fGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1637414165749-9b3cd88b8271?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHRlY2glMjBwcm9kdWN0fGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1699911251220-8e0de3b5ce88?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8b25ld2hlZWx8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1667483629944-6414ad0648c5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGx1eHVyeSUyMHdhdGNofGVufDB8fDB8fHww',
  'https://plus.unsplash.com/premium_photo-1706078438060-d76ced26d8d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGNhbWVyYSUyMHBvbGFyb2lkfGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1525385444278-b7968e7e28dc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fGl0ZW18ZW58MHx8MHx8fDA%3D',
]

const TYPE_IMAGES = [
  'https://images.unsplash.com/reserve/LJIZlzHgQ7WPSh5KVTCB_Typewriter.jpg?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXRlbXxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D',
]

export function PlaybookScrollAnimationSubgrid({
  theme = 'system',
  enhanced = true,
  stick = true,
  center = true,
  layers = true,
  stagger = 'range',
  className,
  style,
}: PlaybookScrollAnimationSubgridProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  usePlaybookScrollAnimationFallback(rootRef, enhanced)

  const rootStyle: CSSProperties = {
    ...style,
  }

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
      style={rootStyle}
    >
      <div className="content-wrap">
        <header>
          <h1 className="fluid">let&apos;s<br />scroll.</h1>
        </header>

        <main>
          <section>
            <div className="content">
              <div className="grid">
                <div className="layer">
                  {FASHION_IMAGES.map((src) => (
                    <div key={src}>
                      <img src={src} alt="" loading="lazy" />
                    </div>
                  ))}
                </div>
                <div className="layer">
                  {PRODUCT_IMAGES.map((src) => (
                    <div key={src}>
                      <img src={src} alt="" loading="lazy" />
                    </div>
                  ))}
                </div>
                <div className="layer">
                  {TYPE_IMAGES.map((src) => (
                    <div key={src}>
                      <img src={src} alt="" loading="lazy" />
                    </div>
                  ))}
                </div>
                <div className="scaler">
                  <img
                    src="https://assets.codepen.io/605876/model-shades.jpg?format=auto&quality=100"
                    alt=""
                    loading="eager"
                  />
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
