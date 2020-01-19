<template>
  <line-content fullscreen class="line-padding">
    <line-button expand="block" @click="open">
      Pair
      <template #end>
        <line-icon source="/ionic-icons.symbols.svg" name="bluetooth"></line-icon>
      </template>
    </line-button>
  </line-content>
</template>

<script lang="ts">
import Vue from 'vue';
import { ToastController } from '@/controller/toast';

const controller = new ToastController();

export default Vue.extend({
  methods : {
    open() {
      // controller.create().open();
    },
  },
});
</script>

<style lang="scss" scoped>

</style>
