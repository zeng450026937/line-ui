import { DirectiveOptions, VNodeDirective } from 'vue';
import { on } from 'skyline/utils/dom';

interface HoverVNodeDirective extends VNodeDirective {
  value?: (hover: boolean, ev: Event) => void;
}

function inserted(el: HTMLElement, binding: HoverVNodeDirective) {
  if (!binding.value) return;

  const {
    value: callback,
    modifiers: options = { passive: true },
  } = binding;

  const enter = (ev: Event) => callback(true, ev);
  const leave = (ev: Event) => callback(false, ev);

  const mouseenterOff = on(el, 'mouseenter', enter, options);
  const mouseleaveOff = on(el, 'mouseleave', leave, options);
  const focusOff = on(el, 'focus', enter, options);
  const blurOff = on(el, 'blur', leave, options);

  function destroy() {
    mouseenterOff();
    mouseleaveOff();
    focusOff();
    blurOff();
  }

  (el as any).vHover = {
    callback,
    options,

    enter,
    leave,
    destroy,
  };
}

function unbind(el: HTMLElement) {
  const { vHover } = el as any;
  if (!vHover) return;
  vHover.destroy();
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

export const VHover = {
  inserted,
  unbind,
  update,
} as DirectiveOptions;

export default VHover;
