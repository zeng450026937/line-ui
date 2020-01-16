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
        <line-list lines="inset">
          <line-item>
            <line-button>line-button</line-button>
          </line-item>

          <line-item>
            <line-label>
              <h1>line-label</h1>
              <h2>Finn</h2>
              <h3>I'm a big deal</h3>
              <p>Listen, I've had a pretty messed up day...</p>
            </line-label>
          </line-item>
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
import { Item } from '@/components/item';
import { Label } from '@/components/label';

Vue.use(App);
Vue.use(Content);
Vue.use(Header);
Vue.use(Footer);
Vue.use(Toolbar);
Vue.use(Title);
Vue.use(Button);
Vue.use(Spinner);
Vue.use(List);
Vue.use(Item);
Vue.use(Label);

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

  overflow-y: auto;
}

.content-wrapper {
  display: flex;

  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100%;
}

</style>
