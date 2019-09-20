<template>
  <div class="flicable">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Flicable',

  props: {},

  methods: {
    cancelFlick() {},
    flick() {},
    resizeContent() {},
    returnToBounds() {},
  },

  created() {
    this.$emit('flickEnded');
    this.$emit('flickStarted');
    this.$emit('movementEnded');
    this.$emit('movementStarted');
  },
};
</script>

<style lang="scss">

</style>
