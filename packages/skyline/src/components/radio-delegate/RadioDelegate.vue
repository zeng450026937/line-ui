<template>
  <div class="radio-delegate">
  </div>
</template>

<script>
import { ItemDelegate } from 'skyline/src/components/item-delegate';

export default {
  name : 'RadioDelegate',

  extends : ItemDelegate,

  props : {
    autoExclusive : {
      type    : Boolean,
      default : true,
    },
  },
};
</script>

<style lang="scss">

</style>
