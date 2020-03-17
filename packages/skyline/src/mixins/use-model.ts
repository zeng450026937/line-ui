import { createMixins } from 'skyline/src/utils/mixins';
import { isDef } from 'skyline/src/utils/helpers';

export interface ModelOptions {
  prop?: string;
  event?: string;
  default?: any;
}

const DEFAULT_PROP = 'value';
const DEFAULT_EVENT = 'change';

export function useModel<
  T extends unknown = any,
  ProxyName extends string = string,
>(proxy: ProxyName, options: ModelOptions = {}, defined = false) {
  const {
    prop = DEFAULT_PROP,
    event = DEFAULT_EVENT,
    default: defaultValue,
  } = options;
  return createMixins({
    model : { prop, event },

    props : {
      [prop] : {
        default : defaultValue,
      },
    },

    data() {
      return defined ? {} : {
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
    },

    created() {
      if (!isDef(this[prop])) return;
      this[proxy] = this[prop];
    },
  });
}
