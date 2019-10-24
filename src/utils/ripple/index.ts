import {
  VNodeDirective, VNode, DirectiveOptions,
} from 'vue';

import './ripple.scss';

const PADDING = 10;
const INITIAL_ORIGIN_SCALE = 0.5;

function createRippleEffect(el: HTMLElement, unbounded: boolean) {
  const removeRipple = (ripple: HTMLElement) => {
    ripple.classList.add('fade-out');
    setTimeout(() => {
      ripple.remove();
    }, 200);
  };

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

      const div = document.createElement('div');
      div.classList.add('ripple');
      const { style } = div;
      style.top = `${styleY}px`;
      style.left = `${styleX}px`;
      style.width = style.height = `${initialSize}px`;
      style.setProperty('--final-scale', `${finalScale}`);
      style.setProperty('--translate-end', `${moveX}px, ${moveY}px`);

      const effect = document.createElement('div');
      effect.classList.add('ripple-effect');
      effect.appendChild(div);

      const container = el;
      container.appendChild(effect);
      setTimeout(() => {
        resolve(() => {
          removeRipple(effect);
        });
      }, 225 + 100);
    });
  }

  return {
    addRipple,
    removeRipple,
  };
}

function bind(
  el: HTMLElement,
  binding: VNodeDirective,
  vnode: VNode,
  oldVnode: VNode,
) {
  (el as any).rippleEffect = createRippleEffect(el, false);
}

function unbind(
  el: HTMLElement,
  binding: VNodeDirective,
  vnode: VNode,
  oldVnode: VNode,
) {
  delete (el as any).rippleEffect;
}

export const Ripple = {
  bind,
  unbind,
} as DirectiveOptions;

export default Ripple;
