import Vue from 'vue';

export function createGroup(name: string) {
  return Vue.extend({
    provide() {
      return {
        [name]: this,
      };
    },

    props: {
      exclusive: {
        type: Boolean,
        default: true,
      },
    },

    data() {
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
          } else if (this.checkedItem === item) {
            this.item = null;
          }

          this.items.forEach((i: Vue) => {
            if (i === item) return;
            (i as any).checked = false;
          });
        }
        console.log('onItemChecked', this.items, this.checkedItem);
      },
      register(item: Vue) {
        this.items.push(item);
        item.$watch('checked', val => this.onItemChecked(item, val));
      },
      unregister(item: Vue) {
        const index = this.items.indexOf(item);
        this.items.splice(index, 1);
      },
    },
  });
}
