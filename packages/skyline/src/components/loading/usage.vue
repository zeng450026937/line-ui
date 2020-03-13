<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Loading</line-title>
      </line-toolbar>
    </line-header>
    <line-content class="line-padding">
      <line-button
        expand="block"
        @click="open"
      >
        Show Loading
      </line-button>
    </line-content>
  </line-app>
</template>

<script>
import Vue from 'vue';
import { LoadingController } from 'skyline/controller/loading';

const controller = new LoadingController();

export default Vue.extend({
  data() {
    return {

    };
  },
  methods : {
    open() {
      controller.create({
        message : 'loading...',
        spinner : 'circles',
      }).open();
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
