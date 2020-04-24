export * from './client-area';
export * from './dom';
export * from './element-proxy';
export * from './event-listener';
export * from './event-modifier';
export * from './offset-parent';
export * from './pointer-coord';
export * from './raf';
export * from './resize-listerner';
export * from './scroll-parent';

export const hasDocument = typeof document !== 'undefined';
export const hasWindow = typeof window !== 'undefined';
export const hasNavigator = typeof navigator !== 'undefined';

export const isDocument = (el: unknown): el is Document => el === document;
export const isWindow = (el: unknown): el is Window => el === window;

let supportsVars: boolean | undefined;

export const isSupportsVars = () => {
  if (supportsVars === undefined) {
    supportsVars = !!(
      window.CSS &&
      window.CSS.supports &&
      window.CSS.supports('--a: 0')
    );
  }
  return supportsVars;
};

export const now = (ev: UIEvent) => ev.timeStamp || Date.now();

const APP_SELECTOR = '[line-app]';
export const getApp = (el?: Element, selector = APP_SELECTOR) => {
  return (
    (el && el.closest && el.closest(selector)) ||
    document.querySelector(selector) ||
    document.body
  );
};
