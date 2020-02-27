/* eslint-disable-next-line import/extensions */
import { Vue } from 'vue/types/vue';
import { createMixins } from 'skyline/utils/mixins';

export function useGroup(name: string) {
  return createMixins({
    provide(): any {
      return {
        [name] : this,
      };
    },

    data() {
      return {
        items : [] as Array<any>,
      };
    },

    methods : {
      registerItem(item: Vue) {
        this.$nextTick().then(() => this.$emit('item:register', item));
        return this.items.push(item);
      },
      unregisterItem(item: Vue) {
        this.$nextTick().then(() => this.$emit('item:unregister', item));
        this.items.splice(this.items.indexOf(item), 1);
      },
    },
  });
}

export type Group = Vue & {
  registerItem(item: Vue): number;
  unregisterItem(item: Vue): void;
};
