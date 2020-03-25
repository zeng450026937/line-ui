<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Alert</line-title>
      </line-toolbar>
    </line-header>
    <line-content
      class="line-padding"
      ref="content"
    >
      <line-list>
        <line-button
          expand="block"
          fill="outline"
          @click="scrollToBottom"
        >Scroll Bottom</line-button>
        <line-item
          v-for="(item, index) in 20"
          :key="index"
        >
          <line-label>Item {{index}}</line-label>
        </line-item>
      </line-list>
      <line-button
        expand="block"
        fill="outline"
        @click="scrollToTop"
      >Scroll Top</line-button>
    </line-content>
  </line-app>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  methods : {
    scrollToBottom() {
      this.$refs.content.scrollToBottom(500);
    },

    scrollToTop() {
      this.$refs.content.scrollToTop(500);
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
