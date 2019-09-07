<template>
  <div class="page-indicator">
  </div>
</template>

<script>
export default {
  name: 'PageIndicator',

  props: {
    count: {
      type: Number,
      default: 0,
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
    delegate: {
      type: Object,
      default: () => ({}),
    },
    interactive: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss">

</style>
