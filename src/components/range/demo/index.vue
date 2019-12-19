<template>
   <div>
     <line-range v-model="value"></line-range>
     <line-range v-model="value" pin></line-range>
     <line-range v-model="dualValue" dual-knobs pin></line-range>
     <line-range v-model="value" :step="10" snaps></line-range>
     <line-range v-model="value" :step="10" snaps ticks></line-range>
     {{value}}
     {{dualValue}}
   </div>
</template>

<script>
import { Range as LineRange } from '@/components/range';

export default {
  name : 'RangeDemo',

  components : {
    LineRange,
  },

  props : {

  },

  data() {
    return {
      value     : 20,
      dualValue : {},
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
