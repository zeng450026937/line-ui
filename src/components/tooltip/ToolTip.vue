<template>
  <div class="tool-tip">
  </div>
</template>

<script>
import Popup from '@/components/popup';

export default {
  name: 'ToolTip',

  extends: Popup,

  props: {
    delay: {
      type: Number,
      default: 0,
    },
    text: {
      type: String,
      default: '',
    },
    timeout: {
      type: Number,
      default: 0,
    },
  },

  provide() {
    return {
      ToolTip: {
        delay: this.delay,
        text: this.text,
        timeout: this.timeout,
        toolTip: this,
        visible: this.visible,
      },
    };
  },

  methods: {
    hide() {},
    show() {},
  },

  created() {
    this.$emit('accepted');
    this.$emit('applied');
    this.$emit('discarded');
    this.$emit('helpRequested');
    this.$emit('rejected');
    this.$emit('reset');
  },
};
</script>

<style lang="scss">

</style>
