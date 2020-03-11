import { DirectiveOptions, VNodeDirective } from 'vue';
import { on } from 'skyline/utils/dom';

interface ScrollVNodeDirective extends VNodeDirective {
  arg: string;
  value: EventListener;
  options?: AddEventListenerOptions;
}

function inserted(el: HTMLElement, binding: ScrollVNodeDirective) {
  const callback = binding.value;
  const options = binding.options || { passive: true };
  const target = binding.arg ? document.querySelector(binding.arg) : window;

  if (!target) return;

  const scrollOff = on(target, 'scroll', callback, options);

  function destroy() {
    scrollOff();
  }

  (el as any).vScroll = {
    callback,
    options,
    target,
    destroy,
  };
}

function unbind(el: HTMLElement) {
  const { vScroll } = el as any;
  if (!vScroll) return;
  vScroll.destroy();
  delete (el as any).vScroll;
}

function update(el: HTMLElement, binding: ScrollVNodeDirective) {
  if (binding.value === binding.oldValue) {
    return;
  }
  if (binding.oldValue) {
    unbind(el);
  }
  inserted(el, binding);
}

export const VScroll = {
  inserted,
  unbind,
  update,
} as DirectiveOptions;

export default VScroll;
