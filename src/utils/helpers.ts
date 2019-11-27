export const isDev = process.env.NODE_ENV === 'development';

/* eslint-disable-next-line */
declare const __zone_symbol__requestAnimationFrame: any;
declare const requestAnimationFrame: any;

/**
 * Patched version of requestAnimationFrame that avoids ngzone
 * Use only when you know ngzone should not run
 */
export const raf = (h: any) => {
  /* eslint-disable-next-line */
  if (typeof __zone_symbol__requestAnimationFrame === 'function') {
    return __zone_symbol__requestAnimationFrame(h);
  }
  if (typeof requestAnimationFrame === 'function') {
    return requestAnimationFrame(h);
  }
  return setTimeout(h);
};

export function keys<T extends Object>(o: T) {
  return Object.keys(o) as (keyof T)[];
}

export const now = (ev: UIEvent) => ev.timeStamp || Date.now();

export const pointerCoord = (ev: any): { x: number, y: number } => {
  // get X coordinates for either a mouse click
  // or a touch depending on the given event
  if (ev) {
    const { changedTouches } = ev;
    if (changedTouches && changedTouches.length > 0) {
      const touch = changedTouches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    if (ev.pageX !== undefined) {
      return { x: ev.pageX, y: ev.pageY };
    }
  }
  return { x: 0, y: 0 };
};

export const debounce = (func: (...args: any[]) => void, wait = 0) => {
  let timer: any;
  return (...args: any[]): any => {
    clearTimeout(timer);
    timer = setTimeout(func, wait, ...args);
  };
};


export const isDef = (value: any): boolean => {
  return value !== undefined && value !== null;
};

export const isEmpty = (val: unknown): val is any => {
  return (val === undefined
    || val === null
    || val === ''
    || (Array.isArray(val) && val.length === 0)
    || (typeof (val) === 'number' && Number.isNaN(val)));
};

export function get(object: any, path: string): any {
  const keyPath = path.split('.');
  let result = object;

  keyPath.forEach((key) => {
    result = isDef(result[key]) ? result[key] : '';
  });

  return result;
}

// copied from vue-next

/* eslint-disable */

export const NOOP = () => {};

export const NO = () => false;

/* eslint-disable-next-line */
export const extend = <T extends object, U extends object>(
  a: T,
  b: U,
): T & U => {
  for (const key in b) {
    (a as any)[key] = b[key];
  }
  return a as any;
};

const { hasOwnProperty } = Object.prototype;
export const hasOwn = (
  val: object,
  key: string | symbol,
): key is keyof typeof val => hasOwnProperty.call(val, key);

export const { isArray } = Array;
export const isFunction = (val: unknown): val is Function => typeof val === 'function';
export const isString = (val: unknown): val is string => typeof val === 'string';
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol';
export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object';

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

export const objectToString = Object.prototype.toString;
export const toTypeString = (value: unknown): string => objectToString.call(value);

export const isPlainObject = (val: unknown): val is object => toTypeString(val) === '[object Object]';

const camelizeRE = /-(\w)/g;
export const camelize = (str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
};

const hyphenateRE = /\B([A-Z])/g;
export const hyphenate = (str: string): string => {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// compare whether a value has changed, accounting for NaN.
export const hasChanged = (value: any, oldValue: any): boolean => (
  value !== oldValue && (value === value || oldValue === oldValue)
);

/* eslint-enable */

// copied from vuetify

/* eslint-disable */
export function convertToUnit(str: string | number | null | undefined, unit = 'px'): string | undefined {
  if (str == null || str === '') {
    return undefined;
  } if (isNaN(+str!)) {
    return String(str);
  }
  return `${ Number(str) }${ unit }`;
}

/* eslint-enable */
