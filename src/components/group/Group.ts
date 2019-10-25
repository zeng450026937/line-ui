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

            this.items.forEach((i: Vue) => {
              if (i === item) return;
              (i as any).checked = false;
            });
          } else if (this.checkedItem === item) {
            this.checkedItem = null;
          }
        }
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
