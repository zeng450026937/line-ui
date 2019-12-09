<template>
  <line-app>
    <line-content color="dark">
      <div class="logo">skyline</div>
    </line-content>
    <router-view></router-view>
  </line-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { App } from '@/components/app';
import { Header } from '@/components/header';
import { Content } from '@/components/content';

Vue.use(App);
Vue.use(Header);
Vue.use(Content);

export default Vue.extend({
  name : 'App',
});
</script>

<style lang="scss">

.logo {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  color: #fff;

  font-family: "Montserrat";
  font-size: 50px;

  line-height: 40px;

  text-transform: uppercase;
}
* {
  margin: 0;

  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;

  overflow: hidden;
}

#app {
  position: relative;

  width: 100%;
  min-width: 1200px;
  height: 100%;

  overflow: hidden;
}
</style>
