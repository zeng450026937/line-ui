<template>
  <div class="stack-view">
    <div class="stack-view-delegate">
      <slot v-bind="initialItem"></slot>
    </div>
    <template v-for="(view, index) in views">
      <div class="stack-view-delegate" :key="index">
        <slot name="delegate" v-bind="view"></slot>
      </div>
    </template>
  </div>
</template>

<script>
export const Status = {
  Inactive: 0,
  Deactivating: 1,
  Activating: 2,
  Active: 3,
};

export const Operation = {
  Transition: 0,
  Immediate: 1,
  PushTransition: 2,
  ReplaceTransition: 3,
  PopTransition: 4,
};

export default {
  name: 'StackView',

  props: {
    initialItem: {
      type: Object,
      default: () => ({}),
    },
    popEnter: {
      type: Object,
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
      return this.views[this.views.length - 1];
    },
    depth() {
      return this.views.length;
    },
    empty() {
      return this.views.length === 0;
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

  data() {
    return {
      views: [],
    };
  },

  methods: {
    clear() {},
    find() {},
    get() {},
    pop(item) {
      if (item) {
        const index = this.views.indexOf(item);
        this.views = this.views.slice(0, index);
      } else {
        this.views.pop();
      }
    },
    push(item) {
      this.views.push(item);
    },
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

.stack-view {
  position: relative;
  // width: 100%;
  height: 300px;
  border: dotted 1px;

  &-delegate {
    position: absolute;
    width: 100%;
    height: 100%;
    border: dotted red 2px;
  }
}

</style>
