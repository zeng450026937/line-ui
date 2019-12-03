/* eslint-disable-next-line import/extensions */
import { Vue } from 'vue/types/vue';
import { createMixins } from '@/utils/mixins';
import { ModelOptions, useModel, DEFAULT_PROP } from '@/mixins/use-model';
import { GroupItem } from '@/mixins/use-group-item';
import { isArray } from '@/utils/helpers';

export enum CheckState {
  Unchecked = 1,
  PartiallyChecked = 2,
  Checked = 3,
}

export type GroupProps = {
  exclusive: boolean;
  checkState: CheckState;
  checkedItem: any;
  items: Array<any>;
  [K: string]: any;
};
export type Group<T = GroupProps> = Vue & T;

export type GroupOptions = ModelOptions & {};

export function useGroup(name: string, options?: GroupOptions) {
  const modelProp = (options && options.prop) || DEFAULT_PROP;
  return createMixins({
    mixins : [useModel('checkedItem', options)],

    provide() {
      return {
        [name] : this,
      };
    },

    props : {
      exclusive : {
        type    : Boolean,
        default : false,
      },
    },

    data() {
      return {
        // This property holds the check state of the checkbox.
        checkState : CheckState.Unchecked,
        // checkedItem : [] as Array<any>,
        items      : [] as Array<any>,
      };
    },

    computed : {
      // This property holds whether the checkbox is a tri-state checkbox.
      // TODO
      // remove it
      tristate(): boolean {
        return this.checkState === CheckState.PartiallyChecked;
      },
    },

    watch : {
      exclusive(val) {
        if (!val) return;
        if (this.checkedItem.length > 1) {
          const [first] = this.checkedItem;
          this.checkedItem = [first];
        }
      },
      checkedItem(val: any) {
        const count = isArray(val) ? val.length : 1;
        this.checkState = count === 0
          ? CheckState.Unchecked
          : count === this.items.length
            ? CheckState.Checked
            : CheckState.PartiallyChecked;
      },
      [modelProp](val: any) {
        this.items.forEach((item: any) => {
          if (Array.isArray(val)) {
            item.checked = val.includes(item.modelValue);
          } else {
            item.checked = item.modelValue === val;
          }
        });
      },
    },

    methods : {
      onItemChecked(item: GroupItem, checked: boolean) {
        const { modelValue } = item;
        if (this.exclusive) {
          if (checked) {
            this.checkedItem = modelValue;
            this.items.forEach((i: any) => {
              if (i === item) return;
              i.checked = false;
            });
          } else if (this.checkedItem === modelValue) {
            this.checkedItem = null;
          }
        } else {
          this.checkedItem = this.checkedItem || [];
          const index = this.checkedItem.indexOf(modelValue);
          if (checked && index === -1) {
            this.checkedItem.push(modelValue);
          } else if (!checked && index !== -1) {
            this.checkedItem.splice(index, 1);
          }
        }
      },
      registerItem(item: GroupItem) {
        const index = this.items.push(item);
        item.$watch('checked', (val: boolean) => this.onItemChecked(item, val));
        item.$on('clicked', () => this.$emit('clicked', item));
        item.$on('toggled', () => this.$emit('toggled', item));
        return index;
      },
      unregisterItem(item: GroupItem) {
        const index = this.items.indexOf(item);
        this.items.splice(index, 1);
      },
    },

    mounted() {
      if (!this.checkedItem) return;

      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        if (Array.isArray(this.checkedItem)) {
          item.checked = this.checkedItem.includes(item.value);
        } else if (item.value === this.checkedItem) {
          item.checked = true;
          break;
        }
      }
    },
  });
}
