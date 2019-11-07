import Vue from 'vue';
import { ModelOptions, useModel, DEFAULT_PROP } from './use-model';

export enum CheckState {
  Unchecked = 1,
  PartiallyChecked = 2,
  Checked = 3,
}

export function useGroup(name: string, options?: ModelOptions) {
  const modelProp = (options && options.prop) || DEFAULT_PROP;
  return useModel<any>('checkedItem', options).extend({
    provide() {
      return {
        [name]: this,
      };
    },

    props: {
      exclusive: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        // This property holds the check state of the checkbox.
        checkState: CheckState.Unchecked,
        // checkedItem: [] as Array<any>,
        items: [] as Array<any>,
      };
    },

    computed: {
      // This property holds whether the checkbox is a tri-state checkbox.
      // TODO
      // remove it
      tristate(): boolean {
        return this.checkState === CheckState.PartiallyChecked;
      },
    },

    watch: {
      exclusive(val) {
        if (!val) return;
        if (this.checkedItem.length > 1) {
          const [first] = this.checkedItem;
          this.checkedItem = [first];
        }
      },
      checkedItem(val: any) {
        const count = val.length;
        this.checkState = count === 0
          ? CheckState.Unchecked
          : count === this.items.length
            ? CheckState.Checked
            : CheckState.PartiallyChecked;
      },
      [modelProp](val: any) {
        this.items.forEach((item: any) => {
          if (Array.isArray(val)) {
            item.checked = val.includes(item.value);
          } else {
            item.checked = item.value === val;
          }
        });
      },
    },

    methods: {
      onItemChecked(item: any, checked: boolean) {
        const { value } = item;
        if (this.exclusive) {
          if (checked) {
            this.checkedItem = value;
            this.items.forEach((i: any) => {
              if (i === item) return;
              i.checked = false;
            });
          } else if (this.checkedItem === value) {
            this.checkedItem = '';
          }
        } else {
          this.checkedItem = this.checkedItem || [];
          const index = this.checkedItem.indexOf(value);
          if (checked && index === -1) {
            this.checkedItem.push(value);
          } else if (!checked && index !== -1) {
            this.checkedItem.splice(index, 1);
          }
        }
      },
      registerItem(item: any) {
        const index = this.items.push(item);
        item.$watch('checked', (val: boolean) => this.onItemChecked(item, val));
        return index;
      },
      unregisterItem(item: any) {
        const index = this.items.indexOf(item);
        this.items.splice(index, 1);
      },
    },

    mounted() {
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
