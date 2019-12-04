/* eslint-disable-next-line import/extensions */
import { Vue } from 'vue/types/vue';
import { createMixins } from '@/utils/mixins';
import { useModel, ModelOptions } from '@/mixins/use-model';
import { mergeListener } from '@/utils/vnode';
import { isDef } from '@/utils/helpers';

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
  // Uncheckable by click
  uncheckable?: boolean;
  model?: boolean;
};

export function useGroupItem(name: string, options?: GroupItemOptions) {
  const {
    autoCheck = true,
    uncheckable = true,
    model: hasModel = true,
  } = options || {};
  return createMixins({
    mixins : hasModel && [useModel<boolean>('checked', options)] as any,

    inject : {
      [name] : {
        default : undefined,
      },
    },

    props : {
      checkable : {
        type    : Boolean,
        default : true,
      },
      disabled   : Boolean,
      modelValue : null as any,
    },

    data() {
      return {
        checked : false,
      };
    },

    methods : {
      toggle() {
        if (this.disabled) return;
        this.$emit('clicked');
        if (!uncheckable && this.checked) return;
        if (!this.checkable) return;
        this.checked = !this.checked;
        this.$emit('toggled', this.checked);
      },
    },

    created() {
      const group = this[name];
      if (group) {
        group.registerItem(this);
        this.inGroup = true;
        this.inParentGroup = group === this.$parent;
      }
    },

    beforeMount() {
      this.checked = this.checked || (
        isDef(this.$attrs.checked)
          && (this.$attrs.checked as string | boolean) !== false
      );
    },

    beforeDestroy() {
      const group = this[name];
      if (group) {
        group.unregisterItem(this);
      }
    },

    afterRender(vnode) {
      if (!autoCheck) return;
      // Inject click listener
      const on = {
        click : this.toggle,
      };
      vnode.data!.on = mergeListener(on, vnode.data!.on);
    },
  });
}
