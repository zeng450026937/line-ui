<template>
  <div class="button"
    @click="onClicked"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
  >
    <div>{{text}}</div>
  </div>
</template>

<script>
import AbstractButton from '@/mixins/abstract-button';

export default {
  name: 'Button',

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
  },

  inject: [
    'ButtonGroup',
  ],

  created() {
    this.autoRepeatTimer = null;
    this.autoRepeatDelayTimer = null;
    this.canExclusive = this.$parent === this.ButtonGroup;

    if (this.canExclusive) {
      this.$parent.addButton(this);
    }
  },

  beforeDestroy() {
    if (this.canExclusive) {
      this.$parent.removeButton(this);
    }
  },

  methods: {
    onClicked(event) {
      this.toggle();

      if (this.canExclusive) {
        this.$parent.buttonClicked(this);
      }
    },

    onMouseDown(event) {
      this.pressed = true;
      this.pressX = event.x;
      this.pressX = event.y;

      // this.down = this.pressed;

      if (this.autoRepeat) {
        this.autoRepeatDelayTimer = setTimeout(() => {
          this.autoRepeatTimer = setInterval(() => {
            // dispatch click event
            console.log('dispatch click event');
          }, this.autoRepeatInterval);
        }, this.autoRepeatDelay);
      }
    },

    onMouseMove(event) {
      if (!this.pressed) return;

      this.pressX = event.x;
      this.pressX = event.y;
    },

    onMouseUp(event) {
      this.pressed = false;
      this.pressX = event.x;
      this.pressX = event.y;

      // this.down = this.pressed;

      if (this.autoRepeatDelayTimer) {
        clearTimeout(this.autoRepeatDelayTimer);
        this.autoRepeatDelayTimer = null;
      }
      if (this.autoRepeatTimer) {
        clearInterval(this.autoRepeatTimer);
        this.autoRepeatTimer = null;
      }
    },
  },
};
</script>

<style lang="scss">

</style>
