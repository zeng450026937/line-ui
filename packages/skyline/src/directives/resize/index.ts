import { DirectiveOptions, VNodeDirective } from 'vue';
import { on } from 'skyline/utils/dom';

interface ResizeVNodeDirective extends VNodeDirective {
  value?: () => void;
  options?: AddEventListenerOptions;
}

function inserted(el: HTMLElement, binding: ResizeVNodeDirective) {
  if (!binding.value) return;

  const {
    value: callback,
    modifiers: options = { passive: true },
  } = binding;

  const resizeOff = on(window, 'resize', callback, options);

  function destroy() {
    resizeOff();
  }

  (el as any).vResize = {
    callback,
    options,
    destroy,
  };

  if (!binding.modifiers || !binding.modifiers.quiet) {
    callback();
  }
}

function unbind(el: HTMLElement) {
  const { vResize } = el as any;
  if (!vResize) return;
  vResize.destroy();
  delete (el as any).vResize;
}

function update(el: HTMLElement, binding: ResizeVNodeDirective) {
  if (binding.value === binding.oldValue) {
    return;
  }
  if (binding.oldValue) {
    unbind(el);
  }
  inserted(el, binding);
}

export const Resize = {
  inserted,
  unbind,
  update,
} as DirectiveOptions;

export default Resize;
