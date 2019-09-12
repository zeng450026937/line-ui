<template>
  <div class="overlay">
    <div class="overlay-scrim"></div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Overlay',

  props: {
    modal: {
      type: Object,
      default: () => ({}),
    },
    modeless: {
      type: Object,
      default: () => ({}),
    },
  },

  mounted() {
    this.$emit('pressed');
    this.$emit('released');
  },
};
</script>

<style lang="scss">

.overlay {
  align-items: center;
  border-radius: inherit;
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), z-index 1ms;
}

.overlay-scrim {
  border-radius: inherit;
  bottom: 0;
  height: 100%;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: inherit;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.87);
  opacity: 0.45;
}

</style>
