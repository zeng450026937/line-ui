<template>
  <div :class="bem()">
    <slot name="default"></slot>
  </div>
</template>

<script>
import { createNamespace } from '@/utils/namespace';

const [createComponent, bem, t] = createNamespace('cell-group');

export default {
  name : 'CellGroup',

  computed : {
    bem() {
      return bem;
    },
  },
};
</script>

<style lang="scss" scoped>
.line-cell-group {
  padding-left: 16px;
  background-color: #ffffff;

  .line-cell {
    padding-left: 0;
  }
}
</style>
