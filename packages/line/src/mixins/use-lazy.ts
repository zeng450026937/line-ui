import { createMixins } from '@line-ui/line/src/utils/mixins';

const DEFAULT_VALUE = 'value';

export function useLazy(value: string = DEFAULT_VALUE) {
  return createMixins({
    props : {
      lazy : {
        type    : Boolean,
        default : true,
      },
    },

    data() {
      return {
        inited : !!this[value],
      };
    },

    watch : {
      [value]() {
        this.inited = this.inited || !!this[value];
      },
    },

    shouldRender(): boolean {
      return this.inited || !this.lazy;
    },
  });
}
