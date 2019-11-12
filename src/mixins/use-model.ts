import Vue from 'vue';

export interface ModelOptions {
  prop?: string,
  event?: string,
  watch?: object,
}

export const DEFAULT_PROP = 'value';
export const DEFAULT_EVENT = 'change';

export function useModel<T extends unknown>(proxy: string, options?: ModelOptions) {
  const {
    prop = DEFAULT_PROP,
    event = DEFAULT_EVENT,
    watch,
  } = options || {};

  return Vue.extend({
    model : { prop, event },

    props : {
      [prop] : null as any,
    },

    data() {
      return {
        [proxy] : this[prop] as T,
      };
    },

    watch : {
      [prop](val: any) {
        this[proxy] = val;
      },
      [proxy](val: any) {
        val !== this[prop] && (this as any).$emit(event, val);
      },
      ...watch,
    },
  });
}
