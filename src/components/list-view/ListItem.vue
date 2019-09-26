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
      const { offsetWidth, offsetHeight } = this.$el;
      const { onLayout, horizontal, vertical } = this.ListView;
      if ((this.offsetWidth !== offsetWidth && horizontal)
      || (this.offsetHeight !== offsetHeight && vertical)) {
        this.offsetWidth = offsetWidth;
        this.offsetHeight = offsetHeight;
        onLayout(this.index, this.offsetWidth, this.offsetHeight);
      }
    },
  },

  created() {
    const { itemLayoutAtIndex } = this.ListView;
    const item = itemLayoutAtIndex(this.index);
    this.offsetWidth = item.geometry.width;
    this.offsetHeight = item.geometry.height;
  },

  async mounted() {
    this.onLayoutChanged();
  },

  updated() {
    this.onLayoutChanged();
  },
};
</script>

<style lang="scss">
.list-item {
  position: absolute;
}
</style>
