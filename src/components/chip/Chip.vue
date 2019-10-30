<template>
  <div class="chip"
       :class="{'chip--border': border}">
    <span class="chip__content">
      <slot name="default"></slot>
    </span>
    <span class="chip__close">
      <i></i>
    </span>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'Chip',

  props: {
    border: {
      type: Boolean,
      default: false,
    },
    closeIcon: {
      type: Boolean,
      default: false,
    },
  },

  watch: {

  },

  created() {

  },

  methods: {

  },
});
</script>

<style lang="scss">
.chip {
  height: 32px;
  border-radius: 16px;
  font-size: 14px;
  margin: 8px;
  padding: 12px;
  display: inline-flex;
  align-items: center;
  color: #1a1a1a;
  background-color: rgba($color: #000000, $alpha: 0.1);
  cursor: pointer;

  &.chip--border {
    border: 1px solid #1a1a1a;
  }
}
</style>
