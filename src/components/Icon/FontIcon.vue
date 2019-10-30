<template>
  <i :class="'font-icon icon'+ name"
     :style="{fontSize: size}">
  </i>
</template>

<script>
import AbstractIcon from './abstract-icon';

export default {
  name: 'FontIcon',

  extends: AbstractIcon,

  props: {
    size: {
      type: [Number, String],
      default: '16px',
    },
  },

  computed: {
    style() {
      let size = '16px';
      const sizes = {
        small: '16px',
        medium: '24px',
        large: '36px',
      };
      size = sizes[this.size] === undefined
        ? size = `${ this.size.toString().replace(/px/, '') }px` : size = sizes[this.size];

      return { fontSize: size };
    },
  },
};
</script>

<style lang="scss">
.font-icon {
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
}
</style>
