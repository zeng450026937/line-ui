import { compose, MiddlewareFn, ComposedMiddlewareFn } from './compose';

export interface LayerContext<P extends Payload = Payload> {
  [key: string]: any;

  // dispatch location
  ns: string;
  path: string;
  payload: P;

  // internal
  push: (ns: string) => (() => void) | undefined;
  match: (name: string) => boolean;
}
export interface Payload {
  [key: string]: any;
}

export type LayerMiddlewareFn<
  T extends LayerContext = LayerContext
> = MiddlewareFn<T>;

export const SEPARATOR = '/';

export class Layer<T extends LayerContext = LayerContext> {
  ns: string;
  middleware: MiddlewareFn<T>[];

  constructor(ns: string = '') {
    this.ns = ns;
    this.middleware = [];
  }

  use(pathOrFn: string | MiddlewareFn<T>, fn?: MiddlewareFn<T>, thisArg?: any) {
    const handler = fn
      ? createHandler(pathOrFn as string, fn, thisArg)
      : (pathOrFn as MiddlewareFn<T>);

    this.middleware.push(handler);
    return this;
  }

  callback(): ComposedMiddlewareFn<T> {
    return (ctx: T, next?: () => any) => {
      const pop = ctx.push(this.ns);
      if (pop) {
        const wrappedNext = next
          ? async () => {
              pop();
              return next();
            }
          : next;
        return compose(this.middleware)(ctx, wrappedNext);
      }
      return next ? next() : Promise.resolve();
    };
  }

  dispatch<R = any, P extends Payload = Payload>(
    path: string,
    payload?: P
  ): Promise<R> {
    const ctx = this.createContext();

    ctx.path = path;
    ctx.payload = payload || {};

    const stack = `${this.ns}/${path}`.split(SEPARATOR).filter(Boolean);
    let deep = 0;

    ctx.push = (ns: string) => {
      if (!ns || !stack.length) {
        return () => {};
      }
      if (deep < stack.length && ns === stack[deep]) {
        deep++;
        return () => {
          deep--;
        };
      }
    };
    ctx.match = (name: string) => {
      return stack[deep] === name && deep === stack.length - 1;
    };

    return this.callback()(ctx);
  }

  createContext(ns: string = this.ns): T {
    return { ns } as any;
  }
}

export const createHandler = <T extends LayerContext>(
  name: string,
  fn: MiddlewareFn<T>,
  thisArg?: any
): MiddlewareFn<T> => {
  return (ctx: T, next: () => Promise<any>) => {
    if (ctx.match(name)) {
      return fn.call(thisArg, ctx, next);
    }
    return next();
  };
};
