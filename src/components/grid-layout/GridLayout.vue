<template>
  <div class="grid-layout">
  </div>
</template>

<script>
export const LayoutDirection = {
  LeftToRight: 0,
  RightToLeft: 1,
};

export default {
  name: 'GridLayout',

  props: {
    columnSpacing: {
      type: Number,
      default: 0,
    },
    columns: {
      type: Number,
      default: 0,
    },
    flow: {
      type: Number,
      default: 0,
    },
    layoutDirection: {
      type: Number,
      default: 0,
    },
    rowSpacing: {
      type: Number,
      default: 0,
    },
    rows: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss">

</style>
