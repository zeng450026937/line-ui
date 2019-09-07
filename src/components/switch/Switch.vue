<template>
  <div class="switch">
  </div>
</template>

<script>
import AbstractButton from '@/mixins/abstract-button';

export default {
  name: 'Switch',

  extends: AbstractButton,

  props: {
    flat: {
      type: Boolean,
      default: false,
    },
    highlighted: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    position() {
      return 0;
    },
    visualPosition() {
      return 0;
    },
  },
};
</script>

<style lang="scss">

</style>


const Switch = AbstractButton.extend({
  computed: {
    position() {
      return 0;
    },
    visualPosition() {
      return 0;
    },
  },
});

export default Switch;
