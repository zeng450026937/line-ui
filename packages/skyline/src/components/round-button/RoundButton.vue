<template>
  <div class="button">
  </div>
</template>

<script>
import AbstractButton from 'skyline/mixins/abstract-button';

export default {
  name : 'Button',

  extends : AbstractButton,

  props : {
    radius : {
      type    : Number,
      default : 3,
    },
  },
};
</script>

<style lang="scss">

</style>
