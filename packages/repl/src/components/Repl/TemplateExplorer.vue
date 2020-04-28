<template>
  <div class="template-explorer">
    <viewer relaxed></viewer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Viewer from './Viewer.vue';

export default Vue.extend({
  components: { Viewer },
});
</script>

<style lang="scss">
.template-explorer {
  display: flex;

  flex-direction: column;

  background: var(--back-light);

  z-index: 5;
}
</style>
