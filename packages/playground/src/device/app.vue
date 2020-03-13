<template>
  <router-view></router-view>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name : 'App',

  data() {
    return {};
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
