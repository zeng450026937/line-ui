<template>
  <div class="button-group">
    <slot name="default"></slot>
  </div>
</template>

<script>
import Vue from 'vue';
import { useGroup } from '@/components/group';

const NAMESPACE = 'ButtonGroup';

export default Vue.extend({
  name : 'ButtonGroup',

  extends : useGroup(NAMESPACE),
});
</script>

<style lang="scss">

</style>
