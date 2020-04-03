<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Menu</line-title>
      </line-toolbar>
    </line-header>

    <line-content>
      <line-menu
        ref="menu"
        contentId="main-content"
        :type="type"
        v-model="value"
      >
        <line-header>
          <line-toolbar>
            <line-title>Menu</line-title>
          </line-toolbar>
        </line-header>
        <line-content>
          <line-list>
            <line-item>
              <line-label>Inbox</line-label>
            </line-item>
            <line-item>
              <line-label>Outbox</line-label>
            </line-item>
            <line-item>
              <line-label>Favorites</line-label>
            </line-item>
            <line-item>
              <line-label>Archived</line-label>
            </line-item>
            <line-item>
              <line-label>Trash</line-label>
            </line-item>
            <line-item>
              <line-label>Spam</line-label>
            </line-item>
          </line-list>
        </line-content>
      </line-menu>
      <div id="main-content">
        <line-button @click="openMenu('overlay')"
          >openMenu - overlay</line-button
        >
        <line-button @click="openMenu('push')">openMenu - push</line-button>
        <line-button @click="openMenu('reveal')">openMenu - reveal</line-button>
      </div>
    </line-content>
  </line-app>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      type: 'overlay',
      value: false,
    };
  },

  methods: {
    openMenu(type) {
      this.type = type;
      this.value = !this.value;
    },
  },

  watch: {
    value(val) {
      console.log('watch: value', val);
    },
  },
});
</script>

<style lang="scss" scoped>
#main-content {
  width: 100%;
  height: 100%;

  padding: 16px;

  background-color: #ffffff;

  .line-button {
    width: 100%;
  }
}
</style>
