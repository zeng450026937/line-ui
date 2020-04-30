<template>
  <div class="console">
    <template v-for="(log, index) in logs">
      <ConsoleLine :key="index" :log="log"></ConsoleLine>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ConsoleLine from './ConsoleLine.vue';

export default Vue.extend({
  components: { ConsoleLine },
  props: {
    logs: Array,
  },
});
</script>

<style lang="scss" scoped></style>
