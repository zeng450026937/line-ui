/* eslint-disable-next-line import/extensions */
import { Vue } from 'vue/types/vue';
import { createMixins } from '@line-ui/line/src/utils/mixins';
import { useGroup } from '@line-ui/line/src/mixins/use-group';
import { ModelOptions, useModel } from '@line-ui/line/src/mixins/use-model';
import { isArray, isDef } from '@line-ui/line/src/utils/helpers';

export type CheckGroupProps = {
  exclusive: boolean;
  checkedItem: any;
  items: Array<any>;
};
export type CheckGroupMixin = Vue & CheckGroupProps;

export function useCheckGroup(name: string) {
  return createMixins({
    mixins: [useGroup(name)],

    props: {
      exclusive: Boolean,
    },

    data() {
      return {
        // TODO:
        // Vue 3
        // Use Set() instead of Array()
        checkedItem: [] as any,
      };
    },

    watch: {
      exclusive(val) {
        if (!val) return;
        if (this.checkedItem.length > 1) {
          const [first] = this.checkedItem;
          this.checkedItem = [first];
        }
      },
    },

    beforeMount() {
      const onItemChecked = (item: Vue, checked: boolean) => {
        this.$emit('item:checked', item, !!checked);
        if (this.exclusive) {
          if (checked) {
            this.checkedItem = item;
            this.items.forEach((i: any) => {
              if (i === item) return;
              i.checked = false;
            });
          } else if (this.checkedItem === item) {
            this.checkedItem = null;
          }
        } else {
          this.checkedItem = this.checkedItem || [];
          const index = this.checkedItem.indexOf(item);
          if (checked && index === -1) {
            this.checkedItem.push(item);
          } else if (!checked && index !== -1) {
            this.checkedItem.splice(index, 1);
          }
        }
      };

      this.$on('item:register', (item: Vue) => {
        item.$watch(
          'checked',
          async (val: boolean, oldVal: any) => {
            // false & undifined & null are all falsy value
            // ignore it
            if (!!oldVal === val) return;
            if (!this.exclusive) {
              // handle check in next tick
              // so checkedItem changes will fire only once if
              // multiple items are changed
              await this.$nextTick();
            }
            onItemChecked(item, val);
          },
          { immediate: true }
        );
      });
    },
  });
}

export function getItemValue(item: any) {
  const { modelValue, itemIndex } = item;
  return isDef(modelValue) ? modelValue : itemIndex;
}

export function useCheckGroupWithModel(name: string, options?: ModelOptions) {
  return createMixins({
    mixins: [useCheckGroup(name), useModel('checkedItemValue', options, true)],

    computed: {
      checkedItemValue: {
        get() {
          const { checkedItem } = this;
          return isArray(checkedItem)
            ? checkedItem.map((item) => getItemValue(item))
            : checkedItem && getItemValue(checkedItem);
        },
        async set(val) {
          if (!val) return;
          // ensure item are all registered
          await this.$nextTick();
          // TODO
          // may has perf impact if we have lots of items
          this.items.forEach((item: any) => {
            if (Array.isArray(val)) {
              item.checked = val.includes(getItemValue(item));
            } else {
              item.checked = getItemValue(item) === val;
            }
          });
        },
      },
    },
  });
}
