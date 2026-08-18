import { useState } from 'react'

import { CarouselSlider } from './CarouselSlider'

const SLIDES = [
  { id: 'aurora', title: 'Aurora', hue: 265 },
  { id: 'lagoon', title: 'Lagoon', hue: 190 },
  { id: 'ember', title: 'Ember', hue: 20 },
  { id: 'moss', title: 'Moss', hue: 140 },
]

export function CarouselSliderPage() {
  const [index, setIndex] = useState(0)

  return (
    <div className="min-h-svh bg-background px-4 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            shared / carousel-slider
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight">
            Carousel slider
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            A draggable card stack with spring transitions. Drag a card or use
            the dots to move between slides.
          </p>
        </header>

        <section className="flex flex-col items-center gap-8">
          <CarouselSlider
            index={index}
            onIndexChange={setIndex}
            slides={SLIDES.map((slide) => (
              <div
                key={slide.id}
                className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl text-white"
                style={{
                  background: `linear-gradient(160deg, hsl(${slide.hue} 80% 55%), hsl(${slide.hue + 40} 70% 35%))`,
                }}
              >
                <p className="text-2xl font-semibold">{slide.title}</p>
                <p className="text-sm opacity-80">Slide {slide.id}</p>
              </div>
            ))}
          />
          <p className="text-sm text-muted-foreground">
            Showing {SLIDES[index]?.title ?? '—'} ({index + 1} of{' '}
            {SLIDES.length})
          </p>
        </section>
      </div>
    </div>
  )
}
