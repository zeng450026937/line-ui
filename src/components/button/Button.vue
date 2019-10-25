<template>
  <div class="button"
    v-autorepeat="{
      enable: autoRepeat,
      delay: autoRepeatDelay,
      interval: autoRepeatInterval
   }"
  >
    <slot name="icon"></slot>
    <slot name="label"></slot>
    <div>{{text}}</div>
  </div>
</template>

<script>
import Vue from 'vue';
import { createGroupItem } from '@/components/group';
import AbstractButton from '@/mixins/abstract-button';
import autorepeat from '@/utils/autorepeat';

export default Vue.extend({
  name: 'Button',

  mixins: [createGroupItem('ButtonGroup')],

  extends: AbstractButton,

  directives: {
    autorepeat,
  },

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

  watch: {
    checked(val) {
      val && this.$emit('toggled', this);
    },
  },

  created() {
    this.autoRepeatTimer = null;
    this.autoRepeatDelayTimer = null;
  },

  methods: {
    onClicked(event) {
      console.log('onClicked', event);
    },

    onMouseDown(event) {
      this.pressX = event.x;
      this.pressX = event.y;
    },

    onMouseMove(event) {
      this.pressX = event.x;
      this.pressX = event.y;
    },

    onMouseUp(event) {
      this.pressX = event.x;
      this.pressX = event.y;
    },
  },
});
</script>

<style lang="scss">

</style>
