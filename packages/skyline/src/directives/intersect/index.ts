import { VNodeDirective } from 'vue';
import { defineDirective } from 'skyline/src/utils/directive';
import {
  isObject,
  isString,
} from 'skyline/src/utils/helpers';

export type IntersectHandler = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver,
  isIntersecting: boolean,
) => void;

export interface IntersectOptions {
  handler: IntersectHandler;
  root?: string | Element | null; // selector or HTMLElement
  rootMargin?: string;
  threshold?: number | number[];
  quiet?: boolean;
  once?: boolean;
}

export function createIntersect(el: HTMLElement, options: IntersectOptions) {
  const {
    handler,
    root,
    rootMargin,
    threshold,
    quiet,
    once,
  } = options;


  let inited = false;

  const observer = new IntersectionObserver(
    (
      entries: IntersectionObserverEntry[] = [],
      observer: IntersectionObserver,
    ) => {
      // If is not quiet or has already been
      // initted, invoke the user handler
      if (handler && (!quiet || inited)) {
        const isIntersecting = entries.some(entry => entry.isIntersecting);

        handler(entries, observer, isIntersecting);
      }

      // If has already been initted and
      // has the once modifier, unbind
      if (inited && once) {
        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        destroy();
      } else {
        // Otherwise, mark the observer as initted
        inited = true;
      }
    },
    {
      root : isString(root) ? document.querySelector(root) : root,
      rootMargin,
      threshold,
    },
  );

  const destroy = () => {
    observer.unobserve(el);
  };

  observer.observe(el);

  return {
    observer,
    destroy,
  };
}

export interface ObserveVNodeDirective extends VNodeDirective {
  value?: IntersectOptions | IntersectHandler;
  modifiers: { [key: string]: boolean };
}

function inserted(el: HTMLElement, binding: ObserveVNodeDirective) {
  const { value, arg, modifiers } = binding;

  if (!value || !arg) return;

  const options = isObject(value)
    ? value as IntersectOptions
    : { handler: value } as IntersectOptions;

  (el as any).vIntersect = createIntersect(el, {
    ...modifiers, // once, quiet
    ...options,
    root : arg || options.root,
  });
}

function unbind(el: HTMLElement) {
  const { vIntersect } = el as any;

  if (!vIntersect) return;

  vIntersect.destroy();

  delete (el as any).vIntersect;
}

function update(el: HTMLElement, binding: ObserveVNodeDirective) {
  const { value, oldValue } = binding;

  if (value === oldValue) {
    return;
  }
  if (oldValue) {
    unbind(el);
  }

  inserted(el, binding);
}

export const vIntersect = /*#__PURE__*/ defineDirective({
  name : 'intersect',
  inserted,
  update,
  unbind,
});

export default vIntersect;
