<template>
  <line-app>
    <line-content color="dark">
      <div class="logo">line-ui</div>
    </line-content>
  </line-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { App } from '@/components/app';
import { Content } from '@/components/content';

Vue.use(App);
Vue.use(Content);

export default Vue.extend({
  name: 'App',
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
</style>
