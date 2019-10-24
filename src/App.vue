<template>
  <application-window title="application-window">
    <template v-slot:menubar>
      <menu-bar v-bind:menus="menus">
      </menu-bar>
    </template>

    <template v-slot:header>
      <div>header</div>
    </template>

    <!-- <div>
      <list-view :model="list">
        <template v-slot:delegate="item">
          <lifecycle-logger style="height: 50px;"
              :label="item.index">item key: {{item.index}}</lifecycle-logger>
          <div style="height: 50px;">item key: {{item.index}}</div>
        </template>
      </list-view>
    </div> -->

    <div class="loading">
      <busy-indicator :running="true"></busy-indicator>
      <div class="loading-text">
        加载中...
      </div>
    </div>

    <div class="progress-bar__container">
      <progress-bar class="item--indeterminate"
                    indeterminate
                    :value="progress"></progress-bar>
      <!-- <progress-bar class="item--indeterminate"
                    indeterminate
                    color="#ff0000"
                    :value="progress"></progress-bar>
      <progress-bar class="item--indeterminate"
                    indeterminate
                    color="#0ff0ff"
                    :value="progress"></progress-bar> -->

      <progress-bar class="item"
                    :value="progress"></progress-bar>

      <progress-bar class="item"
                    color="#ff0000"
                    :value="progress"></progress-bar>

      <progress-bar class="item"
                    color="#0ff0ff"
                    :value="progress"></progress-bar>

    </div>

    <div>
      <progress-bar-circular :value="progress"></progress-bar-circular>
      <progress-bar-circular :value="progress"
                             color="#ff0000"></progress-bar-circular>
      <progress-bar-circular :value="progress"
                             color="#0ff0ff"></progress-bar-circular>
    </div>
    <div>
      <button @click="progress = progress - 10 <= 0 ? 0 : progress - 10 ">-</button>
      <button @click="progress = progress + 10 >= 100 ? 100 : progress + 10">+</button>
    </div>
    <template v-slot:footer>
      <div>footer</div>

    </template>

  </application-window>
</template>

<script>
import { ApplicationWindow } from './components/application-window';
import { MenuBar } from './components/menu-bar';
// import { ListView } from './components/list-view';
// import { LifecycleLogger } from './components/functional';
import { BusyIndicator } from './components/busy-indicator';
import { ProgressBar, ProgressBarCircular } from './components/progress-bar';


export default {
  name: 'app',

  components: {
    ApplicationWindow,
    MenuBar,
    // ListView,
    // LifecycleLogger,
    BusyIndicator,
    ProgressBar,
    ProgressBarCircular,
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

      progress: 30,
    };
  },
};
</script>

<style lang="scss">
.loading {
  width: 300px;
  height: 100px;
  margin: auto;
  .busy-indicator {
    color: #10c29b;
  }
  .loading-text {
    color: #666666;
    font-size: 14px;
    margin-top: 8px;
  }
}

.progress-bar__container {
  width: 100%;

  .item {
    margin: 20px 0;
    height: 8px;
  }

  .item--indeterminate {
    margin: 10px 0;
    height: 4px;
  }
}
</style>
