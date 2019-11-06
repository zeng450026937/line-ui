<template>
  <div class="popup"
       v-show="visable"
       v-remote="global">
    <div class="overlay"
         :style="{opacity: dim ? 0.32 : 0.01}"
         @touchstart.capture="onTouchStart"
         @click.capture="onMouseDown"
         @mousedown.capture="onMouseDown">
      <slot name="overlay"
            v-bind="{modal, dim}"></slot>
    </div>

    <!-- <div class="arrow"></div>
    <div class="content"
         ref="content"> -->
    <slot name="default"></slot>
    <!-- </div> -->
  </div>
</template>

<script>
import Vue from 'vue';
import remote from '@/directives/remote';
import { now } from '@/utils/helpers';
import { GESTURE_CONTROLLER } from '@/utils/gesture';

export const ClosePolicy = {
  NoAutoClose: 0,
  CloseOnPressOutside: 1,
  CloseOnPressOutsideParent: 2,
  CloseOnReleaseOutside: 3,
  CloseOnReleaseOutsideParent: 4,
  CloseOnEscape: 5,
};

export default Vue.extend({
  name: 'Popup',

  directives: {
    remote,
  },

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    global: {
      type: Boolean,
      default: false,
    },
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
    tappable: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      visable: this.value,
    };
  },


  methods: {
    close() { },
    focus() { },
    open() { },

    onTouchStart(ev) {
      console.log('onTouchStart');
      this.lastClick = now(ev);
      this.emitTap(ev);
    },

    onMouseDown(ev) {
      console.log('onMouseDown');
      if (this.lastClick < now(ev) - 2500) {
        this.emitTap(ev);
      }
    },

    emitTap(ev) {
      console.log('emitTap');
      if (this.modal) {
        ev.preventDefault();
        ev.stopPropagation();
      }
      if (this.tappable) {
        this.$emit('tap');
      }
    },
  },

  created() {
    this.lastClick = -10000;
    this.blocker = GESTURE_CONTROLLER.createBlocker({
      disableScroll: true,
    });

    if (this.modal) {
      this.blocker.block();
    }
    // abstract signal defines
    // this.$emit('aboutToHide');
    // this.$emit('aboutToShow');
    // this.$emit('closed');
    // this.$emit('opened');
  },

  watch: {
    value(val) {
      this.visable = val;
    },
  },

  beforeDestroy() {
    this.$emit('aboutToHide');
    this.blocker.unblock();
  },
});
</script>

<style lang="scss">
.popup {
  // position: fixed;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // border: dotted plum;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), z-index 1ms;
  z-index: 9;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    transition: inherit;
    background-color: rgba(0, 0, 0, 0.87);
    opacity: 0.32;
  }

  // .content {
  // width: 100%;
  // position: absolute;
  // top: 0;
  // left: 0;
  // right: 0;
  // bottom: 0;
  // }
}
</style>
