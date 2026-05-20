import { Pane } from 'https://esm.sh/tweakpane@4.0.4'

const config = {
  theme: 'dark',
  reveal: false,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const update = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.reveal = config.reveal
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

ctrl.addBinding(config, 'reveal', {
  label: 'Reveal',
})

ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
})

ctrl.on('change', sync)
update()

if (
  !CSS.supports('(animation-timeline: view()) and (animation-range: 0 100%)')
) {
  class Slider {
    constructor(element) {
      const input = element
      const sync = () => {
        const val = (input.value - input.min) / (input.max - input.min)
        document.documentElement.style.setProperty(
          '--compare',
          Math.round(val * 100)
        )
      }
      console.info('polyfilling scroll animation for input:', element)
      input.addEventListener('input', sync)
      // on iOS, you'll also want to cater for starting an interaction
      input.addEventListener('pointerdown', sync)
      sync()
    }
  }
  const sliders = document.querySelectorAll('.slider')
  for (const slider of sliders) new Slider(slider)
}

const syncParallax = ({ x, y }) => {
  document.documentElement.style.setProperty('--xp', x / window.innerWidth - 0)
  document.documentElement.style.setProperty('--yp', y / window.innerHeight - 0)
}

document.body.addEventListener('pointermove', syncParallax)
