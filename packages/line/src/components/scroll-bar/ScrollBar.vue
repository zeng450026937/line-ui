<template>
  <div class="scroll-bar">
    <div class="scroll-bar-track vertical">
      <div class="scroll-bar-thumb"></div>
    </div>
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
      return this.orientation === Orientation.Horizontal;
    },
    vertical() {
      return this.orientation === Orientation.Vertical;
    },
  },

  methods: {
    decrease() {},
    increase() {},
  },
};
</script>

<style lang="scss">
.scroll-bar {
  &-track {
    position: absolute;
    right: 2px;
    bottom: 2px;

    border-radius: 3px;

    background-color: rgba(0, 0, 0, 0.05);

    &.vertical {
      top: 2px;

      width: 6px;

      .scroll-bar-thumb {
        width: 100%;
      }
    }

    &.horizontal {
      left: 2px;

      height: 6px;

      .scroll-bar-thumb {
        height: 100%;
      }
    }
  }

  &-thumb {
    display: block;
    position: relative;

    width: 100px;
    height: 100px;

    transform: translate3d(0, 0, 0);

    border-radius: inherit;

    background-color: rgba(0, 0, 0, 0.15);

    cursor: pointer;

    &:hover,
    &:active {
      background-color: rgba(0, 0, 0, 0.25);
    }
  }
}
</style>
