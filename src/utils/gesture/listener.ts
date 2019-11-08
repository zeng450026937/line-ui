
let _sPassive: boolean | undefined;

const supportsPassive = (node: Node) => {
  if (_sPassive === undefined) {
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get : () => {
          return _sPassive = true;
        },
      });
      node.addEventListener('optsTest', () => { }, opts);
    } catch (e) {
      _sPassive = false;
    }
  }
  return !!_sPassive;
};

export const addEventListener = (
  el: any,
  eventName: string,
  callback: EventListenerOrEventListenerObject,
  opts: {
    passive?: boolean;
    capture?: boolean
  },
): (() => void
) => {
  // use event listener options when supported
  // otherwise it's just a boolean for the "capture" arg
  const listenerOpts = supportsPassive(el) ? {
    capture : !!opts.capture,
    passive : !!opts.passive,
  } : !!opts.capture;

  let add: string;
  let remove: string;
  if (el.__zone_symbol__addEventListener) {
    add = '__zone_symbol__addEventListener';
    remove = '__zone_symbol__removeEventListener';
  } else {
    add = 'addEventListener';
    remove = 'removeEventListener';
  }

  el[add](eventName, callback, listenerOpts);
  return () => {
    el[remove](eventName, callback, listenerOpts);
  };
};
