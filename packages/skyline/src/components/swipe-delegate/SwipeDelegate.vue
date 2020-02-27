<template>
  <div class="swipe-delegate">
  </div>
</template>

<script>
import { ItemDelegate } from 'skyline/components/item-delegate';

export default {
  name : 'SwipeDelegate',

  extends : ItemDelegate,

  props : {
    swipe : {
      type    : Object,
      default : () => ({
        position   : null,
        complete   : null,
        enabled    : null,
        left       : null,
        behind     : null,
        right      : null,
        leftItem   : null,
        behindItem : null,
        rightItem  : null,
        transition : null,
      }),
    },
  },

  provide() {
    return {
      SwipeDelegate : {
        pressed : this.pressed,
        clicked : () => {},
      },
    };
  },

  methods : {
    close() {},
    open() {},
  },

  created() {
    this.$emit('closed');
    this.$emit('completed');
    this.$emit('opened');
  },
};
</script>

<style lang="scss">

</style>
