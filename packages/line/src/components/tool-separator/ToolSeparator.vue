<template>
  <div class="tool-separator"></div>
</template>

<script>
export const Orientation = {
  Horizontal: 0,
  Vertical: 1,
};

export default {
  name: 'ToolSeparator',

  props: {
    orientation: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    horizontal() {
      return false;
    },
    vertical() {
      return false;
    },
  },
};
</script>

<style lang="scss"></style>
