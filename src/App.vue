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
      <list-view :model="list">
        <template v-slot:delegate="item">
          <!-- <lifecycle-logger style="height: 50px;" :label="item.index">item key: {{item.index}}</lifecycle-logger> -->
          <div style="height: 60px;">item key: {{item.index}}</div>
        </template>
      </list-view>
    </div>

    <template v-slot:footer>
      <div>footer</div>
    </template>
  </application-window>
</template>

<script>
import { ApplicationWindow } from './components/application-window';
import { MenuBar } from './components/menu-bar';
import { ListView } from './components/list-view';
import { LifecycleLogger } from './components/functional';

export default {
  name: 'app',

  components: {
    ApplicationWindow,
    MenuBar,
    ListView,
    LifecycleLogger,
  },

  data() {
    const list = [];
    list.length = 500000;
    for (let index = 0; index < list.length; index++) {
      list[index] = { text: index, index };      
    }

    return {
      menus: [
        // { title: 'File' },
        // { title: 'Edit' },
        // { title: 'View' },
        // { title: 'Help' },
      ],
      list: Object.freeze(list),
    };
  },
};
</script>

<style lang="scss">

</style>
