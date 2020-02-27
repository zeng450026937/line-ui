<template>
  <div>
    <!-- SwitchDemo -->
    <line-switch></line-switch>
    <line-switch color="danger"></line-switch>
    <line-switch color="success" checked></line-switch>
    <line-switch color="warning" disabled checked></line-switch>
  </div>
</template>

<script>
import { Switch as LineSwitch } from 'skyline/components/switch';

export default {
  name : 'SwitchDemo',

  components : {
    LineSwitch,
  },

  props : {

  },

  data() {
    return {

    };
  },

  computed : {

  },

  created() {

  },

  mounted() {

  },

  methods : {

  },

  watch : {

  },
};
</script>

<style lang="scss" scoped>
</style>
