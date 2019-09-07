<template>
  <div class="item-delegate">
  </div>
</template>

<script>
import AbstractButton from '@/mixins/abstract-button';

export default {
  name: 'ItemDelegate',

  extends: AbstractButton,

  props: {
    highlighted: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">

</style>
