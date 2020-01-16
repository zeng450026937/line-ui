<template>
  <line-app>
    <line-header>
      <line-toolbar>
        <template #start>
          <div class="logo">SKYLINE</div>
        </template>

        <template #end>
          <line-button>GET STARTED</line-button>
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

          <line-item>
            <line-label>line-note</line-label>
            <template #end>
              <line-note color="danger">new</line-note>
            </template>
          </line-item>

        </line-list>
      </div>

      <div class="content-wrapper">
        <line-spinner type="dots"></line-spinner>

        <line-card style="width: 300px">
          <img src="./asserts/madison.jpg" />

          <line-card-header>
            <line-card-subtitle>Destination</line-card-subtitle>
            <line-card-title>Madison, WI</line-card-title>
          </line-card-header>

          <line-card-content>
            Founded in 1829 on an isthmus between Lake Monona and Lake Mendota,
            Madison was named the capital of the Wisconsin Territory in 1836.
          </line-card-content>
        </line-card>
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
import { Note } from '@/components/note';
import {
  Card,
  CardContent,
  CardHeader,
  CardSubtitle,
  CardTitle,
} from '@/components/card';

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
Vue.use(Note);
Vue.use(Card);
Vue.use(CardContent);
Vue.use(CardHeader);
Vue.use(CardSubtitle);
Vue.use(CardTitle);

export default Vue.extend({
  name : 'App',

  data() {
    return {
    };
  },
});
</script>

<style lang="scss">

.logo {
  padding: 0 20px;

  font-size: 20px;
  font-weight: 500;

  letter-spacing: .0125em;
}

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
