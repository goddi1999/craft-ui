import 'https://unpkg.com/@tailwindcss/browser@4';
import { Pane } from 'https://esm.sh/tweakpane@4.0.4';

const config = {
  theme: 'dark',
  debug: false,
  explode: false,
  rtl: false,
  speed: 2,
  scrub: 0,
  filtered: true,
  displacement: {
    scale: 20 },

  turbulence: {
    numOctaves: 10,
    baseFrequency: 1.8,
    seed: 1,
    stitchTiles: 'noStitch',
    type: 'fractalNoise' } };


const input = document.querySelector('#text');
const dupes = document.querySelectorAll('.dupe');
const turbulence = document.querySelector('svg filter feTurbulence');
const debugulence = document.querySelector('svg #displace feTurbulence');
const displacement = document.querySelector('svg filter feDisplacementMap');
const form = document.querySelector('form');
form.addEventListener('submit', async e => {
  e.preventDefault();
  if (config.explode) return;
  form.dataset.submitted = 'true';
  await Promise.allSettled([...document.getAnimations().map(a => a.finished)]);
  form.dataset.submitted = 'false';
  input.value = '';
  syncScroll(true);
});

const ctrl = new Pane({
  title: 'Config',
  expanded: true });


const update = () => {
  document.documentElement.dataset.theme = config.theme;
  document.documentElement.dataset.filtered = config.filtered;
  document.documentElement.dataset.rtl = config.rtl;
  document.documentElement.dataset.debug = config.debug;
  document.documentElement.dataset.explode = config.explode;
  document.documentElement.style.setProperty('--scrub', config.scrub / 100);
  document.documentElement.style.setProperty('--speed', config.speed);
  // update filter attributes
  for (const key of Object.keys(config.turbulence)) {
    turbulence.setAttribute(key, config.turbulence[key]);
    debugulence.setAttribute(key, config.turbulence[key]);
  }
  displacement.setAttribute('scale', config.displacement.scale);
};

const sync = event => {
  if (
  !document.startViewTransition ||
  event.target.controller.view.labelElement.innerText !== 'Theme')

  return update();
  document.startViewTransition(() => update());
};

ctrl.addBinding(config, 'rtl', {
  label: 'rtl' });

ctrl.addBinding(config, 'speed', {
  label: 'speed',
  min: 1,
  max: 10,
  step: 0.1 });

const debugFolder = ctrl.addFolder({ title: 'debug', expanded: true });
debugFolder.
addBinding(config, 'debug', {
  label: 'debug' }).

on('change', () => {
  scrub.disabled = exploder.disabled = !config.debug;
  if (!config.debug) {
    config.explode = false;
    ctrl.refresh();
  }
});
const exploder = debugFolder.
addBinding(config, 'explode', {
  label: 'explode',
  disabled: true }).

on('change', async () => {
  document.documentElement.dataset.exploding = config.explode;
  await Promise.allSettled([
  ...document.getAnimations().map(a => a.finished)]);

  document.documentElement.dataset.exploding = !config.explode;
});
const scrub = debugFolder.addBinding(config, 'scrub', {
  label: 'progress',
  disabled: true,
  min: 0,
  max: 100,
  step: 1 });

debugFolder.addBinding(config, 'filtered', {
  label: 'filter' });


const filterFolder = ctrl.addFolder({ title: 'filter', expanded: false });

const turb = filterFolder.addFolder({ title: 'feTurbulence' });
turb.addBinding(config.turbulence, 'seed', {
  min: 0,
  max: 1000,
  step: 1,
  label: 'seed' });

turb.addBinding(config.turbulence, 'baseFrequency', {
  min: 0,
  max: 2,
  step: 0.001,
  label: 'baseFrequency' });

turb.addBinding(config.turbulence, 'numOctaves', {
  min: 0,
  max: 10,
  step: 1,
  label: 'numOctaves' });

turb.addBinding(config.turbulence, 'type', {
  options: {
    fractalNoise: 'fractalNoise',
    turbulence: 'turbulence' },

  label: 'type' });

turb.addBinding(config.turbulence, 'stitchTiles', {
  options: {
    noStitch: 'noStitch',
    stitch: 'stitch' },

  label: 'stitchTiles' });


const displace = filterFolder.addFolder({ title: 'feDisplacementMap' });
displace.addBinding(config.displacement, 'scale', {
  min: 0,
  max: 50,
  step: 1,
  label: 'scale' });


ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark' } });



ctrl.on('change', sync);
update();

const syncScroll = (updateValue = false) => {
  for (const dupe of dupes) {
    dupe.scrollLeft = dupe.scrollX = input.scrollX = input.scrollLeft;
    if (updateValue) dupe.innerText = input.value;
  }
};

input.addEventListener('input', () => syncScroll(true));
input.addEventListener('keyup', () => syncScroll(true));
input.addEventListener('scroll', syncScroll);