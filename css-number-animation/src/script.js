import { Pane } from 'https://esm.sh/tweakpane@4.0.4'

const config = {
  value: 55,
  animation: false,
}

const ctrl = new Pane({ title: 'config' })

ctrl.addBinding(config, 'value', {
  min: 0,
  max: 100,
  step: 1,
  label: 'value'
}).on('change', (e) => {
  if (e.last) {
    document.documentElement.style.setProperty(config.animation ? '--reference' : '--value', config.value)
  }
})

ctrl.addBinding(config, 'animation', {
  label: 'use animation'
}).on('change', () => {
  document.documentElement.dataset.animate = config.animation
})
document.documentElement.style.setProperty(config.animation ? '--reference' : '--value', config.value)
document.documentElement.dataset.animate = config.animation