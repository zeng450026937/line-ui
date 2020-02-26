import { DirectiveOptions, VNodeDirective } from 'vue';
import { isObject } from '@/utils/helpers';

interface ObserveVNodeDirective extends VNodeDirective {
  arg: string;
  value: ObserveDirectiveValue | ObserveDirectiveHandler;
}

type ObserveDirectiveValue = {
  handler: ObserveDirectiveHandler;
  options?: IntersectionObserverInit;
};

type ObserveDirectiveHandler = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver,
  isIntersecting: boolean,
) => void;

function inserted(el: HTMLElement, binding: ObserveVNodeDirective) {
  if (!binding.value) return;

  const modifiers = binding.modifiers || {};
  const { value } = binding;
  const callback = isObject(value)
    ? (value as ObserveDirectiveValue).handler
    : (value as ObserveDirectiveHandler);
  const options = {
    root : document.querySelector(binding.arg),
    ...(value as ObserveDirectiveValue).options,
  };
  const observer = new IntersectionObserver((
    entries: IntersectionObserverEntry[] = [],
    observer: IntersectionObserver,
  ) => {
    if (!(el as any).vIntersect) return; // Just in case, should never fire

    // If is not quiet or has already been
    // initted, invoke the user callback
    if (
      callback && (
        !modifiers.quiet
        || (el as any).vIntersect.init
      )
    ) {
      const isIntersecting = Boolean(entries.find(entry => entry.isIntersecting));

      callback(entries, observer, isIntersecting);
    }

    // If has already been initted and
    // has the once modifier, unbind
    /* eslint-disable-next-line */
    if ((el as any).vIntersect.init && modifiers.once) unbind(el);
    // Otherwise, mark the observer as initted
    else ((el as any).vIntersect.init = true);
  }, options);


  function destroy() {
    observer.unobserve(el);
  }

  (el as any).vIntersect = {
    init : false,
    observer,
    destroy,
  };

  observer.observe(el);
}

function unbind(el: HTMLElement) {
  const { vIntersect } = el as any;
  if (!vIntersect) return;
  vIntersect.destroy();
  delete (el as any).vIntersect;
}

function update(el: HTMLElement, binding: ObserveVNodeDirective) {
  if (binding.value === binding.oldValue) {
    return;
  }
  if (binding.oldValue) {
    unbind(el);
  }
  inserted(el, binding);
}

export const Intersect = {
  inserted,
  update,
  unbind,
} as DirectiveOptions;

export default Intersect;
