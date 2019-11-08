<template>
  <div class="tree-view">
  </div>
</template>

<script>
export default {
  name : 'TreeView',

  props : {
    currentIndex : {
      type    : Object,
      default : () => ({}),
    },
    delegate : {
      type    : Object,
      default : () => ({}),
    },
    model : {
      type    : Object,
      default : () => ({}),
    },
    rootIndex : {
      type    : Object,
      default : () => ({}),
    },
    section : {
      type    : Object,
      default : () => ({
        property         : '',
        criteria         : 0,
        delegate         : null,
        labelPositioning : 0,
      }),
    },
    selection : {
      type    : Object,
      default : () => ({}),
    },
  },

  methods : {
    collapse() {},
    expand() {},
    indexAt() {},
    isExpanded() {},
  },

  mounted() {
    this.$emit('activated');
    this.$emit('clicked');
    this.$emit('collapsed');
    this.$emit('doubleClicked');
    this.$emit('expanded');
    this.$emit('pressAndHold');
  },
};
</script>

<style lang="scss">

</style>
