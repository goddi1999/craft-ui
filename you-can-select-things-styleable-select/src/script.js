import converter from 'https://esm.sh/number-to-words@1.2.4'
import gsap from 'https://esm.sh/gsap@3.13.0'
import ScrollToPlugin from 'https://esm.sh/gsap@3.13.0/ScrollToPlugin'
import { Pane } from 'https://esm.sh/tweakpane@4.0.4'

gsap.registerPlugin(ScrollToPlugin)

const config = {
  options: 20,
  theme: 'dark',
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
    event.target.controller.view.labelElement.innerText !== 'theme'
  )
    return update()
  document.startViewTransition(() => update())
}

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

const select = document.querySelector('.custom-select')
const scroller = select.querySelector('.scroller')
const options = select.querySelector('.options')

const getScrollTopToCenterElement = (container, element) => {
  if (!container || !element) return 0

  const style = getComputedStyle(container)
  const paddingTop = Number.parseFloat(style.paddingTop)
  const paddingBottom = Number.parseFloat(style.paddingBottom)

  const containerScrollTop = container.scrollTop
  const containerTop = container.getBoundingClientRect().top
  const elementTop = element.getBoundingClientRect().top

  // Relative offset from the scrollTop baseline, including current scroll
  const offsetInsideContainer = elementTop - containerTop + containerScrollTop

  const containerHeight = container.clientHeight
  const elementHeight = element.offsetHeight

  const scrollTarget =
    offsetInsideContainer -
    (containerHeight - paddingTop - paddingBottom) / 2 +
    elementHeight / 2 -
    paddingTop

  return scrollTarget
}

const isCentered = (el, container) => {
  const elRect = el.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()

  const elCenter = elRect.top + elRect.height / 2
  const containerCenter = containerRect.top + containerRect.height / 2

  return Math.abs(elCenter - containerCenter) <= 1
}

const assignProximityValues = (items, selectedIndex, distanceValueMap) => {
  return items.map((item, index) => {
    const distance = Math.min(3, Math.abs(index - selectedIndex))
    item.style.setProperty('--proximity', distance)
  })
}
let scrollmax
const syncSelect = () => {
  if (select.matches(':open')) {
    window.addEventListener('pointerdown', syncCenter, { once: true })
    window.addEventListener('click', syncSelect, { once: true })
  }

  const selected =
    select.querySelector(':focus') || select.querySelector(':checked')

  if (selected) {
    const top = getScrollTopToCenterElement(scroller, selected)
    const centered = isCentered(selected, scroller)
    select.dataset.centered = centered
    if (scrollmax?.isActive()) scrollmax.kill()
    if (!centered) {
      scrollmax = gsap.to(scroller, {
        scrollTo: top,
        duration: 0.26,
        overwrite: 'auto',
        onComplete: () => {
          gsap.set(scroller, { clearProps: 'all' })
        },
        ease: 'power2.out',
      })
    }
  }
}

const syncCenter = () => {
  const selected =
    select.querySelector(':focus') || select.querySelector(':checked')
  const centered = isCentered(selected, scroller)
  select.dataset.centered = centered
}

const syncProximity = () => {
  const selected = options.querySelector(':checked')
  assignProximityValues(
    [...options.children],
    [...options.children].indexOf(selected) || 0
  )
}

select.addEventListener('focus', syncSelect, true)
select.addEventListener('keydown', syncCenter, true)
select.addEventListener('input', syncProximity)

// generate the options
syncProximity()
