<template>
  <div>
    <line-range v-model="value" color="success"></line-range>
    <line-range v-model="value" pin></line-range>
    <line-range v-model="dualValue" color="dark" dual-knobs pin></line-range>
    <line-range v-model="value" color="warning" :step="10" snaps></line-range>
    <line-range
      v-model="value"
      color="danger"
      :step="10"
      snaps
      ticks
    ></line-range>
    {{ value }}
    {{ dualValue }}
  </div>
</template>

<script>
import { Range as LineRange } from '@line-ui/skyline/src/components/range';

export default {
  name: 'RangeDemo',

  components: {
    LineRange,
  },

  props: {},

  data() {
    return {
      value: 20,
      dualValue: {},
    };
  },

  computed: {},

  created() {},

  mounted() {},

  methods: {},

  watch: {},
};
</script>

<style lang="scss" scoped></style>
