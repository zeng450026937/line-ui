<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Toast</line-title>
      </line-toolbar>
    </line-header>

    <line-content class="line-padding">
      <line-button
        expand="block"
        @click="open"
      >
        Pair
        <template #end>
          <line-icon
            source="/ionic-icons.symbols.svg"
            name="bluetooth"
          ></line-icon>
        </template>
      </line-button>
    </line-content>
  </line-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { ToastController } from 'skyline/controller/toast';

const controller = new ToastController();

export default Vue.extend({
  methods : {
    open() {
      controller
        .create({
          color    : 'dark',
          duration : 2000,
          message  : 'Paired successfully',
        })
        .open();
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
