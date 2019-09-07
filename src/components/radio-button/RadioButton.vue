<template>
  <div class="radio-button">
  </div>
</template>

<script>
import AbstractButton from '@/mixins/abstract-button';

export default {
  name: 'RadioButton',

  extends: AbstractButton,

  props: {
    autoExclusive: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss">

</style>
