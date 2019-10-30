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

  (el as any).vScroll = {
    callback,
    options,
    target,
  };
}

function unbind(el: HTMLElement) {
  if (!(el as any).vScroll) return;

  const { callback, options, target } = (el as any).vScroll;

  target.removeEventListener('scroll', callback, options);
  delete (el as any).vScroll;
}

export const Scroll = {
  inserted,
  unbind,
} as DirectiveOptions;

export default Scroll;
