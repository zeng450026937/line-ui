<template>
  <div>
    <line-chip>
      test
    </line-chip>
    <line-chip color="warning">
      <line-icon name="alarm"></line-icon>
      test
    </line-chip>
    <line-chip color="success" border>
      <line-icon name="alarm"></line-icon>
      test
    </line-chip>
    <line-chip color="primary" border>
      <line-icon name="alarm"></line-icon>
      test
    </line-chip>
    <line-chip color="danger">
      <line-icon name="alarm"></line-icon>
      test
    </line-chip>
    <line-chip color="danger" border>
      <line-icon name="alarm"></line-icon>
      test
    </line-chip>
    <line-chip color="light">
      <line-icon name="alarm"></line-icon>
      test
    </line-chip>
    <line-chip color="dark" border>
      <line-icon name="alarm"></line-icon>
      test
    </line-chip>
  </div>
</template>

<script>
import { Chip as LineChip } from '@/components/chip';
import { Icon as LineIcon } from '@/components/icon';

export default {
  name : 'ChipDemo',

  components : {
    LineChip,
    LineIcon,
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
