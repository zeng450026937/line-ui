<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Popover</line-title>
      </line-toolbar>
    </line-header>

    <line-content class="line-padding">
      <line-popover trigger="popoverButton" :overlay="false" v-model="visible">
        <line-list>
          <line-list-header>Ionic</line-list-header>
          <line-item button>Learn Ionic</line-item>
          <line-item button>Documentation</line-item>
          <line-item button>Showcase</line-item>
          <line-item button>GitHub Repo</line-item>
          <line-item lines="none" :detail="false" button>Close</line-item>
        </line-list>
      </line-popover>
      <line-button expand="block" ref="popoverButton" @click="onClick">
        Show Popover
      </line-button>

      <line-button expand="block">
        on click
      </line-button>
    </line-content>
  </line-app>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      event: null,

      visible: false,
    };
  },

  methods: {
    onClick(ev) {
      this.visible = !this.visible;
      // this.event = ev;
      // this.$refs.popover.open(ev);
    },
  },
});
</script>

<style lang="scss" scoped></style>
