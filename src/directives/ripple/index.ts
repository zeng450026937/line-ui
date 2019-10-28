import {
  VNodeDirective, VNode, DirectiveOptions,
} from 'vue';

import './ripple.scss';

const PADDING = 10;
const INITIAL_ORIGIN_SCALE = 0.5;

const removeRipple = (ripple: HTMLElement, effect?: HTMLElement) => {
  ripple.classList.add('fade-out');
  setTimeout(() => {
    effect && effect.remove();
    ripple.remove();
  }, 200);
};

type RippleOption = {
  unbounded: boolean,
  delay: boolean | number,
}

function createRippleEffect(el: HTMLElement, options: RippleOption) {
  const { unbounded = false, delay = true } = options;

  function addRipple(x: number, y: number) {
    return new Promise<() => void>((resolve) => {
      const rect = el.getBoundingClientRect();
      const { width } = rect;
      const { height } = rect;
      const hypotenuse = Math.sqrt(width * width + height * height);
      const maxDim = Math.max(height, width);
      const maxRadius = unbounded ? maxDim : hypotenuse + PADDING;
      const initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);
      const finalScale = maxRadius / initialSize;
      let posX = x - rect.left;
      let posY = y - rect.top;
      if (unbounded) {
        posX = width * 0.5;
        posY = height * 0.5;
      }
      const styleX = posX - initialSize * 0.5;
      const styleY = posY - initialSize * 0.5;
      const moveX = width * 0.5 - posX;
      const moveY = height * 0.5 - posY;

      const ripple = document.createElement('div');
      ripple.classList.add('ripple');
      const { style } = ripple;
      style.top = `${styleY}px`;
      style.left = `${styleX}px`;
      style.width = style.height = `${initialSize}px`;
      style.setProperty('--final-scale', `${finalScale}`);
      style.setProperty('--translate-end', `${moveX}px, ${moveY}px`);

      const effect = document.createElement('div');
      effect.classList.add('ripple-effect');
      if (unbounded) {
        effect.classList.add('unbounded');
      }
      effect.appendChild(ripple);

      const container = el;
      container.appendChild(effect);
      setTimeout(() => {
        resolve(() => {
          removeRipple(ripple, effect);
        });
      }, 225 + 100);
    });
  }

  return {
    addRipple,
    options,
  };
}

function bind(
  el: HTMLElement,
  binding: VNodeDirective,
  vnode: VNode,
) {
  const { modifiers } = binding;
  (el as any).rippleEffect = createRippleEffect(el, modifiers as RippleOption);
}

function unbind(
  el: HTMLElement,
  binding: VNodeDirective,
  vnode: VNode,
) {
  delete (el as any).rippleEffect;
}

export const Ripple = {
  bind,
  unbind,
} as DirectiveOptions;

export default Ripple;
