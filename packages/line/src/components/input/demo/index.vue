<template>
  <div>
    <line-input v-model="inputVal"> </line-input>
  </div>
</template>

<script>
import { Input as LineInput } from '@line-ui/skyline/components/input';

export default {
  name: 'InputDemo',

  components: {
    LineInput,
  },

  props: {},

  data() {
    return {
      inputVal: '',
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
