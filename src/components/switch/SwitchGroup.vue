<template>
  <div class="switch-button-group">
    <slot name="default"></slot>
  </div>
</template>

<script>
import Vue from 'vue';
import { useGroup } from '@/components/group';

const NAMESPACE = 'SwitchGroup';

export default Vue.extend({
  name: 'SwitchGroup',

  extends: useGroup(NAMESPACE),
});
</script>

<style lang="scss">

.switch-button-group {}

</style>
