<template>
  <application-window
    title="application-window"
  >
    <template v-slot:menubar>
      <menu-bar v-bind:menus="menus">
      </menu-bar>
    </template>

    <template v-slot:header>
      <div>header</div>
    </template>

    <div>
      <flipable></flipable>
    </div>

    <template v-slot:footer>
      <div>footer</div>
    </template>
  </application-window>
</template>

<script>
import { ApplicationWindow } from './components/application-window';
import { MenuBar } from './components/menu-bar';
import { Flipable } from './components/flipable';

export default {
  name: 'app',

  components: {
    ApplicationWindow,
    MenuBar,
    Flipable,
  },

  data() {
    return {
      menus: [
        // { title: 'File' },
        // { title: 'Edit' },
        // { title: 'View' },
        // { title: 'Help' },
      ],
    };
  },
};
</script>

<style lang="scss">

</style>
