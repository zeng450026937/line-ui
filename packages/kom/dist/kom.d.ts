import { ComponentOptions } from 'vue/types/options';
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options';
import { default as Vue_2 } from 'vue';
import { VueConstructor } from 'vue';

declare type ArrayState = string[];

export declare const chainget: (ns: string, delegate: any) => any;

declare type ComposedMiddlewareFn<T = any> = (
  context: T,
  next?: () => void
) => any;

declare const _default: {
  install: (target?: VueConstructor<Vue_2>) => void;
};
export default _default;

export declare const install: (target?: VueConstructor<Vue_2>) => void;

export declare const keys: <T extends Record<string, any>>(o: T) => (keyof T)[];

export declare class Layer<T extends LayerContext = LayerContext> {
  ns: string;
  middleware: MiddlewareFn<T>[];
  constructor(ns?: string);
  match(path?: string): boolean;
  use(
    pathOrFn: string | MiddlewareFn<T>,
    fn?: MiddlewareFn<T>,
    thisArg?: any
  ): this;
  callback(): ComposedMiddlewareFn<T>;
  dispatch<R = any, P extends Payload = Payload>(
    path: string,
    payload?: P
  ): Promise<R>;
  createContext(ns?: string): T;
  createHandler(
    path: string,
    fn: MiddlewareFn<T>,
    thisArg?: any
  ): (ctx: T, next: () => void) => any;
}

export declare interface LayerContext<P extends Payload = Payload> {
  [key: string]: any;
  ns: string;
  path: string;
  payload: P;
}

export declare const mapStore: (
  store: StoreMap | StoreMap[],
  exportNS?: boolean
) => import('vue/types/options').Accessors<
  import('vue/types/options').DefaultComputed
>;

declare type MiddlewareFn<T = any> = (context: T, next: () => void) => any;

export declare class Model extends Layer<ModelContext> {
  parent?: Model;
  submodel: {
    [key: string]: Model;
  };
  mixins: ComponentOptions<Vue_2>[];
  data: {
    [key: string]: any;
  };
  computed: {
    [key: string]: () => any;
  };
  watch: {
    [key: string]: () => any;
  };
  events: {
    [key: string]: (() => any)[];
  };
  store?: Vue_2;
  d: {
    [key: string]: any;
  };
  constructor(ns?: string);
  get(key: string | number): any;
  set(key: string | number, val: any): void;
  get root(): Model;
  initialized(): boolean;
  mount(key: string, model: Model): this | undefined;
  model(key?: string): Model;
  up(): Model;
  provide<Data, Computed, Methods, Props>(
    key: string | ModelDefines<Data, Computed, Methods, Props>,
    val?: any
  ): this;
  hook(key: string, fn: () => any): this;
  subscribe(key: string, fn: () => void): this;
  broadcast(event: string, ...args: any[]): this;
  getModel(ns?: string): any;
  getStore(ns?: string): Vue_2 | undefined;
  setNS(ns?: string): void;
  setParent(parent?: Model): void;
  genNS(key?: string): string;
  genVM(parent?: Vue_2): Vue_2;
  init(): this;
  destroy(): void;
  createContext(): ModelContext;
}

export declare interface ModelContext extends LayerContext {
  model: Model;
  store: Vue_2;
  getModel: (ns: string) => Model | undefined;
  getStore: (ns: string) => Vue_2 | undefined;
  get: (key: any) => any;
  set: (key: any, val: any) => void;
}

export declare type ModelDefines<
  Data = any,
  Computed = any,
  Methods = any,
  Props = any
> = ThisTypedComponentOptionsWithRecordProps<
  Vue_2 & ModelInjection,
  Data,
  Methods,
  Computed,
  Props
> & {
  middleware?: {
    [key: string]: MiddlewareFn<ModelContext>;
  };
  subscribe?: {
    [key: string]: () => any;
  };
};

export declare type ModelInjection = {
  $kom: Model;
  $model: Model;
  $store: Vue_2;
  $getModel: Model['getModel'];
  $getStore: Model['getStore'];
  $dispatch: Model['dispatch'];
  $broadcast: Model['broadcast'];
  $subscribe: Model['subscribe'];
};

declare type ObjectState = {
  [key: string]: string | ((store: Vue_2) => any);
};

export declare interface Payload {
  [key: string]: any;
}

export declare const resolvePath: (...args: string[]) => string;

export declare const SEPARATOR = '/';

declare type StoreMap = {
  ns?: string;
  state: ObjectState | ArrayState;
};

export {};
