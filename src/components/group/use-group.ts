import Vue from 'vue';
import { ModelOptions, useModel, DEFAULT_PROP } from './use-model';

export enum CheckState {
  Unchecked = 1,
  PartiallyChecked = 2,
  Checked = 3,
}

export function useGroup(name: string, options?: ModelOptions) {
  const modelProp = (options && options.prop) || DEFAULT_PROP;
  return useModel('checkedItem', options).extend({
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
        checkedItem: [] as Array<any>,
        items: [] as Array<any>,
      };
    },

    computed: {
      // This property holds whether the checkbox is a tri-state checkbox.
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
      checkedItem(val: Array<any>[]) {
        const count = val.length;
        this.checkState = count === 0
          ? CheckState.Unchecked
          : count === this.items.length
            ? CheckState.Checked
            : CheckState.PartiallyChecked;
      },
      [modelProp](val: Array<any>[]) {
        this.items.forEach((item: any) => {
          if (val.includes(item.value)) {
            item.checked = true;
          }
        });
      },
    },

    methods: {
      onItemChecked(item: Vue, checked: boolean) {
        const { value } = item as any;
        if (this.exclusive) {
          if (checked) {
            this.checkedItem = [value];
            this.items.forEach((i: Vue) => {
              if (i === item) return;
              (i as any).checked = false;
            });
          } else if (this.checkedItem[0] === value) {
            this.checkedItem = [];
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
      registerItem(item: Vue) {
        const index = this.items.push(item);
        item.$watch('checked', val => this.onItemChecked(item, val));
        return index;
      },
      unregisterItem(item: Vue) {
        const index = this.items.indexOf(item);
        this.items.splice(index, 1);
      },
    },

    mounted() {
    },
  });
}
