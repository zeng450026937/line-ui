<template>
  <div class="stack-view">
  </div>
</template>

<script>
export const Enum = {
  Inactive: 0,
  Deactivating: 1,
  Activating: 2,
  Active: 3,
};

export default {
  name: 'StackView',

  props: {
    initialItem: {
      type: Object,
      default: () => ({}),
    },
    popEnter: {
      type: String,
      default: () => ({}),
    },
    popExit: {
      type: Object,
      default: () => ({}),
    },
    pushEnter: {
      type: Object,
      default: () => ({}),
    },
    pushExit: {
      type: Object,
      default: () => ({}),
    },
    replaceEnter: {
      type: Object,
      default: () => ({}),
    },
    replaceExit: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    busy() {
      return false;
    },
    currentItem() {
      return {};
    },
    depth() {
      return 0;
    },
    empty() {
      return true;
    },
  },

  provide() {
    return {
      StackView: {
        index: this.index,
        status: this.status,
        view: this.view,
        visible: this.visible,
      },
    };
  },

  methods: {
    clear() {},
    find() {},
    get() {},
    pop() {},
    push() {},
    replace() {},
  },

  created() {
    this.$emit('activated');
    this.$emit('activating');
    this.$emit('deactivated');
    this.$emit('deactivating');
    this.$emit('removed');
  },
};
</script>

<style lang="scss">

</style>
