<template>
  <div class="svg-icon"
       :style="iconStyles">
    <svg xmlns='http://www.w3.org/2000/svg'
         viewBox='0 0 24 24'>
      <use xlink:href="{{href}}"></use>
    </svg>
  </div>
</template>

<script>
import AbstractIcon from './abstract-icon';

export default {
  name: 'SvgIcon',

  extends: AbstractIcon,

  props: {
    size: {
      type: [Number, String],
      default: 16,
    },
  },

  computed: {
    href() {
      return `${ this.source || '' }#${ this.name }`;
    },
    iconStyles() {
      const { size, width, height } = this;

      return {
        width: `${ width }px`,
        height: `${ height }px`,
        fontSize: `${ size.toString().replace(/px/, '') }px`,
      };
    },
  },
};
</script>

<style lang="scss">
.svg-icon {
  position: relative;
  display: inline-flex;
  vertical-align: middle;

  svg {
    width: 100%;
    height: 100%;
    margin: auto;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 0;
  }
}
</style>
