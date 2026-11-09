import { Pane } from 'https://esm.sh/tweakpane@4.0.4'
import gsap from 'https://esm.sh/gsap@3.12.0'
import { Draggable } from 'https://esm.sh/gsap@3.12.0/Draggable'
gsap.registerPlugin(Draggable)

const config = {
  theme: 'dark',
  cell: 28,
  alpha: 1,
  line: 0.75,
  width: 3,
  speed: 0.15,
  size: 100,
  threshold: 0.01,
  intensity: 0.9,
  spotlight: true,
  stopOne: 100,
  stopTwo: 100,
  angle: 0,
  adjust: false,
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const header = document.querySelector('header')
const DPR = window.devicePixelRatio || 1
const lines = document.querySelector('header canvas')
const linesCtx = lines.getContext('2d')
const cells = []

const drawLines = () => {
  linesCtx.clearRect(0, 0, lines.width, lines.height)
  cells.forEach((cell) => {
    linesCtx.save()
    linesCtx.translate(cell.x, cell.y)
    linesCtx.rotate(cell.a)
    linesCtx.beginPath()
    linesCtx.globalAlpha = config.alpha
    linesCtx.lineWidth = config.width
    linesCtx.strokeStyle = 'canvasText'
    linesCtx.moveTo((config.cell * config.line * -1) / 2, 0)
    linesCtx.lineTo((config.cell * config.line) / 2, 0)
    linesCtx.stroke()
    linesCtx.restore()
  })
}

const initializeLines = () => {
  // set up the canvas
  const { width, height } = lines.getBoundingClientRect()
  lines.width = width * DPR
  lines.height = height * DPR
  linesCtx.scale(DPR, DPR)
  // sort out the lines
  cells.length = 0
  for (let x = 0; x < width; x += config.cell) {
    for (let y = 0; y < height; y += config.cell) {
      cells.push({
        x: x + config.cell * 0.5,
        y: y + config.cell * 0.5,
        r: 0,
        t: 0,
      })
    }
  }
  gsap.ticker.add(drawLines)
}

const getShortestRotation = (current, target) => {
  let diff = target - current
  if (diff > Math.PI) diff -= 2 * Math.PI
  if (diff < -Math.PI) diff += 2 * Math.PI
  return diff
}

const syncLines = ({ x, y }) => {
  const { left, top } = lines.getBoundingClientRect()
  header.style.setProperty('--mx', Math.floor(x - left))
  header.style.setProperty('--my', Math.floor(y - top))
  cells.forEach((cell) => {
    const dx = x - (cell.x + left)
    const dy = y - (cell.y + top)
    const newAngle = Math.atan2(dy, dx)
    const diff = getShortestRotation(cell.a, newAngle)

    if (Math.abs(diff) > config.threshold) {
      cell.a += diff * config.speed
      // Normalize angle to be between -PI and PI
      cell.a = ((cell.a + Math.PI) % (2 * Math.PI)) - Math.PI
    } else {
      cell.a = newAngle
    }
    cell.t = newAngle
  })
}

const handleChange = () => {
  initializeLines()
}

const sizeObserver = new ResizeObserver(handleChange)
sizeObserver.observe(lines)

// handle the pointerMove
window.addEventListener('pointermove', syncLines)

const update = (event) => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.spotlight = config.spotlight
  document.documentElement.dataset.adjust = config.adjust
  header.style.setProperty('--intensity', 1 - config.intensity)
  header.style.setProperty('--mask-size', config.size)
  header.style.setProperty('--mask-s1', config.stopOne)
  header.style.setProperty('--mask-s2', config.stopTwo)
  header.style.setProperty('--mask-angle', config.angle)
  if (event?.target.controller.view.labelElement.innerText === 'size') {
    initializeLines()
  }
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'theme'
  )
    return update(event)
  document.startViewTransition(() => update(event))
}

ctrl.addBinding(config, 'adjust', {
  label: 'adjust',
})

const lineFolder = ctrl.addFolder({ title: 'lines', expanded: false })

lineFolder.addBinding(config, 'cell', {
  min: 10,
  max: 100,
  step: 1,
  label: 'size',
})

lineFolder.addBinding(config, 'line', {
  min: 0.1,
  max: 1,
  step: 0.01,
  label: 'length',
})

lineFolder.addBinding(config, 'width', {
  min: 1,
  max: 10,
  step: 1,
  label: 'width',
})

lineFolder.addBinding(config, 'alpha', {
  min: 0.01,
  max: 1,
  step: 0.01,
  label: 'alpha',
})

const maskFolder = ctrl.addFolder({ title: 'masking', expanded: false })
const mainFolder = maskFolder.addFolder({ title: 'main', expanded: false })
mainFolder.addBinding(config, 'stopOne', {
  label: 'stop one',
  min: 0,
  max: 100,
  step: 1,
})
mainFolder.addBinding(config, 'stopTwo', {
  label: 'stop two',
  min: 0,
  max: 100,
  step: 1,
})
mainFolder.addBinding(config, 'angle', {
  label: 'angle',
  min: 0,
  max: 360,
  step: 1,
})

const spotFolder = maskFolder.addFolder({ title: 'spotlight', expanded: false })
spotFolder.addBinding(config, 'spotlight', {
  label: 'enable',
})
spotFolder.addBinding(config, 'size', {
  label: 'size',
  min: 10,
  max: 300,
  step: 1,
})
spotFolder.addBinding(config, 'intensity', {
  label: 'power',
  min: 0.01,
  max: 1,
  step: 0.01,
})

ctrl.addBinding(config, 'theme', {
  label: 'theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
})

ctrl.on('change', sync)
update()

Draggable.create(header, {
  bounds: document.querySelector('main'),
  type: 'x,y',
  trigger: header.querySelector('button'),
})
