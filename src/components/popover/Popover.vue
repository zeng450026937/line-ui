<template>
  <div class="popover">
    <div class="popover-content" ref="content" v-remote>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Popper, { Placement } from 'popper.js';
import remote from '@/directives/remote';

export { Placement };

export default Vue.extend({
  name: 'Popover',

  directives: {
    remote,
  },

  props: {
    placement: {
      type: String,
      default: 'bottom',
    },
    visable: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    placement: 'prepare',
  },

  methods: {
    prepare() {
      const reference = this.$parent.$el;
      const { content } = this.$refs;
      this.popper = new Popper(reference, content, {
        placement: 'bottom',
        eventsEnabled: false,
        modifiers: {
          flip: { enabled: false },
          preventOverflow: {
            enabled: true,
            escapeWithReference: false,
          // boundariesElement: target,
          },
          applyStyle: { enabled: true },
          applyCustomStyle: {
            enabled: true,
            fn(data) {
              return data;
            },
            order: 900,
          },
        },
      });
    },
  },

  mounted() {
    this.prepare();
  },

  updated() {
    console.log('u');
    if (this.popper) {
      this.popper.update();
    }
  },

  beforeDestroy() {
    if (this.popper) {
      this.popper.destroy();
      this.popper = null;
    }
  },
});
</script>

<style>

.popover-content {
  position: absolute;
}

</style>
