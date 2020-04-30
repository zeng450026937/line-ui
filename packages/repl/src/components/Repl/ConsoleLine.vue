<template>
  <div class="console-line">
    <template v-for="(arg, index) in log.args">
      <div :key="index" class="node">{{ arg }}</div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    log: Object,
  },
});
</script>

<style lang="scss" scoped>
.console-line {
  .node {
    display: inline-block;
  }
}
</style>
