/* eslint-disable import/extensions */
import Vue from 'vue';
import {
  ComponentOptions,
  ThisTypedComponentOptionsWithRecordProps,
} from 'vue/types/options';
import { Layer, LayerContext, SEPARATOR } from './layer';
import { MiddlewareFn } from './compose';

/* eslint-disable-next-line prefer-destructuring */
export const nextTick = Vue.nextTick;

let hasStrategies: boolean | undefined;

function setupStrategies() {
  const strategies = Vue.config.optionMergeStrategies;
  strategies.middleware = strategies.methods;
  strategies.subscribe = strategies.methods;
}

export interface ModelContext extends LayerContext {
  model: Model;
  store: Vue;
  getModel: (ns: string) => Model | undefined;
  getStore: (ns: string) => Vue | undefined;
  get: (key: any) => any;
  set: (key: any, val: any) => void;
}

export type ModelMiddlewareFn<
  T extends ModelContext = ModelContext
> = MiddlewareFn<T>;

export type ModelInjection = {
  $kom: Model;
  $model: Model;
  $store: Vue;
  $getModel: Model['getModel'];
  $getStore: Model['getStore'];
  $dispatch: Model['dispatch'];
  $broadcast: Model['broadcast'];
  $subscribe: Model['subscribe'];
};

export type ModelDefines<
  Data = any,
  Computed = any,
  Methods = any,
  Props = any
> = ThisTypedComponentOptionsWithRecordProps<
  Vue & ModelInjection,
  Data,
  Methods,
  Computed,
  Props
> & {
  middleware?: { [key: string]: MiddlewareFn<ModelContext> };
  subscribe?: { [key: string]: () => any };
};

export class Model extends Layer<ModelContext> {
  parent?: Model;
  submodel: { [key: string]: Model };

  mixins: ComponentOptions<Vue>[];
  data: { [key: string]: any };
  computed: { [key: string]: () => any };
  watch: { [key: string]: () => any };
  events: { [key: string]: (() => any)[] };

  store?: Vue;
  options?: object;

  d: { [key: string]: any };

  constructor(ns?: string) {
    super(ns);

    this.submodel = {};
    this.mixins = [];
    this.data = {};
    this.computed = {};
    this.watch = {};
    this.events = {};

    this.d = {};

    if (!hasStrategies) {
      setupStrategies();
      hasStrategies = true;
    }
  }

  get(key: string | number) {
    return this.d[key];
  }

  set(key: string | number, val: any) {
    this.d[key] = val;
  }

  get root(): Model {
    return this.parent ? this.parent.root : this;
  }

  initialized(): boolean {
    return !!this.store;
  }

  mount(key: string, model: Model) {
    if (__DEV__ && this.submodel[key]) {
      console.warn(`redefinition model: ${key}`);
    }
    model.setNS(key);
    this.submodel[key] = model;
    return this;
  }

  model(key?: string, val?: Model) {
    if (!key) return this;

    let model = this.submodel[key];

    if (__DEV__ && model && val) {
      console.warn(`model: ${key} was previously definded`);
      return model;
    }

    if (!model) {
      model = val || new Model();
      model.setNS(key);
      model.setParent(this);
      this.submodel[key] = model;
    }

    return model;
  }

  up(): Model {
    return this.parent || this;
  }

  provide<Data, Computed, Methods, Props>(
    key: string | ModelDefines<Data, Computed, Methods, Props>,
    val?: any
  ) {
    if (key && !val) {
      this.mixins.push(key as ComponentOptions<Vue>);
      key = '';
    }

    if (!key) return this;

    if (__DEV__ && this.computed![key as string]) {
      console.warn(`redefinition key: ${key}`);
    }

    if (typeof val === 'function') {
      this.computed[key as string] = val;
    } else {
      this.data[key as string] = val;
    }

    return this;
  }

  hook(key: string, fn: () => any) {
    if (this.initialized()) {
      this.store!.$watch(key as any, fn);
      return this;
    }
    this.watch[key] = fn;
    return this;
  }

  subscribe(key: string, fn: () => void) {
    if (this.initialized()) {
      this.store!.$root.$on(key, fn);
      return this;
    }

    this.events[key] = this.events[key] || [];
    this.events[key].push(fn);

    return this;
  }

  broadcast(event: string, ...args: any[]) {
    if (this.initialized()) {
      this.store!.$root.$emit(event, ...args);
      return this;
    }
    if (__DEV__) {
      console.warn('broadcast() can only be used when initialized');
    }
    return this;
  }

  getModel(ns?: string): Model {
    return ns ? chainget(ns, this, (m) => m.submodel) : this;
  }

  getStore(ns?: string): Vue | undefined {
    if (__DEV__ && !this.initialized()) {
      console.warn('getStore() can only be used when initialized');
      return;
    }
    const { store } = this;
    return ns ? chainget(ns, store) : store;
  }

  setNS(ns: string = '') {
    this.ns = ns;
  }

  setParent(parent?: Model) {
    this.parent = parent;
  }

  genVM(parent?: Vue): Vue {
    const model = this;

    return new Vue({
      ...this.options,

      parent,
      mixins: this.mixins,
      data: this.data,
      computed: this.computed,
      watch: this.watch,

      beforeCreate() {
        this.$kom = model.root;
        this.$model = model;
        this.$store = model.store!;
        this.$getModel = model.getModel.bind(model.root);
        this.$getStore = model.getStore.bind(model.root);
        this.$dispatch = model.dispatch.bind(model.root);
        this.$broadcast = model.broadcast.bind(model);
        this.$subscribe = model.subscribe.bind(model);
      },
    });
  }

  init(options?: object) {
    if (this.initialized()) return this;

    this.options = options;

    const submodels = Object.keys(this.submodel);

    submodels.forEach((key) => {
      // submodel placeholder
      this.data[key] = {};
    });

    this.store = this.genVM(this.parent && this.parent.store);

    const { middleware, subscribe } = this.store.$options as {
      middleware: ComponentOptions<Vue>['methods'];
      subscribe: ComponentOptions<Vue>['methods'];
    };

    if (middleware) {
      keys(middleware).forEach((name) =>
        this.use(name as string, middleware[name], this.store)
      );
    }
    if (subscribe) {
      keys(subscribe).forEach((name) =>
        this.subscribe(name as string, subscribe[name])
      );
    }

    keys(this.events).forEach((name) => {
      this.events[name].forEach((fn) => this.subscribe(name as string, fn));
    });

    // fill submodel placeholder
    submodels.forEach((key) => {
      const m = this.submodel[key];
      m.init();

      this.use(m.callback());
      this.data[key] = m.store;
    });

    return this;
  }

  destroy() {
    if (!this.initialized()) return;

    Object.keys(this.submodel).forEach((key) => this.submodel[key].destroy());

    this.store!.$destroy();
  }

  createContext() {
    const context = super.createContext();

    context.model = this;
    context.store = this.store!;
    context.getModel = this.getModel.bind(this);
    context.getStore = this.getStore.bind(this);
    context.get = this.get.bind(this);
    context.set = this.set.bind(this);

    return context;
  }
}

export const keys = <T extends Record<string, any>>(o: T) => {
  return Object.keys(o) as (keyof T)[];
};

export const chainget = (
  ns: string,
  delegate: any,
  getter?: (delegate: any, key: string) => any
) => {
  return ns.split(SEPARATOR).reduce((acc, key) => {
    if (getter) {
      acc = getter(acc, key);
    }
    if (acc) {
      return acc[key];
    }
    return false;
  }, delegate);
};
