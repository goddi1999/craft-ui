import gsap from 'https://esm.sh/gsap@3.13.0'
import Draggable from 'https://esm.sh/gsap@3.13.0/Draggable'
import { Pane } from 'https://esm.sh/tweakpane@4.0.5'
gsap.registerPlugin(Draggable)

// --- Presets ---
const BUILT_IN_PRESETS = {
  // line: per-line shimmer (display: inline, gradient wraps each text line)
  Default: {
    theme: 'dark',
    mode: 'line',
    cps: 50,
    icons: true,
    textAlpha: 0.1,
    stops: [{ color: 'hsla(160,100%,50%,1)', spread: 20 }],
  },
  Subtle: {
    theme: 'dark',
    mode: 'line',
    cps: 70,
    icons: false,
    textAlpha: 0.1,
    stops: [{ color: 'hsla(0,0%,100%,1.0)', spread: 8 }],
  },
  'Neon Duo': {
    theme: 'dark',
    mode: 'line',
    cps: 60,
    icons: false,
    textAlpha: 0.04,
    stops: [
      { color: 'hsla(180,100%,70%,1)', spread: 12 },
      { color: 'hsla(300,100%,70%,1)', spread: 24 },
    ],
  },
  Golden: {
    theme: 'dark',
    mode: 'line',
    cps: 70,
    icons: true,
    textAlpha: 0.08,
    stops: [
      { color: 'hsla(54, 100%, 81%, 1.00)', spread: 6 },
      { color: 'hsla(25,100%,60%,1)', spread: 12 },
      { color: 'hsla(45, 74%, 50%, 1.00)', spread: 18 },
    ],
  },
  'Tri-Color': {
    theme: 'dark',
    mode: 'line',
    cps: 50,
    icons: true,
    textAlpha: 0.05,
    // linear- gradient(90deg,
    //   #000000 0, #000000 33.33 %,
    //   hsl(301.56deg 40.31 % 62.55 %) 40 %,
    //   hsl(9 96 % 55 %) 45 %,
    //   hsl(41deg 100 % 50 %) 50 %,
    //   hsl(240deg 94 % 94 %) 50 %,
    //   hsl(210deg 97 % 49 %) 50 %,
    //   transparent 66.67 %,
    //   transparent
    // )
    stops: [
      { color: 'hsla(219,90%,40%,1)', spread: 3 },
      { color: 'hsla(240,95%,94%,1)', spread: 6 },
      { color: 'hsla(41,100%,50%,1)', spread: 9 },
      { color: 'hsla(9,96%,55%,1)', spread: 12 },
      { color: 'hsla(301,40%,62%,1)', spread: 15 },
    ],
  },
  // Light: {
  //   theme: 'light',
  //   mode: 'line',
  //   cps: 45,
  //   icons: true,
  //   textAlpha: 0.12,
  //   stops: [{ color: 'hsla(220,90%,50%,1)', spread: 20 }],
  // },
  // sweep: full-block horizontal sweep (display: inline-block)
  Sweep: {
    theme: 'dark',
    mode: 'sweep',
    cps: 120,
    icons: true,
    textAlpha: 0.1,
    angle: 24,
    offset: 4,
    stops: [{ color: 'hsla(160,100%,50%,1)', spread: 10 }],
  },
  'Sweep Duo': {
    theme: 'dark',
    mode: 'sweep',
    cps: 200,
    icons: false,
    textAlpha: 0.05,
    angle: 25,
    offset: 6,
    stops: [
      { color: 'hsla(180,100%,70%,1)', spread: 10 },
      { color: 'hsla(300,100%,70%,1)', spread: 20 },
    ],
  },
  // vertical: top-to-bottom sweep, spread in lh units
  Waterfall: {
    theme: 'dark',
    mode: 'vertical',
    cps: 260,
    icons: true,
    textAlpha: 0.08,
    offset: 2,
    stops: [
      { color: 'hsla(200, 95%, 19%, 1.00)', spread: 1.5 },
      { color: 'hsla(200, 85%, 77%, 1.00)', spread: 3 },
    ],
  },
  Cascade: {
    theme: 'dark',
    mode: 'vertical',
    cps: 255,
    icons: false,
    textAlpha: 0.04,
    offset: 3,
    stops: [
      { color: 'hsla(180,100%,70%,1)', spread: 1 },
      { color: 'hsla(280,100%,70%,1)', spread: 3 },
    ],
  },
}

function getCustomPresets() {
  try {
    return JSON.parse(localStorage.getItem('shimmer-presets') || '{}')
  } catch {
    return {}
  }
}

function saveCustomPreset(name, data) {
  const presets = getCustomPresets()
  presets[name] = data
  localStorage.setItem('shimmer-presets', JSON.stringify(presets))
}

function getAllPresets() {
  return { ...BUILT_IN_PRESETS, ...getCustomPresets() }
}

// --- Config ---
const config = {
  theme: 'dark',
  mode: 'line', // 'line' | 'sweep' | 'vertical'
  cps: 50, // characters per second — higher = faster
  icons: true,
  textAlpha: 0.1,
  angle: 0, // degree offset from 90deg, sweep mode only
  offset: 0, // ch/lh added to background-size and stop position to clear angled edges
  stops: [{ color: 'hsla(160,100%,50%,1)', spread: 20 }],
  debug: false,
  scrub: 0, // 0 = closed, 100 = open (debug mode only)
}

// --- Dynamic Style ---
const styleEl = document.createElement('style')
styleEl.id = 'shimmer-dynamic'
document.head.appendChild(styleEl)

function buildGradientCSS() {
  const { stops, textAlpha, mode } = config
  const n = stops.length
  const isVertical = mode === 'vertical'
  const isBlock = mode !== 'line'

  // Axis-specific values — sweep supports an angle offset from 90deg
  const dir = isVertical
    ? '180deg'
    : mode === 'sweep'
    ? `${90 + config.angle}deg`
    : '90deg'
  const spreadUnit = isVertical ? '1lh' : '1ch'
  const posClosed = isVertical ? '0 200%' : '200% 0'

  // offset (in ch/lh) widens the gradient so the angled stop clears the element edges,
  // and shifts the stop by the same amount so timing is unchanged
  const offset = config.offset
  const animSize = isVertical
    ? `100% calc(200% + ${offset} * 1lh)`
    : `calc(200% + ${offset} * 1ch) 100%`

  const shimmerLayers = stops.map((stop) => {
    const colorEnd = `calc(100% - ${offset} * ${spreadUnit})`
    const colorStart = `calc(100% - ${stop.spread + offset} * ${spreadUnit})`
    return `linear-gradient(${dir}, #0000 0 ${colorStart}, ${stop.color} ${colorStart} ${colorEnd}, #0000 ${colorEnd} 100%)`
  })
  const midToneEnd = `calc(100% - ${offset} * ${spreadUnit})`
  const midTone = `linear-gradient(${dir}, light-dark(color-mix(in hsl, #000, canvas 40%), color-mix(in hsl, #fff, canvas 40%)) 0 ${midToneEnd}, #0000 ${midToneEnd} 100%)`
  const alphaLayer = `linear-gradient(light-dark(hsl(0 0% 0% / ${textAlpha}), hsl(0 0% 100% / ${textAlpha})) 0 100%)`

  const bgImage = [...shimmerLayers, midTone, alphaLayer].join(', ')
  // shimmer layers + midTone slide in from closed pos; alphaLayer always at 0 0
  const bgPosClosed = [...Array(n + 1).fill(posClosed), '0 0'].join(', ')
  const bgPosOpen = Array(n + 2)
    .fill('0 0')
    .join(', ')
  const bgSize = [...Array(n + 1).fill(animSize), '100% 100%'].join(', ')
  const bgClip = Array(n + 2)
    .fill('text')
    .join(', ')
  const bgRepeat = Array(n + 2)
    .fill('no-repeat')
    .join(', ')

  // Debug scrub: interpolate between closed (t=0) and open (t=1) positions
  const t = config.scrub / 100
  const scrubPos = isVertical ? `0 ${(1 - t) * 200}%` : `${(1 - t) * 200}% 0`
  const bgPosScrub = [...Array(n + 1).fill(scrubPos), '0 0'].join(', ')

  styleEl.textContent = `
@media (prefers-reduced-motion: no-preference) {
  .accordion p {
    display: ${isBlock ? 'inline-block' : 'inline'};
    background-image: ${bgImage};
    background-position: ${bgPosClosed};
    background-size: ${bgSize};
    background-repeat: ${bgRepeat};
    background-clip: ${bgClip};
    color: #0000;
    transition-property: background-position, opacity;
    transition-timing-function: var(--ease);
    transition-duration: calc(var(--char-count, 200) / var(--cps, 50) * 1s), var(--speed);
  }
  .accordion[data-open] p {
    background-position: ${bgPosOpen};
  }
  .accordion p::selection {
    background: ${stops.at(-1)?.color ?? 'light-dark(#000, #fff)'};
    color: light-dark(#fff, #000);
  }
  ${
    config.debug
      ? `
  /* Debug scrub — lock position, drop bg-position from transition */
  [data-debug] .accordion p,
  [data-debug] .accordion[data-open] p {
    transition-property: opacity;
    background-position: ${bgPosScrub};
  }
  `
      : ''
  }
}
`
}

// --- Update ---
const update = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.icons = config.icons
  document.documentElement.style.setProperty('--cps', config.cps)
  if (config.debug) {
    document.documentElement.setAttribute('data-debug', '')
  } else {
    document.documentElement.removeAttribute('data-debug')
  }
  // Kill any in-flight background-position transitions before rebuilding the
  // gradient so percentage values are recomputed against the new background-size
  // from a clean starting point, not mid-interpolation.
  const ps = [...document.querySelectorAll('.accordion p')]
  for (const p of ps) p.style.setProperty('transition', 'none')
  buildGradientCSS()
  void document.body.offsetHeight
  for (const p of ps) p.style.removeProperty('transition')
}

// --- Pane ---
let ctrl
let d
let _prevMode = config.mode
let _prevDebug = config.debug

function buildPane() {
  const prevPos = d ? { x: d[0].x, y: d[0].y } : null
  if (ctrl) ctrl.dispose()

  ctrl = new Pane({ title: 'config', expanded: true })

  // Presets
  const presetsFolder = ctrl.addFolder({ title: 'Presets', expanded: false })
  const allPresets = getAllPresets()
  const presetOptions = Object.fromEntries(
    Object.keys(allPresets).map((k) => [k, k])
  )
  const presetState = { preset: '' }

  const presetList = presetsFolder.addBinding(presetState, 'preset', {
    label: 'load',
    options: { '— select —': '', ...presetOptions },
  })
  presetList.on('change', ({ value }) => {
    if (!value) return
    const preset = getAllPresets()[value]
    if (!preset) return
    // default mode to 'line' for old presets without mode;
    // migrate wps → cps for old localStorage presets
    const loaded = JSON.parse(JSON.stringify(preset))
    if (loaded.wps && !loaded.cps) {
      loaded.cps = Math.round(loaded.wps * 6)
      delete loaded.wps
    }
    Object.assign(config, { mode: 'line' }, loaded)
    _prevMode = config.mode
    buildPane()
    update()
  })

  presetsFolder
    .addButton({ title: 'Save current as preset' })
    .on('click', () => {
      const name = prompt('Preset name:')
      if (!name?.trim()) return
      saveCustomPreset(name.trim(), JSON.parse(JSON.stringify(config)))
      buildPane()
      update()
    })

  ctrl.addBlade({ view: 'separator' })

  // Main controls
  ctrl.addBinding(config, 'theme', {
    label: 'theme',
    options: { system: 'system', light: 'light', dark: 'dark' },
  })
  ctrl.addBinding(config, 'mode', {
    label: 'mode',
    options: {
      'line (per-line)': 'line',
      'sweep (horizontal)': 'sweep',
      vertical: 'vertical',
    },
  })
  if (config.mode === 'sweep') {
    ctrl.addBinding(config, 'angle', {
      label: 'angle offset',
      min: -45,
      max: 45,
      step: 1,
    })
  }
  if (config.mode !== 'line') {
    const offsetUnit = config.mode === 'vertical' ? 'lh' : 'ch'
    ctrl.addBinding(config, 'offset', {
      label: `offset (${offsetUnit})`,
      min: 0,
      max: 60,
      step: 1,
    })
  }

  ctrl.addBinding(config, 'cps', {
    label: 'speed (cps)',
    min: 5,
    max: 300,
    step: 1,
  })
  ctrl.addBinding(config, 'textAlpha', {
    label: 'text alpha',
    min: 0,
    max: 1,
    step: 0.01,
  })
  ctrl.addBinding(config, 'icons', { label: 'icons' })
  ctrl.addBinding(config, 'debug', { label: 'debug' })
  if (config.debug) {
    ctrl.addBinding(config, 'scrub', {
      label: 'scrub',
      min: 0,
      max: 100,
      step: 0.1,
    })
  }

  ctrl.addBlade({ view: 'separator' })

  // Stops — spread unit and range depend on mode
  const isVertical = config.mode === 'vertical'
  const spreadLabel = isVertical ? 'spread (lh)' : 'spread (ch)'
  const spreadMax = isVertical ? 15 : 60
  const spreadStep = isVertical ? 0.5 : 1
  const spreadMin = isVertical ? 0.5 : 1

  const stopsFolder = ctrl.addFolder({ title: 'Color stops', expanded: true })

  config.stops.forEach((stop, i) => {
    const stopFolder = stopsFolder.addFolder({
      title: `Stop ${i + 1}`,
      expanded: true,
    })
    stopFolder.addBinding(stop, 'color', { label: 'color' })
    stopFolder.addBinding(stop, 'spread', {
      label: spreadLabel,
      min: spreadMin,
      max: spreadMax,
      step: spreadStep,
    })
    if (config.stops.length > 1) {
      stopFolder.addButton({ title: 'Remove' }).on('click', () => {
        config.stops.splice(i, 1)
        buildPane()
        update()
      })
    }
  })

  stopsFolder.addButton({ title: '+ Add stop' }).on('click', () => {
    const defaultSpread = isVertical ? 2 : 15
    config.stops.push({ color: 'hsla(200,100%,65%,1)', spread: defaultSpread })
    buildPane()
    update()
  })

  ctrl.on('change', (event) => {
    const label = event.target.controller.view.labelElement?.innerText
    if (label === 'theme' && document.startViewTransition) {
      document.startViewTransition(() => update())
    } else {
      update()
    }
    // Rebuild pane when mode changes so spread labels/ranges update
    if (config.mode !== _prevMode) {
      _prevMode = config.mode
      setTimeout(() => buildPane(), 0)
    }
    // Rebuild pane when debug toggles to show/hide scrub slider
    if (config.debug !== _prevDebug) {
      _prevDebug = config.debug
      setTimeout(() => buildPane(), 0)
    }
  })

  // Draggable
  const tweakClass = 'div.tp-dfwv'
  d = Draggable.create(tweakClass, {
    type: 'x,y',
    allowEventDefault: true,
    trigger: tweakClass + ' button.tp-rotv_b',
  })

  if (prevPos) {
    gsap.set(tweakClass, { x: prevPos.x, y: prevPos.y })
  }

  document.querySelector(tweakClass).addEventListener('dblclick', () => {
    gsap.to(tweakClass, {
      x: `+=${d[0].x * -1}`,
      y: `+=${d[0].y * -1}`,
      onComplete: () => {
        gsap.set(tweakClass, { clearProps: 'all' })
      },
    })
  })
}

// Auto-compute --char-count for each accordion from its paragraph text
for (const li of document.querySelectorAll('li.accordion')) {
  const p = li.querySelector('p')
  if (p) li.style.setProperty('--char-count', p.textContent.trim().length)
}

buildPane()
update()

// --- Accordion ---
class PlatformAccordion extends HTMLElement {
  connectedCallback() {
    for (const button of this.querySelectorAll('button[aria-controls]')) {
      button.addEventListener('click', () => this.toggle(button))
    }
  }

  toggle(button) {
    const li = button.closest('li')
    if (!li) return
    const isOpen = li.hasAttribute('data-open')
    for (const open of this.querySelectorAll('li[data-open]')) {
      this.close(open)
    }
    if (!isOpen) this.open(li, button)
  }

  open(li, button) {
    li.setAttribute('data-open', '')
    button.setAttribute('aria-expanded', 'true')
  }

  async close(li) {
    const wrap = li.querySelector('.content-wrap')
    li.removeAttribute('data-open')
    li.querySelector('button[aria-controls]')?.setAttribute(
      'aria-expanded',
      'false'
    )
    await Promise.allSettled(
      (wrap?.getAnimations() ?? [])
        .filter((a) => a.transitionProperty === 'grid-template-rows')
        .map((a) => a.finished)
    )
    if (li.hasAttribute('data-open')) return
    const ps = [...li.querySelectorAll('p')]
    for (const p of ps) p.style.setProperty('transition', 'none')
    void li.offsetHeight
    for (const p of ps) p.style.removeProperty('transition')
  }
}

customElements.define('platform-accordion', PlatformAccordion)
