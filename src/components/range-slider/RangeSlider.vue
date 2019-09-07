<template>
  <div class="range-slider">
  </div>
</template>

<script>
export const Orientation = {
  Horizontal: 0,
  Vertical: 1,
};

export const SnapMode = {
  AsNeeded: 0,
  AlwaysOff: 1,
  AlwaysOn: 2,
  NoSnap: 3,
  SnapAlways: 4,
  SnapOnRelease: 5,
};

export default {
  name: 'RangeSlider',

  props: {
    first: {
      type: Object,
      default: () => ({
        value: 0,
        position: 0,
        visualPosition: 0,
        handle: {},
        pressed: false,
        hovered: false,
        implicitHandleWidth: 0,
        implicitHandleHeight: 0,
      }),
    },
    from: {
      type: Number,
      default: 0,
    },
    live: {
      type: Boolean,
      default: true,
    },
    orientation: {
      type: Number,
      default: 0,
    },
    second: {
      type: Object,
      default: () => ({
        value: 0,
        position: 0,
        visualPosition: 0,
        handle: {},
        pressed: false,
        hovered: false,
        implicitHandleWidth: 0,
        implicitHandleHeight: 0,
      }),
    },
    snapMode: {
      type: Number,
      default: 0,
    },
    stepSize: {
      type: Number,
      default: 0,
    },
    to: {
      type: Number,
      default: 0,
    },
    touchDragThreshold: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    horizontal() {
      return false;
    },
    vertical() {
      return false;
    },
  },

  methods: {
    setValues() {},
    valueAt() {},
  },

  created() {
    this.$emit('first.moved');
    this.$emit('second.moved');
  },
};
</script>

<style lang="scss">

</style>
