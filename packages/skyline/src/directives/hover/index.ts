import { VNodeDirective } from 'vue';
import { defineDirective } from 'skyline/utils/directive';
import { on } from 'skyline/utils/dom';

export interface HoverOptions {
  callback: (hover: boolean, ev: Event) => void;
  passive?: boolean;
}

export function createHover(el: HTMLElement, options: HoverOptions) {
  const { callback } = options;

  const enter = (ev: Event) => callback(true, ev);
  const leave = (ev: Event) => callback(false, ev);

  const mouseenterOff = on(el, 'mouseenter', enter, options);
  const mouseleaveOff = on(el, 'mouseleave', leave, options);
  const focusOff = on(el, 'focus', enter, options);
  const blurOff = on(el, 'blur', leave, options);

  const destroy = () => {
    mouseenterOff();
    mouseleaveOff();
    focusOff();
    blurOff();
  };

  return {
    options,
    enter,
    leave,
    destroy,
  };
}

export interface HoverVNodeDirective extends VNodeDirective {
  value?: (hover: boolean, ev: Event) => void;
}

function inserted(el: HTMLElement, binding: HoverVNodeDirective) {
  const {
    value: callback,
    modifiers: options,
  } = binding;

  if (!callback) return;

  (el as any).vHover = createHover(el, {
    callback,
    passive : true,
    ...options,
  });
}

function unbind(el: HTMLElement) {
  const { vHover } = el as any;

  if (!vHover) return;

  vHover.destroy();

  delete (el as any).vHover;
}

function update(el: HTMLElement, binding: HoverVNodeDirective) {
  const { value, oldValue } = binding;

  if (value === oldValue) {
    return;
  }
  if (oldValue) {
    unbind(el);
  }

  inserted(el, binding);
}

export const VHover = defineDirective({
  name : 'hover',
  inserted,
  unbind,
  update,
});

export default VHover;
