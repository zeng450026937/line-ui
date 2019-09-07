<template>
  <div class="progress-bar">
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',

  props: {
    from: {
      type: Number,
      default: 0,
    },
    to: {
      type: Number,
      default: 0,
    },
    value: {
      type: Object,
      default: () => ({}),
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
