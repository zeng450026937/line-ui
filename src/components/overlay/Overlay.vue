<template>
  <div class="overlay"
    @touchstart.capture="onTouchStart"
    @click.capture="onMouseDown"
    @mousedown.capture="onMouseDown"
    :style="style"
  >
    <slot></slot>
  </div>
</template>

<script>
import Vue from 'vue';
import { now } from '@/utils/helpers';
import { GESTURE_CONTROLLER } from '@/utils/gesture';

export default Vue.extend({
  name : 'Overlay',

  props : {
    visable : {
      type    : Boolean,
      default : true,
    },
    tappable : {
      type    : Boolean,
      default : true,
    },
    stopPropagation : {
      type    : Boolean,
      default : true,
    },
  },

  computed : {
    style() {
      return {
        background : this.visable ? '#000' : 'transparent',
        cursor     : this.tappable ? 'pointer' : 'auto',
      };
    },
  },

  created() {
    this.lastClick = -10000;
    this.blocker = GESTURE_CONTROLLER.createBlocker({
      disableScroll : true,
    });

    if (this.stopPropagation) {
      this.blocker.block();
    }
  },

  beforeDestroy() {
    this.blocker.unblock();
  },

  methods : {
    onTouchStart(ev) {
      this.lastClick = now(ev);
      this.emitTap(ev);
    },

    onMouseDown(ev) {
      if (this.lastClick < now(ev) - 2500) {
        this.emitTap(ev);
      }
    },

    emitTap(ev) {
      if (this.stopPropagation) {
        ev.preventDefault();
        ev.stopPropagation();
      }
      if (this.tappable) {
        this.$emit('tap');
      }
    },
  },
});
</script>

<style lang="scss">

.overlay {
  align-items: center;
  border-radius: inherit;
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), z-index 1ms;
}

.overlay-scrim {
  border-radius: inherit;
  bottom: 0;
  height: 100%;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: inherit;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.87);
  opacity: 0.45;
}

</style>
