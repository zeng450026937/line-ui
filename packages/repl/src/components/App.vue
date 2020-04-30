<template>
  <line-app>
    <line-header translucent>
      <Header></Header>
    </line-header>

    <line-content>
      <div class="container">
        <Menu></Menu>
        <Repl></Repl>
      </div>
    </line-content>
  </line-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from './Header.vue';
import Menu from './Menu.vue';
import Repl from './Repl/Repl.vue';

export default Vue.extend({
  components: { Header, Menu, Repl },
  mounted() {
    window.addEventListener(
      'keydown',
      (e) => {
        const hasCtrl = navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey;
        const hasKeyS = e.keyCode === 83;

        if (hasKeyS && hasCtrl) {
          e.preventDefault();
        }
      },
      false
    );
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;

  flex-direction: row;

  width: 100%;
  height: 100%;
}
</style>
