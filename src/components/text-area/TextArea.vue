<template>
  <div class="text-area">
  </div>
</template>

<script>
export default {
  name : 'TextArea',

  props : {
    canPaste : {
      type    : Boolean,
      default : true,
    },
    canRedo : {
      type    : Boolean,
      default : true,
    },
    canUndo : {
      type    : Boolean,
      default : true,
    },
    persistentSelection : {
      type    : Boolean,
      default : false,
    },
    readOnly : {
      type    : Boolean,
      default : false,
    },
    text : {
      type    : String,
      default : '',
    },
    hoverEnabled : {
      type    : Boolean,
      default : true,
    },
    placeholderText : {
      type    : String,
      default : '',
    },
    placeholderTextColor : {
      type    : String,
      default : '',
    },
  },

  computed : {
    selectedText() {
      return '';
    },
  },

  created() {
    this.$emit('pressAndHold');
    this.$emit('pressed');
    this.$emit('released');
  },
};
</script>

<style lang="scss">

</style>
