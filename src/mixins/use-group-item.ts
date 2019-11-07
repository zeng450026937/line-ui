import Vue from 'vue';
import { ModelOptions, useModel } from './use-model';

const NullGroup = {
  registerItem() {},
  unregisterItem() {},
};

export function useGroupItem(name: string, options?: ModelOptions) {
  return useModel<boolean>('checked', options).extend({
    inject: {
      [name]: {
        default: NullGroup,
      },
    },

    props: {
      checkable: {
        type: Boolean,
        default: true,
      },
      value: null as any,
    },

    data() {
      return {
        checked: false,
      };
    },

    methods: {
      toggle() {
        if (this.checkable) {
          this.checked = !this.checked;
        }
      },
    },

    created() {
      const group = (this as any)[name];
      if (group) {
        group.registerItem(this);
      }
    },

    beforeDestroy() {
      const group = (this as any)[name];
      if (group) {
        group.unregisterItem(this);
      }
    },
  });
}
