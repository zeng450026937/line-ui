<template>
  <div class="svg-icon">
    <svg>
      <use xlink:href="{{href}}"></use>
    </svg>
  </div>
</template>

<script>
import AbstractIcon from './abstract-icon';

export default {
  name: 'SvgIcon',

  extends: AbstractIcon,

  computed: {
    href() {
      return `${this.source || ''}#${this.name}`;
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
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 0;
  }
}

</style>
