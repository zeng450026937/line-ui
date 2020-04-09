export type MiddlewareFn<T = any> = (context: T, next: () => void) => any;
export type ComposedMiddlewareFn<T = any> = (
  context: T,
  next?: () => void
) => any;

export function compose<T>(
  middleware: MiddlewareFn[]
): ComposedMiddlewareFn<T> {
  return function composedMiddleware(context: T, next?: () => void) {
    const dispatch = async (i: number): Promise<any> => {
      if (__DEV__ && i <= index) {
        console.warn('next() called multiple times');
        return;
      }

      index = i;

      let fn: MiddlewareFn<T> | undefined = middleware[i];

      if (i === middleware.length) fn = next;

      if (!fn) return;

      return fn(context, dispatch.bind(null, i + 1));
    };

    // last called middleware
    let index = -1;

    return dispatch(0);
  };
}
