<template>
  <div class="check-box-group">
    <slot name="default"></slot>
  </div>
</template>

<script>
import Vue from 'vue';
import { createGroup } from '@/components/group';

export default Vue.extend({
  name: 'CheckBoxGroup',

  extends: createGroup('CheckBoxGroup'),

  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },

  computed: {},

  created() {
    this.$nextTick(() => {
      this.items.forEach((item) => {
        item.checked = this.value.includes(item.label);
      });
    });
  },

  methods: {
    onItemChecked(item, checked) {
      const { label } = item;
      const { value } = this;
      const index = value.findIndex(el => el === label);
      if (checked && index === -1) {
        value.push(label);
      } else if (!checked && index !== -1) {
        value.splice(index, 1);
      }
      this.$emit('input', value);
    },
  },
});
</script>

<style lang="scss">
// .check-box-group > .check-box + .check-box {
//   margin-left: 8px;
// }
</style>
