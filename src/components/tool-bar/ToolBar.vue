<template>
  <div class="tool-bar">
  </div>
</template>

<script>
export const Position = {
  Min: 0,
  Header: 0,
  Footer: 1,
  Max: 1,
};

export default {
  name: 'ToolBar',

  props: {
    position: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss">

</style>
