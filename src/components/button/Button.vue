<template>
  <div class="button">
    <div v-if="display != AbstractButton.TextOnly"></div>
    <div>{{text}}</div>
  </div>
</template>

<script>
import AbstractButton from '@/mixins/abstract-button';

export default {
  name: 'Button',

  extends: AbstractButton,

  props: {
    flat: {
      type: Boolean,
      default: false,
    },
    highlighted: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">

</style>
