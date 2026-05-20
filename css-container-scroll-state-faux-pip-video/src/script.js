import { Pane } from 'https://esm.sh/tweakpane@4.0.4'

const config = {
  theme: 'light',
  debug: false,
  margin: 0.1,
  gutter: 1,
  width: 260,
  duration: 0.26,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const update = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.debug = config.debug
  document.documentElement.style.setProperty('--margin', config.margin)
  document.documentElement.style.setProperty('--gutter', config.gutter)
  document.documentElement.style.setProperty('--width', config.width)
  document.documentElement.style.setProperty('--duration', config.duration)
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'theme'
  )
    return update()
  document.startViewTransition(() => update())
}

ctrl.addBinding(config, 'margin', {
  label: 'threshold',
  min: 0,
  max: 1,
  step: 0.01,
})
ctrl.addBinding(config, 'gutter', {
  label: 'gutter(rem)',
  min: 0,
  max: 5,
  step: 0.1,
})
ctrl.addBinding(config, 'width', {
  label: 'width(px)',
  min: 120,
  max: 360,
  step: 1,
})
ctrl.addBinding(config, 'duration', {
  label: 'transition(s)',
  min: 0.2,
  max: 1,
  step: 0.01,
})

ctrl.addBinding(config, 'debug', {
  label: 'debug',
})

ctrl.addBinding(config, 'theme', {
  label: 'theme',
  options: {
    system: 'system',
    light: 'light',
    dark: 'dark',
  },
})

ctrl.on('change', sync)
update()

if (!CSS.supports('container-type: scroll-state')) {
  const sentinel = document.querySelector('.sentinel')
  const observer = new IntersectionObserver((entries) => {
    document.documentElement.dataset.stuck = !entries[0].isIntersecting
  })
  observer.observe(sentinel)
}
