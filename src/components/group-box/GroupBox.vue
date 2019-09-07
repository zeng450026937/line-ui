<template>
  <div class="group-box">
  </div>
</template>

<script>
export default {
  name: 'GroupBox',

  props: {
    label: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">

</style>
