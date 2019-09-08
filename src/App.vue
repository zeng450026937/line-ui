<template>
  <application-window
    title="application-window"
    style="height: 100%"
  >
    <template v-slot:menubar>
      <menu-bar v-bind:menus="menus">
      </menu-bar>
    </template>

    <template v-slot:header>
      <div>header</div>
    </template>

    <div>content</div>

    <template v-slot:footer>
      <div>footer</div>
    </template>
  </application-window>
</template>

<script>
import { ApplicationWindow } from './components/application-window';
import { MenuBar } from './components/menu-bar';

export default {
  name: 'app',

  components: {
    ApplicationWindow,
    MenuBar,
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
