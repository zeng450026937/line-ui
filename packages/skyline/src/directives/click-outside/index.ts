import { DirectiveOptions, VNodeDirective } from 'vue';
import { on } from 'skyline/utils/dom';

interface ClickOutsideOption {
  enabled?: (ev?: Event) => boolean;
  include?: () => HTMLElement[];
  callback: (ev: Event) => void;
}

interface ClickOutsideDirective extends VNodeDirective {
  value?: (ev: Event) => void;
  args?: ClickOutsideOption;
}

function createClickOutside(el: HTMLElement, options: ClickOutsideOption) {
  const {
    enabled = () => true,
    include = () => [],
    callback,
  } = options;

  function maybe(ev: Event) {
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
  }

  const doc = document;
  const opts = { passive: true };

  const mouseupOff = on(doc, 'mouseup', maybe, opts);
  const touchendOff = on(doc, 'touchend', maybe, opts);

  function destroy() {
    mouseupOff();
    touchendOff();
  }

  return {
    maybe,
    destroy,
  };
}

function inserted(el: HTMLElement, binding: ClickOutsideDirective) {
  if (!binding.value) return;
  const vClickOutside = createClickOutside(
    el,
    {
      ...binding.args,
      callback : binding.value,
    } as ClickOutsideOption,
  );
  (el as any).vClickOutside = vClickOutside;
}

function unbind(el: HTMLElement, binding?: ClickOutsideDirective) {
  const { vClickOutside } = el as any;
  if (!vClickOutside) return;
  vClickOutside.destroy();
  delete (el as any).vClickOutside;
}

function update(el: HTMLElement, binding: ClickOutsideDirective) {
  if (binding.value === binding.oldValue) {
    return;
  }
  if (binding.oldValue) {
    unbind(el);
  }
  inserted(el, binding);
}

export const VClickOutside = {
  inserted,
  unbind,
  update,
} as DirectiveOptions;

export default VClickOutside;
