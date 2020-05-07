<template>
  <div class="readme">
    <div class="content" v-html="html"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    html: String,
  },
});
</script>

<style lang="scss">
.readme {
  max-width: 100%;
  max-height: 100%;

  overflow: auto;

  .content {
    max-width: 690px;

    margin: 0 auto;

    h1 {
      text-transform: uppercase;
    }
  }
}
</style>
