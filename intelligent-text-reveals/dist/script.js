import { Pane } from 'https://esm.sh/tweakpane@4.0.4';

const config = {
  theme: 'system',
  duration: 1.4,
  delay: 0.5,
  by: 16,
  my: -80,
  blur: 4,
  lh: 1.5,
  debug: false,
  color: 'hsla(220, 73%, 72%, 0.64)' };


const ctrl = new Pane({
  title: 'config',
  expanded: false });


const update = () => {
  document.documentElement.dataset.theme = config.theme;
  document.documentElement.dataset.debug = config.debug;
  document.documentElement.style.setProperty('--by', config.by);
  document.documentElement.style.setProperty('--my', config.my);
  document.documentElement.style.setProperty('--lh', config.lh);
  document.documentElement.style.setProperty('--blur', config.blur);
  document.documentElement.style.setProperty('--duration', config.duration);
  document.documentElement.style.setProperty('--delay', config.delay);
  document.documentElement.style.setProperty('--color', config.color);
};

const sync = event => {
  if (
  !document.startViewTransition ||
  event.target.controller.view.labelElement.innerText !== 'Theme')

  return update();
  document.startViewTransition(() => update());
};

ctrl.addBinding(config, 'duration', {
  label: 'duration(s)',
  min: 0.2,
  max: 4,
  step: 0.1 });

ctrl.addBinding(config, 'delay', {
  label: 'delay(s)',
  min: 0,
  max: 4,
  step: 0.1 });

ctrl.addBinding(config, 'color');

const debug = ctrl.addFolder({ title: 'debug', expanded: false });

debug.addBinding(config, 'my', {
  min: -160,
  max: 160,
  step: 1,
  label: 'mask y' });

debug.addBinding(config, 'by', {
  min: -160,
  max: 160,
  step: 1,
  label: 'background y' });

debug.addBinding(config, 'lh', {
  min: 0,
  max: 2,
  step: 0.01,
  label: 'line-height' });

debug.addBinding(config, 'blur', {
  min: 0,
  max: 10,
  step: 1,
  label: 'blur' });

debug.addBinding(config, 'debug', {
  label: 'activate' });

ctrl.addBinding(config, 'theme', {
  label: 'theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark' } });



const main = document.querySelector('main');
ctrl.addButton({ title: 'replay' }).on('click', () => {
  console.info('go');
  const MARKUP = main.innerHTML;
  main.innerHTML = '';
  requestAnimationFrame(() => {
    main.innerHTML = MARKUP;
  });
});

ctrl.on('change', sync);
update();