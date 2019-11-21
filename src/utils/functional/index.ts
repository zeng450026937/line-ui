import Vue, { RenderContext, VNodeData } from 'vue';
/* eslint-disable-next-line */
import { CombinedVueInstance } from 'vue/types/vue';

type ObjectIndex = Record<string, any>;

type Context = RenderContext & { data: VNodeData & ObjectIndex };

type InheritContext = Partial<VNodeData> & ObjectIndex;

const inheritKey = [
  'ref',
  'style',
  'class',
  'attrs',
  'nativeOn',
  'directives',
  'staticClass',
  'staticStyle',
];

const mapInheritKey: ObjectIndex = { nativeOn: 'on' };

// inherit partial context, map nativeOn to on
export function inherit(context: Context, inheritListeners?: boolean): InheritContext {
  const result = inheritKey.reduce(
    (obj, key) => {
      if (context.data[key]) {
        obj[mapInheritKey[key] || key] = context.data[key];
      }
      return obj;
    },
    {} as InheritContext,
  );

  if (inheritListeners) {
    result.on = result.on || {};
    Object.assign(result.on, context.data.on);
  }

  return result;
}

// emit event
export function emit(context: Context, eventName: string, ...args: any[]) {
  const listeners = context.listeners[eventName];
  if (listeners) {
    if (Array.isArray(listeners)) {
      listeners.forEach(listener => {
        listener(...args);
      });
    } else {
      listeners(...args);
    }
  }
}

// mount functional component
export function mount(Component: any, data?: VNodeData) {
  const instance = new Vue({
    el    : document.createElement('div'),
    props : Component.props,
    render(h) {
      return h(Component, {
        props : this.$props,
        ...data,
      });
    },
  });

  // document.body.appendChild(instance.$el);

  return instance;
}

// delegate functional component
export function createDelegate(Component: any) {
  function createData() {
    return Vue.observable({
      props : undefined,
      on    : undefined,
      style : undefined,
      class : undefined,
    });
  }

  let component: CombinedVueInstance<Vue, {}, {}, {}, {}> | null;
  let data = createData();

  return {
    get el() {
      return component && component.$el;
    },
    get component() {
      return component;
    },
    mount() {
      if (component) return;
      component = mount(Component, data);
    },
    on(val: object) {
      Vue.set(data, 'on', val);
      return this;
    },
    style(val: object) {
      Vue.set(data, 'style', val);
      return this;
    },
    class(val: object) {
      Vue.set(data, 'class', val);
      return this;
    },
    mounted() {
      return !!component;
    },
    destroy() {
      if (!component) return;
      component.$el.remove();
      component.$destroy();
      component = null;
      data = createData();
    },
  };
}
