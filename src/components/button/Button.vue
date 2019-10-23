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

  created() {
    this.autoRepeatTimer = null;
    this.autoRepeatDelayTimer = null;
  },

  methods: {
    onClicked(event) {
      this.toggle();
    },

    onMouseDown(event) {
      this.pressed = true;
      this.pressX = event.x;
      this.pressX = event.y;

      this.down = this.pressed;

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

      this.down = this.pressed;

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
