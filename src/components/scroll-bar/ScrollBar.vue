<template>
  <div class="scroll-bar">
  </div>
</template>

<script>
export const Orientation = {
  Horizontal: 0,
  Vertical: 1,
};

export const Policy = {
  AsNeeded: 2,
  AlwaysOff: 3,
  AlwaysOn: 4,
  NoSnap: 5,
  SnapAlways: 6,
  SnapOnRelease: 7,
};

export default {
  name: 'ScrollBar',

  props: {
    active: {
      type: Boolean,
      default: true,
    },
    interactive: {
      type: Boolean,
      default: true,
    },
    minimumSize: {
      type: Number,
      default: 0,
    },
    orientation: {
      type: Number,
      default: 0,
    },
    policy: {
      type: Number,
      default: 0,
    },
    position: {
      type: Number,
      default: 0,
    },
    pressed: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 0,
    },
    snapMode: {
      type: Number,
      default: 0,
    },
    stepSize: {
      type: Number,
      default: 0,
    },
    visualPosition: {
      type: Number,
      default: 0,
    },
    visualSize: {
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
    decrease() {},
    increase() {},
  },
};
</script>

<style lang="scss">

</style>
