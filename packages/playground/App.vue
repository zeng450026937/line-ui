<template>
  <line-app>
    <line-header>
      <line-toolbar>
        <template #start>
          <line-title>SKYLINE</line-title>
        </template>

        <template #end>
          <line-button>Get Started</line-button>
        </template>
      </line-toolbar>
    </line-header>

    <line-content>
      <div class="content-nav">
        <line-list>
          <div class="line-item">button</div>
        </line-list>
      </div>

      <div class="content-wrapper">
        <line-spinner type="dots"></line-spinner>
      </div>
    </line-content>

    <line-footer>
      <div class="content-wrapper">
        <div>©2019 Skyline Terms Privacy</div>
      </div>
    </line-footer>
  </line-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { App } from '@/components/app';
import { Content } from '@/components/content';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toolbar } from '@/components/tool-bar';
import { Title } from '@/components/tool-title';
import { Button } from '@/components/button';
import { Spinner } from '@/components/spinner';
import { List } from '@/components/list';

Vue.use(App);
Vue.use(Content);
Vue.use(Header);
Vue.use(Footer);
Vue.use(Toolbar);
Vue.use(Title);
Vue.use(Button);
Vue.use(Spinner);
Vue.use(List);

export default Vue.extend({
  name : 'App',

  data() {
    return {
    };
  },
});
</script>

<style lang="scss">

.content-nav {
  position: absolute;

  top: 0;
  bottom: 0;
  left: 0;
}

.content-wrapper {
  display: flex;

  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100%;
}

</style>
