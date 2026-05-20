import gsap from 'https://esm.sh/gsap@3.13.0';
import Draggable from 'https://esm.sh/gsap@3.13.0/Draggable';
import { Pane } from 'https://esm.sh/tweakpane@4.0.4';
gsap.registerPlugin(Draggable);

// Quantity Picker Web Component (Light DOM)
class QuantityPicker extends HTMLElement {
  constructor() {
    super();
    // Cache DOM references after render
    this._elements = {};
  }

  static get observedAttributes() {
    return ['min', 'max', 'step', 'value', 'disabled', 'readonly', 'name', 'id'];
  }

  // Helper to get attribute with default
  getAttr(name, defaultValue = '') {
    return this.getAttribute(name) || defaultValue;
  }

  // Helper to get numeric attribute
  getNumAttr(name, defaultValue = 0) {
    return parseFloat(this.getAttr(name, defaultValue));
  }

  // Cache parsed values
  get config() {
    if (!this._config) this._config = {};
    return {
      min: this.getNumAttr('min', 0),
      max: this.getNumAttr('max', 100),
      step: this.getNumAttr('step', 1),
      value: this.getNumAttr('value', this._config.min || 0),
      disabled: this.hasAttribute('disabled'),
      readonly: this.hasAttribute('readonly') };

  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this._elements.input) return;
    const oldMin = this.getNumAttr('min', 0);
    // Clear config cache
    this._config = null;

    switch (name) {
      case 'value':
        if (this._elements.input && this._elements.input.value !== newValue) {
          this._elements.input.value = newValue;
          this._elements.input.setAttribute('value', newValue);
          this._elements.track.style.setProperty('--translate-x', oldMin - newValue);
        }
        this.updateButtonStates();
        break;
      case 'min':
      case 'max':
      case 'step':
        this.updateInput();
        this.updateTrack();
        this.updateButtonStates();
        break;
      case 'disabled':
      case 'readonly':
        this.updateInput();
        break;
      default:
        this.updateInput();}

  }

  render() {
    const { min, max, step, value, disabled, readonly } = this.config;
    const id = this.getAttr('id', 'quantity');
    const name = this.getAttr('name', 'quantity');

    this.innerHTML = `
      <button class="decrement" aria-label="Decrease quantity">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
        </svg>
      </button>
      <div class="track-container">
        <input
          type="number" 
          id="${id}"
          name="${name}"
          min="${min}" 
          max="${max}" 
          step="${step}" 
          value="${value}"
          required
          ${disabled ? 'disabled' : ''}
          ${readonly ? 'readonly' : ''}
        />
        <div aria-hidden="true" class="track"></div>
      </div>
      <button class="increment" aria-label="Increase quantity">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    `;

    // Cache element references
    this._elements = {
      input: this.querySelector('input'),
      increment: this.querySelector('.increment'),
      decrement: this.querySelector('.decrement'),
      track: this.querySelector('.track') };


    this.updateTrack();
    this.updateButtonStates();
  }

  setupEventListeners() {
    const { input, increment, decrement } = this._elements;

    // Single handler for both buttons using data attribute or class
    const handleStep = e => {
      const direction = e.currentTarget.classList.contains('increment') ? 1 : -1;
      const { min, max, step } = this.config;
      const currentValue = parseFloat(input.value) || 0;
      const newValue = currentValue + step * direction;

      // Check boundaries
      if (direction > 0 && newValue > max || direction < 0 && newValue < min) return;

      input.value = newValue;
      this._elements.track.style.setProperty('--translate-x', min - newValue);
      this.updateButtonStates();
      this.dispatchChange(newValue);
    };

    increment.addEventListener('click', handleStep);
    decrement.addEventListener('click', handleStep);

    input.addEventListener('input', e => {
      this.updateButtonStates();
      const value = e.target.value;
      // Only update track if value is numeric
      if (value !== '' && !isNaN(value)) {
        this._elements.track.style.setProperty('--translate-x', e.target.min - value);
      }
      this.dispatchChange(value);
    });

    // Prevent native change event from bubbling to avoid conflicts
    // input.addEventListener('change', (e) => {
    //   e.stopPropagation()
    // })
  }

  // Helper to dispatch change event
  dispatchChange(value) {
    if (this.getAttr('value') !== String(value)) {
      this.dispatchEvent(new CustomEvent('change', { detail: { value }, bubbles: true }));
    }
  }

  updateInput() {
    const { input } = this._elements;
    if (!input) return;

    const { min, max, step, value, disabled, readonly } = this.config;

    Object.assign(input, {
      min, max, step, value,
      disabled,
      readOnly: readonly });


    this.updateButtonStates();
  }

  // Helper to set aria-disabled attribute
  setAriaDisabled(element, disabled) {
    element.disabled = disabled;
    element[disabled ? 'setAttribute' : 'removeAttribute']('aria-disabled', 'true');
  }

  updateButtonStates() {
    const { increment, decrement, input } = this._elements;
    if (!increment || !decrement || !input) return;

    const { disabled, readonly, min, max, step } = this.config;

    // Handle component-level disabled/readonly state
    if (disabled || readonly) {
      this.setAriaDisabled(increment, true);
      this.setAriaDisabled(decrement, true);
      return;
    }

    const currentValue = parseFloat(input.value) || 0;

    // Update button states based on boundaries
    this.setAriaDisabled(decrement, currentValue - step < min);
    this.setAriaDisabled(increment, currentValue + step > max);
  }

  updateTrack() {
    const { track } = this._elements;
    if (!track) return;

    const { min, max, step } = this.config;
    const range = max - min;

    // Optimize for large ranges - use Array.from for better performance
    track.dataset.lowRangeOut = min - step;
    track.dataset.highRangeOut = max + step;
    track.textContent = Array.from(
    { length: range + 1 },
    (_, i) => min + i).
    join('\n');
  }}


// Register the custom element
customElements.define('quantity-picker', QuantityPicker);

const config = {
  theme: 'system',
  step: 1,
  min: 0,
  max: 100,
  value: Math.floor(Math.random() * 100) + 1 };


const ctrl = new Pane({
  title: 'config',
  expanded: true });


const picker = document.querySelector('quantity-picker');
// Store reference to the value binding for direct UI updates
let valueBinding;
const update = event => {
  document.documentElement.dataset.theme = config.theme;
  picker.setAttribute('step', config.step);
  picker.setAttribute('min', config.min);
  picker.setAttribute('max', config.max);

};

const sync = event => {
  // Check if this is a real user interaction or just a refresh
  // When we call refresh() on a specific binding, it doesn't trigger change event
  // So we can safely update here
  if (
  !document.startViewTransition ||
  !event.target ||
  event.target.controller.view.labelElement.innerText !== 'theme')

  return update();
  document.startViewTransition(() => update());
};

valueBinding = ctrl.addBinding(config, 'value', {
  label: 'value',
  min: 0,
  max: 1000,
  step: 1 }).
on('change', event => {
  // Update the quantity-picker when user interacts with tweakpane
  picker.setAttribute('value', config.value);
});
ctrl.addBinding(config, 'step', {
  label: 'step',
  min: 1,
  max: 20,
  step: 1 });

ctrl.addBinding(config, 'min', {
  label: 'min',
  min: 0,
  max: 100,
  step: 1 });

ctrl.addBinding(config, 'max', {
  label: 'max',
  min: 0,
  max: 1000,
  step: 1 });

ctrl.addBinding(config, 'theme', {
  label: 'theme',
  options: {
    system: 'system',
    light: 'light',
    dark: 'dark' } });



ctrl.on('change', sync);
update();

// Set initial value
picker.setAttribute('value', config.value);

// Listen for changes from the quantity-picker component
picker.addEventListener('change', e => {
  // Check if this is our custom event with detail
  if (!e.detail || e.detail.value === undefined || e.detail.value === null || e.detail.value === '') return;

  const newValue = parseFloat(e.detail.value);
  // Skip if parseFloat returns NaN
  if (isNaN(newValue)) return;

  // Update the config value
  config.value = newValue;

  // Directly update the Tweakpane input element without triggering events
  // Tweakpane creates an input element inside the binding's view
  const tweakpaneInput = valueBinding.controller.view.element.querySelector('input');
  if (tweakpaneInput) {
    tweakpaneInput.value = newValue;
  }
  // Update the slider knob position
  const sliderKnob = valueBinding.controller.view.element.querySelector('.tp-sldv_k');
  if (sliderKnob) {
    sliderKnob.style.setProperty('width', `${Math.max(config.min, Math.min(1000, newValue / 1000 * 100))}%`);
  }
});

// make tweakpane panel draggable
const tweakClass = 'div.tp-dfwv';
const d = Draggable.create(tweakClass, {
  type: 'x,y',
  allowEventDefault: true,
  trigger: tweakClass + ' button.tp-rotv_b' });

document.querySelector(tweakClass).addEventListener('dblclick', () => {
  gsap.to(tweakClass, {
    x: `+=${d[0].x * -1}`,
    y: `+=${d[0].y * -1}`,
    onComplete: () => {
      gsap.set(tweakClass, { clearProps: 'all' });
    } });

});