<template>
  <div class="collapse">
    <slot name="default"></slot>
  </div>
</template>

<script>
import { useGroup } from '@/components/group';

const NAMESPACE = 'Collapse';

export default {
  name: 'Collapse',

  mixins: [useGroup(NAMESPACE)],

  props: {
    exclusive: {
      type: Boolean,
      default: true,
    },
  },

  methods: {

  },
};
</script>

<style lang="scss" scoped>
.collapse {
  width: 100%;
}
</style>
