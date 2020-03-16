<template>
  <div class="dialog">
  </div>
</template>

<script>
import { Popup } from 'skyline/src/components/popup';

export default {
  name : 'Dialog',

  extends : Popup,

  props : {
    footer : {
      type    : Object,
      default : () => ({}),
    },
    header : {
      type    : Object,
      default : () => ({}),
    },
    standardButtons : {
      type    : Number,
      default : 0,
    },
    title : {
      type    : String,
      default : '',
    },
  },

  computed : {
    result() {
      return 0;
    },
  },

  methods : {
    accept() {},
    done() {},
    reject() {},
    standardButton() {},
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
