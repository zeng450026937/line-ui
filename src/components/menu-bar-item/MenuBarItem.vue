<template>
  <div class="menu-bar-item">
    {{menu.title}}
  </div>
</template>

<script>
import AbstractButton from '@/mixins/abstract-button';

export default {
  name: 'MenuBarItem',

  extends: AbstractButton,

  props: {
    highlighted: {
      type: Boolean,
      default: false,
    },
    menu: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    menuBar() {
      return null;
    },
  },

  mounted() {
    this.$emit('triggered');
  },
};
</script>

<style lang="scss">

</style>
