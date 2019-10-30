import Vue from 'vue';

type GroupData = {
  checkState: boolean;
  checkedItem: Vue | null;
  items: Array<Vue>;
};

export function createGroup(name: string) {
  return Vue.extend({
    provide(): Object {
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

    data(): GroupData {
      return {
        checkState: false,
        checkedItem: null,
        items: [],
      };
    },

    watch: {
      exclusive(val) {
        if (!val) this.checkedItem = null;
      },
    },

    methods: {
      onItemChecked(item: Vue, checked: boolean) {
        if (this.exclusive) {
          if (checked) {
            this.checkedItem = item;
            this.items.forEach((i: Vue) => {
              if (i === item) return;
              (i as any).checked = false;
              i.$emit('change', false);
            });
          } else if (this.checkedItem === item) {
            this.checkedItem = null;
          }
        }
        // console.log('onItemChecked', this.items, this.checkedItem);
      },
      registerItem(item: Vue) {
        this.items.push(item);
        item.$watch('checked', val => this.onItemChecked(item, val));
      },
      unregisterItem(item: Vue) {
        const index = this.items.indexOf(item);
        this.items.splice(index, 1);
      },
    },
  });
}
