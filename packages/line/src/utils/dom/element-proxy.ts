import { isFunction, isProxySupported } from '@line-ui/line/src/utils/helpers';

export function createElementProxy(element: HTMLElement | object) {
  return isProxySupported()
    ? (new Proxy(
        {},
        {
          get(target: object, key: string | symbol, receiver: object) {
            if (key in target) {
              return Reflect.get(target, key, receiver);
            }
            if (key in element) {
              const value = Reflect.get(element, key);
              Reflect.set(
                target,
                key,
                isFunction(value) ? value.bind(element) : value
              );
            }
            return Reflect.get(target, key, receiver);
          },
        }
      ) as HTMLElement)
    : (element as HTMLElement);
}
