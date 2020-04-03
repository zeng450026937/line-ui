<template>
  <div>
    <line-badge>
      13
    </line-badge>
    <line-badge color="success">
      10k
    </line-badge>
    <line-badge color="danger">
      10k
    </line-badge>
  </div>
</template>

<script>
import { Badge as LineBadge } from '@line-ui/skyline/src/components/badge';

export default {
  name: 'DadgeDemo',

  components: {
    LineBadge,
  },

  props: {},

  data() {
    return {};
  },

  computed: {},

  created() {},

  mounted() {},

  methods: {},

  watch: {},
};
</script>

<style lang="scss" scoped></style>
