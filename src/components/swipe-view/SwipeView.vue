<template>
  <div class="swipe-view">
  </div>
</template>

<script>
export const Orientation = {
  Min: 0,
  Horizontal: 0,
  Vertical: 1,
  Max: 1,
};

export default {
  name: 'SwipeView',

  props: {
    interactive: {
      type: Boolean,
      default: true,
    },
    orientation: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    horizontal() {
      return true;
    },
    vertical() {
      return true;
    },
  },

  provide() {
    return {
      SwipeView: {
        index: this.index,
        isCurrentItem: this.isCurrentItem,
        isNextItem: this.isNextItem,
        isPreviousItem: this.isPreviousItem,
        view: this,
      },
    };
  },
};
</script>

<style lang="scss">

</style>
