// eslint-disable-next-line import/no-mutable-exports
export let supportsPassive: boolean | undefined;

export const isSupportsPassive = (node: Node) => {
  if (supportsPassive === undefined) {
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: () => {
          supportsPassive = true;
        },
      });
      node.addEventListener('passive-tester', null, opts);
    } catch (e) {
      supportsPassive = false;
    }
  }
  return !!supportsPassive;
};

export const off = (
  el: EventTarget,
  event: string,
  listener: EventListener,
  opts?: AddEventListenerOptions
) => {
  el.removeEventListener(event, listener, opts);
};

export const on = (
  el: EventTarget,
  event: string,
  listener: EventListener,
  opts: AddEventListenerOptions = { passive: false, capture: false }
) => {
  // use event listener options when supported
  // otherwise it's just a boolean for the "capture" arg
  const listenerOpts = isSupportsPassive(el as Node) ? opts : !!opts.capture;

  el.addEventListener(event, listener, listenerOpts);

  return () =>
    off(el, event, listener, listenerOpts as AddEventListenerOptions);
};

export const once = (
  el: Element | Document | Window,
  event: string,
  listener: EventListener,
  opts?: AddEventListenerOptions
) => {
  const off = on(
    el,
    event,
    (ev: Event) => {
      listener(ev);
      off();
    },
    opts
  );
};
