import { VNodeDirective } from 'vue';
import { defineDirective } from 'skyline/utils/directive';
import { on } from 'skyline/utils/dom';

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

    !elements.some(element => element.contains(ev.target as Node)) && setTimeout(
      () => { enabled(ev) && callback(ev); },
      0,
    );
  };

  const doc = document;
  const opts = { passive: true };

  const mouseupOff = on(doc, 'mouseup', maybe, opts);
  const touchendOff = on(doc, 'touchend', maybe, opts);

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

  const vClickOutside = createClickOutside(
    el,
    {
      ...binding.args,
      callback : binding.value,
    } as ClickOutsideOptions,
  );

  (el as any).vClickOutside = vClickOutside;
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

export const VClickOutside = /*#__PURE__*/ defineDirective({
  name : 'click-outside',
  inserted,
  unbind,
  update,
});

export default VClickOutside;
