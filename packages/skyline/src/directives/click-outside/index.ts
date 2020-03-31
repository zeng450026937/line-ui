import { VNodeDirective } from 'vue';
import { defineDirective } from 'skyline/src/utils/directive';
import {
  getApp,
  on,
} from 'skyline/src/utils/dom';

export interface ClickOutsideOptions {
  enabled?: (ev?: Event) => boolean;
  include?: () => HTMLElement[];
  callback: (ev: Event) => void;
}

export function createClickOutside(el: HTMLElement, options: ClickOutsideOptions) {
  const {
    enabled = () => true,
    include = () => [],
    callback,
  } = options;

  const maybe = (ev: Event) => {
    if (!ev) return;
    if (enabled(ev) === false) return;

    if (('isTrusted' in ev && !ev.isTrusted)
    || ('pointerType' in ev && !(ev as PointerEvent).pointerType)
    ) return;

    const elements = include();
    elements.push(el);

    if (!elements.some(element => element.contains(ev.target as Node))) {
      callback(ev);
    }
  };

  const app = getApp(el);
  const opts = { passive: true };

  const mouseupOff = on(app, 'mouseup', maybe, opts);
  const touchendOff = on(app, 'touchend', maybe, opts);

  const destroy = () => {
    mouseupOff();
    touchendOff();
  };

  return {
    maybe,
    destroy,
  };
}

export interface ClickOutsideDirective extends VNodeDirective {
  value?: (ev: Event) => void;
  args?: ClickOutsideOptions;
}

function inserted(el: HTMLElement, binding: ClickOutsideDirective) {
  if (!binding.value) return;

  (el as any).vClickOutside = createClickOutside(
    el,
    {
      ...binding.args,
      callback : binding.value,
    } as ClickOutsideOptions,
  );
}

function unbind(el: HTMLElement) {
  const { vClickOutside } = el as any;

  if (!vClickOutside) return;

  vClickOutside.destroy();

  delete (el as any).vClickOutside;
}

function update(el: HTMLElement, binding: ClickOutsideDirective) {
  const { value, oldValue } = binding;

  if (value === oldValue) {
    return;
  }
  if (oldValue) {
    unbind(el);
  }

  inserted(el, binding);
}

export const vClickOutside = /*#__PURE__*/ defineDirective({
  name : 'click-outside',
  inserted,
  unbind,
  update,
});

export default vClickOutside;
