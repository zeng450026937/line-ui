<template>
  <div class="button-group">
    <slot name="default"></slot>
  </div>
</template>

<script>
import Vue from 'vue';
import { createGroup } from '@/components/group';

export default Vue.extend({
  name: 'ButtonGroup',

  extends: createGroup('ButtonGroup'),
});
</script>

<style lang="scss">

</style>
