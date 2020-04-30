<template>
  <div id="menu-wrapper">
    <line-list>
      <template v-for="res in resources">
        <line-item :key="res.name">
          {{ res.name.replace('-', ' ') }}
        </line-item>
      </template>
    </line-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  store: {
    state: ['resources'],
  },
});
</script>

<style lang="scss">
#menu-wrapper {
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 304px;
  height: 100%;

  border-right: 1px solid black;

  overflow-y: auto;
}
</style>
