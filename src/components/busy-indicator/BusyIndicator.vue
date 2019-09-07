<template>
  <div class="busy-indicator">
  </div>
</template>

<script>
export default {
  name: 'BusyIndicator',

  props: {
    running: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">

</style>
