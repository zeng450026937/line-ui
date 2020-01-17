<template>
  <line-app>
    <line-header>
      <line-toolbar>
        <template #start>
          <line-button color="dark" style="font-weight: bold;" @click="$router.push('/')">SKYLINE</line-button>
        </template>

        <template #end>
          <line-button size="small">GITHUB</line-button>
        </template>
      </line-toolbar>
    </line-header>

    <line-content>
      <div class="content-nav">
        <line-list lines="inset" style="width: 220px;">
          <line-list-header>COMPONENTS</line-list-header>

          <template v-for="component in components">
            <line-item button :key="component.name" @click="$router.push(component.path)">
              <line-label>{{ component.name }}</line-label>
            </line-item>
          </template>

          <line-item v-if="false">
            <line-label>
              <h1>line-label</h1>
              <h2>Finn</h2>
              <h3>I'm a big deal</h3>
              <p>Listen, I've had a pretty messed up day...</p>
            </line-label>
          </line-item>

          <line-item v-if="false">
            <line-label>line-note</line-label>
            <template #end>
              <line-note color="danger">new</line-note>
            </template>
          </line-item>

        </line-list>
      </div>

      <router-view></router-view>

    </line-content>

    <line-footer v-if="false">
      <div>
        <div>©2019 Skyline Terms Privacy</div>
      </div>
    </line-footer>
  </line-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { components } from './router';

export default Vue.extend({
  name : 'App',

  data() {
    (this as any).components = components;

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

</style>
