import { VNodeDirective } from 'vue';
import { defineDirective } from '@line-ui/line/src/utils/directive';
import { isString } from '@line-ui/line/src/utils/helpers';
import { on } from '@line-ui/line/src/utils/dom';

export interface ScrollOptions extends AddEventListenerOptions {
  target?: string | Element;
  callback: EventListener;
}

export function createScroll(options: ScrollOptions) {
  const win = window;
  const { target = win, callback } = options;
  const targetEl = isString(target)
    ? document.querySelector(target) || win
    : target;

  const scrollOff = on(targetEl, 'scroll', callback, options);

  const destroy = () => {
    scrollOff();
  };

  return {
    options,
    target,
    destroy,
  };
}

export interface ScrollVNodeDirective extends VNodeDirective {
  arg?: string;
  value?: EventListener;
}

function inserted(el: HTMLElement, binding: ScrollVNodeDirective) {
  const { value, arg, modifiers } = binding;

  if (!value) return;

  (el as any).vScroll = createScroll({
    passive: true,
    ...modifiers,
    target: arg,
    callback: value,
  });
}

function unbind(el: HTMLElement) {
  const { vScroll } = el as any;

  if (!vScroll) return;

  vScroll.destroy();

  delete (el as any).vScroll;
}

function update(el: HTMLElement, binding: ScrollVNodeDirective) {
  const { value, oldValue } = binding;

  if (value === oldValue) {
    return;
  }
  if (oldValue) {
    unbind(el);
  }

  inserted(el, binding);
}

export const vScroll = /*#__PURE__*/ defineDirective({
  name: 'scroll',
  inserted,
  unbind,
  update,
});

export default vScroll;
