<template>
  <div class="list-item">
    <slot></slot>
  </div>
</template>

<script>
export default {
  inject: ['ListView'],

  props: {
    index: {
      type: Number,
      required: true,
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
    // console.debug('item created', this.index);
  },

  destroyed() {
    // console.debug('item destroyed', this.index);
  },

  mounted() {
    // console.debug('item mounted', this.index);
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
