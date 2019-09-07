<template>
  <div class="popup" v-show="visable">
  </div>
</template>

<script>
export const ClosePolicy = {
  NoAutoClose: 0,
  CloseOnPressOutside: 1,
  CloseOnPressOutsideParent: 2,
  CloseOnReleaseOutside: 3,
  CloseOnReleaseOutsideParent: 4,
  CloseOnEscape: 5,
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
