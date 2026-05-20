import gsap from 'https://esm.sh/gsap@3.12.0';
import { Draggable } from 'https://esm.sh/gsap@3.12.0/Draggable';
import { Pane } from 'https://esm.sh/tweakpane@4.0.4';
gsap.registerPlugin(Draggable);

const config = {
  speed: 0.4,
  theme: 'system' };


const ctrl = new Pane({
  title: 'config',
  expanded: true });


const update = () => {
  document.documentElement.dataset.theme = config.theme;
  document.documentElement.style.setProperty(
  '--speed',
  `${config.speed * 0.5}s`);

};

const sync = event => {
  if (
  !document.startViewTransition ||
  event.target.controller.view.labelElement.innerText !== 'theme')

  return update();
  document.startViewTransition(() => update());
};

ctrl.addBinding(config, 'speed', {
  min: 0.2,
  max: 2,
  step: 0.01,
  label: 'duration (s)' });


ctrl.addBinding(config, 'theme', {
  label: 'theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark' } });



ctrl.on('change', sync);
update();
const cta = document.querySelector('#cta');
Draggable.create(cta, { type: 'left,top' });