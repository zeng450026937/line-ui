<template>
  <div class="check-delegate">
  </div>
</template>

<script>
import AbstractButton from '@/mixins/abstract-button';

const Unchecked = 1;
const PartiallyChecked = 2;
const Checked = 3;

export default {
  name : 'CheckDelegate',

  extends : AbstractButton,

  props : {
    checkState : {
      type    : Number,
      default : Unchecked,
    },
    nextCheckState : {
      type : Function,
      default() {
        return this.checkState === Checked ? Unchecked : Checked;
      },
    },
    tristate : {
      type    : Boolean,
      default : false,
    },
  },
};
</script>

<style lang="scss">

</style>
