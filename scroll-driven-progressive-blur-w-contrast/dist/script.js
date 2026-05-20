import { Pane } from 'https://esm.sh/tweakpane@4.0.4';
import gsap from 'https://esm.sh/gsap@3.12.0';
import ScrollTrigger from 'https://esm.sh/gsap@3.12.0/ScrollTrigger';

const CONFIG = {
  light: false,
  max: 5,
  size: 80,
  contrast: 1.4,
  brightness: 1.4,
  hue: 164,
  debug: false };


const CTRL = new Pane({ title: 'Config', expanded: false });
CTRL.addBinding(CONFIG, 'size', {
  label: 'Size (px)',
  min: 20,
  max: 120,
  step: 1 });

CTRL.addBinding(CONFIG, 'max', { label: 'Blur (px)', min: 2, max: 50, step: 1 });
CTRL.addBinding(CONFIG, 'brightness', {
  label: 'Brightness',
  min: 1,
  max: 2,
  step: 0.01 });

CTRL.addBinding(CONFIG, 'contrast', {
  label: 'Contrast',
  min: 1,
  max: 2,
  step: 0.01 });

CTRL.addBinding(CONFIG, 'hue', { label: 'Hue', min: 0, max: 359, step: 1 });
CTRL.addBinding(CONFIG, 'light', { label: 'Light Mode' });
CTRL.addBinding(CONFIG, 'debug', { label: 'Debug' });

const update = () => {
  ScrollTrigger.refresh();
  document.documentElement.style.setProperty('--blur-contrast', CONFIG.contrast);
  document.documentElement.style.setProperty(
  '--blur-brightness',
  CONFIG.brightness);

  document.documentElement.style.setProperty('--blur-size', CONFIG.size);
  document.documentElement.style.setProperty('--blur-max', CONFIG.max);
  document.documentElement.style.setProperty('--hue', CONFIG.hue);
  document.documentElement.dataset.light = CONFIG.light;
  document.documentElement.dataset.debug = CONFIG.debug;
};

CTRL.on('change', event => {
  if (
  !document.startViewTransition ||
  event.target.controller.view.labelElement.innerText !== 'Light Mode')

  return update();
  document.startViewTransition(update);
});
update();

if (!CSS.supports('animation-timeline: scroll()')) {
  gsap.registerPlugin(ScrollTrigger);
  const scroller = document.querySelector('.scroller');
  const sig = document.querySelector('.sig');

  // In GSAP, jus' gonna do a scroll custom property based on the distance
  ScrollTrigger.create({
    scroller,
    scrub: true,
    start: 0,
    end: () => CONFIG.range,
    ease: 'none',
    trigger: 'article',
    onUpdate: self => {
      scroller.style.setProperty(
      '--scroll-progress-top',
      CONFIG.trigger ? Math.floor(self.progress) * 100 : self.progress * 100);

    } });


  ScrollTrigger.create({
    scroller,
    trigger: 'article',
    scrub: true,
    ease: 'none',
    start: () => {
      return ScrollTrigger.maxScroll(scroller) - CONFIG.range * 1;
    },
    end: () => {
      return ScrollTrigger.maxScroll(scroller);
    },
    onUpdate: self => {
      scroller.style.setProperty(
      '--scroll-progress-bottom',
      CONFIG.trigger ? Math.ceil(self.progress) * 100 : self.progress * 100);

    } });


  gsap.fromTo(
  '.sig path',
  {
    '--draw': 1.025 },

  {
    '--draw': 0,
    scrollTrigger: {
      trigger: sig,
      // scrub: true,
      scroller,
      toggleActions: 'play reset play reset',
      // start: `top bottom-=${sig.getBoundingClientRect().height * 0.5}`,
      start: `top bottom-=${sig.getBoundingClientRect().height * 0.5}` } });




  const obs = new ResizeObserver(ScrollTrigger.refresh);
  obs.observe(scroller);
}