<template>
  <button class="button"
          @click="onClick"
          v-on="$listeners"
          v-autorepeat="{
      enable: autoRepeat,
      delay: autoRepeatDelay,
      interval: autoRepeatInterval
   }">
    <slot name="icon"></slot>
    <slot name="label"></slot>
    <div>{{text}}</div>
    <slot></slot>
  </button>
</template>

<script>
import Vue from 'vue';
import { createGroupItem } from '@/components/group';
import AbstractButton from '@/mixins/abstract-button';
import autorepeat from '@/directives/autorepeat';

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

  methods: {
    onClick() {
      this.toggle();
    },
  },
});
</script>

<style lang="scss">
.button {
  max-width: 100%;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba($color: #666666, $alpha: 0.8);
  border-radius: 4px;
  color: #666666;
  background-color: #ffffff;
  line-height: 1;
  font-size: 14px;
  font-weight: 500;
  padding: 0 20px;
  white-space: nowrap;
  transition: 0.1s;
  user-select: none;
  position: relative;
  outline: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  cursor: pointer;

  &:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.22);
    border: 1px solid rgba($color: #666666, $alpha: 1);
  }
}
</style>
