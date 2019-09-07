<template>
  <div class="slider">
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
  name: 'Slider',

  props: {
    from: {
      type: Number,
      default: 0,
    },
    handle: {
      type: Object,
      default: () => ({}),
    },
    live: {
      type: Boolean,
      default: true,
    },
    orientation: {
      type: Number,
      default: 0,
    },
    pressed: {
      type: Boolean,
      default: true,
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
    value: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    horizontal() {
      return false;
    },
    position() {
      return 0;
    },
    vertical() {
      return false;
    },
    visualPosition() {
      return false;
    },
  },

  methods: {
    decrease() {},
    increase() {},
    valueAt() {},
  },

  created() {
    this.$emit('moved');
  },
};
</script>

<style lang="scss">

</style>

const Slider = Control.extend({
  props: {
    from: {
      type: Number,
      default: 0,
    },
    handle: {
      type: Object,
      default: () => ({}),
    },
    live: {
      type: Boolean,
      default: true,
    },
    orientation: {
      type: Number,
      default: 0,
    },
    pressed: {
      type: Boolean,
      default: true,
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
    value: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    horizontal() {
      return false;
    },
    implicitHandleHeight() {
      return 0;
    },
    implicitHandleWidth() {
      return 0;
    },
    position() {
      return 0;
    },
    vertical() {
      return false;
    },
    visualPosition() {
      return false;
    },
  },

  methods: {
    decrease() {},
    increase() {},
    valueAt() {},
  },

  created() {
    this.$emit('moved');
  },
});

Slider.NoSnap = Enum.NoSnap;
Slider.SnapAlways = Enum.SnapAlways;
Slider.SnapOnRelease = Enum.SnapOnRelease;

export default Slider;
