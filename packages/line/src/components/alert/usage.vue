<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Alert</line-title>
      </line-toolbar>
    </line-header>
    <line-content class="line-padding">
      <line-button expand="block" @click="open">
        Show Alert
      </line-button>
    </line-content>
  </line-app>
</template>

<script>
import Vue from 'vue';
import { AlertController } from '@line-ui/skyline/src/controller/alert';

const controller = new AlertController();

export default Vue.extend({
  methods: {
    open() {
      controller
        .create({
          header: 'Alert',
          message: 'Alert successfully',
          buttons: [
            {
              text: 'Disagree',
            },
            {
              text: 'Agree',
            },
          ],
        })
        .open();
    },
  },
});
</script>

<style lang="scss" scoped></style>
