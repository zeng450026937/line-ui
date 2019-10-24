import { VNodeDirective, DirectiveOptions } from 'vue';

interface ScrollVNodeDirective extends VNodeDirective {
  arg: string
  value: EventListenerOrEventListenerObject
  options?: boolean | AddEventListenerOptions
}

function inserted(el: HTMLElement, binding: ScrollVNodeDirective) {
  const callback = binding.value;
  const options = binding.options || { passive: true };
  const target = binding.arg ? document.querySelector(binding.arg) : window;
  if (!target) return;

  target.addEventListener('scroll', callback, options);

  el._onScroll = {
    callback,
    options,
    target,
  };
}

function unbind(el: HTMLElement) {
  if (!el._onScroll) return;

  const { callback, options, target } = el._onScroll;

  target.removeEventListener('scroll', callback, options);
  delete el._onScroll;
}

export const Scroll = {
  inserted,
  unbind,
} as DirectiveOptions;

export default Scroll;
