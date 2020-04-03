<template>
  <div class="flicable" v-on:touchmove="onMove">
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

    onMove(e) {
      console.log(e);
    },
  },

  created() {
    this.$emit('flickEnded');
    this.$emit('flickStarted');
    this.$emit('movementEnded');
    this.$emit('movementStarted');
  },

  mounted() {},

  beforeDestroy() {},
};
</script>

<style lang="scss">
.flicable {
  position: relative;

  width: 300px;
  height: 300px;

  border: dotted gray;

  overflow: hidden;
}
</style>
