import { createMixins } from '@/utils/mixins';

export interface ModelOptions {
  prop?: string,
  event?: string,
  watch?: object,
}

export const DEFAULT_PROP = 'value';
export const DEFAULT_EVENT = 'change';

export function useModel<
  T extends unknown = any,
  ProxyName extends string = string,
>(proxy: ProxyName, options?: ModelOptions) {
  const {
    prop = DEFAULT_PROP,
    event = DEFAULT_EVENT,
    watch,
  } = options || {};

  return createMixins({
    model : { prop, event },

    props : {
      [prop] : null as any,
    },

    data() {
      return {
        [proxy] : this[prop] as T,
      } as Record<ProxyName, T>;
    },

    watch : {
      [prop](val: any) {
        this[proxy] = val;
      },
      [proxy](val: any) {
        val !== this[prop] && this.$emit(event, val);
      },
      ...watch,
    },
  });
}
