<template>
  <div class="list-item">
    <dynamic-node
      v-if="cachedNode"
      :vnode="cachedNode"
    ></dynamic-node>
    <slot
      v-else
      name="default" v-bind="item"
    ></slot>
  </div>
</template>

<script>
import { DynamicNode } from '@/components/functional';

export default {
  name: 'ListItem',

  components: {
    DynamicNode,
  },

  inject: ['ListView'],

  props: {
    index: {
      type: Number,
      required: true,
    },
    item: {
      type: [
        String, Number, Boolean, Array, Object, Date, Function, Symbol,
      ],
      default: () => ({}),
    },
  },

  watch: {
    item() {
      this.cachedNode = null;
    },
  },

  methods: {
    onLayoutChanged() {
      const { itemLayoutAtIndex, mapToItemIndex } = this.ListView;
      const item = itemLayoutAtIndex(mapToItemIndex(this.index));
      this.offsetWidth = item.geometry.width;
      this.offsetHeight = item.geometry.height;
    
      const { offsetWidth, offsetHeight } = this.$el;
      const { onLayout, horizontal, vertical } = this.ListView;
      if ((this.offsetWidth !== offsetWidth && horizontal)
      || (this.offsetHeight !== offsetHeight && vertical)) {
        this.offsetWidth = offsetWidth;
        this.offsetHeight = offsetHeight;
        onLayout(mapToItemIndex(this.index), this.offsetWidth, this.offsetHeight);
      }
    },
  },

  created() {
    this.cachedItem = this.item;
    this.cachedNode = null;
    // console.debug('item created', this.index);
  },

  destroyed() {
    // console.debug('item destroyed', this.index);
  },

  mounted() {
    // console.debug('item mounted', this.index);
    /* eslint-disable-next-line */
    this.cachedNode = this._vnode.children;
    this.onLayoutChanged();
  },

  updated() {
    // console.debug('item updated', this.index);
    this.onLayoutChanged();
  },
};
</script>

<style lang="scss">
.list-item {
  position: absolute;
}
</style>
