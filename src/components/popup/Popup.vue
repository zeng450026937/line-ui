<template>
  <div class="popup" v-if="$scopedSlots.default">
    <slot></slot>
  </div>
</template>

<script>
// Close Policy
const NoAutoClose = 0;
const CloseOnPressOutside = 1;
const CloseOnPressOutsideParent = 2;
const CloseOnReleaseOutside = 3;
const CloseOnReleaseOutsideParent = 4;
const CloseOnEscape = 5;

export {
  NoAutoClose,
  CloseOnPressOutside,
  CloseOnPressOutsideParent,
  CloseOnReleaseOutside,
  CloseOnReleaseOutsideParent,
  CloseOnEscape,
};

export default {
  name: 'Popup',

  props: {
    closePolicy: {
      type: Number,
      default: 0,
    },
    dim: {
      type: Boolean,
      default: false,
    },
    modal: {
      type: Boolean,
      default: false,
    },
    visable: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    close() {},
    focus() {},
    open() {},
  },

  created() {
    // abstract signal defines
    this.$emit('aboutToHide');
    this.$emit('aboutToShow');
    this.$emit('closed');
    this.$emit('opened');
  },
};
</script>

<style lang="scss">

</style>
