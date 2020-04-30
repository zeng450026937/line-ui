<template>
  <div class="menu-wrapper">
    <template v-for="res in resources">
      <!-- <line-item :key="res.name" lines="none">
          {{ res.name.replace('-', ' ') }}
        </line-item> -->
      <line-list :key="res.name">
        <line-list-header>
          {{ res.name.replace('-', ' ') }}
        </line-list-header>

        <template v-for="(usage, index) in res.usage.keys">
          <line-item :key="index" lines="none">
            <div>{{ usage }}</div>
          </line-item>
        </template>
      </line-list>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  store: {
    state: {
      resources(store) {
        return store.resources.filter((res) => res.usage.keys.length);
      },
    },
  },
});
</script>

<style lang="scss">
.menu-wrapper {
  display: flex;
  position: relative;

  flex-direction: column;
  justify-content: flex-start;

  width: 304px;
  height: 100%;

  background-color: rgba(#e6e6e6, 0.5);
  backdrop-filter: saturate(180%) blur(20px);

  overflow-y: auto;

  .line-list,
  .line-list-header,
  .line-item {
    --background: rgba(230, 230, 230, 0.5);
    --background-focused: #e6e6e6;
    backdrop-filter: saturate(180%) blur(20px);
  }

  .line-list-header {
    font-size: 1em;

    text-transform: capitalize;
  }

  .line-item {
    --min-height: 32px;
    font-size: 0.9em;

    text-transform: lowercase;

    cursor: pointer;
  }
}
</style>
