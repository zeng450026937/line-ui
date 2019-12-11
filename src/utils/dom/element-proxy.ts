import { isFunction } from '@/utils/helpers';

export function createElementProxy(element: HTMLElement) {
  return new Proxy({}, {
    get(obj, prop) {
      const target = (element && prop in element) ? element : obj as any;
      const value = target[prop];
      return isFunction(value) ? value.bind(target) : value;
    },
  }) as HTMLElement;
}
