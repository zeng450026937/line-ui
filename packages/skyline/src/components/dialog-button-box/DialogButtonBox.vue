<template>
  <div class="dialog-button-box">
  </div>
</template>

<script>
export const StandardButton = {
  Accepted        : 0,
  Rejected        : 1,
  Ok              : 0,
  Open            : 1,
  Save            : 2,
  Cancel          : 3,
  Close           : 4,
  Discard         : 5,
  Apply           : 6,
  Reset           : 7,
  RestoreDefaults : 8,
  Help            : 9,
  SaveAll         : 10,
  Yes             : 11,
  YesToAll        : 12,
  No              : 13,
  NoToAll         : 14,
  Abort           : 15,
  Retry           : 16,
  Ignore          : 17,
  NoButton        : 18,
};

export default {
  name : 'DialogButtonBox',

  props : {
    alignment : {
      type    : Number,
      default : 0,
    },
    buttonLayout : {
      type    : Number,
      default : 0,
    },
    delegate : {
      type    : Object,
      default : () => ({}),
    },
    position : {
      type    : Number,
      default : 0,
    },
    standardButtons : {
      type    : Number,
      default : 0,
    },
  },

  methods : {
    standardButton() {},
  },

  created() {
    this.$emit('accepted');
    this.$emit('applied');
    this.$emit('clicked');
    this.$emit('discarded');
    this.$emit('helpRequested');
    this.$emit('rejected');
    this.$emit('reset');
  },
};
</script>

<style lang="scss">

</style>
