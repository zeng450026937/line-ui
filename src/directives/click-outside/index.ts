import { VNodeDirective, DirectiveOptions } from 'vue';

interface ClickOutsideOption {
  enabled?: (ev?: UIEvent) => boolean
  include?: () => HTMLElement[]
  callback: (ev: UIEvent) => void
}

interface ClickOutsideDirective extends VNodeDirective {
  value?: (ev: UIEvent) => void
  args?: ClickOutsideOption
}

function createClickOutside(el: HTMLElement, options: ClickOutsideOption) {
  const {
    enabled = () => true,
    include = () => [],
    callback,
  } = options;

  function maybe(ev: UIEvent) {
    if (!ev) return;
    if (enabled(ev) === false) return;

    if (('isTrusted' in ev && !ev.isTrusted)
    || ('pointerType' in ev && !(ev as PointerEvent).pointerType)
    ) return;

    const elements = include();
    elements.push(el);

    !elements.some(element => element.contains(ev.target as Node)) && setTimeout(
      () => { enabled!(ev) && callback!(ev); },
      0,
    );
  }

  return {
    maybe,
  };
}

function bind(el: HTMLElement, binding: ClickOutsideDirective) {
  if (!binding.value) return;
  const vClickOutside = createClickOutside(el, {
    ...binding.args,
    callback : binding.value,
  } as ClickOutsideOption);
  const doc = document;
  doc.addEventListener('mouseup', vClickOutside.maybe, true);
  doc.addEventListener('touchend', vClickOutside.maybe, true);
  (el as any).vClickOutside = vClickOutside;
}

function unbind(el: HTMLElement, binding: ClickOutsideDirective) {
  if (!binding.value) return;
  const { vClickOutside } = el as any;
  const doc = document;
  doc.removeEventListener('mouseup', vClickOutside.maybe, true);
  doc.removeEventListener('touchend', vClickOutside.maybe, true);
  delete (el as any).vClickOutside;
}

export const ClickOutside = {
  bind,
  unbind,
} as DirectiveOptions;

export default ClickOutside;
