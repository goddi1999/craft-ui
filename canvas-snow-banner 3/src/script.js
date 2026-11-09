import { Pane } from 'https://esm.sh/tweakpane@4.0.4'
import gsap from 'https://esm.sh/gsap@3.12.0'

const config = {
  height: 120,
  amount: 200,
  sway: 200,
  framerate: 60,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const DPR = window.devicePixelRatio || 1

let generateFlakes

// canvas stuff
const snowdrop = document.querySelector('canvas')
const snowctx = snowdrop.getContext('2d')

const update = (event) => {
  if (event?.last) {
    document.documentElement.style.setProperty('--banner-height', config.height)
    if (generateFlakes) generateFlakes()
  }
}

ctrl.addBinding(config, 'height', {
  min: 80,
  max: 300,
  step: 1,
  label: 'Height (px)',
})
ctrl.addBinding(config, 'amount', {
  min: 10,
  max: 500,
  step: 1,
  label: 'Amount',
})
ctrl.addBinding(config, 'sway', {
  min: -500,
  max: 500,
  step: 1,
  label: 'Wind (x)',
})
ctrl
  .addBinding(config, 'framerate', {
    min: 0,
    max: 60,
    step: 1,
    label: 'Framerate',
  })
  .on('change', () => gsap.ticker.fps(config.framerate))

ctrl.on('change', update)
update()

let flakes
generateFlakes = () => {
  const { width } = snowdrop.getBoundingClientRect()
  snowdrop.width = width * DPR
  snowdrop.height = config.height * DPR
  snowctx.scale(DPR, DPR)
  flakes = []
  for (let f = 0; f < config.amount; f++) {
    const size = gsap.utils.random(6, 14, 1)
    const snowflake = document.createElement('canvas')
    const flakectx = snowflake.getContext('2d')
    snowflake.width = size * DPR
    snowflake.height = size * DPR
    flakectx.scale(DPR, DPR)
    flakectx.font = `${size}px monospace`
    flakectx.textAlign = 'center'
    flakectx.textBaseline = 'middle'
    flakectx.globalAlpha = gsap.utils.random(0.6, 1)
    flakectx.fillStyle = 'hsl(0 0% 80%)'
    flakectx.fillText('*', size * 0.5, size * 0.5)

    const flake = {
      c: snowflake,
      t: flakectx,
      f: size,
      x: gsap.utils.random(0, 100, 1),
      y: -size,
      w: 0,
      r: 0,
    }
    gsap.to(flake, {
      y: config.height * DPR + size * 2,
      w: gsap.utils.random(
        0,
        Math.random() > 0.98 ? config.sway * -0.25 : config.sway
      ),
      r: 360,
      duration: gsap.utils.random(2, 8),
      delay: gsap.utils.random(0, 8),
      ease: 'none',
      repeat: -1,
    })
    flakes.push(flake)
  }
}

generateFlakes()

const render = () => {
  snowctx.clearRect(0, 0, snowdrop.width, snowdrop.height)
  for (let f = 0; f < config.amount; f++) {
    const flake = flakes[f]
    if (flake) {
      snowctx.drawImage(
        flake.c,
        snowdrop.width * (flake.x / 100) + flake.w,
        flake.y,
        flake.f,
        flake.f
      )
    }
  }
}
window.addEventListener('resize', generateFlakes)
gsap.ticker.fps(config.framerate)
gsap.ticker.add(render)
