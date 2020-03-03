export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
): T => {
  let timer: number | undefined;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as any;
};

export const EMPTY_OBJ: { readonly [key: string]: any } = __DEV__
  ? Object.freeze({})
  : {};
export const EMPTY_ARR: [] = [];

export const NOOP = () => {};

/**
 * Always return false.
 */
export const NO = () => false;

export const extend = <T extends object, U extends object>(
  a: T,
  b: U,
): T & U => {
  /* eslint-disable-next-line guard-for-in */
  for (const key in b) {
    (a as any)[key] = b[key];
  }
  return a as any;
};

export const keys = <T extends Record<string, any>>(o: T) => {
  return Object.keys(o) as (keyof T)[];
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
export const isObject = (val: unknown): val is Record<any, any> => typeof val === 'object' && val !== null;

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

export const isDef = (val: any): boolean => val !== undefined && val !== null;

export const objectToString = Object.prototype.toString;
export const toTypeString = (value: unknown): string => objectToString.call(value);

export function toRawType(value: unknown): string {
  return toTypeString(value).slice(8, -1);
}

export const isPlainObject = (val: unknown): val is object => toTypeString(val) === '[object Object]';
export const isDate = (val: unknown): val is Date => toTypeString(val) === '[object Date]';

/* eslint-disable implicit-arrow-linebreak, no-self-compare */

// compare whether a value has changed, accounting for NaN.
export const hasChanged = (value: any, oldValue: any): boolean =>
  value !== oldValue && (value === value || oldValue === oldValue);
