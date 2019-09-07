<template>
  <div class="spin-box">
  </div>
</template>

<script>
import AbstractButton from '@/mixins/abstract-button';

export default {
  name: 'SpinBox',

  extends: AbstractButton,

  props: {
    down: {
      type: Object,
      default: () => ({
        pressed: false,
        indicator: {},
        hovered: false,
        implicitIndicatorWidth: 24,
        implicitIndicatorHeight: 24,
      }),
    },
    editable: {
      type: Boolean,
      default: false,
    },
    from: {
      type: Number,
      default: 0,
    },
    inputMethodHints: {
      type: Number,
      default: 100,
    },
    stepSize: {
      type: Number,
      default: 0,
    },
    textFromValue: {
      type: Function,
      default: () => {},
    },
    to: {
      type: Number,
      default: 0,
    },
    up: {
      type: Object,
      default: () => ({
        pressed: false,
        indicator: {},
        hovered: false,
        implicitIndicatorWidth: 24,
        implicitIndicatorHeight: 24,
      }),
    },
    validator: {
      type: Function,
      default: () => {},
    },
    value: {
      type: Number,
      default: 0,
    },
    valueFromText: {
      type: Function,
      default: () => {},
    },
    wrap: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    displayText() {
      return '';
    },
    inputMethodComposing() {
      return false;
    },
  },

  methods: {
    decrease() {},
    increase() {},
  },

  created() {
    // abstract signal defines
    this.$emit('valueModified');
  },
};
</script>

<style lang="scss">

</style>
