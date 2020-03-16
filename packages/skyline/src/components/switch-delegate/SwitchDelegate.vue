<template>
  <div class="switch-delegate">
  </div>
</template>

<script>
import { ItemDelegate } from 'skyline/src/components/item-delegate';

export default {
  name : 'SwitchDelegate',

  extends : ItemDelegate,

  computed : {
    position() {
      return 0;
    },
    visualPosition() {
      return 0;
    },
  },
};
</script>

<style lang="scss">

</style>
