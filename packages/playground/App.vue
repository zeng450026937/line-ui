<template>
  <line-app>
    <line-header>
      <line-toolbar>
        <line-title>SKYLINE</line-title>
        <template #primary>
          <line-button>Get Started</line-button>
        </template>
      </line-toolbar>
    </line-header>

    <line-content>
      <div class="content-wrapper">
        <line-spinner type="dots" color="primary"></line-spinner>
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

Vue.use(App);
Vue.use(Content);
Vue.use(Header);
Vue.use(Footer);
Vue.use(Toolbar);
Vue.use(Title);
Vue.use(Button);
Vue.use(Spinner);

export default Vue.extend({
  name : 'App',

  data() {
    return {
    };
  },
});
</script>

<style lang="scss">

.content-wrapper {
  display: flex;

  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100%;
}

</style>
