/* eslint-disable-next-line import/extensions */
import { Vue } from 'vue/types/vue';
import { createMixins } from 'skyline/utils/mixins';
import { useGroup } from 'skyline/mixins/use-group';
import { useGroupItem } from 'skyline/mixins/use-group-item';
import { ModelOptions, useModel } from 'skyline/mixins/use-model';
import { isArray, isDef } from 'skyline/utils/helpers';

export const enum CheckState {
  // The checkbox is unchecked.
  Unchecked = -1,
  // The checkbox is partially checked. This state is only used when tristate is enabled.
  PartiallyChecked = 0,
  // The checkbox is checked.
  Checked = 1,
}

export type TreeItemProps = {
  checkState: CheckState;
};
export type TreeItem = TreeItemProps;

export function useTreeItem(name: string, options?: ModelOptions) {
  return createMixins({
    mixins : [
      useGroup(name),
      useGroupItem(name),
    ],

    props : {
      checkable : {
        type    : Boolean,
        default : true,
      },
      disabled : Boolean,
    },

    data() {
      return {
        // This property holds the check state of the checkbox.
        checkState  : CheckState.Unchecked,
        // TODO:
        // Vue 3
        // Use Set() instead of Array()
        checkedItem : [] as any,
        items       : [] as Array<any>,
      };
    },

    watch : {
      checkedItem(val: any) {
        const count = isArray(val)
          ? val.length
          : val
            ? 1
            : 0;
        this.checkState = count === 0
          ? CheckState.Unchecked
          : count === this.items.length
            ? CheckState.Checked
            : CheckState.PartiallyChecked;
      },

      checkState(val) {
        if (val === CheckState.Checked || val === CheckState.Unchecked) {
          this.items.forEach((item: any) => {
            item.checkState = val;
          });
        }
      },
    },

    created() {
      const onItemCheckState = (item: Vue, state: any) => {
        const index = this.checkedItem.indexOf(item);
        if (state === CheckState.Checked && index === -1) {
          this.checkedItem.push(item);
        } else if (state === CheckState.Unchecked && index !== -1) {
          this.checkedItem.splice(index, 1);
        }
      };

      this.$on('item:register', (item: Vue) => {
        item.$watch(
          'checkState',
          (val) => {
            onItemCheckState(item, val);
          },
          { immediate: true },
        );
      });
    },

    methods : {
      toggle() {
        if (this.disabled) return;
        this.$emit('clicked');
        if (!this.checkable) return;
        this.checkState = this.checkState === CheckState.Checked
          ? CheckState.Unchecked
          : CheckState.Checked;
        this.$emit('toggled', this.checkState);
      },
    },
  });
}

export function useTreeItemWithModel(name: string, options?: ModelOptions) {
  return createMixins({
    mixins : [
      useTreeItem(name),
      useModel('checkedItemValue', options, true),
    ],

    props : {
      modelValue : null as any,
    },

    computed : {
      checkedItemValue : {
        get() {
          return this.items.map((item: any) => item.checkedItemValue);
        },
        async set(val) {
          if (!val) return;
          // ensure item are all registered
          await this.$nextTick();
        },
      },
    },

    created() {
      this;
    },
  });
}
