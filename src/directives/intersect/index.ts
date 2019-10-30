import { VNodeDirective } from 'vue';

interface ObserveVNodeDirective extends VNodeDirective {
  arg: string
  options?: IntersectionObserverInit
}

function inserted(el: HTMLElement, binding: ObserveVNodeDirective) {
  const modifiers = binding.modifiers || /* istanbul ignore next */ {};
  const { value } = binding;
  const isObject = value !== null && typeof value === 'object';
  const callback = isObject ? value.handler : value;
  const options = {
    root: document.querySelector(binding.arg),
    ...Object(value),
  };
  const observer = new IntersectionObserver((
    entries: IntersectionObserverEntry[] = [],
    /* eslint-disable-next-line */
    observer: IntersectionObserver,
  ) => {
    /* istanbul ignore if */
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

  (el as any).vIntersect = { init: false, observer };

  observer.observe(el);
}

function unbind(el: HTMLElement) {
  /* istanbul ignore if */
  if (!(el as any).vIntersect) return;

  (el as any).vIntersect.observer.unobserve(el);
  delete (el as any).vIntersect;
}

export const Intersect = {
  inserted,
  unbind,
};

export default Intersect;
