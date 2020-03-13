<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Popover</line-title>
      </line-toolbar>
    </line-header>

    <line-content class="line-padding">
      <line-popover ref="popover">
        <line-list>
          <line-list-header>Ionic</line-list-header>
          <line-item button>Learn Ionic</line-item>
          <line-item button>Documentation</line-item>
          <line-item button>Showcase</line-item>
          <line-item button>GitHub Repo</line-item>
          <line-item
            lines="none"
            detail="false"
            button
          >Close</line-item>
        </line-list>
      </line-popover>
      <line-button
        expand="block"
        @click="onClick"
      >
        Show Popover
      </line-button>
    </line-content>
  </line-app>
</template>

<script>
import Vue from 'vue';
import { PopoverController } from 'skyline/controller/popover';

const controller = new PopoverController();

export default Vue.extend({
  data() {
    return {
      event : null,
      controller,
    };
  },

  methods : {
    onClick(ev) {
      this.event = ev;
      this.$refs.popover.open(ev);
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
