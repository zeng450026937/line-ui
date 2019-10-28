import Vue from 'vue';

const NullGroup = {
  register() {},
  unregister() {},
};

export function createGroupItem(name: string) {
  function isGroupAvailable(item: Vue) {
    const group = (item as any)[name];
    return group && item.$parent === group;
  }

  return Vue.extend({
    inject: {
      [name]: {
        default: NullGroup,
      },
    },

    model: {
      prop: 'checked',
      event: 'change',
    },

    props: {
      checkable: {
        type: Boolean,
        default: true,
      },
      checked: {
        type: Boolean,
        default: false,
      },
    },

    methods: {
      toggle() {
        if (this.checkable) {
          this.$emit('change', !this.checked);
        }
      },
    },

    created() {
      const group = (this as any)[name];
      if (isGroupAvailable(this)) {
        group.register(this, this.$parent);
      }
    },

    beforeDestroy() {
      const group = (this as any)[name];
      if (isGroupAvailable(this)) {
        group.unregister(this, this.$parent);
      }
    },
  });
}
