<template>
  <div class="switch"
       :class="{'switch--checked': value}"
       @click="toggle">
    <input class="switch__input"
           type="checkbox"
           :value="value">
    <span class="switch__track">
    </span>
  </div>
</template>

<script>
import AbstractButton from '@/mixins/abstract-button';

export default {
  name: 'Z-Switch',

  extends: AbstractButton,

  props: {
    flat: {
      type: Boolean,
      default: false,
    },
    highlighted: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    position() {
      return 0;
    },
    visualPosition() {
      return 0;
    },
  },

  methods: {
    toggle() {
      this.$emit('input', !this.value);
      this.$emit('change', !this.value);
    },
  },

  watch: {

  },
};
</script>

<style lang="scss">
.switch {
  height: 20px;
  width: 42px;
  position: relative;
  background-color: rgba($color: #000000, $alpha: 0.15);
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12) inset,
    0 0 6px rgba(0, 0, 0, 0.04) inset;
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.12);
  cursor: pointer;
  &__input {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    z-index: -1;
  }
  &__track {
    display: block;
    width: 16px;
    height: 16px;
    background-color: #fff;
    border-radius: 50%;
    position: absolute;
    left: 2px;
    box-shadow: 0 2px 12px 0 rgba($color: #000000, $alpha: 0.1) inset;
    transition: inherit;
  }
  &.switch--checked {
    background-color: rgba($color: #10c29b, $alpha: 0.2);
    box-shadow: 0 2px 4px rgba($color: #10c29b, $alpha: 0.22) inset,
      0 0 6px rgba($color: #10c29b, $alpha: 0.14) inset;
    .switch__track {
      background-color: #10c29b;
      left: calc(100% - 18px);
    }
  }
}
</style>


const Switch = AbstractButton.extend({
  computed: {
    position() {
      return 0;
    },
    visualPosition() {
      return 0;
    },
  },
});

export default Switch;
