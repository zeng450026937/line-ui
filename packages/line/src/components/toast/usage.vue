<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Toast</line-title>
      </line-toolbar>
    </line-header>

    <line-content class="line-padding">
      <line-toast
        color="dark"
        :duration="2000"
        position="top"
        message="Paired successfully"
        v-model="visible"
      >
      </line-toast>
      <line-button expand="block" @click="open">
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

import { ToastController } from '@line-ui/line/src/controllers';

export default Vue.extend({
  data() {
    return {
      visible: false,
      index: 1,
    };
  },

  methods: {
    open() {
      this.toast = ToastController.create({
        color: 'dark',
        duration: 3000,
        position: 'top',
        message: 'Paired successfully' + this.index,
        // header: 'test-header',
        buttons: [
          // {
          //   side: 'start',
          //   icon: 'add',
          //   text: 'Favorite',
          //   handler: () => {
          //     console.log('Favorite clicked');
          //   },
          // },
          // {
          //   text: 'Done',
          //   role: 'cancel',
          //   handler: () => {
          //     console.log('Cancel clicked');
          //   },
          // },
        ],
      });
      this.toast.open();

      this.index++;
    },
  },
});
</script>

<style lang="scss" scoped></style>
