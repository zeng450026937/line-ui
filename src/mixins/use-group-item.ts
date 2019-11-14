/* eslint-disable-next-line import/extensions */
import { CombinedVueInstance, Vue } from 'vue/types/vue';
import { createMixins } from '@/utils/mixins';
import { ModelOptions, useModel } from '@/mixins/use-model';

const NullGroup = {
  registerItem() {},
  unregisterItem() {},
};

export type GroupItemProps = {
  checkable: boolean;
  modelValue: any;
};
export type GroupItem<T = GroupItemProps> = CombinedVueInstance<Vue, any, any, any, T>

export function useGroupItem(name: string, options?: ModelOptions) {
  return createMixins({
    mixins : [useModel<boolean>('checked', options)],

    inject : {
      [name] : {
        default : NullGroup,
      },
    },

    props : {
      checkable : {
        type    : Boolean,
        default : true,
      },
      modelValue : null as any,
    },

    data() {
      return {
        checked : false,
      };
    },

    methods : {
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
