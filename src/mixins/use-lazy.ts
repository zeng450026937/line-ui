import Vue from 'vue';

export const DEFAULT_VALUE = 'value';

export function useLazy(value: string = DEFAULT_VALUE) {
  return Vue.extend({
    props : {
      [value] : null as any,
      lazy    : {
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
