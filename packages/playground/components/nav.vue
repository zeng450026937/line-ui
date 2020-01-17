<template>
  <div class="nav-wrapper">
    <line-list lines="inset">
      <line-item>
        <line-button>line-button</line-button>
      </line-item>

      <line-item>
        <line-label>
          <h1>line-label</h1>
          <h2>Finn</h2>
          <h3>I'm a big deal</h3>
          <p>Listen, I've had a pretty messed up day...</p>
        </line-label>
      </line-item>

      <line-item>
        <line-label>line-note</line-label>
        <template #end>
          <line-note color="danger">new</line-note>
        </template>
      </line-item>
    </line-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name : 'line-nav',
});
</script>

<style lang="scss">

.nav-wrapper {
  position: absolute;

  top: 0;
  bottom: 0;
  left: 0;

  overflow-y: auto;
}

</style>
