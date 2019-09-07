<template>
  <div class="delay-button">
  </div>
</template>

<script>
import AbstractButton from '@/mixins/abstract-button';

export default {
  name: 'DelayButton',

  extends: AbstractButton,

  props: {
    delay: {
      type: Number,
      default: 3000,
    },
    transition: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    progress() {
      return 0;
    },
  },

  created() {
    this.$emit('activated');
  },
};
</script>

<style lang="scss">

</style>
