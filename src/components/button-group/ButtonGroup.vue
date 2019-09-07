<template>
  <div class="button-group">
  </div>
</template>

<script>
export default {
  name: 'ButtonGroup',

  props: {
    buttons: {
      type: Array,
      default: () => ([]),
    },
    checkState: {
      type: Array,
      default: null,
    },
    checkedButton: {
      type: Object,
      default: null,
    },
    exclusive: {
      type: Boolean,
      default: true,
    },
  },
  
  methods: {
    addButton() {},
    removeButton() {},
  },

  created() {
    this.$emit('clicked');
  },
};
</script>

<style lang="scss">

</style>
