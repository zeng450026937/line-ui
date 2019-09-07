<template>
  <div class="drawer">
  </div>
</template>

<script>
import { Popup } from '@/components/popup';

export const Edge = {
  TopEdge: 0,
  LeftEdge: 1,
  RightEdge: 2,
  BottomEdge: 3,
};

export default {
  name: 'Drawer',

  extends: Popup,

  props: {
    dragMargin: {
      type: Number,
      default: 0,
    },
    edge: {
      type: Number,
      default: 0,
    },
    interactive: {
      type: Boolean,
      default: true,
    },
    position: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss">

</style>
