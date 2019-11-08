<template>
  <div class="column-layout">
  </div>
</template>

<script>
export const LayoutDirection = {
  LeftToRight : 0,
  RightToLeft : 1,
};

export default {
  name : 'ColumnLayout',

  props : {
    layoutDirection : {
      type    : Number,
      default : LayoutDirection.LeftToRight,
    },
    spacing : {
      type    : Number,
      default : 0,
    },
  },
};
</script>

<style lang="scss">

</style>
