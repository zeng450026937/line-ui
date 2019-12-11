import { VNodeDirective } from 'vue';

interface HoverVNodeDirective extends VNodeDirective {
  value?: (hover: boolean) => void
}

function inserted(el: HTMLElement, binding: HoverVNodeDirective) {
  if (!binding.value) return;

  const {
    value: callback,
    modifiers: options = { passive: true },
  } = binding;

  const enter = () => callback(true);
  const leave = () => callback(false);

  el.addEventListener('mouseenter', enter, options);
  el.addEventListener('mouseleave', leave, options);
  el.addEventListener('focus', enter, options);
  el.addEventListener('blur', leave, options);

  function destroy() {
    el.removeEventListener('mouseenter', enter, options);
    el.removeEventListener('mouseleave', leave, options);
    el.removeEventListener('focus', enter, options);
    el.removeEventListener('blur', leave, options);
  }

  (el as any).vHover = {
    callback,
    options,
    destroy,
  };
}

function unbind(el: HTMLElement) {
  if (!(el as any).vHover) return;
  (el as any).vHover.destroy();
  delete (el as any).vHover;
}

function update(el: HTMLElement, binding: HoverVNodeDirective) {
  if (binding.value === binding.oldValue) {
    return;
  }
  if (binding.oldValue) {
    unbind(el);
  }
  inserted(el, binding);
}

export const Hover = {
  inserted,
  unbind,
  update,
};

export default Hover;
