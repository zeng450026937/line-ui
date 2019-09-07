<template>
  <div class="text-field">
  </div>
</template>

<script>
export default {
  name: 'TextField',

  props: {
    canPaste: {
      type: Boolean,
      default: true,
    },
    canRedo: {
      type: Boolean,
      default: true,
    },
    canUndo: {
      type: Boolean,
      default: true,
    },
    length: {
      type: Number,
      default: 0,
    },
    maximumLength: {
      type: Number,
      default: 0,
    },
    persistentSelection: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: '',
    },
    hoverEnabled: {
      type: Boolean,
      default: true,
    },
    placeholderText: {
      type: String,
      default: '',
    },
    placeholderTextColor: {
      type: String,
      default: '',
    },
  },

  computed: {
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
