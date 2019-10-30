<template>
  <div class="swiper swiper-container">
    <div class="swiper-wrapper">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper';

export const Orientation = {
  Horizontal: 0,
  Vertical: 1,
  Min: 0,
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

  data() {
    return {
      swiper: null,
    };
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

  created() {

  },

  mounted() {
    const swiper = new Swiper('.swiper-container');
    this.swiper = swiper;
  },
};
</script>

<style lang="scss">
@import './swiper.scss';
.swiper {
  width: 100%;
  height: 100%;
}
</style>
