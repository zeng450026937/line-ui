<template>
  <div class="page">
  </div>
</template>

<script>
export default {
  name: 'Page',

  props: {
    footer: {
      type: Object,
      default: () => ({}),
    },
    header: {
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
