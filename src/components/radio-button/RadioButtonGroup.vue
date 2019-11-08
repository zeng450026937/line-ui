<template>
  <div class="radio-button-group">
    <slot name="default"></slot>
  </div>
</template>

<script>
import Vue from 'vue';
import { useGroup } from '@/components/group';

const NAMESPACE = 'RadioButtonGroup';

export default Vue.extend({
  name : 'RadioButtonGroup',

  extends : useGroup(NAMESPACE),

  props : {
    exclusive : {
      type    : Boolean,
      default : true,
    },
  },
});
</script>

<style lang="scss">
</style>
