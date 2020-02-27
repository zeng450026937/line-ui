/* eslint-disable-next-line import/extensions */
import { Vue } from 'vue/types/vue';
import { createMixins } from 'skyline/utils/mixins';
import { useGroupItem } from 'skyline/mixins/use-group-item';
import { ModelOptions, useModel } from 'skyline/mixins/use-model';
import { isDef } from 'skyline/utils/helpers';

export type CheckItemProps = {
  checkable: boolean;
  checked: boolean;
  disabled: boolean;
};
export type CheckItem = Vue & CheckItemProps;

export function useCheckItem(name: string) {
  return createMixins({
    mixins : [useGroupItem(name)],

    props : {
      checkable : {
        type    : Boolean,
        default : true,
      },
      disabled : Boolean,
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
        if (!this.checkable) return;
        this.checked = !this.checked;
        this.$emit('toggled', this.checked);
      },
    },

    beforeMount() {
      this.checked = this.checked || (
        isDef(this.$attrs.checked)
          && (this.$attrs.checked as string | boolean) !== false
      );
    },
  });
}

export function useCheckItemWithModel(name: string, options?: ModelOptions) {
  return createMixins({
    mixins : [
      useCheckItem(name),
      useModel('checked', options),
    ],

    props : {
      modelValue : null as any,
    },
  });
}
