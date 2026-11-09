import { Pane } from 'https://esm.sh/tweakpane@4.0.4'
import gsap from 'https://esm.sh/gsap@3.12.0'

const config = {
  theme: 'system',
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const update = () => {
  document.documentElement.dataset.theme = config.theme
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

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

// gsap stuff!
gsap.defaults({
  duration: 1,
})
const tl = gsap.timeline({
  paused: true,
})
const lines = gsap.utils.toArray('ul li')
gsap.set('ul li', { yPercent: 300 })
const paddedLines = [...lines, ...lines, ...lines]
paddedLines.forEach((line, index) => {
  // create a mini timeline for the line
  const lineTl = gsap.timeline().set(line, { yPercent: 300 }).to(
    line,
    {
      yPercent: '-=600',
      repeatRefresh: true,
      immediateRender: false,
      ease: 'none',
      duration: 6,
    },
    0
  )
  tl.add(lineTl, index)
})

const scrubber = gsap.timeline({ paused: true }).fromTo(
  tl,
  {
    totalTime: lines.length + 1, // lines.length + 2
  },
  {
    totalTime: lines.length * 2 + 1, // lines.length * 2 + 2
    ease: 'none',
    duration: lines.length,
    repeat: -1,
  }
)
gsap.set(scrubber, { totalTime: lines.length + 2 })

let index = 0
gsap.set('.indicator', {
  '--width': lines[index].getBoundingClientRect().width,
})

const syncIndicator = () => {
  index += 1
  gsap.set('.indicator', {
    '--width': lines[index % lines.length].getBoundingClientRect().width,
    '--h': gsap.utils.random(0, 359)
  })
}

gsap.to(scrubber, {
  delay: 1,
  totalTime: '+=1',
  duration: 1,
  repeat: -1,
  repeatDelay: 1,
  repeatRefresh: true,
  onStart: syncIndicator,
  onRepeat: syncIndicator,
  ease: 'elastic.out(1, 0.875)',
})

gsap.set('.container', { opacity: 1 })
