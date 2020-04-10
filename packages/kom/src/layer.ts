import { compose, MiddlewareFn, ComposedMiddlewareFn } from './compose';

export interface LayerContext<P extends Payload = Payload> {
  [key: string]: any;

  ns: string;
  path: string;
  payload: P;
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

  match(path: string = ''): boolean {
    if (!this.ns) return true;
    return path.startsWith(this.ns);
  }

  use(pathOrFn: string | MiddlewareFn<T>, fn?: MiddlewareFn<T>, thisArg?: any) {
    const handler = fn
      ? this.createHandler(pathOrFn as string, fn, thisArg)
      : (pathOrFn as MiddlewareFn<T>);

    this.middleware.push(handler);
    return this;
  }

  callback(): ComposedMiddlewareFn<T> {
    return (ctx: T, next?: () => void) => {
      if (!this.match(resolvePath(ctx.ns, ctx.path))) {
        return next ? next() : Promise.resolve();
      }
      return compose(this.middleware)(ctx, next);
    };
  }

  dispatch<R = any, P extends Payload = Payload>(
    path: string,
    payload?: P
  ): Promise<R> {
    const ctx = this.createContext();

    ctx.path = path;
    ctx.payload = payload || {};

    return this.callback()(ctx);
  }

  createContext(ns: string = this.ns): T {
    return { ns } as any;
  }

  createHandler(path: string, fn: MiddlewareFn<T>, thisArg?: any) {
    return (ctx: T, next: () => void) => {
      if (resolvePath(this.ns, path) !== resolvePath(ctx.ns, ctx.path)) {
        return next();
      }
      return fn.call(thisArg, ctx, next);
    };
  }
}

export const resolvePath = (...args: string[]): string => {
  return args.join(SEPARATOR).split(SEPARATOR).filter(Boolean).join(SEPARATOR);
};
