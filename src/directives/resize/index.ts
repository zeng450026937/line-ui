import { VNodeDirective } from 'vue';

interface ResizeVNodeDirective extends VNodeDirective {
  value?: () => void
  options?: boolean | AddEventListenerOptions
}

function inserted(el: HTMLElement, binding: ResizeVNodeDirective) {
  if (!binding.value) return;

  const {
    value: callback,
    modifiers: options = { passive: true },
  } = binding;

  window.addEventListener('resize', callback, options);

  function destroy() {
    window.removeEventListener('resize', callback, options);
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
  if (!(el as any).vResize) return;
  (el as any).vResize.destroy();
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
};

export default Resize;
