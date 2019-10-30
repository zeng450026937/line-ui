import { VNodeDirective } from 'vue';

interface ResizeVNodeDirective extends VNodeDirective {
  value?: () => void
  options?: boolean | AddEventListenerOptions
}

function inserted(el: HTMLElement, binding: ResizeVNodeDirective) {
  const callback = binding.value!;
  const options = binding.options || { passive: true };

  window.addEventListener('resize', callback, options);
  (el as any).vResize = {
    callback,
    options,
  };

  if (!binding.modifiers || !binding.modifiers.quiet) {
    callback();
  }
}

function unbind(el: HTMLElement) {
  if (!(el as any).vResize) return;

  const { callback, options } = (el as any).vResize;
  window.removeEventListener('resize', callback, options);
  delete (el as any).vResize;
}

export const Resize = {
  inserted,
  unbind,
};

export default Resize;
