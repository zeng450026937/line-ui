<template>
  <div class="split-view">
  </div>
</template>

<script>
export default {
  name : 'SplitView',

  props : {
    handle : {
      type    : Object,
      default : () => ({}),
    },
    orientation : {
      type    : Number,
      default : 0,
    },
  },

  computed : {
    resizing() {
      return false;
    },
  },

  methods : {
    restoreState() {},
    saveState() {},
  },
};
</script>

<style lang="scss">

</style>
