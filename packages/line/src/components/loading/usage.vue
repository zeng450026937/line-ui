<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Loading</line-title>
      </line-toolbar>
    </line-header>
    <line-content class="line-padding">
      <line-loading
        message="loading..."
        :spinner="spinner"
        v-model="visible"
      ></line-loading>
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

export default Vue.extend({
  data() {
    return {
      visible : false,
      spinner : 'lines-small', // bubbles circles circular crescent dots lines lines-small
    };
  },
  methods : {
    open() {
      this.visible = !this.visible;
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
