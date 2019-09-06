<template>
  <div class="menubar">
    <template v-for="menu in getMenus()">
      <slot name="delegate" v-bind:menu="menu">
        <menu-bar-item v-bind:menu="menu"></menu-bar-item>
      </slot>
    </template>
  </div>
</template>

<script>
import { MenuBarItem } from '@/components/menu-bar-item';

export default {
  name: 'MenuBar',

  components: {
    MenuBarItem,
  },

  props: {
    delegate: {
      type: Object,
      default: () => ({}),
    },
    menus: {
      type: Array,
      default: () => ([]),
    },
  },

  methods: {
    addMenu() {},
    insertMenu() {},
    menuAt() {},
    removeMenu() {},
    takeMenu() {},
  },
};
</script>

<style lang="scss">

.menubar {
  position: relative;
  display: flex;
  flex-direction: row; 
}

</style>
