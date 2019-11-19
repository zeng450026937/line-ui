/* eslint-disable-next-line import/extensions */
import { Vue } from 'vue/types/vue';
import { createMixins } from '@/utils/mixins';
import { useModel, ModelOptions } from '@/mixins/use-model';
import { mergeListener } from '@/utils/vnode';

const NullGroup = {
  registerItem() {},
  unregisterItem() {},
};

export type GroupItemProps = {
  checkable: boolean;
  value: any;
  [K: string]: any
};
export type GroupItem<T = GroupItemProps> = Vue & T;

export type GroupItemOptions = ModelOptions & {
  autoCheck?: boolean;
};

export function useGroupItem(name: string, options?: GroupItemOptions) {
  const { autoCheck = true } = options || {};
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
      const group = this[name];
      if (group) {
        group.registerItem(this);
      }
    },

    beforeDestroy() {
      const group = this[name];
      if (group) {
        group.unregisterItem(this);
      }
    },

    // TODO: need discussion
    afterRender(vnode) {
      if (!autoCheck) return;
      // Inject click listener
      const on = {
        click : this.toggle,
      };
      vnode.data!.on = mergeListener(on, vnode.data!.on || {});
    },
  });
}
