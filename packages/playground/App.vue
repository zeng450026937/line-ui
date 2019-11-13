<template>
  <div id="app">
    <line-overlay :visable="false"></line-overlay>
    <line-popup dim :value="false">popup</line-popup>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Overlay, Popup } from '@/components/overlay';

export default Vue.extend({
  name : 'App',

  components : {
    [Overlay.name] : Overlay,
    [Popup.name]   : Popup,
  },

  data() {
    return {
    };
  },
});
</script>

<style lang="scss">

#app {
  position: relative;

  height: 100%;
}

</style>
