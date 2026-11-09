import { Pane } from 'https://esm.sh/tweakpane@4.0.4'

const config = {
  theme: 'system',
  cells: 12,
  frames: 12,
  speed: 0.25,
  sprites: false,
  scale: 1,
  explode: false,
  first: 0,
  second: 0,
  delay: 0.4,
}

// TODO:: not working with configured numbers of cells
let createSprites
let scrubOne
let scrubTwo

const ctrl = new Pane({
  title: 'Config',
  expanded: false,
})

const update = (event) => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.showMask = config.sprites
  document.documentElement.dataset.explode = config.explode
  document.documentElement.style.setProperty('--mask-speed', config.speed)
  document.documentElement.style.setProperty('--mask-delay', config.delay)
  document.documentElement.style.setProperty('--scale', config.scale)
  document.documentElement.style.setProperty('--first', config.first)
  document.documentElement.style.setProperty('--second', config.second)
  if (
    createSprites &&
    event.last &&
    (event.target.controller.view.labelElement.innerText === 'Cells' ||
      event.target.controller.view.labelElement.innerText === 'Frames')
  )
    createSprites()
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update(event)
  document.startViewTransition(() => update(event))
}

const debug = ctrl.addFolder({ title: 'Debug' })
const setup = ctrl.addFolder({ title: 'Sprites' })

debug.addBinding(config, 'sprites', {
  label: 'Show Mask',
})
debug.addBinding(config, 'explode', {
  label: 'Explode',
})
scrubOne = debug.addBinding(config, 'first', {
  label: 'Scrub 1st',
  min: 0,
  max: config.frames,
  step: 1,
})
scrubTwo = debug.addBinding(config, 'second', {
  label: 'Scrub 2nd',
  min: 0,
  max: config.frames,
  step: 1,
})
debug.addBinding(config, 'scale', {
  label: 'Scale',
  min: 0.1,
  max: 1,
  step: 0.01,
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

setup.addBinding(config, 'speed', {
  min: 0.2,
  max: 2,
  step: 0.1,
  label: 'Speed (s)',
})
setup.addBinding(config, 'delay', {
  min: 0,
  max: 5,
  step: 0.1,
  label: 'Delay (x)'
})

setup.addBinding(config, 'cells', {
  min: 5,
  max: 20,
  step: 1,
  label: 'Cells',
})

setup
  .addBinding(config, 'frames', {
    min: 3,
    max: 24,
    step: 1,
    label: 'Frames',
  })
  .on('change', () => {
    scrubOne.max = scrubTwo.max = config.frames
    config.first = Math.min(config.first, config.frames)
    config.second = Math.min(config.second, config.frames)
    ctrl.refresh()
  })

ctrl.addButton({ title: 'Regenerate Sprites' }).on('click', () => {
  createSprites()
})

ctrl.addButton({ title: 'Transition' }).on('click', () => {
  config.flipped = !config.flipped
  config.first = 0
  config.second = 0
  ctrl.refresh()
  document.documentElement.dataset.flip = config.flipped
})

update()

// basic array shuffling function
const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
// split array into chunks to use for groups
const split = (arr, chunks) => {
  const chunkSize = Math.ceil(arr.length / chunks)
  const result = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize))
  }
  return result
}
// convert SVG element into a data URL for CSS mask, etc.
const svgToUrl = (svg) => {
  const svgString = new XMLSerializer().serializeToString(svg)
  const encodedSvg = encodeURIComponent(svgString)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22')
  return `data:image/svg+xml;charset=utf-8,${encodedSvg}`
}

const main = document.querySelector('main')
const inContainer = main.querySelector('.sprite-container--in')
const outContainer = main.querySelector('.sprite-container--out')
// this will generate an SVG sprite based on the given configuration
const generateSprite = (prefix) => {
  const indices = split(
    shuffle(new Array(config.cells ** 2).fill(0).map((_, i) => i)),
    config.frames
  )
  const svgNamespace = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(svgNamespace, 'svg')
  svg.setAttribute('xmlns', svgNamespace)
  svg.setAttribute(
    'viewBox',
    `0 0 ${config.cells * 10 * (indices.length + 1)} ${config.cells * 10}`
  ) // Adjust viewBox to fit the grid
  svg.setAttribute('class', 'sprite')

  const defs = document.createElementNS(svgNamespace, 'defs')
  // add a starter frame that's empty?
  // generate the paths and put them in a defs slot
  for (let f = 0; f < indices.length; f++) {
    // generate a path per frame: M10 10 h20 v20 h-20 z
    const positions = indices[f]
    let d = ''
    for (let p = 0; p < positions.length; p++) {
      const x = positions[p] % config.cells
      const y = Math.floor(positions[p] / config.cells)
      d += `M${x * 10} ${y * 10} h10 v10 h-10 z `
    }
    // create the path and give it the "D" lol
    const path = document.createElementNS(svgNamespace, 'path')
    path.setAttribute('d', d)
    path.setAttribute('fill', 'currentColor')
    path.setAttribute('stroke', 'currentColor')
    path.setAttribute('shape-rendering', 'crispEdges')
    path.setAttribute('stroke-width', '0.025')
    path.setAttribute('id', `${prefix}-${f}`)
    defs.appendChild(path)

    // whilst here, may aswell create the frame group as well
    const group = document.createElementNS(svgNamespace, 'g')
    for (let u = 0; u < f + 1; u++) {
      const use = document.createElementNS(svgNamespace, 'use')
      use.setAttribute('href', `#${prefix}-${u}`)
      use.setAttribute('x', (f + 1) * (config.cells * 10))
      group.appendChild(use)
    }
    svg.appendChild(group)
  }
  svg.appendChild(defs)
  const dataURL = svgToUrl(svg)
  document.documentElement.style.setProperty('--mask-frames', indices.length)
  return {
    svg,
    dataURL,
  }
}

createSprites = () => {
  const { svg: outSVG, dataURL: outURL } = generateSprite('o')
  const { svg: inSVG, dataURL: inURL } = generateSprite('i')
  document.documentElement.style.setProperty('--mask-in', `url(${inURL})`)
  document.documentElement.style.setProperty('--mask-out', `url(${outURL})`)
  inContainer.innerHTML = outContainer.innerHTML = ''
  inContainer.appendChild(inSVG)
  outContainer.appendChild(outSVG)
}

createSprites()

const trigger = main.querySelector('button')
trigger.addEventListener('click', () => {
  config.flipped = !config.flipped
  config.first = 0
  config.second = 0
  ctrl.refresh()
  document.documentElement.dataset.flip = config.flipped
})
